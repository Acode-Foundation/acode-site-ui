import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Plugin, UserPlugin } from "@/types";

const fetchUserPlugins = async (userId: string): Promise<UserPlugin[]> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugins?user=${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch user plugins");
	}

	return response.json();
};

const deletePlugin = async (
	pluginId: string,
	mode: "soft" | "hard" = "soft",
): Promise<void> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin/${pluginId}?mode=${mode}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to delete plugin");
	}
};

export const useUserPlugins = (userId: string) => {
	return useQuery({
		queryKey: ["userPlugins", userId],
		queryFn: () => fetchUserPlugins(userId),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false,
	});
};

export const useDeletePlugin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			pluginId,
			mode,
		}: {
			pluginId: string;
			mode?: "soft" | "hard";
		}) => deletePlugin(pluginId, mode),
		onSuccess: (_, variables) => {
			// Invalidate all plugin-related queries
			queryClient.invalidateQueries({ queryKey: ["userPlugins"] });
			queryClient.invalidateQueries({ queryKey: ["plugins"] });
			queryClient.invalidateQueries({ queryKey: ["pluginsByStatus"] });
		},
		onMutate: async (variables) => {
			const { pluginId, mode } = variables;

			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["plugins"] });
			await queryClient.cancelQueries({ queryKey: ["pluginsByStatus"] });

			// Snapshot previous values
			const previousPlugins = queryClient.getQueriesData({
				queryKey: ["plugins"],
			});
			const previousPluginsByStatus = queryClient.getQueriesData({
				queryKey: ["pluginsByStatus"],
			});

			// Optimistically update plugins queries
			queryClient.setQueriesData({ queryKey: ["plugins"] }, (old: unknown) => {
				const data = old as { pages: Plugin[][] } | undefined;
				if (!data?.pages) return old;
				return {
					...data,
					pages: data.pages.map((page: Plugin[]) =>
						page
							.map((plugin: Plugin) => {
								if (plugin.id === pluginId) {
									if (mode === "hard") {
										return null; // Will be filtered out
									} else {
										return { ...plugin, status: "deleted" };
									}
								}
								return plugin;
							})
							.filter((plugin): plugin is Plugin => plugin !== null),
					),
				};
			});

			// Optimistically update pluginsByStatus queries
			queryClient.setQueriesData(
				{ queryKey: ["pluginsByStatus"] },
				(old: unknown) => {
					const data = old as { pages: Plugin[][] } | undefined;
					if (!data?.pages) return old;
					return {
						...data,
						pages: data.pages.map((page: Plugin[]) =>
							page
								.filter(
									(plugin: Plugin) => plugin.id !== pluginId || mode !== "hard",
								)
								.map((plugin: Plugin) => {
									if (plugin.id === pluginId && mode === "soft") {
										return { ...plugin, status: "deleted" };
									}
									return plugin;
								}),
						),
					};
				},
			);

			return { previousPlugins, previousPluginsByStatus };
		},
		onError: (err, variables, context) => {
			// Rollback on error
			if (context?.previousPlugins) {
				context.previousPlugins.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}
			if (context?.previousPluginsByStatus) {
				context.previousPluginsByStatus.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}
		},
	});
};

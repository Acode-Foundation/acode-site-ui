import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plugin } from "@/types/plugin";

interface UserPlugin extends Plugin {
	status: "pending" | "approved" | "rejected";
	revenue?: number;
}

const fetchUserPlugins = async (userId: string): Promise<UserPlugin[]> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugins?user=${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch user plugins");
	}

	return response.json();
};

const deletePlugin = async (pluginId: string): Promise<void> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugins/${pluginId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		}
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
		mutationFn: deletePlugin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userPlugins"] });
		},
	});
};
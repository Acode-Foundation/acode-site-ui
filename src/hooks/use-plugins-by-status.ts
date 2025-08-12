import { useInfiniteQuery } from "@tanstack/react-query";
import { Plugin } from "@/types";

export function usePluginsByStatus(status: 0 | 1 | 2 | 3, enabled = true) {
	return useInfiniteQuery<Plugin[]>({
		queryKey: ["pluginsByStatus", status],
		queryFn: async ({ pageParam = 1 }) => {
			const params = new URLSearchParams({
				status: status.toString(),
				page: pageParam.toString(),
				limit: "20",
			});

			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugins?${params}`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch plugins: ${response.status}`);
			}

			const data = await response.json();
			return Array.isArray(data) ? data : [];
		},
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < 20) return undefined; // No more pages
			return allPages.length + 1; // Next page number
		},
		enabled,
		staleTime: 2 * 60 * 1000, // 2 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		initialPageParam: 1,
	});
}

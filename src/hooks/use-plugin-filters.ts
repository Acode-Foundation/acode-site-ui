import { useMemo } from "react";
import type { FilterOptions, Plugin } from "@/types";

export const usePluginFilters = (plugins: Plugin[], filters: FilterOptions) => {
	return useMemo(() => {
		if (!plugins) return [];

		return plugins.filter((plugin) => {
			const keywords = JSON.parse(plugin.keywords || "[]");
			const matchesSearch =
				plugin.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
				plugin.author
					.toLowerCase()
					.includes(filters.searchQuery.toLowerCase()) ||
				keywords.some((keyword: string) =>
					keyword.toLowerCase().includes(filters.searchQuery.toLowerCase()),
				);

			return matchesSearch;
		});
	}, [plugins, filters.searchQuery]);
};

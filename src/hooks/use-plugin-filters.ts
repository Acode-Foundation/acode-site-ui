import { useMemo } from 'react'
import type { Plugin } from './use-plugins'

interface FilterOptions {
  searchQuery: string
  selectedFilter: string
  selectedCategory: string
}

export const usePluginFilters = (plugins: Plugin[], filters: FilterOptions) => {
  return useMemo(() => {
    if (!plugins) return []
    
    return plugins.filter(plugin => {
      const keywords = JSON.parse(plugin.keywords || '[]')
      const matchesSearch = plugin.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           plugin.author.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           keywords.some((keyword: string) => keyword.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      
      const matchesFilter = filters.selectedFilter === "all" ||
                           (filters.selectedFilter === "new") ||
                           (filters.selectedFilter === "most-downloaded" && plugin.downloads > 10000) ||
                           (filters.selectedFilter === "featured" && plugin.votes_up > 20) ||
                           (filters.selectedFilter === "free" && plugin.price === 0) ||
                           (filters.selectedFilter === "paid" && plugin.price > 0)
      
      return matchesSearch && matchesFilter
    })
  }, [plugins, filters.searchQuery, filters.selectedFilter, filters.selectedCategory])
}
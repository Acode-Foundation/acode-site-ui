import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Filter, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MainLayout } from "@/components/layout/main-layout";
import { PluginCard } from "@/components/ui/plugin-card";
import { PluginCardSkeleton } from "@/components/ui/plugin-card-skeleton";
import { usePlugins } from "@/hooks/use-plugins";
import { usePluginFilters } from "@/hooks/use-plugin-filters";
const filters = [{
  value: "default",
  label: "Default"
}, {
  value: "most-downloaded",
  label: "Most Downloaded"
}, {
  value: "newest",
  label: "Newest"
}, {
  value: "recently-updated",
  label: "Recently Updated"
}, {
  value: "free",
  label: "Free"
}, {
  value: "paid",
  label: "Paid"
}];
export default function Plugins() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("default");

  // Determine API filter type
  const apiFilter = ['default', 'most-downloaded', 'newest', 'recently-updated'].includes(selectedFilter) ? selectedFilter as 'default' | 'most-downloaded' | 'newest' | 'recently-updated' : 'default';
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error
  } = usePlugins(apiFilter);

  // Flatten all pages into a single array
  const allPlugins = useMemo(() => {
    return data?.pages.flatMap(page => page) || [];
  }, [data]);

  // Filter for free/paid plugins
  const categoryFilteredPlugins = useMemo(() => {
    if (selectedFilter === 'free') {
      return allPlugins.filter(plugin => plugin.price === 0);
    } else if (selectedFilter === 'paid') {
      return allPlugins.filter(plugin => plugin.price > 0);
    }
    return allPlugins;
  }, [allPlugins, selectedFilter]);
  const filteredPlugins = usePluginFilters(categoryFilteredPlugins, {
    searchQuery
  });

  // Infinite scroll implementation
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1000 >= document.documentElement.scrollHeight) {
      if (hasNextPage && !isFetchingNextPage && !searchQuery) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, searchQuery]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  if (isLoading) {
    return <MainLayout>
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Plugin
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Marketplace</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({
              length: 12
            }).map((_, i) => <PluginCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </MainLayout>;
  }
  return <MainLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plugin
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover and install plugins to extend Acode's functionality. </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card/60 backdrop-blur-lg border border-border/50 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search plugins, authors, keywords..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-12 bg-background/80 border-border/50 rounded-lg text-base" />
            </div>

            {/* Filter */}
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full lg:w-48 h-12 bg-background/80 border-border/50 rounded-lg">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filters.map(filter => <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPlugins.length} of {categoryFilteredPlugins.length} plugins
          </p>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Submit Plugin
          </Button>
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlugins.map((plugin, index) => <PluginCard key={plugin.id} plugin={plugin} index={index} />)}
        </div>

        {/* Loading More Indicator */}
        {isFetchingNextPage && <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Loading more plugins...</span>
          </div>}

        {/* Load More Button (fallback for infinite scroll) */}
        {!searchQuery && hasNextPage && !isFetchingNextPage && filteredPlugins.length > 0 && <div className="flex justify-center mt-8">
            <Button onClick={() => fetchNextPage()} variant="outline" className="px-8">
              Load More Plugins
            </Button>
          </div>}

        {/* No Results */}
        {filteredPlugins.length === 0 && !isLoading && <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No plugins found matching your criteria.</p>
          </div>}
      </div>
    </div>
    </MainLayout>;
}
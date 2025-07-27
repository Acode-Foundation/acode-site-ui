import {
	Edit,
	ExternalLink,
	Filter,
	Loader2,
	Search,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PluginCard } from "@/components/ui/plugin-card";
import { PluginCardSkeleton } from "@/components/ui/plugin-card-skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePluginFilters } from "@/hooks/use-plugin-filters";
import { usePlugins } from "@/hooks/use-plugins";
import { useDeletePlugin } from "@/hooks/use-user-plugins";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

const filters = [
	{
		value: "default",
		label: "Default",
	},
	{
		value: "most-downloaded",
		label: "Most Downloaded",
	},
	{
		value: "newest",
		label: "Newest",
	},
	{
		value: "recently-updated",
		label: "Recently Updated",
	},
	{
		value: "free",
		label: "Free",
	},
	{
		value: "paid",
		label: "Paid",
	},
];
export default function Plugins() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState("default");

	const { data: loggedInUser } = useLoggedInUser();
	const deletePluginMutation = useDeletePlugin();

	// Determine API filter type
	const apiFilter = [
		"default",
		"most-downloaded",
		"newest",
		"recently-updated",
	].includes(selectedFilter)
		? (selectedFilter as import("@/types").PluginFilterType)
		: "default";
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
	} = usePlugins(apiFilter);

	// Flatten all pages into a single array
	const allPlugins = useMemo(() => {
		return data?.pages.flatMap((page) => page) || [];
	}, [data]);

	// Filter for free/paid plugins
	const categoryFilteredPlugins = useMemo(() => {
		if (selectedFilter === "free") {
			return allPlugins.filter((plugin) => plugin.price === 0);
		} else if (selectedFilter === "paid") {
			return allPlugins.filter((plugin) => plugin.price > 0);
		}
		return allPlugins;
	}, [allPlugins, selectedFilter]);
	const filteredPlugins = usePluginFilters(categoryFilteredPlugins, {
		searchQuery,
	});

	const handleDeletePlugin = async (pluginId: string) => {
		try {
			await deletePluginMutation.mutateAsync(pluginId);
			toast.success("Plugin deleted successfully");
		} catch (error) {
			toast.error("Failed to delete plugin");
		}
	};

	// Infinite scroll implementation
	const handleScroll = useCallback(() => {
		if (
			window.innerHeight + document.documentElement.scrollTop + 1000 >=
			document.documentElement.scrollHeight
		) {
			if (hasNextPage && !isFetchingNextPage && !searchQuery) {
				fetchNextPage();
			}
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage, searchQuery]);
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);
	if (isLoading) {
		return (
			<div className="min-h-screen py-8">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Plugin
							<span className="bg-gradient-primary bg-clip-text text-transparent">
								{" "}
								Marketplace
							</span>
						</h1>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{Array.from({
							length: 12,
						}).map((_, i) => (
							<PluginCardSkeleton key={i} />
						))}
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Plugin
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							Marketplace
						</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Discover and install plugins to extend Acode's functionality.{" "}
					</p>
				</div>

				{/* Search and Filters */}
				<div className="bg-card/60 backdrop-blur-lg border border-border/50 rounded-xl p-6 mb-8 shadow-lg">
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Search */}
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<Input
								placeholder="Search plugins, authors, keywords..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 h-12 bg-background/80 border-border/50 rounded-lg text-base"
							/>
						</div>

						{/* Filter */}
						<Select value={selectedFilter} onValueChange={setSelectedFilter}>
							<SelectTrigger className="w-full lg:w-48 h-12 bg-background/80 border-border/50 rounded-lg">
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{filters.map((filter) => (
									<SelectItem key={filter.value} value={filter.value}>
										{filter.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Results Count */}
				<div className="flex justify-between items-center mb-6">
					<p className="text-muted-foreground">
						Showing {filteredPlugins.length} of {categoryFilteredPlugins.length}{" "}
						plugins
					</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							window.location.href = "/submit-plugin";
						}}
					>
						<ExternalLink className="w-4 h-4 mr-2" />
						Submit Plugin
					</Button>
				</div>

				{/* Plugins Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredPlugins.map((plugin, index) => (
						<div key={plugin.id} className="relative group">
							<PluginCard plugin={plugin} index={index} />
							{loggedInUser?.id === plugin.user_id && (
								<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
									<Button
										size="sm"
										variant="secondary"
										className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-muted hover:text-foreground"
										asChild
									>
										<Link to={`/submit-plugin?id=${plugin.id}`}>
											<Edit className="h-3 w-3" />
										</Link>
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												size="sm"
												variant="secondary"
												className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-destructive hover:text-destructive-foreground"
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete Plugin</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete "{plugin.name}"? This
													action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDeletePlugin(plugin.id)}
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Loading More Indicator */}
				{isFetchingNextPage && (
					<div className="flex justify-center items-center py-8">
						<Loader2 className="w-6 h-6 animate-spin mr-2" />
						<span className="text-muted-foreground">
							Loading more plugins...
						</span>
					</div>
				)}

				{/* Load More Button (fallback for infinite scroll) */}
				{!searchQuery &&
					hasNextPage &&
					!isFetchingNextPage &&
					filteredPlugins.length > 0 && (
						<div className="flex justify-center mt-8">
							<Button
								onClick={() => fetchNextPage()}
								variant="outline"
								className="px-8"
							>
								Load More Plugins
							</Button>
						</div>
					)}

				{/* No Results */}
				{filteredPlugins.length === 0 && !isLoading && (
					<div className="text-center py-12">
						<p className="text-muted-foreground text-lg">
							No plugins found matching your criteria.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	BarChart3,
	CheckCircle,
	Clock,
	Edit,
	Eye,
	Filter,
	MoreHorizontal,
	Package,
	Search,
	Trash2,
	XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletePluginDialog } from "@/components/ui/delete-plugin-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useDeletePlugin, useUserPlugins } from "@/hooks/use-user-plugins";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export function UserPluginsOverview() {
	const { data: user } = useLoggedInUser();
	const { data: plugins = [], isLoading } = useUserPlugins(
		user?.id?.toString() || "",
	);
	const deletePluginMutation = useDeletePlugin();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<"downloads">("downloads");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const pluginsPerPage = 5;

	// Filter and sort plugins
	const filteredAndSortedPlugins = useMemo(() => {
		let filtered = plugins;

		// Apply search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(plugin) =>
					plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					plugin.keywords?.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((plugin) => plugin.status === statusFilter);
		}

		// Apply sorting
		filtered.sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;

			switch (sortBy) {
				case "downloads":
					aValue = a.downloads;
					bValue = b.downloads;
					break;
			}

			if (sortOrder === "asc") {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			}
		});

		return filtered;
	}, [plugins, searchQuery, statusFilter, sortBy, sortOrder]);

	// Pagination logic
	const totalPages = Math.ceil(
		filteredAndSortedPlugins.length / pluginsPerPage,
	);
	const startIndex = (currentPage - 1) * pluginsPerPage;
	const paginatedPlugins = filteredAndSortedPlugins.slice(
		startIndex,
		startIndex + pluginsPerPage,
	);

	// Reset pagination when filters change
	// biome-ignore lint/correctness/useExhaustiveDependencies: It's necessary, for resetting of pagination
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, statusFilter, sortBy, sortOrder]);

	const handleDeletePlugin = async (
		pluginId: string,
		mode: "soft" | "hard",
	) => {
		try {
			await deletePluginMutation.mutateAsync({ pluginId, mode });
			toast({
				title: "Plugin Deleted",
				description: `Plugin ${mode === "hard" ? "permanently deleted" : "deleted"} successfully`,
			});
		} catch (error) {
			toast({
				title: "Delete Failed",
				description: "Failed to delete plugin. Please try again.",
				variant: "destructive",
			});
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return (
					<Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 gap-1">
						<CheckCircle className="w-3 h-3" />
						Approved
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 gap-1">
						<Clock className="w-3 h-3" />
						Pending
					</Badge>
				);
			case "rejected":
				return (
					<Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 gap-1">
						<XCircle className="w-3 h-3" />
						Rejected
					</Badge>
				);
			case "deleted":
				return (
					<Badge
						variant="outline"
						className="bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20 gap-1"
					>
						<Trash2 className="w-3 h-3" />
						Deleted
					</Badge>
				);
			default:
				return (
					<Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 gap-1">
						<Clock className="w-3 h-3" />
						Unknown
					</Badge>
				);
		}
	};

	const totalPlugins = filteredAndSortedPlugins.length;
	const approvedPlugins = filteredAndSortedPlugins.filter(
		(p) => p.status === "approved",
	).length;
	const pendingPlugins = filteredAndSortedPlugins.filter(
		(p) => p.status === "pending",
	).length;
	const totalDownloads = filteredAndSortedPlugins.reduce(
		(sum, plugin) => sum + plugin.downloads,
		0,
	);

	const handleSort = (column: "downloads") => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("desc");
		}
	};

	const getSortIcon = (column: "downloads") => {
		if (sortBy !== column) return <ArrowUpDown className="w-4 h-4" />;
		return sortOrder === "asc" ? (
			<ArrowUp className="w-4 h-4" />
		) : (
			<ArrowDown className="w-4 h-4" />
		);
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Package className="w-5 h-5" />
						My Plugins
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading plugins...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Package className="w-5 h-5" />
					My Plugins
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-primary">
							{totalPlugins}
						</div>
						<div className="text-sm text-muted-foreground">Total Plugins</div>
					</div>
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-green-500">
							{approvedPlugins}
						</div>
						<div className="text-sm text-muted-foreground">Approved</div>
					</div>
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-yellow-500">
							{pendingPlugins}
						</div>
						<div className="text-sm text-muted-foreground">Pending</div>
					</div>
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-primary">
							{totalDownloads.toLocaleString()}
						</div>
						<div className="text-sm text-muted-foreground">Total Downloads</div>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="bg-card/60 backdrop-blur-lg border border-border/50 rounded-xl p-4 mb-6 shadow-sm">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search plugins..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-background/80 border-border/50"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full lg:w-48 bg-background/80 border-border/50">
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
								<SelectItem value="deleted">Deleted</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Plugins Table */}
				{plugins.length === 0 ? (
					<div className="text-center py-8">
						<Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">No plugins yet</h3>
						<p className="text-muted-foreground mb-4">
							{searchQuery || statusFilter !== "all"
								? "No plugins match your search criteria."
								: "Start by submitting your first plugin to the store."}
						</p>
						<Link to="/submit-plugin">
							<Button>Submit Plugin</Button>
						</Link>
					</div>
				) : (
					<>
						{/* Mobile view */}
						<div className="block md:hidden space-y-4">
							{paginatedPlugins.map((plugin) => (
								<Card key={plugin.id} className="p-4">
									<div className="flex items-start gap-3 mb-3">
										<img
											src={plugin.icon}
											alt={plugin.name}
											className="w-10 h-10 rounded border flex-shrink-0"
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.style.display = "none";
											}}
											loading="lazy"
										/>
										<div className="flex-1 min-w-0">
											<div className="font-medium truncate">{plugin.name}</div>
											<div className="text-sm text-muted-foreground">
												v{plugin.version}
											</div>
											<div className="flex items-center gap-2 mt-1">
												{getStatusBadge(plugin.status)}
											</div>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4 text-sm mb-3">
										<div>
											<span className="text-muted-foreground">Downloads:</span>
											<div className="font-medium">
												{plugin.downloads.toLocaleString()}
											</div>
										</div>
										<div>
											<span className="text-muted-foreground">Rating:</span>
											<div className="flex items-center gap-1">
												<span>{plugin.votes_up || 0}</span>
												<Eye className="w-3 h-3 text-muted-foreground" />
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Link to={`/plugins/${plugin.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full">
												<Eye className="w-4 h-4 mr-2" />
												View
											</Button>
										</Link>
										{plugin.status === "approved" && plugin.price > 0 && (
											<Link
												to={`/plugin-orders/${plugin.id}`}
												className="flex-1"
											>
												<Button variant="outline" size="sm" className="w-full">
													<BarChart3 className="w-4 h-4 mr-2" />
													Orders
												</Button>
											</Link>
										)}
										<Link
											to={`/submit-plugin?id=${plugin.id}`}
											className="flex-1"
										>
											<Button variant="outline" size="sm" className="w-full">
												<Edit className="w-4 h-4 mr-2" />
												Edit
											</Button>
										</Link>
										<DeletePluginDialog
											pluginName={plugin.name}
											isOwner={true}
											isAdmin={user?.role === "admin"}
											onDelete={(mode) => handleDeletePlugin(plugin.id, mode)}
											isDeleting={deletePluginMutation.isPending}
											trigger={
												<Button
													variant="outline"
													size="sm"
													className="flex-shrink-0"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											}
										/>
									</div>
								</Card>
							))}
						</div>

						{/* Desktop view */}
						<div className="hidden md:block rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-semibold text-foreground">
											Plugin
										</TableHead>
										<TableHead className="font-semibold text-foreground">
											Status
										</TableHead>
										<TableHead>
											<Button
												variant="ghost"
												size="sm"
												className="h-auto p-0 font-semibold text-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-1"
												onClick={() => handleSort("downloads")}
											>
												Downloads {getSortIcon("downloads")}
											</Button>
										</TableHead>
										<TableHead className="font-semibold text-foreground">
											Rating
										</TableHead>
										<TableHead className="font-semibold text-foreground">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{paginatedPlugins.map((plugin) => (
										<TableRow key={plugin.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<img
														src={plugin.icon}
														alt={plugin.name}
														className="w-8 h-8 rounded border"
														onError={(e) => {
															const target = e.target as HTMLImageElement;
															target.style.display = "none";
														}}
														loading="lazy"
													/>
													<div>
														<div className="font-medium">{plugin.name}</div>
														<div className="text-sm text-muted-foreground">
															v{plugin.version}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>{getStatusBadge(plugin.status)}</TableCell>
											<TableCell>{plugin.downloads.toLocaleString()}</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<span>{plugin.votes_up || 0}</span>
													<Eye className="w-3 h-3 text-muted-foreground" />
												</div>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger>
														<Button
															variant="ghost"
															size="sm"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">Open menu</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-48">
														<DropdownMenuItem asChild>
															<Link
																to={`/plugins/${plugin.id}`}
																className="flex items-center"
															>
																<Eye className="mr-2 h-4 w-4" />
																View Plugin
															</Link>
														</DropdownMenuItem>
														{plugin.status === "approved" &&
															plugin.price > 0 && (
																<DropdownMenuItem asChild>
																	<Link
																		to={`/plugin-orders/${plugin.id}`}
																		className="flex items-center"
																	>
																		<BarChart3 className="mr-2 h-4 w-4" />
																		View Orders
																	</Link>
																</DropdownMenuItem>
															)}
														<DropdownMenuItem asChild>
															<Link
																to={`/submit-plugin?id=${plugin.id}`}
																className="flex items-center"
															>
																<Edit className="mr-2 h-4 w-4" />
																Edit Plugin
															</Link>
														</DropdownMenuItem>
														<DropdownMenuSeparator className="bg-border" />
														<DeletePluginDialog
															pluginName={plugin.name}
															isOwner={true}
															isAdmin={user?.role === "admin"}
															onDelete={(mode) =>
																handleDeletePlugin(plugin.id, mode)
															}
															isDeleting={deletePluginMutation.isPending}
															trigger={
																<DropdownMenuItem
																	onSelect={(e) => e.preventDefault()}
																	className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-400"
																>
																	<Trash2 className="mr-2 h-4 w-4" />
																	Delete Plugin
																</DropdownMenuItem>
															}
														/>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-6">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href="#"
												onClick={(e) => {
													e.preventDefault();
													if (currentPage > 1) setCurrentPage(currentPage - 1);
												}}
												className={
													currentPage <= 1
														? "pointer-events-none opacity-50"
														: ""
												}
											/>
										</PaginationItem>

										{[...Array(totalPages)].map((_, index) => {
											const page = index + 1;
											return (
												<PaginationItem key={page}>
													<PaginationLink
														href="#"
														onClick={(e) => {
															e.preventDefault();
															setCurrentPage(page);
														}}
														isActive={currentPage === page}
													>
														{page}
													</PaginationLink>
												</PaginationItem>
											);
										})}

										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													if (currentPage < totalPages)
														setCurrentPage(currentPage + 1);
												}}
												className={
													currentPage >= totalPages
														? "pointer-events-none opacity-50"
														: ""
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

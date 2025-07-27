import { Edit, Eye, Package, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useUserPlugins, useDeletePlugin } from "@/hooks/use-user-plugins";
import { toast } from "@/hooks/use-toast";

export function UserPluginsOverview() {
	const { data: plugins = [], isLoading } = useUserPlugins();
	const deletePluginMutation = useDeletePlugin();

	const handleDelete = async (pluginId: string, pluginName: string) => {
		if (!confirm(`Are you sure you want to delete "${pluginName}"?`)) {
			return;
		}

		try {
			await deletePluginMutation.mutateAsync(pluginId);
			toast({
				title: "Plugin deleted",
				description: `${pluginName} has been deleted successfully.`,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete plugin. Please try again.",
				variant: "destructive",
			});
		}
	};

	const getStatusBadge = (status: string) => {
		const variants = {
			approved: "bg-green-500/10 text-green-500 border-green-500/20",
			pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
			rejected: "bg-red-500/10 text-red-500 border-red-500/20",
		};

		return (
			<Badge className={variants[status as keyof typeof variants] || variants.pending}>
				{status}
			</Badge>
		);
	};

	const totalPlugins = plugins.length;
	const approvedPlugins = plugins.filter(p => p.status === "approved").length;
	const pendingPlugins = plugins.filter(p => p.status === "pending").length;
	const totalDownloads = plugins.reduce((sum, plugin) => sum + plugin.downloads, 0);

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
						<div className="text-2xl font-bold text-primary">{totalPlugins}</div>
						<div className="text-sm text-muted-foreground">Total Plugins</div>
					</div>
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-green-500">{approvedPlugins}</div>
						<div className="text-sm text-muted-foreground">Approved</div>
					</div>
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-yellow-500">{pendingPlugins}</div>
						<div className="text-sm text-muted-foreground">Pending</div>
					</div>
					<div className="text-center p-4 bg-muted/30 rounded-lg">
						<div className="text-2xl font-bold text-primary">{totalDownloads.toLocaleString()}</div>
						<div className="text-sm text-muted-foreground">Total Downloads</div>
					</div>
				</div>

				{/* Plugins Table */}
				{plugins.length === 0 ? (
					<div className="text-center py-8">
						<Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">No plugins yet</h3>
						<p className="text-muted-foreground mb-4">
							Start by submitting your first plugin to the store.
						</p>
						<Link to="/submit-plugin">
							<Button>Submit Plugin</Button>
						</Link>
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Plugin</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Downloads</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{plugins.map((plugin) => (
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
												/>
												<div>
													<div className="font-medium">{plugin.name}</div>
													<div className="text-sm text-muted-foreground">v{plugin.version}</div>
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
											<div className="flex items-center gap-2">
												<Link to={`/plugins/${plugin.id}`}>
													<Button variant="ghost" size="sm">
														<Eye className="w-4 h-4" />
													</Button>
												</Link>
												<Link to={`/submit-plugin?update=${plugin.id}`}>
													<Button variant="ghost" size="sm">
														<Edit className="w-4 h-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(plugin.id, plugin.name)}
													disabled={deletePluginMutation.isPending}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
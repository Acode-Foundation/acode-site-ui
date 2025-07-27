import { useQuery } from "@tanstack/react-query";
import {
	Calendar,
	CheckCircle,
	Download,
	Edit,
	Github,
	Globe,
	Mail,
	Package,
	Settings,
	Star,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PluginCard } from "@/components/ui/plugin-card";
import { useToast } from "@/hooks/use-toast";
import { useDeletePlugin } from "@/hooks/use-user-plugins";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { DeveloperProfile as DeveloperType } from "@/types/developer";
import { Plugin } from "@/types/plugin";

interface Developer extends DeveloperType {
	role: string;
	threshold: number;
}

const fetchDeveloper = async (email: string): Promise<Developer> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/${email}`,
	);
	if (!response.ok) {
		throw new Error("Developer not found");
	}
	return response.json();
};

const fetchDeveloperPlugins = async (userId: string): Promise<Plugin[]> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugins?user=${userId}`,
	);
	if (!response.ok) {
		return [];
	}
	return response.json();
};

export default function DeveloperProfile() {
	const { email } = useParams<{ email: string }>();
	const { toast } = useToast();
	const { data: loggedInUser } = useLoggedInUser();
	const deleteMutation = useDeletePlugin();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [pluginToDelete, setPluginToDelete] = useState<string | null>(null);

	const {
		data: developer,
		isLoading: isDeveloperLoading,
		error: developerError,
	} = useQuery({
		queryKey: ["developer", email],
		queryFn: () => fetchDeveloper(email!),
		enabled: !!email,
	});

	const { data: plugins = [], isLoading: isPluginsLoading } = useQuery({
		queryKey: ["developer-plugins", developer?.id],
		queryFn: () => fetchDeveloperPlugins(developer!.id.toString()),
		enabled: !!developer?.id,
	});

	const isOwnProfile = loggedInUser?.email === email;

	const handleDeletePlugin = (pluginId: string) => {
		setPluginToDelete(pluginId);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!pluginToDelete) return;

		try {
			await deleteMutation.mutateAsync(pluginToDelete);
			toast({
				title: "Success",
				description: "Plugin deleted successfully",
			});
			setDeleteDialogOpen(false);
			setPluginToDelete(null);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete plugin",
				variant: "destructive",
			});
		}
	};

	if (isDeveloperLoading) {
		return (
			<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading developer profile...</p>
				</div>
			</div>
		);
	}

	if (developerError || !developer) {
		return (
			<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Developer Not Found</h1>
					<p className="text-muted-foreground mb-6">
						The developer profile you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	const totalDownloads = plugins.reduce(
		(sum, plugin) => sum + plugin.downloads,
		0,
	);
	const averageRating =
		plugins.length > 0
			? plugins.reduce((sum, plugin) => sum + plugin.votes_up, 0) /
				plugins.length
			: 0;

	return (
		<div className="min-h-screen bg-gradient-dark">
			<div className="container mx-auto px-4 py-8">
				{/* Developer Header */}
				<Card className="mb-8">
					<CardContent className="p-8">
						<div className="flex flex-col md:flex-row gap-6">
							<Avatar className="w-24 h-24">
								{developer.github ? (
									<AvatarImage
										src={`https://avatars.githubusercontent.com/${developer.github}`}
										alt={developer.name}
									/>
								) : null}
								<AvatarFallback className="text-2xl bg-gradient-primary text-white">
									{developer.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h1 className="text-3xl font-bold">{developer.name}</h1>
									{developer.verified === 1 && (
										<div className="flex items-center gap-1">
											<CheckCircle className="w-5 h-5 text-green-500" />
											<Badge className="bg-green-500/10 text-green-500 border-green-500/20">
												Verified
											</Badge>
										</div>
									)}
								</div>

								<p className="text-muted-foreground mb-4">{developer.email}</p>

								<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
									<div className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										Joined{" "}
										{new Date(developer.created_at).toLocaleDateString(
											"en-US",
											{
												month: "long",
												year: "numeric",
											},
										)}
									</div>
								</div>

								<div className="flex flex-wrap gap-3">
									{isOwnProfile && (
										<Button
											size="sm"
											asChild
											className="bg-gradient-primary hover:shadow-glow-primary"
										>
											<Link to="/dashboard?tab=profile">
												<Settings className="w-4 h-4 mr-2" />
												Edit Profile
											</Link>
										</Button>
									)}
									{developer.website && (
										<Button variant="outline" size="sm" asChild>
											<a
												href={developer.website}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Globe className="w-4 h-4 mr-2" />
												Website
											</a>
										</Button>
									)}
									{developer.github && (
										<Button variant="outline" size="sm" asChild>
											<a
												href={`https://github.com/${developer.github}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Github className="w-4 h-4 mr-2" />
												GitHub
											</a>
										</Button>
									)}
									<Button variant="outline" size="sm" asChild>
										<a href={`mailto:${developer.email}`}>
											<Mail className="w-4 h-4 mr-2" />
											Contact
										</a>
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardContent className="p-6 text-center">
							<Package className="w-8 h-8 mx-auto mb-2 text-primary" />
							<div className="text-2xl font-bold">{plugins.length}</div>
							<p className="text-sm text-muted-foreground">Plugins</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<Download className="w-8 h-8 mx-auto mb-2 text-primary" />
							<div className="text-2xl font-bold">
								{totalDownloads.toLocaleString()}
							</div>
							<p className="text-sm text-muted-foreground">Total Downloads</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<Star className="w-8 h-8 mx-auto mb-2 text-primary" />
							<div className="text-2xl font-bold">
								{Math.round(averageRating)}
							</div>
							<p className="text-sm text-muted-foreground">Avg Upvotes</p>
						</CardContent>
					</Card>
				</div>

				{/* Published Plugins */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="w-5 h-5" />
							Published Plugins ({plugins.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isPluginsLoading ? (
							<div className="text-center py-12">
								<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-muted-foreground">Loading plugins...</p>
							</div>
						) : plugins.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{plugins.map((plugin, index) => (
									<div key={plugin.id} className="relative group">
										<PluginCard plugin={plugin} index={index} />
										{isOwnProfile && (
											<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-muted hover:text-foreground"
													asChild
												>
													<Link to={`/submit-plugin?id=${plugin.id}`}>
														<Edit className="h-3 w-3" />
													</Link>
												</Button>
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-destructive hover:text-destructive-foreground"
													onClick={() => handleDeletePlugin(plugin.id)}
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
								<p className="text-muted-foreground">
									No plugins published yet.
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Delete Confirmation Dialog */}
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Plugin</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this plugin? This action cannot
								be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setPluginToDelete(null)}>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={confirmDelete}
								className="bg-destructive hover:bg-destructive/90"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}

import {
	CheckCircle,
	Clock,
	Download,
	Star,
	Trash,
	Verified,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PluginStatusToggle } from "@/components/ui/plugin-status-toggle";
import { Plugin } from "@/types";

interface PluginCardProps {
	plugin: Plugin;
	index?: number;
	showStatus?: boolean;
	currentUserId?: number;
	isAdmin?: boolean;
}

const getStatusBadge = (status?: string) => {
	switch (status) {
		case "approved":
			return {
				icon: CheckCircle,
				label: "Approved",
				variant: "default" as const,
				className:
					"bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
			};
		case "pending":
			return {
				icon: Clock,
				label: "Pending",
				variant: "secondary" as const,
				className:
					"bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
			};
		case "rejected":
			return {
				icon: XCircle,
				label: "Rejected",
				variant: "destructive" as const,
				className:
					"bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
			};
		case "deleted":
			return {
				icon: Trash,
				label: "Deleted",
				variant: "outline" as const,
				className:
					"bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20",
			};
		default:
			return null;
	}
};

export function PluginCard({
	plugin,
	index = 0,
	showStatus = false,
	currentUserId,
	isAdmin = false,
}: PluginCardProps) {
	const [currentPluginStatus, setCurrentPluginStatus] = useState(plugin.status);
	const statusInfo = getStatusBadge(currentPluginStatus);
	const shouldShowStatus =
		showStatus && (isAdmin || plugin.user_id === currentUserId) && statusInfo;

	return (
		<Link key={plugin.id} to={`/plugins/${plugin.id}`}>
			<Card
				className="bg-card/60 backdrop-blur-lg border border-border/50 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg cursor-pointer overflow-hidden h-full"
				style={{ animationDelay: `${index * 0.05}s` }}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="relative">
							<img
								src={plugin.icon}
								alt={plugin.name}
								className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform border border-border/20"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = "none";
									target.nextElementSibling?.classList.remove("hidden");
								}}
							/>
							<div className="hidden w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform border border-border/20">
								{plugin.name.charAt(0)}
							</div>
						</div>
						<div className="flex flex-col items-end gap-1">
							<Badge variant="outline" className="text-xs">
								v{plugin.version}
							</Badge>
							{shouldShowStatus && (
								<div
									onClick={(e) => {
										if (isAdmin) {
											e.preventDefault();
											e.stopPropagation();
										}
									}}
									className={isAdmin ? "cursor-pointer" : ""}
								>
									{isAdmin ? (
										<PluginStatusToggle
											pluginId={plugin.id}
											pluginName={plugin.name}
											currentStatus={currentPluginStatus || ""}
											onStatusChange={setCurrentPluginStatus}
											variant="menu"
										>
											<Badge
												variant={statusInfo.variant}
												className={`text-xs flex items-center gap-1 ${statusInfo.className} hover:opacity-80 transition-opacity`}
											>
												<statusInfo.icon className="w-3 h-3" />
												{statusInfo.label}
											</Badge>
										</PluginStatusToggle>
									) : (
										<Badge
											variant={statusInfo.variant}
											className={`text-xs flex items-center gap-1 ${statusInfo.className}`}
										>
											<statusInfo.icon className="w-3 h-3" />
											{statusInfo.label}
										</Badge>
									)}
								</div>
							)}
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
							{plugin.name}
						</h3>
						<div className="flex items-center space-x-1">
							<p className="text-sm text-muted-foreground truncate">
								by{" "}
								<span className="text-muted-foreground group-hover:text-primary">
									{plugin.author}
								</span>
							</p>
							{plugin.author_verified === 1 && (
								<Verified className="w-3 h-3 text-primary" />
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<div className="flex items-center justify-between text-sm mb-4">
						<span
							className={`font-medium ${plugin.price === 0 ? "text-green-400" : "text-primary"}`}
						>
							{plugin.price === 0 ? "Free" : `₹${plugin.price}`}
						</span>
						<Badge variant="outline" className="text-xs px-1">
							{plugin.license}
						</Badge>
					</div>

					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<div className="flex items-center space-x-3">
							<div className="flex items-center space-x-1">
								<Star className="w-3 h-3 text-green-400" />
								<span className="text-green-400">{plugin.votes_up}</span>
							</div>
							<div className="flex items-center space-x-1">
								<Star className="w-3 h-3 text-red-400 rotate-180" />
								<span className="text-red-400">{plugin.votes_down}</span>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<Download className="w-3 h-3" />
							<span>{plugin.downloads.toLocaleString()}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePluginStatus } from "@/hooks/use-plugin-status";

interface PluginStatusToggleProps {
	pluginId: string;
	pluginName: string;
	currentStatus: string;
	onStatusChange?: (newStatus: string) => void;
	variant?: "button" | "menu";
	children?: React.ReactNode;
}

export function PluginStatusToggle({
	pluginId,
	pluginName,
	currentStatus,
	onStatusChange,
	variant = "button",
	children,
}: PluginStatusToggleProps) {
	const [reason, setReason] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedAction, setSelectedAction] = useState<
		"approve" | "reject" | null
	>(null);

	const pluginStatusMutation = usePluginStatus();

	const handleStatusChange = async (action: "approve" | "reject") => {
		try {
			await pluginStatusMutation.mutateAsync({
				pluginId,
				status: action,
				reason: action === "reject" ? reason : undefined,
			});

			// Update the status in the parent component if callback provided
			if (onStatusChange) {
				onStatusChange(action === "approve" ? "approved" : "rejected");
			}

			setDialogOpen(false);
			setReason("");
			setSelectedAction(null);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const openDialog = (action: "approve" | "reject") => {
		setSelectedAction(action);
		if (action === "approve") {
			// For approve, execute immediately
			handleStatusChange("approve");
		} else {
			// For reject, open dialog for reason
			setDialogOpen(true);
		}
	};

	if (variant === "menu") {
		return (
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Change Plugin Status</DialogTitle>
						<DialogDescription>
							Change the status of "{pluginName}" plugin.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => openDialog("approve")}
								disabled={
									currentStatus === "approved" || pluginStatusMutation.isPending
								}
							>
								<Check className="w-4 h-4 mr-2" />
								Approve
							</Button>
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => openDialog("reject")}
								disabled={
									currentStatus === "rejected" || pluginStatusMutation.isPending
								}
							>
								<X className="w-4 h-4 mr-2" />
								Reject
							</Button>
						</div>

						{selectedAction === "reject" && (
							<div className="space-y-2">
								<Label htmlFor="reason">Reason for rejection</Label>
								<Textarea
									id="reason"
									placeholder="Enter reason for rejection..."
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									rows={3}
								/>
							</div>
						)}

						{selectedAction === "reject" && (
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => {
										setDialogOpen(false);
										setSelectedAction(null);
										setReason("");
									}}
								>
									Cancel
								</Button>
								<Button
									onClick={() => handleStatusChange("reject")}
									disabled={!reason.trim() || pluginStatusMutation.isPending}
									variant="destructive"
								>
									{pluginStatusMutation.isPending
										? "Rejecting..."
										: "Reject Plugin"}
								</Button>
							</DialogFooter>
						)}
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	// Button variant (for direct use)
	return (
		<div className="flex gap-2">
			<Button
				variant="outline"
				size="sm"
				className="h-8"
				disabled={
					currentStatus === "approved" || pluginStatusMutation.isPending
				}
				onClick={() => openDialog("approve")}
			>
				<Check className="w-4 h-4 mr-2" />
				Approve
			</Button>

			<Dialog
				open={dialogOpen && selectedAction === "reject"}
				onOpenChange={(open) => {
					if (!open) {
						setDialogOpen(false);
						setSelectedAction(null);
						setReason("");
					}
				}}
			>
				<Button
					variant="outline"
					size="sm"
					className="h-8"
					disabled={
						currentStatus === "rejected" || pluginStatusMutation.isPending
					}
					onClick={() => openDialog("reject")}
				>
					<X className="w-4 h-4 mr-2" />
					Reject
				</Button>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Reject Plugin</DialogTitle>
						<DialogDescription>
							Please provide a reason for rejecting "{pluginName}".
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2">
						<Label htmlFor="reason">Reason for rejection</Label>
						<Textarea
							id="reason"
							placeholder="Enter reason for rejection..."
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							rows={3}
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setDialogOpen(false);
								setSelectedAction(null);
								setReason("");
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={() => handleStatusChange("reject")}
							disabled={!reason.trim() || pluginStatusMutation.isPending}
							variant="destructive"
						>
							{pluginStatusMutation.isPending
								? "Rejecting..."
								: "Reject Plugin"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

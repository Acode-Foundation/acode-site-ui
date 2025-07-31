import { AlertCircle, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface DeletePluginDialogProps {
	pluginName: string;
	isOwner: boolean;
	isAdmin: boolean;
	onDelete: (mode: "soft" | "hard") => void;
	trigger?: React.ReactNode;
	isDeleting?: boolean;
}

export function DeletePluginDialog({
	pluginName,
	isOwner,
	isAdmin,
	onDelete,
	trigger,
	isDeleting = false,
}: DeletePluginDialogProps) {
	const [deleteMode, setDeleteMode] = useState<"soft" | "hard">("soft");
	const [open, setOpen] = useState(false);

	const handleDelete = () => {
		onDelete(deleteMode);
		setOpen(false);
	};

	// For normal users who own the plugin, only soft delete is available
	const shouldShowModeSelection = isAdmin;
	const mode = isOwner && !isAdmin ? "soft" : deleteMode;

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				{trigger || (
					<Button
						size="sm"
						variant="ghost"
						className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-destructive hover:text-destructive-foreground"
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						Delete Plugin
					</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div className="space-y-3">
							<p>
								Are you sure you want to delete{" "}
								<span className="font-semibold">"{pluginName}"</span>?
							</p>

							{shouldShowModeSelection && (
								<>
									<Separator />
									<div className="space-y-3">
										<Label className="text-sm font-medium">
											Select deletion mode:
										</Label>
										<RadioGroup
											value={deleteMode}
											onValueChange={(value: "soft" | "hard") =>
												setDeleteMode(value)
											}
											className="space-y-3"
										>
											<div className="flex items-start space-x-3">
												<RadioGroupItem
													value="soft"
													id="soft"
													className="mt-1"
												/>
												<div className="space-y-1">
													<Label htmlFor="soft" className="font-medium">
														Soft Delete
													</Label>
													<p className="text-xs text-muted-foreground">
														Marks the plugin as deleted but keeps the data. Can
														be restored later.
													</p>
												</div>
											</div>
											<div className="flex items-start space-x-3">
												<RadioGroupItem
													value="hard"
													id="hard"
													className="mt-1"
												/>
												<div className="space-y-1">
													<Label
														htmlFor="hard"
														className="font-medium text-destructive"
													>
														Hard Delete
													</Label>
													<p className="text-xs text-muted-foreground">
														Permanently removes all plugin data. This action
														cannot be undone.
													</p>
												</div>
											</div>
										</RadioGroup>
									</div>
								</>
							)}

							{!shouldShowModeSelection && isOwner && (
								<>
									<Separator />
									<div className="bg-muted/50 p-3 rounded-lg">
										<p className="text-xs text-muted-foreground">
											As the plugin owner, this will perform a soft delete
											(marking as deleted but preserving data).
										</p>
									</div>
								</>
							)}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isDeleting}
						className={`${
							mode === "hard"
								? "bg-destructive hover:bg-destructive/90"
								: "bg-orange-600 hover:bg-orange-600/90"
						} text-white`}
					>
						{isDeleting ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="w-4 h-4 mr-2" />
								{mode === "hard" ? "Delete Permanently" : "Delete"}
							</>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

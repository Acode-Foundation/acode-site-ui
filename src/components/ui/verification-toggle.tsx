import { ShieldCheck, ShieldX } from "lucide-react";
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
import { useVerificationToggle } from "@/hooks/use-verification-toggle";

interface VerificationToggleProps {
	userId: string;
	isVerified: boolean;
	userName: string;
	variant?: "button" | "icon" | "menu" | "action-only";
	size?: "sm" | "default" | "lg";
	className?: string;
	children?: React.ReactNode;
}

function VerificationDialogContent({
	isVerified,
	userName,
	onConfirm,
	isLoading,
}: {
	isVerified: boolean;
	userName: string;
	onConfirm: () => void;
	isLoading: boolean;
}) {
	const action = isVerified ? "revoke verification of" : "verify";
	const buttonText = isVerified ? "Revoke Verification" : "Verify User";

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					{isVerified ? "Revoke Verification" : "Verify User"}
				</AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to {action} this user "{userName}"?
					{isVerified && " This will remove their verified status."}
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction
					onClick={onConfirm}
					className={
						isVerified
							? "bg-red-600 hover:bg-red-700"
							: "bg-green-600 hover:bg-green-700"
					}
					disabled={isLoading}
				>
					{buttonText}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}

export function VerificationToggle({
	userId,
	isVerified,
	userName,
	variant = "button",
	size = "default",
	className = "",
	children,
}: VerificationToggleProps) {
	const { toggleVerification, isLoading } = useVerificationToggle();

	const handleToggleVerification = async () => {
		try {
			await toggleVerification({ userId, revoke: isVerified });
		} catch (error) {
			// Error handling is done in the hook
		}
	};

	const Icon = isVerified ? ShieldX : ShieldCheck;
	const buttonText = isVerified ? "Revoke Verification" : "Verify User";

	if (variant === "action-only") {
		return (
			<AlertDialogAction
				onClick={handleToggleVerification}
				className={
					isVerified
						? "bg-red-600 hover:bg-red-700"
						: "bg-green-600 hover:bg-green-700"
				}
				disabled={isLoading}
			>
				{buttonText}
			</AlertDialogAction>
		);
	}

	const getTriggerButton = () => {
		if (children) {
			return children;
		}

		const baseProps = {
			disabled: isLoading,
			className,
		};

		switch (variant) {
			case "icon":
				return (
					<Button
						variant="ghost"
						size="sm"
						className={`h-8 w-8 p-0 ${className}`}
						{...baseProps}
					>
						<Icon className="w-4 h-4" />
					</Button>
				);
			case "menu":
				return (
					<Button
						variant="ghost"
						size="sm"
						className={`flex items-center gap-2 justify-start ${className}`}
						{...baseProps}
					>
						<Icon className="w-4 h-4" />
						{buttonText}
					</Button>
				);
			default:
				return (
					<Button
						variant={isVerified ? "destructive" : "default"}
						size={size}
						className={`flex items-center gap-2 ${className}`}
						{...baseProps}
					>
						<Icon className="w-4 h-4" />
						{buttonText}
					</Button>
				);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{getTriggerButton()}</AlertDialogTrigger>
			<VerificationDialogContent
				isVerified={isVerified}
				userName={userName}
				onConfirm={handleToggleVerification}
				isLoading={isLoading}
			/>
		</AlertDialog>
	);
}

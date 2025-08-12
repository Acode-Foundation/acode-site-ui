import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UseVerificationToggleProps {
	onSuccess?: () => void;
}

export function useVerificationToggle({
	onSuccess,
}: UseVerificationToggleProps = {}) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const verificationMutation = useMutation({
		mutationFn: async ({
			userId,
			revoke,
		}: {
			userId: string;
			revoke: boolean;
		}) => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/verify${revoke ? "/revoke" : ""}/${userId}`,
				{
					method: "PATCH",
					credentials: "include",
				},
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error ||
						`Failed to ${revoke ? "revoke verification" : "verify"} user`,
				);
			}

			return response.json();
		},
		onSuccess: (data, variables) => {
			const action = variables.revoke ? "revoked" : "verified";
			toast({
				title: "Success",
				description: `User ${action} successfully`,
			});

			// Invalidate relevant queries
			queryClient.invalidateQueries({ queryKey: ["developer"] });
			queryClient.invalidateQueries({ queryKey: ["adminUsers"] });

			onSuccess?.();
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	return {
		toggleVerification: verificationMutation.mutateAsync,
		isLoading: verificationMutation.isPending,
	};
}

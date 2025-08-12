import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChangePluginStatusParams {
	pluginId: string;
	status: "approve" | "reject";
	reason?: string;
}

interface PluginStatusResponse {
	message?: string;
	error?: string;
}

export function usePluginStatus() {
	const queryClient = useQueryClient();

	return useMutation<PluginStatusResponse, Error, ChangePluginStatusParams>({
		mutationFn: async ({ pluginId, status, reason }) => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ id: pluginId, status, reason }),
				},
			);

			const data = await response.json();

			if (!response.ok || data.error) {
				throw new Error(data.error || "Failed to update plugin status");
			}

			return data;
		},
		onSuccess: (data, variables) => {
			toast.success(
				`Plugin ${variables.status === "approve" ? "approved" : "rejected"} successfully`,
			);

			// Invalidate relevant queries to refresh the data
			queryClient.invalidateQueries({ queryKey: ["plugins"] });
			queryClient.invalidateQueries({ queryKey: ["adminStats"] });
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`);
		},
	});
}

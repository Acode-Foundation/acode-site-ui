import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Review, ReviewFormData, ReplyData, FlagResponse } from "@/types/plugin-detail";

const fetchReviews = async (pluginId: string): Promise<Review[]> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/${pluginId}`,
		{
			credentials: "include",
		}
	);
	if (!response.ok) {
		return [];
	}
	return response.json();
};

const submitReview = async (pluginId: string, data: ReviewFormData): Promise<void> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				plugin_id: pluginId,
				comment: data.comment,
				vote: data.vote,
			}),
		}
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to submit review");
	}
};

const replyToReview = async (commentId: number, data: ReplyData): Promise<void> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/${commentId}/reply`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to reply to review");
	}
};

const flagComment = async (commentId: number): Promise<FlagResponse> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/toggle-flag/${commentId}`,
		{
			method: "PATCH",
			credentials: "include",
		}
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to flag comment");
	}

	return response.json();
};

export const useReviews = (pluginId: string) => {
	return useQuery({
		queryKey: ["reviews", pluginId],
		queryFn: () => fetchReviews(pluginId),
		enabled: !!pluginId,
	});
};

export const useSubmitReview = (pluginId: string) => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (data: ReviewFormData) => submitReview(pluginId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reviews", pluginId] });
			queryClient.invalidateQueries({ queryKey: ["plugin", pluginId] });
		},
	});
};

export const useReplyToReview = (pluginId: string) => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ commentId, data }: { commentId: number; data: ReplyData }) => 
			replyToReview(commentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reviews", pluginId] });
		},
	});
};

export const useFlagComment = (pluginId: string) => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (commentId: number) => flagComment(commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reviews", pluginId] });
		},
	});
};
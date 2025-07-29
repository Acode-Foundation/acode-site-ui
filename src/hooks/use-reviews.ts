import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	FlagResponse,
	ReplyData,
	Review,
	ReviewFormData,
} from "@/types/plugin-detail";

const fetchReviews = async (pluginId: string): Promise<Review[]> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/${pluginId}`,
		{
			credentials: "include",
		},
	);
	if (!response.ok) {
		return [];
	}
	return response.json();
};

const submitReview = async (
	pluginId: string,
	data: ReviewFormData,
): Promise<void> => {
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
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to submit review");
	}
};

const replyToReview = async (
	commentId: number,
	data: ReplyData,
): Promise<void> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/${commentId}/reply`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
		},
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
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to flag comment");
	}

	return response.json();
};

const deleteReview = async (commentId: number): Promise<void> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/comment/${commentId}`,
		{
			method: "DELETE",
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to delete review");
	}
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
		onSuccess: (_, { commentId, data }) => {
			// Update the specific review's reply without refetching
			queryClient.setQueryData(
				["reviews", pluginId],
				(oldData: Review[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.map((review) =>
						review.id === commentId
							? { ...review, author_reply: data.reply }
							: review,
					);
				},
			);
		},
	});
};

export const useFlagComment = (pluginId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (commentId: number) => flagComment(commentId),
		onSuccess: (data, commentId) => {
			// Update the specific review's flag status without refetching
			queryClient.setQueryData(
				["reviews", pluginId],
				(oldData: Review[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.map((review) =>
						review.id === commentId
							? { ...review, flagged_by_author: data.flagged }
							: review,
					);
				},
			);
		},
	});
};

export const useEditReview = (pluginId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ReviewFormData) => submitReview(pluginId, data),
		onSuccess: (_, data) => {
			// Update the reviews cache optimistically to prevent scroll jump
			queryClient.setQueryData(
				["reviews", pluginId],
				(oldData: Review[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.map((review) => {
						// Find the user's existing review and update it
						const loggedInUser = queryClient.getQueryData(["loggedInUser"]) as
							| { id: number }
							| undefined;
						if (review.user_id === loggedInUser?.id) {
							return { ...review, comment: data.comment, vote: data.vote };
						}
						return review;
					});
				},
			);
			queryClient.invalidateQueries({ queryKey: ["plugin", pluginId] });
		},
	});
};

export const useEditReply = (pluginId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ commentId, data }: { commentId: number; data: ReplyData }) =>
			replyToReview(commentId, data),
		onSuccess: (_, { commentId, data }) => {
			// Update the specific review's reply without refetching
			queryClient.setQueryData(
				["reviews", pluginId],
				(oldData: Review[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.map((review) =>
						review.id === commentId
							? { ...review, author_reply: data.reply }
							: review,
					);
				},
			);
		},
	});
};

export const useDeleteReview = (pluginId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (commentId: number) => deleteReview(commentId),
		onSuccess: (_, commentId) => {
			// Remove the deleted review from the list
			queryClient.setQueryData(
				["reviews", pluginId],
				(oldData: Review[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.filter((review) => review.id !== commentId);
				},
			);
			queryClient.invalidateQueries({ queryKey: ["plugin", pluginId] });
		},
	});
};

export const useDeleteReply = (pluginId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			commentId,
			data,
		}: {
			commentId: number;
			data: { reply: string };
		}) => replyToReview(commentId, { reply: "" }),
		onSuccess: (_, { commentId }) => {
			// Remove the reply from the specific review
			queryClient.setQueryData(
				["reviews", pluginId],
				(oldData: Review[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.map((review) =>
						review.id === commentId ? { ...review, author_reply: "" } : review,
					);
				},
			);
		},
	});
};

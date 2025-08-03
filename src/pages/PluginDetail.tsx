import { useQuery } from "@tanstack/react-query";
import hljs from "highlight.js";
import {
	BarChart3,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Edit,
	Flag,
	Github,
	MessageSquare,
	Reply,
	Send,
	Shield,
	Star,
	Tag,
	ThumbsDown,
	ThumbsUp,
	Trash,
	Trash2,
	Users,
	XCircle,
} from "lucide-react";
import MarkdownIt from "markdown-it";
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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import "highlight.js/styles/github-dark.css";
import MarkdownItGitHubAlerts from "markdown-it-github-alerts";
import { toast } from "sonner";
import {
	useDeleteReply,
	useDeleteReview,
	useEditReply,
	useEditReview,
	useFlagComment,
	useReplyToReview,
	useReviews,
	useSubmitReview,
} from "@/hooks/use-reviews";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import {
	Contributor,
	PluginData,
	VOTE_DOWN,
	VOTE_NULL,
	VOTE_UP,
} from "@/types/plugin-detail";

const fetchPlugin = async (pluginId: string): Promise<PluginData> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin/${pluginId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		},
	);
	if (!response.ok) {
		throw new Error("Plugin not found");
	}
	return response.json();
};

const md = new MarkdownIt({
	html: true,
	linkify: true,
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return (
					'<pre><code class="hljs">' +
					hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
					"</code></pre>"
				);
			} catch (e) {
				console.error(e);
			}
		}

		return (
			'<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
		);
	},
}).use(MarkdownItGitHubAlerts);

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

export default function PluginDetail() {
	const { id } = useParams();
	const { data: loggedInUser } = useLoggedInUser();

	// Review form state
	const [reviewComment, setReviewComment] = useState("");
	const [reviewVote, setReviewVote] = useState<string>("");
	const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
	const [showReplyForm, setShowReplyForm] = useState<{
		[key: number]: boolean;
	}>({});
	const [editingReview, setEditingReview] = useState<number | null>(null);
	const [editComment, setEditComment] = useState("");
	const [editVote, setEditVote] = useState<string>("");
	const [editingReply, setEditingReply] = useState<number | null>(null);
	const [editReplyText, setEditReplyText] = useState("");

	const {
		data: plugin,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["plugin", id],
		queryFn: async () => await fetchPlugin(id!),
		enabled: !!id,
	});

	const { data: reviews = [] } = useReviews(id!);
	const submitReviewMutation = useSubmitReview(id!);
	const editReviewMutation = useEditReview(id!);
	const deleteReviewMutation = useDeleteReview(id!);
	const replyMutation = useReplyToReview(id!);
	const editReplyMutation = useEditReply(id!);
	const deleteReplyMutation = useDeleteReply(id!);
	const flagMutation = useFlagComment(id!);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading plugin...</p>
				</div>
			</div>
		);
	}

	if (error || !plugin) {
		return (
			<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Plugin Not Found</h1>
					<p className="text-muted-foreground">
						The plugin you're looking for doesn't exist or has been removed.
					</p>
				</div>
			</div>
		);
	}

	const contributors: Contributor[] = plugin.contributors
		? JSON.parse(plugin.contributors || "[]")
		: [];

	const formatRelativeTime = (dateString: string) => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return "just now";
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 30) {
			return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
		}

		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths < 12) {
			return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
		}

		const diffInYears = Math.floor(diffInMonths / 12);
		return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
	};

	const getVoteIcon = (vote: number) => {
		if (vote === VOTE_UP)
			return <ThumbsUp className="w-4 h-4 text-green-500" />;
		if (vote === VOTE_DOWN)
			return <ThumbsDown className="w-4 h-4 text-red-500" />;
		return null;
	};

	const handleSubmitReview = async () => {
		if (!loggedInUser) {
			toast.error("Please log in to write a review");
			return;
		}

		if (!reviewComment.trim() && !reviewVote) {
			toast.error("Please provide a comment or vote");
			return;
		}

		try {
			await submitReviewMutation.mutateAsync({
				comment: reviewComment.trim(),
				vote: reviewVote ? parseInt(reviewVote) : VOTE_NULL,
			});
			setReviewComment("");
			setReviewVote("");
			toast.success("Review submitted successfully");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to submit review");
			} else {
				toast.error("Failed to submit review");
			}
		}
	};

	const handleReply = async (commentId: number) => {
		const reply = replyText[commentId]?.trim();
		if (!reply) {
			toast.error("Please enter a reply");
			return;
		}

		try {
			await replyMutation.mutateAsync({
				commentId,
				data: { reply },
			});
			setReplyText((prev) => ({ ...prev, [commentId]: "" }));
			setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
			toast.success("Reply sent successfully");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to send reply");
			} else {
				toast.error("Failed to send reply");
			}
		}
	};

	const handleFlag = async (commentId: number) => {
		try {
			const result = await flagMutation.mutateAsync(commentId);
			toast.success(result.flagged ? "Comment flagged" : "Comment unflagged");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to flag comment");
			} else {
				toast.error("Failed to flag comment");
			}
		}
	};

	const handleEditReview = async (reviewId: number) => {
		if (!editComment.trim() && !editVote) {
			toast.error("Please provide a comment or vote");
			return;
		}

		try {
			await editReviewMutation.mutateAsync({
				comment: editComment.trim(),
				vote: editVote ? parseInt(editVote) : VOTE_NULL,
			});
			setEditingReview(null);
			setEditComment("");
			setEditVote("");
			toast.success("Review updated successfully");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to update review");
			} else {
				toast.error("Failed to update review");
			}
		}
	};

	const handleDeleteReview = async (reviewId: number) => {
		try {
			await deleteReviewMutation.mutateAsync(reviewId);
			toast.success("Review deleted successfully");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to delete review");
			} else {
				toast.error("Failed to delete review");
			}
		}
	};

	const startEditReview = (review: {
		id: number;
		comment: string | null;
		vote: number;
	}) => {
		setEditingReview(review.id);
		setEditComment(review.comment || "");
		setEditVote(review.vote.toString());
	};

	const cancelEditReview = () => {
		setEditingReview(null);
		setEditComment("");
		setEditVote("");
	};

	const handleEditReply = async (commentId: number) => {
		if (!editReplyText.trim()) {
			toast.error("Please enter a reply");
			return;
		}

		try {
			await editReplyMutation.mutateAsync({
				commentId,
				data: { reply: editReplyText.trim() },
			});
			setEditingReply(null);
			setEditReplyText("");
			toast.success("Reply updated successfully");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to update reply");
			} else {
				toast.error("Failed to update reply");
			}
		}
	};

	const handleDeleteReply = async (commentId: number) => {
		try {
			await deleteReplyMutation.mutateAsync({
				commentId,
				data: { reply: "" },
			});
			toast.success("Reply deleted successfully");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Failed to delete reply");
			} else {
				toast.error("Failed to delete reply");
			}
		}
	};

	const startEditReply = (commentId: number, currentReply: string) => {
		setEditingReply(commentId);
		setEditReplyText(currentReply);
	};

	const cancelEditReply = () => {
		setEditingReply(null);
		setEditReplyText("");
	};

	const isPluginDeveloper = loggedInUser?.id === plugin?.user_id;
	const userReview = reviews.find(
		(review) => review.user_id === loggedInUser?.id,
	);

	const statusInfo = getStatusBadge(plugin?.status);
	const shouldShowStatus =
		loggedInUser && (loggedInUser.role === "admin" || isPluginDeveloper) && statusInfo;

	const isAndroidDevice = () => {
		return /android/i.test(navigator.userAgent);
	};

	return (
		<div className="min-h-screen bg-gradient-dark">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Plugin Icon */}
						<div className="flex-shrink-0">
							{plugin.icon ? (
								<img
									src={plugin.icon}
									alt={plugin.name}
									className="w-24 h-24 rounded-2xl object-cover shadow-lg"
								/>
							) : (
								<div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
									{plugin.name.charAt(0)}
								</div>
							)}
						</div>

						{/* Plugin Info */}
						<div className="flex-1 space-y-4">
							<div>
								<div className="flex items-center gap-3 mb-2">
									<h1 className="text-4xl font-bold">{plugin.name}</h1>
									<div className="flex flex-wrap gap-2">
										<Badge
											variant="outline"
											className="text-sm px-3 py-1 bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-colors"
										>
											v{plugin.version}
										</Badge>
										<Badge
											variant="outline"
											className={`text-sm px-3 py-1 transition-colors ${
												plugin.price === 0
													? "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/40"
													: "bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/40"
											}`}
										>
											{plugin.price === 0 ? "Free" : `₹${plugin.price}`}
										</Badge>
										<Badge
											variant="outline"
											className="text-sm px-3 py-1 bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-colors"
										>
											{plugin.license}
										</Badge>
										{shouldShowStatus && (
											<Badge
												variant={statusInfo.variant}
												className={`text-sm px-3 py-1 flex items-center gap-1 ${statusInfo.className}`}
											>
												<statusInfo.icon className="w-3 h-3" />
												{statusInfo.label}
											</Badge>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground mb-4">
									<span>by</span>
									<Link
										to={`/developer/${plugin.author_email}`}
										className="text-primary hover:underline font-medium flex items-center gap-1"
									>
										{plugin.author}
										{plugin.author_verified === 1 && (
											<CheckCircle className="w-4 h-4 text-green-500" />
										)}
									</Link>
								</div>

								{/* Keywords */}
								{plugin.keywords && (
									<div className="flex flex-wrap gap-2 mb-4">
										{JSON.parse(plugin.keywords || "[]").map(
											(keyword: string, index: number) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs bg-muted/30 border-muted"
												>
													<Tag className="w-3 h-3 mr-1" />
													{keyword}
												</Badge>
											),
										)}
									</div>
								)}
							</div>

							{/* Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="bg-card/50 rounded-lg p-3 border">
									<div className="flex items-center gap-2">
										<ThumbsUp className="w-4 h-4 text-green-500" />
										<span className="font-bold">{plugin.votes_up}</span>
									</div>
									<div className="text-sm text-muted-foreground">Upvotes</div>
								</div>
								<div className="bg-card/50 rounded-lg p-3 border">
									<div className="flex items-center gap-2">
										<Download className="w-4 h-4 text-blue-500" />
										<span className="font-bold">
											{plugin.downloads.toLocaleString()}
										</span>
									</div>
									<div className="text-sm text-muted-foreground">Downloads</div>
								</div>
								<div className="bg-card/50 rounded-lg p-3 border">
									<div className="flex items-center gap-2">
										<MessageSquare className="w-4 h-4 text-purple-500" />
										<span className="font-bold">{plugin.comment_count}</span>
									</div>
									<div className="text-sm text-muted-foreground">Reviews</div>
								</div>
								<div className="bg-card/50 rounded-lg p-3 border">
									<div className="flex items-center gap-2">
										<ThumbsDown className="w-4 h-4 text-red-500" />
										<span className="font-bold">{plugin.votes_down}</span>
									</div>
									<div className="text-sm text-muted-foreground">Downvotes</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								{isAndroidDevice() && (
									<Button
										size="lg"
										className="bg-gradient-primary hover:shadow-glow-primary"
										asChild
									>
										<a
											href={`acode://plugin/install/${plugin.id}`}
											target="_blank"
										>
											<Download className="w-5 h-5 mr-2" />
											Install Plugin
										</a>
									</Button>
								)}
								{(loggedInUser?.role === "admin" ||
									loggedInUser?.id === plugin.user_id) &&
									plugin.price > 0 && (
										<Button variant="outline" size="lg" asChild>
											<Link to={`/plugin-orders/${plugin.id}`}>
												<BarChart3 className="w-5 h-5 mr-2" />
												View Orders
											</Link>
										</Button>
									)}
								{loggedInUser?.role === "admin" && (
									<Button variant="outline" size="lg" asChild>
										<a
											href={`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin/download/${plugin.id}`}
											download
											target="_blank"
											rel="noopener noreferrer"
										>
											<Download className="w-5 h-5 mr-2" />
											Download ZIP
										</a>
									</Button>
								)}
								{plugin.repository && (
									<Button variant="outline" size="lg" asChild>
										<a
											href={plugin.repository}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Github className="w-5 h-5 mr-2" />
											Source Code
										</a>
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						<Tabs defaultValue="overview" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="reviews">Reviews</TabsTrigger>
								<TabsTrigger value="changelog">Changelog</TabsTrigger>
								<TabsTrigger value="contributors">Contributors</TabsTrigger>
							</TabsList>

							<TabsContent value="overview" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Description</CardTitle>
									</CardHeader>
									<CardContent>
										<div
											className="markdown-content"
											dangerouslySetInnerHTML={{
												__html: md.render(plugin.description),
											}}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="reviews" className="space-y-6">
								{/* Write Review Section */}
								{loggedInUser && !userReview && (
									<Card>
										<CardHeader>
											<CardTitle>Write a Review</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="vote">Your Rating</Label>
												<Select
													value={reviewVote}
													onValueChange={setReviewVote}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select your rating" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value={VOTE_UP.toString()}>
															<div className="flex items-center gap-2">
																<ThumbsUp className="w-4 h-4 text-green-500" />
																Thumbs Up
															</div>
														</SelectItem>
														<SelectItem value={VOTE_DOWN.toString()}>
															<div className="flex items-center gap-2">
																<ThumbsDown className="w-4 h-4 text-red-500" />
																Thumbs Down
															</div>
														</SelectItem>
														<SelectItem value={VOTE_NULL.toString()}>
															<div className="flex items-center gap-2">
																<MessageSquare className="w-4 h-4" />
																Comment Only
															</div>
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="comment">Comment (optional)</Label>
												<Textarea
													id="comment"
													placeholder="Share your thoughts about this plugin..."
													value={reviewComment}
													onChange={(e) => setReviewComment(e.target.value)}
													rows={3}
													maxLength={250}
												/>
												<div className="text-xs text-muted-foreground text-right">
													{reviewComment.length}/250 characters
												</div>
											</div>
											<Button
												onClick={handleSubmitReview}
												disabled={submitReviewMutation.isPending}
												className="w-full"
											>
												<Send className="w-4 h-4 mr-2" />
												{submitReviewMutation.isPending
													? "Submitting..."
													: "Submit Review"}
											</Button>
										</CardContent>
									</Card>
								)}

								{/* Reviews List */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<MessageSquare className="w-5 h-5" />
											Reviews ({reviews.length})
										</CardTitle>
									</CardHeader>
									<CardContent>
										{reviews.length > 0 ? (
											<div className="space-y-4">
												{reviews.map((review) => (
													<div
														key={review.id}
														className="border-b border-border/50 pb-4 last:border-b-0"
													>
														<div className="flex items-start gap-3">
															<Avatar className="w-8 h-8">
																{review.github ? (
																	<AvatarImage
																		src={`https://avatars.githubusercontent.com/${review.github}`}
																		alt={review.name || "User"}
																	/>
																) : null}
																<AvatarFallback className="bg-gradient-primary text-white text-sm">
																	{review.name?.charAt(0) || "U"}
																</AvatarFallback>
															</Avatar>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<div className="flex items-center gap-2">
																		<span className="font-medium">
																			{review.name || "Anonymous"}
																		</span>
																		{review.github && (
																			<Button
																				variant="link"
																				size="sm"
																				className="p-0 h-auto text-xs"
																				asChild
																			>
																				<a
																					href={`https://github.com/${review.github}`}
																					target="_blank"
																					rel="noopener noreferrer"
																				>
																					<Github className="w-3 h-3 mr-1" />@
																					{review.github}
																				</a>
																			</Button>
																		)}
																	</div>
																	{getVoteIcon(review.vote)}
																	<span className="text-sm text-muted-foreground">
																		{formatRelativeTime(review.created_at)}
																	</span>
																	{/* Flag button for plugin developer */}
																	{isPluginDeveloper && (
																		<Button
																			size="sm"
																			variant="ghost"
																			onClick={() => handleFlag(review.id)}
																			disabled={flagMutation.isPending}
																			className={`h-6 w-6 p-0 ${
																				review.flagged_by_author
																					? "text-red-500 hover:text-red-600"
																					: "text-muted-foreground hover:text-foreground"
																			}`}
																		>
																			<Flag className="w-3 h-3" />
																		</Button>
																	)}
																	{/* Edit and Delete buttons for user's own review */}
																	{loggedInUser?.id === review.user_id && (
																		<div className="flex gap-1">
																			<Button
																				size="sm"
																				variant="ghost"
																				onClick={() => startEditReview(review)}
																				className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
																			>
																				<Edit className="w-3 h-3" />
																			</Button>
																			<AlertDialog>
																				<AlertDialogTrigger asChild>
																					<Button
																						size="sm"
																						variant="ghost"
																						disabled={
																							deleteReviewMutation.isPending
																						}
																						className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
																					>
																						<Trash2 className="w-3 h-3" />
																					</Button>
																				</AlertDialogTrigger>
																				<AlertDialogContent>
																					<AlertDialogHeader>
																						<AlertDialogTitle>
																							Delete Review
																						</AlertDialogTitle>
																						<AlertDialogDescription>
																							Are you sure you want to delete
																							this review? This action cannot be
																							undone.
																						</AlertDialogDescription>
																					</AlertDialogHeader>
																					<AlertDialogFooter>
																						<AlertDialogCancel>
																							Cancel
																						</AlertDialogCancel>
																						<AlertDialogAction
																							onClick={() =>
																								handleDeleteReview(review.id)
																							}
																							className="bg-red-600 hover:bg-red-700"
																						>
																							Delete
																						</AlertDialogAction>
																					</AlertDialogFooter>
																				</AlertDialogContent>
																			</AlertDialog>
																		</div>
																	)}
																	{/* Admin delete button for any review */}
																	{loggedInUser?.role === "admin" &&
																		loggedInUser?.id !== review.user_id && (
																			<AlertDialog>
																				<AlertDialogTrigger asChild>
																					<Button
																						size="sm"
																						variant="ghost"
																						disabled={
																							deleteReviewMutation.isPending
																						}
																						className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
																						title="Delete review (Admin)"
																					>
																						<Trash2 className="w-3 h-3" />
																					</Button>
																				</AlertDialogTrigger>
																				<AlertDialogContent>
																					<AlertDialogHeader>
																						<AlertDialogTitle>
																							Delete Review (Admin Action)
																						</AlertDialogTitle>
																						<AlertDialogDescription>
																							As an admin, you are about to
																							delete this user's review. This
																							action cannot be undone and will
																							permanently remove the review from
																							the plugin.
																						</AlertDialogDescription>
																					</AlertDialogHeader>
																					<AlertDialogFooter>
																						<AlertDialogCancel>
																							Cancel
																						</AlertDialogCancel>
																						<AlertDialogAction
																							onClick={() =>
																								handleDeleteReview(review.id)
																							}
																							className="bg-red-600 hover:bg-red-700"
																						>
																							Delete Review
																						</AlertDialogAction>
																					</AlertDialogFooter>
																				</AlertDialogContent>
																			</AlertDialog>
																		)}
																</div>
																{editingReview === review.id ? (
																	<div className="space-y-3 mb-2">
																		<div className="space-y-2">
																			<Label htmlFor="edit-vote">
																				Your Rating
																			</Label>
																			<Select
																				value={editVote}
																				onValueChange={setEditVote}
																			>
																				<SelectTrigger>
																					<SelectValue placeholder="Select your rating" />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectItem
																						value={VOTE_UP.toString()}
																					>
																						<div className="flex items-center gap-2">
																							<ThumbsUp className="w-4 h-4 text-green-500" />
																							Thumbs Up
																						</div>
																					</SelectItem>
																					<SelectItem
																						value={VOTE_DOWN.toString()}
																					>
																						<div className="flex items-center gap-2">
																							<ThumbsDown className="w-4 h-4 text-red-500" />
																							Thumbs Down
																						</div>
																					</SelectItem>
																					<SelectItem
																						value={VOTE_NULL.toString()}
																					>
																						<div className="flex items-center gap-2">
																							<MessageSquare className="w-4 h-4" />
																							Comment Only
																						</div>
																					</SelectItem>
																				</SelectContent>
																			</Select>
																		</div>
																		<div className="space-y-2">
																			<Label htmlFor="edit-comment">
																				Comment (optional)
																			</Label>
																			<Textarea
																				id="edit-comment"
																				placeholder="Share your thoughts about this plugin..."
																				value={editComment}
																				onChange={(e) =>
																					setEditComment(e.target.value)
																				}
																				rows={3}
																				maxLength={250}
																			/>
																			<div className="text-xs text-muted-foreground text-right">
																				{editComment.length}/250 characters
																			</div>
																		</div>
																		<div className="flex gap-2">
																			<Button
																				size="sm"
																				onClick={() =>
																					handleEditReview(review.id)
																				}
																				disabled={editReviewMutation.isPending}
																				className="h-7 px-3 text-xs"
																			>
																				<Send className="w-3 h-3 mr-1" />
																				{editReviewMutation.isPending
																					? "Updating..."
																					: "Update Review"}
																			</Button>
																			<Button
																				size="sm"
																				variant="outline"
																				onClick={cancelEditReview}
																				className="h-7 px-3 text-xs"
																			>
																				Cancel
																			</Button>
																		</div>
																	</div>
																) : (
																	<>
																		{review.comment ? (
																			<p className="text-sm text-muted-foreground mb-2">
																				{review.comment}
																			</p>
																		) : (
																			<p className="text-sm text-muted-foreground/60 italic mb-2">
																				{review.vote === VOTE_UP
																					? "Gave a thumbs up"
																					: "Gave a thumbs down"}
																			</p>
																		)}
																	</>
																)}

																{/* Developer Reply */}
																{review.author_reply && (
																	<div className="mt-2 p-3 bg-muted/50 rounded-lg border">
																		<div className="flex items-center justify-between gap-2 mb-1">
																			<Badge
																				variant="outline"
																				className="text-xs bg-primary/10 text-primary border-primary/20"
																			>
																				<CheckCircle className="w-3 h-3 mr-1" />
																				Developer Reply
																			</Badge>
																			{/* Edit and Delete buttons for developer's own reply */}
																			{isPluginDeveloper && (
																				<div className="flex gap-1">
																					<Button
																						size="sm"
																						variant="ghost"
																						onClick={() =>
																							startEditReply(
																								review.id,
																								review.author_reply,
																							)
																						}
																						className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
																					>
																						<Edit className="w-3 h-3" />
																					</Button>
																					<AlertDialog>
																						<AlertDialogTrigger asChild>
																							<Button
																								size="sm"
																								variant="ghost"
																								disabled={
																									deleteReplyMutation.isPending
																								}
																								className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
																							>
																								<Trash2 className="w-3 h-3" />
																							</Button>
																						</AlertDialogTrigger>
																						<AlertDialogContent>
																							<AlertDialogHeader>
																								<AlertDialogTitle>
																									Delete Reply
																								</AlertDialogTitle>
																								<AlertDialogDescription>
																									Are you sure you want to
																									delete this reply? This action
																									cannot be undone.
																								</AlertDialogDescription>
																							</AlertDialogHeader>
																							<AlertDialogFooter>
																								<AlertDialogCancel>
																									Cancel
																								</AlertDialogCancel>
																								<AlertDialogAction
																									onClick={() =>
																										handleDeleteReply(review.id)
																									}
																									className="bg-red-600 hover:bg-red-700"
																								>
																									Delete
																								</AlertDialogAction>
																							</AlertDialogFooter>
																						</AlertDialogContent>
																					</AlertDialog>
																				</div>
																			)}
																		</div>
																		{editingReply === review.id ? (
																			<div className="space-y-2">
																				<Textarea
																					placeholder="Edit your reply..."
																					value={editReplyText}
																					onChange={(e) =>
																						setEditReplyText(e.target.value)
																					}
																					rows={2}
																					className="text-sm"
																				/>
																				<div className="flex gap-2">
																					<Button
																						size="sm"
																						onClick={() =>
																							handleEditReply(review.id)
																						}
																						disabled={
																							editReplyMutation.isPending
																						}
																						className="h-7 px-3 text-xs"
																					>
																						<Send className="w-3 h-3 mr-1" />
																						{editReplyMutation.isPending
																							? "Updating..."
																							: "Update Reply"}
																					</Button>
																					<Button
																						size="sm"
																						variant="outline"
																						onClick={cancelEditReply}
																						className="h-7 px-3 text-xs"
																					>
																						Cancel
																					</Button>
																				</div>
																			</div>
																		) : (
																			<p className="text-sm">
																				{review.author_reply}
																			</p>
																		)}
																	</div>
																)}

																{/* Reply Form for Plugin Developer */}
																{isPluginDeveloper && !review.author_reply && (
																	<div className="mt-2">
																		{!showReplyForm[review.id] ? (
																			<Button
																				size="sm"
																				variant="outline"
																				onClick={() =>
																					setShowReplyForm((prev) => ({
																						...prev,
																						[review.id]: true,
																					}))
																				}
																				className="h-7 px-3 text-xs"
																			>
																				<Reply className="w-3 h-3 mr-1" />
																				Reply
																			</Button>
																		) : (
																			<div className="space-y-2">
																				<Textarea
																					placeholder="Write your reply..."
																					value={replyText[review.id] || ""}
																					onChange={(e) =>
																						setReplyText((prev) => ({
																							...prev,
																							[review.id]: e.target.value,
																						}))
																					}
																					rows={2}
																					className="text-sm"
																				/>
																				<div className="flex gap-2">
																					<Button
																						size="sm"
																						onClick={() =>
																							handleReply(review.id)
																						}
																						disabled={replyMutation.isPending}
																						className="h-7 px-3 text-xs"
																					>
																						<Send className="w-3 h-3 mr-1" />
																						Send Reply
																					</Button>
																					<Button
																						size="sm"
																						variant="outline"
																						onClick={() => {
																							setShowReplyForm((prev) => ({
																								...prev,
																								[review.id]: false,
																							}));
																							setReplyText((prev) => ({
																								...prev,
																								[review.id]: "",
																							}));
																						}}
																						className="h-7 px-3 text-xs"
																					>
																						Cancel
																					</Button>
																				</div>
																			</div>
																		)}
																	</div>
																)}
															</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="text-center py-8 text-muted-foreground">
												<MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
												<p>
													No reviews yet. Be the first to review this plugin!
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="changelog">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Calendar className="w-5 h-5" />
											Changelog - Version {plugin.version}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div
											className="markdown-content"
											dangerouslySetInnerHTML={{
												__html: md.render(
													plugin.changelogs ||
														"No changelog available for this version.",
												),
											}}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="contributors">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Users className="w-5 h-5" />
											Contributors ({contributors.length + 1})
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{/* Main Author */}
											<div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
												<Avatar className="w-12 h-12">
													{plugin.author_github ? (
														<AvatarImage
															src={`https://avatars.githubusercontent.com/${plugin.author_github}`}
															alt={plugin.author}
														/>
													) : null}
													<AvatarFallback className="bg-gradient-primary text-white font-semibold">
														{plugin.author.charAt(0).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-semibold text-lg">
															{plugin.author}
														</span>
														<Badge className="text-xs bg-primary/20 text-primary border-primary/30">
															Plugin Author
														</Badge>
														{plugin.author_verified === 1 && (
															<CheckCircle className="w-4 h-4 text-green-500" />
														)}
													</div>
													<div className="flex items-center gap-3 text-sm text-muted-foreground">
														{plugin.author_github && (
															<Button
																variant="link"
																size="sm"
																className="p-0 h-auto text-muted-foreground hover:text-primary"
																asChild
															>
																<a
																	href={`https://github.com/${plugin.author_github}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Github className="w-4 h-4 mr-1" />@
																	{plugin.author_github}
																</a>
															</Button>
														)}
													</div>
												</div>
											</div>

											{/* Additional Contributors */}
											{contributors.length > 0 && (
												<div className="space-y-3">
													<Separator />
													<h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
														Additional Contributors
													</h4>
													{contributors.map((contributor, index) => (
														<div
															key={index}
															className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
														>
															<Avatar className="w-10 h-10">
																{contributor.github ? (
																	<AvatarImage
																		src={`https://avatars.githubusercontent.com/${contributor.github}`}
																		alt={contributor.name}
																	/>
																) : null}
																<AvatarFallback className="bg-secondary font-medium">
																	{contributor.name.charAt(0).toUpperCase()}
																</AvatarFallback>
															</Avatar>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<span className="font-medium">
																		{contributor.name}
																	</span>
																	<Badge
																		variant="outline"
																		className="text-xs bg-muted border-muted-foreground/20"
																	>
																		{contributor.role}
																	</Badge>
																</div>
																{contributor.github && (
																	<Button
																		variant="link"
																		size="sm"
																		className="p-0 h-auto text-muted-foreground hover:text-primary"
																		asChild
																	>
																		<a
																			href={`https://github.com/${contributor.github}`}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			<Github className="w-4 h-4 mr-1" />@
																			{contributor.github}
																		</a>
																	</Button>
																)}
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}

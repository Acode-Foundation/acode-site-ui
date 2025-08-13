import hljs from "highlight.js";
import {
	Check,
	CheckCircle2,
	Edit2,
	ExternalLink,
	HelpCircle,
	Link,
	Loader2,
	MessageCircle,
	MoreHorizontal,
	Plus,
	Search,
	Send,
	Shield,
	Trash2,
	X,
} from "lucide-react";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { EXTERNAL_LINKS, openExternalLink } from "@/config/links";
import "highlight.js/styles/github-dark.css";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import type { FAQ } from "@/types";

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
});

export default function FAQ() {
	const [searchQuery, setSearchQuery] = useState("");
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [loading, setLoading] = useState(true);

	// Admin functionality
	const { data: currentUser } = useLoggedInUser();
	const isAdmin = currentUser?.role === "admin";

	// Form state
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
	const [formData, setFormData] = useState({ q: "", a: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);

	// FAQ state
	const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());
	const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);

	const toggleFaq = (faqId: string) => {
		const newExpanded = new Set(expandedFaqs);
		const isExpanding = !newExpanded.has(faqId);

		if (newExpanded.has(faqId)) {
			newExpanded.delete(faqId);
			// Remove hash from URL when closing
			window.history.pushState({}, "", window.location.pathname);
		} else {
			newExpanded.add(faqId);
			// Add hash to URL when opening
			window.history.pushState({}, "", `${window.location.pathname}#${faqId}`);
		}

		setExpandedFaqs(newExpanded);

		// Scroll to FAQ if expanding
		if (isExpanding) {
			setTimeout(() => {
				const element = document.getElementById(faqId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}, 100);
		}
	};

	const fetchFAQs = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/faqs`,
			);
			const data = await response.json();
			if (Array.isArray(data)) {
				setFaqs(data);
			} else {
				setFaqs([
					{
						q: "What is Acode?",
						a: "Acode is a powerful, feature-rich code editor designed specifically for Android devices.",
					},
				]);
			}
		} catch (error) {
			console.error("Failed to fetch FAQs:", error);
			// Fallback data in case API fails
			setFaqs([
				{
					q: "What is Acode?",
					a: "Acode is a powerful, feature-rich code editor designed specifically for Android devices.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFAQs();

		// Handle URL hash navigation
		const hash = window.location.hash.slice(1);
		if (hash && hash.startsWith("faq-")) {
			setExpandedFaqs(new Set([hash]));
			// Scroll to the FAQ after a brief delay
			setTimeout(() => {
				const element = document.getElementById(hash);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}, 100);
		}
	}, []);

	// FAQ functions
	const generateFaqId = (index: number) => `faq-${index}`;

	const copyFaqLink = async (index: number) => {
		const faqId = generateFaqId(index);
		const url = `${window.location.origin}${window.location.pathname}#${faqId}`;

		try {
			await navigator.clipboard.writeText(url);
			setCopiedFaqId(faqId);
			toast.success("FAQ link copied to clipboard!");

			setTimeout(() => {
				setCopiedFaqId(null);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy link:", error);
			toast.error("Failed to copy link");
		}
	};

	// Admin CRUD operations
	const handleAddFaq = async () => {
		if (!formData.q.trim() || !formData.a.trim()) return;

		setIsSubmitting(true);
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/faqs/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(formData),
				},
			);

			if (response.ok) {
				await fetchFAQs();
				setFormData({ q: "", a: "" });
				setIsAddDialogOpen(false);
			}
		} catch (error) {
			console.error("Failed to add FAQ:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditFaq = async () => {
		if (!formData.q.trim() || !formData.a.trim() || !editingFaq) return;

		setIsSubmitting(true);
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/faqs/`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						...formData,
						old_q: editingFaq.q,
					}),
				},
			);

			if (response.ok) {
				await fetchFAQs();
				setFormData({ q: "", a: "" });
				setEditingFaq(null);
				setIsEditDialogOpen(false);
			}
		} catch (error) {
			console.error("Failed to edit FAQ:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteFaq = async (faq: FAQ) => {
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/faqs/${encodeURIComponent(faq.q)}`,
				{
					method: "DELETE",
					credentials: "include",
				},
			);

			if (response.ok) {
				await fetchFAQs();
			}
		} catch (error) {
			console.error("Failed to delete FAQ:", error);
		}
	};

	const openEditDialog = (faq: FAQ) => {
		setEditingFaq(faq);
		setFormData({ q: faq.q, a: faq.a });
		setIsEditDialogOpen(true);
	};

	const resetForm = () => {
		setFormData({ q: "", a: "" });
		setEditingFaq(null);
	};

	const filteredFAQs = faqs?.filter(
		(faq) =>
			faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
						<HelpCircle className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Frequently Asked
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							Questions
						</span>
					</h1>
					<p className="text-xl text-muted-foreground">
						Find answers to common questions about Acode. Can't find what you're
						looking for? Contact our support team.
					</p>
				</div>

				{/* Search */}
				<Card className="bg-gradient-to-r from-background via-background/50 to-background border-border/50 mb-8">
					<CardContent className="p-6">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<Input
								placeholder="Search frequently asked questions..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 pr-4 h-12 text-base bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
						{searchQuery && (
							<div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
								<span>Showing results for:</span>
								<Badge
									variant="secondary"
									className="bg-primary/10 text-primary"
								>
									{searchQuery}
								</Badge>
								<span>({filteredFAQs.length} found)</span>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Admin Panel */}
				{isAdmin && (
					<Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
									<Plus className="w-4 h-4 text-white" />
								</div>
								Admin Panel
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
								<DialogTrigger asChild>
									<Button onClick={resetForm}>
										<Plus className="w-4 h-4 mr-2" />
										Add New FAQ
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[650px] border border-border/50 shadow-xl">
									<DialogHeader className="text-left pb-4">
										<DialogTitle className="flex items-center gap-3 text-xl font-semibold">
											<div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
												<Plus className="w-5 h-5 text-white" />
											</div>
											Add New FAQ
										</DialogTitle>
										<DialogDescription className="text-base text-muted-foreground mt-2">
											Create a new frequently asked question and answer for your
											community.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-6 py-2">
										<div className="space-y-2">
											<Label
												htmlFor="question"
												className="text-sm font-medium flex items-center gap-2"
											>
												Question
												<span className="text-destructive">*</span>
											</Label>
											<Input
												id="question"
												placeholder="What would you like to know about...?"
												value={formData.q}
												onChange={(e) =>
													setFormData({ ...formData, q: e.target.value })
												}
												className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors"
											/>
										</div>
										<div className="space-y-2">
											<Label
												htmlFor="answer"
												className="text-sm font-medium flex items-center gap-2"
											>
												Answer
												<span className="text-destructive">*</span>
												<Badge
													variant="secondary"
													className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
												>
													Markdown supported
												</Badge>
											</Label>
											<Textarea
												id="answer"
												placeholder="Provide a comprehensive answer using Markdown formatting..."
												value={formData.a}
												onChange={(e) =>
													setFormData({ ...formData, a: e.target.value })
												}
												rows={8}
												className="border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors resize-none"
											/>
										</div>
									</div>
									<div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-border/30">
										<Button
											variant="outline"
											onClick={() => {
												setIsAddDialogOpen(false);
												resetForm();
											}}
											className="order-2 sm:order-1 transition-colors"
											disabled={isSubmitting}
										>
											<X className="w-4 h-4 mr-2" />
											Cancel
										</Button>
										<Button
											onClick={handleAddFaq}
											disabled={
												isSubmitting || !formData.q.trim() || !formData.a.trim()
											}
											className="order-1 sm:order-2 bg-gradient-primary hover:opacity-90 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
										>
											{isSubmitting ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Adding FAQ...
												</>
											) : (
												<>
													<Check className="w-4 h-4 mr-2" />
													Add FAQ
												</>
											)}
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				)}

				{/* FAQ Accordion */}
				<Card className="bg-gradient-to-br from-card/50 via-background/30 to-card/80 backdrop-blur-sm border-border/50 mb-8 shadow-lg">
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
									<HelpCircle className="w-5 h-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-xl">
										Frequently Asked Questions
									</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										{filteredFAQs.length} questions available
									</p>
								</div>
							</div>
							{!loading && filteredFAQs.length > 0 && (
								<Badge
									variant="outline"
									className="bg-primary/5 text-primary border-primary/20"
								>
									{filteredFAQs.length} FAQs
								</Badge>
							)}
						</div>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						{loading ? (
							<div className="text-center py-12">
								<div className="flex flex-col items-center space-y-4">
									<div className="relative">
										<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20"></div>
										<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent absolute top-0"></div>
									</div>
									<div className="space-y-2">
										<p className="text-lg font-medium">Loading FAQs...</p>
										<p className="text-sm text-muted-foreground">
											Please wait while we fetch the latest questions and
											answers
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-6">
								{filteredFAQs.map((faq, index) => {
									const faqId = generateFaqId(index);
									const isCopied = copiedFaqId === faqId;
									const isExpanded = expandedFaqs.has(faqId);

									return (
										<Card
											key={index}
											id={faqId}
											className="group bg-gradient-to-br from-card/80 via-background/50 to-card/60 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg scroll-mt-24"
										>
											<Collapsible
												open={isExpanded}
												onOpenChange={() => toggleFaq(faqId)}
											>
												<CollapsibleTrigger asChild>
													<CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors rounded-t-lg">
														<div className="flex flex-col sm:flex-row sm:items-start gap-3">
															<div className="flex-1 text-left">
																<h3 className="text-lg font-semibold leading-relaxed text-foreground group-hover:text-primary transition-colors pr-2">
																	{faq.q}
																</h3>
															</div>
															<div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
																<div
																	className="flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
																	onClick={(e) => e.stopPropagation()}
																>
																	{/* Copy Link Action */}
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={(e) => {
																			e.stopPropagation();
																			copyFaqLink(index);
																		}}
																		className="h-8 w-8 p-0 hover:bg-blue-500/10 transition-all duration-200 rounded-lg"
																		title="Copy FAQ link"
																	>
																		{isCopied ? (
																			<CheckCircle2 className="w-4 h-4 text-green-500" />
																		) : (
																			<Link className="w-4 h-4 text-blue-500" />
																		)}
																	</Button>

																	{/* Admin Actions */}
																	{isAdmin && (
																		<>
																			<Button
																				size="sm"
																				variant="ghost"
																				onClick={(e) => {
																					e.stopPropagation();
																					openEditDialog(faq);
																				}}
																				className="h-8 w-8 p-0 hover:bg-orange-500/10 transition-all duration-200 rounded-lg"
																				title="Edit FAQ"
																			>
																				<Edit2 className="w-4 h-4 text-orange-500" />
																			</Button>
																			<AlertDialog>
																				<AlertDialogTrigger asChild>
																					<Button
																						size="sm"
																						variant="ghost"
																						onClick={(e) => e.stopPropagation()}
																						className="h-8 w-8 p-0 hover:bg-destructive/10 transition-all duration-200 rounded-lg"
																						title="Delete FAQ"
																					>
																						<Trash2 className="w-4 h-4 text-destructive" />
																					</Button>
																				</AlertDialogTrigger>
																				<AlertDialogContent className="sm:max-w-[440px] border border-border/50">
																					<AlertDialogHeader className="text-left">
																						<AlertDialogTitle className="flex items-center gap-2 text-destructive font-semibold">
																							<div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
																								<Trash2 className="w-4 h-4" />
																							</div>
																							Delete FAQ
																						</AlertDialogTitle>
																						<AlertDialogDescription className="text-base leading-relaxed mt-2">
																							Are you sure you want to delete
																							this FAQ? This action cannot be
																							undone.
																							<div className="mt-4 p-4 bg-muted rounded-lg border border-border/30">
																								<p className="font-medium text-sm text-foreground line-clamp-2">
																									{faq.q}
																								</p>
																							</div>
																						</AlertDialogDescription>
																					</AlertDialogHeader>
																					<AlertDialogFooter className="gap-2">
																						<AlertDialogCancel className="transition-colors">
																							Cancel
																						</AlertDialogCancel>
																						<AlertDialogAction
																							onClick={() =>
																								handleDeleteFaq(faq)
																							}
																							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-sm"
																						>
																							<Trash2 className="w-4 h-4 mr-2" />
																							Delete
																						</AlertDialogAction>
																					</AlertDialogFooter>
																				</AlertDialogContent>
																			</AlertDialog>
																		</>
																	)}
																</div>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-200 rounded-lg"
																>
																	{isExpanded ? (
																		<X className="w-4 h-4 text-muted-foreground" />
																	) : (
																		<Plus className="w-4 h-4 text-muted-foreground" />
																	)}
																</Button>
															</div>
														</div>
													</CardHeader>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<CardContent className="pt-0 pb-6">
														<div className="bg-gradient-to-br from-muted/30 to-background rounded-lg p-4 border border-border/30">
															<div
																className="markdown-content text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert"
																dangerouslySetInnerHTML={{
																	__html: md.render(faq.a),
																}}
															/>
														</div>
													</CardContent>
												</CollapsibleContent>
											</Collapsible>
										</Card>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Edit Dialog */}
				<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
					<DialogContent className="sm:max-w-[650px] border border-border/50 shadow-xl">
						<DialogHeader className="text-left pb-4">
							<DialogTitle className="flex items-center gap-3 text-xl font-semibold">
								<div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-lg">
									<Edit2 className="w-5 h-5 text-white" />
								</div>
								Edit FAQ
							</DialogTitle>
							<DialogDescription className="text-base text-muted-foreground mt-2">
								Update the question and answer for this frequently asked
								question.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-6 py-2">
							<div className="space-y-2">
								<Label
									htmlFor="edit-question"
									className="text-sm font-medium flex items-center gap-2"
								>
									Question
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="edit-question"
									placeholder="What would you like to know about...?"
									value={formData.q}
									onChange={(e) =>
										setFormData({ ...formData, q: e.target.value })
									}
									className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="edit-answer"
									className="text-sm font-medium flex items-center gap-2"
								>
									Answer
									<span className="text-destructive">*</span>
									<Badge
										variant="secondary"
										className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
									>
										Markdown supported
									</Badge>
								</Label>
								<Textarea
									id="edit-answer"
									placeholder="Provide a comprehensive answer using Markdown formatting..."
									value={formData.a}
									onChange={(e) =>
										setFormData({ ...formData, a: e.target.value })
									}
									rows={8}
									className="border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors resize-none"
								/>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-border/30">
							<Button
								variant="outline"
								onClick={() => {
									setIsEditDialogOpen(false);
									resetForm();
								}}
								className="order-2 sm:order-1 transition-colors"
								disabled={isSubmitting}
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
							<Button
								onClick={handleEditFaq}
								disabled={
									isSubmitting || !formData.q.trim() || !formData.a.trim()
								}
								className="order-1 sm:order-2 bg-gradient-secondary hover:opacity-90 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Saving Changes...
									</>
								) : (
									<>
										<Check className="w-4 h-4 mr-2" />
										Save Changes
									</>
								)}
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* No Results */}
				{!loading && filteredFAQs.length === 0 && (
					<Card className="bg-gradient-to-br from-muted/20 via-background to-muted/10 border-border/50">
						<CardContent className="py-16 px-6 text-center">
							<div className="flex flex-col items-center space-y-4">
								<div className="w-20 h-20 bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl flex items-center justify-center">
									<Search className="w-10 h-10 text-muted-foreground" />
								</div>
								<div className="space-y-2">
									<h3 className="text-2xl font-semibold">No FAQs found</h3>
									<p className="text-muted-foreground max-w-md mx-auto">
										{searchQuery
											? `No results found for "${searchQuery}". Try adjusting your search terms or browse all questions.`
											: "No FAQs are available at the moment. Check back later or contact support."}
									</p>
								</div>
								{searchQuery && (
									<div className="flex gap-3">
										<Button
											variant="outline"
											onClick={() => setSearchQuery("")}
										>
											<X className="w-4 h-4 mr-2" />
											Clear Search
										</Button>
										<Button variant="default">
											<MessageCircle className="w-4 h-4 mr-2" />
											Contact Support
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Support Section */}
				{filteredFAQs.length > 0 && (
					<div className="mt-16 space-y-8">
						<div className="text-center space-y-3">
							<h2 className="text-3xl font-bold">Still Need Help?</h2>
							<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
								Can't find what you're looking for? Here are more ways to get
								support and connect with our community.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<Card className="bg-gradient-to-br from-purple-500/5 via-background to-purple-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
								<CardContent className="p-6 text-center">
									<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
										<MessageCircle className="w-8 h-8 text-white" />
									</div>
									<h3 className="font-semibold mb-3 text-lg">
										Join Discord Community
									</h3>
									<p className="text-muted-foreground text-sm mb-5 leading-relaxed">
										Connect with other developers, get help, and share your
										projects in our active Discord community.
									</p>
									<Button
										variant="outline"
										className="w-full border-purple-500/30 hover:bg-purple-500/10 transition-colors"
										onClick={() => openExternalLink(EXTERNAL_LINKS.discord)}
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										Join Discord
									</Button>
								</CardContent>
							</Card>

							<Card className="bg-gradient-to-br from-green-500/5 via-background to-green-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
								<CardContent className="p-6 text-center">
									<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
										<ExternalLink className="w-8 h-8 text-white" />
									</div>
									<h3 className="font-semibold mb-3 text-lg">Documentation</h3>
									<p className="text-muted-foreground text-sm mb-5 leading-relaxed">
										Comprehensive guides, tutorials, and API documentation to
										help you master Acode.
									</p>
									<Button
										variant="outline"
										className="w-full border-green-500/30 hover:bg-green-500/10 transition-colors"
										onClick={() => openExternalLink(EXTERNAL_LINKS.docs)}
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										View Docs
									</Button>
								</CardContent>
							</Card>

							<Card className="bg-gradient-to-br from-blue-500/5 via-background to-blue-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105 group md:col-span-2 lg:col-span-1">
								<CardContent className="p-6 text-center">
									<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
										<Send className="w-8 h-8 text-white" />
									</div>
									<h3 className="font-semibold mb-3 text-lg">
										Join Telegram Group
									</h3>
									<p className="text-muted-foreground text-sm mb-5 leading-relaxed">
										Stay updated with announcements, updates, and connect with
										the Acode community on Telegram.
									</p>
									<Button
										variant="outline"
										className="w-full border-blue-500/30 hover:bg-blue-500/10 transition-colors"
										onClick={() => openExternalLink(EXTERNAL_LINKS.telegram)}
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										Join Telegram
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

import { Upload, FileArchive, AlertCircle, CheckCircle, Loader2, Package, User, Tag, Shield, Hash, DollarSign, Github, UserCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { PluginMetadata } from "@/types/submit-plugin";

export default function SubmitPlugin() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { data: user, isLoading: userLoading } = useLoggedInUser();
	const [file, setFile] = useState<File | null>(null);
	const [pluginMetadata, setPluginMetadata] = useState<PluginMetadata | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const analyzePluginZip = async (zipFile: File) => {
		setIsAnalyzing(true);
		try {
			const zip = new JSZip();
			const zipContent = await zip.loadAsync(zipFile);
			
			// Look for plugin.json
			const pluginJsonFile = zipContent.file("plugin.json");
			if (!pluginJsonFile) {
				throw new Error("plugin.json not found in ZIP file");
			}

			const pluginJsonContent = await pluginJsonFile.async("string");
			const pluginData = JSON.parse(pluginJsonContent);

			// Look for icon
			let iconDataUrl: string | undefined;
			const iconFile = zipContent.file("icon.png") || zipContent.file("icon.jpg") || zipContent.file("icon.jpeg");
			if (iconFile) {
				const iconBlob = await iconFile.async("blob");
				iconDataUrl = URL.createObjectURL(iconBlob);
			}

			const metadata: PluginMetadata = {
				id: pluginData.id || "",
				name: pluginData.name || "",
				version: pluginData.version || "",
				author: pluginData.author,
				license: pluginData.license,
				keywords: Array.isArray(pluginData.keywords) ? pluginData.keywords : [],
				contributors: Array.isArray(pluginData.contributors) ? pluginData.contributors : [],
				minVersionCode: pluginData.minVersionCode,
				price: pluginData.price,
				icon: iconDataUrl,
			};

			setPluginMetadata(metadata);
		} catch (error) {
			console.error("Error analyzing ZIP:", error);
			toast({
				title: "Invalid plugin ZIP",
				description: error instanceof Error ? error.message : "Could not read plugin metadata from ZIP file.",
				variant: "destructive",
			});
			setPluginMetadata(null);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleFileSelect = async (selectedFile: File) => {
		if (selectedFile.type !== "application/zip" && !selectedFile.name.endsWith(".zip")) {
			toast({
				title: "Invalid file type",
				description: "Please upload a ZIP file containing your plugin.",
				variant: "destructive",
			});
			return;
		}
		setFile(selectedFile);
		await analyzePluginZip(selectedFile);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) {
			handleFileSelect(droppedFile);
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			handleFileSelect(selectedFile);
		}
	};

	const handleSubmit = async () => {
		if (!file) {
			toast({
				title: "No file selected",
				description: "Please select a plugin ZIP file to upload.",
				variant: "destructive",
			});
			return;
		}

		if (!user) {
			toast({
				title: "Authentication required",
				description: "Please log in to submit a plugin.",
				variant: "destructive",
			});
			navigate("/login");
			return;
		}

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("plugin", file);

			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin`,
				{
					method: "POST",
					body: formData,
					credentials: "include",
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to upload plugin");
			}

			const result = await response.json();
			
			toast({
				title: "Plugin submitted successfully!",
				description: "Your plugin has been submitted and is awaiting approval.",
			});

			// Reset form
			setFile(null);
			setPluginMetadata(null);
			
			// Navigate to plugins page or dashboard
			navigate("/plugins");
		} catch (error) {
			console.error("Upload error:", error);
			toast({
				title: "Upload failed",
				description: error instanceof Error ? error.message : "An error occurred while uploading your plugin.",
				variant: "destructive",
			});
		} finally {
			setIsUploading(false);
		}
	};

	if (userLoading) {
		return (
			<div className="min-h-screen py-8">
				<div className="container mx-auto px-4">
					<div className="flex justify-center items-center py-32">
						<Loader2 className="w-8 h-8 animate-spin" />
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen py-8">
				<div className="container mx-auto px-4 max-w-2xl">
					<Card className="border-border/50">
						<CardHeader className="text-center">
							<AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
							<CardTitle>Authentication Required</CardTitle>
							<CardDescription>
								You need to be logged in to submit a plugin to the marketplace.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<div className="space-y-4">
								<Button onClick={() => navigate("/login")} className="w-full">
									Log In
								</Button>
								<Button 
									variant="outline" 
									onClick={() => navigate("/signup")} 
									className="w-full"
								>
									Create Account
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Submit Your
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							Plugin
						</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Share your plugin with the Acode community. Upload your ZIP file and help extend Acode's functionality.
					</p>
				</div>

				{/* Upload Card */}
				<Card className="border-border/50 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileArchive className="w-5 h-5" />
							Upload Plugin
						</CardTitle>
						<CardDescription>
							Upload your plugin ZIP file. Make sure it includes plugin.json, icon, and other required files.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* File Upload Area */}
						<div
							className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
								isDragOver
									? "border-primary bg-primary/5"
									: file
									? "border-green-500 bg-green-500/5"
									: "border-border hover:border-primary/50"
							}`}
							onDrop={handleDrop}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragOver(true);
							}}
							onDragLeave={() => setIsDragOver(false)}
						>
							{isAnalyzing ? (
								<div className="space-y-4">
									<Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
									<div>
										<p className="font-medium text-primary">
											Analyzing Plugin...
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											Reading plugin metadata from ZIP file
										</p>
									</div>
								</div>
							) : file ? (
								<div className="space-y-4">
									<CheckCircle className="w-12 h-12 mx-auto text-green-500" />
									<div>
										<p className="font-medium text-green-600 dark:text-green-400">
											File Selected
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setFile(null);
											setPluginMetadata(null);
										}}
									>
										Remove File
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									<Upload className="w-12 h-12 mx-auto text-muted-foreground" />
									<div>
										<p className="font-medium">
											Drop your plugin ZIP file here, or{" "}
											<label className="text-primary cursor-pointer hover:underline">
												browse
												<input
													type="file"
													accept=".zip"
													onChange={handleFileInputChange}
													className="sr-only"
												/>
											</label>
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											ZIP files only, max 10MB
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Plugin Metadata Display */}
						{pluginMetadata && (
							<Card className="border-border/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Package className="w-5 h-5" />
										Plugin Information
									</CardTitle>
									<CardDescription>
										Metadata extracted from your plugin.json file
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Icon and Basic Info */}
										<div className="space-y-4">
											{pluginMetadata.icon && (
												<div className="flex justify-center">
													<img 
														src={pluginMetadata.icon} 
														alt="Plugin Icon" 
														className="w-16 h-16 rounded-lg border border-border"
													/>
												</div>
											)}
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<Hash className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm font-medium">ID:</span>
													<code className="text-sm bg-muted px-2 py-1 rounded">{pluginMetadata.id}</code>
												</div>
												<div className="flex items-center gap-2">
													<Package className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm font-medium">Name:</span>
													<span className="text-sm">{pluginMetadata.name}</span>
												</div>
												<div className="flex items-center gap-2">
													<Tag className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm font-medium">Version:</span>
													<Badge variant="secondary">{pluginMetadata.version}</Badge>
												</div>
												{pluginMetadata.author && (
													<div className="flex items-center gap-2">
														<User className="w-4 h-4 text-muted-foreground" />
														<span className="text-sm font-medium">Author:</span>
														<span className="text-sm">{pluginMetadata.author}</span>
													</div>
												)}
											</div>
										</div>

										{/* Additional Info */}
										<div className="space-y-4">
											{pluginMetadata.license && (
												<div className="flex items-center gap-2">
													<Shield className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm font-medium">License:</span>
													<Badge variant="outline">{pluginMetadata.license}</Badge>
												</div>
											)}
											{pluginMetadata.price !== undefined && (
												<div className="flex items-center gap-2">
													<DollarSign className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm font-medium">Price:</span>
													<Badge variant={pluginMetadata.price === 0 ? "secondary" : "default"}>
														{pluginMetadata.price === 0 ? "Free" : `₹${pluginMetadata.price}`}
													</Badge>
												</div>
											)}
											{pluginMetadata.minVersionCode !== undefined && (
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium">Min Version Code:</span>
													<span className="text-sm">{pluginMetadata.minVersionCode}</span>
												</div>
											)}
											{pluginMetadata.keywords && pluginMetadata.keywords.length > 0 && (
												<div>
													<span className="text-sm font-medium mb-2 block">Keywords:</span>
													<div className="flex flex-wrap gap-1">
														{pluginMetadata.keywords.map((keyword, index) => (
															<Badge key={index} variant="outline" className="text-xs">
																{keyword}
															</Badge>
														))}
													</div>
												</div>
											)}
											{pluginMetadata.contributors && pluginMetadata.contributors.length > 0 && (
												<div>
													<span className="text-sm font-medium mb-2 block">Contributors:</span>
													<div className="space-y-2">
														{pluginMetadata.contributors.map((contributor, index) => (
															<div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
																<UserCheck className="w-4 h-4 text-muted-foreground" />
																<div className="flex-1">
																	<div className="text-sm font-medium">
																		{typeof contributor === 'string' ? contributor : contributor.name}
																	</div>
																	{typeof contributor === 'object' && contributor.role && (
																		<div className="text-xs text-muted-foreground">
																			{contributor.role}
																		</div>
																	)}
																</div>
																{typeof contributor === 'object' && contributor.github && (
																	<div className="flex items-center gap-1 text-xs text-muted-foreground">
																		<Github className="w-3 h-3" />
																		<span>@{contributor.github}</span>
																	</div>
																)}
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Requirements */}
						<div className="bg-muted/30 rounded-lg p-6">
							<h3 className="font-semibold mb-3">Plugin Requirements:</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									<span>Include a valid <code className="bg-muted px-1 rounded">plugin.json</code> file with plugin metadata</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									<span>Provide an icon file (recommended: 128x128px PNG)</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									<span>Include a README file with plugin description and usage instructions</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									<span>Use semantic versioning (e.g., 1.0.0)</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									<span>File size should not exceed 10MB</span>
								</li>
							</ul>
						</div>

						{/* Submit Button */}
						<div className="flex gap-4">
							<Button
								onClick={handleSubmit}
								disabled={!file || isUploading}
								className="flex-1"
							>
								{isUploading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Uploading...
									</>
								) : (
									<>
										<Upload className="w-4 h-4 mr-2" />
										Submit Plugin
									</>
								)}
							</Button>
							<Button
								variant="outline"
								onClick={() => navigate("/plugins")}
							>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
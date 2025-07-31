import {
	type QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	BarChart3,
	Building2,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	Edit,
	Eye,
	LogOut,
	Package,
	Plus,
	Settings,
	Shield,
	Star,
	Trash2,
	Upload,
	Users,
	Wallet,
	X,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EarningsOverview } from "@/components/dashboard/earnings-overview";
import { PaymentMethods } from "@/components/dashboard/payment-methods";
import { UserPluginsOverview } from "@/components/dashboard/user-plugins-overview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletePluginDialog } from "@/components/ui/delete-plugin-dialog";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast.ts";
import { useDeletePlugin } from "@/hooks/use-user-plugins";
import { useLoggedInUser } from "@/hooks/useLoggedInUser.ts";
import { User } from "@/types";

// Mock user data
const currentMockUser = {
	name: "John Doe",
	email: "john@example.com",
	role: "user", // "user" or "admin"
	avatar: "JD",
	joinDate: "2024-01-15",
	bio: "Full-stack developer passionate about mobile development and creating tools that enhance productivity.",
	website: "https://johndoe.dev",
	github: "johndoe",
	location: "San Francisco, CA",
	totalEarnings: 245.67,
	bankAccount: {
		accountHolder: "John Doe",
		bankName: "Chase Bank",
		accountNumber: "****1234",
		routingNumber: "****567",
	},
};

// Mock plugin data
const userPlugins = [
	{
		id: "1",
		name: "My Theme Studio",
		status: "approved",
		downloads: 1234,
		rating: 4.5,
		revenue: 89.99,
	},
	{
		id: "2",
		name: "Code Formatter Pro",
		status: "pending",
		downloads: 0,
		rating: 0,
		revenue: 0,
	},
];

const allPlugins = [
	...userPlugins,
	{
		id: "3",
		name: "Git Manager",
		author: "deadlyjack",
		status: "approved",
		downloads: 50234,
		rating: 4.8,
	},
	{
		id: "4",
		name: "AI Assistant",
		author: "acode-dev",
		status: "pending",
		downloads: 0,
		rating: 0,
	},
];

const allUsers = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		role: "user",
		plugins: 2,
		joinDate: "2024-01-15",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		role: "developer",
		plugins: 5,
		joinDate: "2023-12-01",
	},
];

const LoadingDashboard = () => {
	return (
		<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
			<div className="text-center">
				<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-muted-foreground">Loading dashboard...</p>
			</div>
		</div>
	);
};

const handleLogOut = async (
	queryClient: QueryClient,
	e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => {
	// invalidate the Access Token received while Login.
	try {
		const response = await fetch(
			`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
			{
				method: "DELETE",
				credentials: "include",
			},
		);

		const responseData =
			response.headers.get("content-type") === "application/json"
				? await response.json()
				: null;
		if (responseData?.error || !response.ok) {
			toast({
				title: "Unable to Log Out!",
				description:
					responseData.error ||
					`Something went wrong, server responded empty (request status code: ${response.status}). Please try again.`,
			});
			// Bad Request, in this case means: response as {error: 'Not Logged in'}
			if (response.status === 400) {
				setTimeout(() => {
					window.location.href = "/login";
				}, 1000);
			}
		} else if (response.ok) {
			toast({
				title: "Logged Out!",
				description:
					responseData.message || "Logged Out Successfully, redirecting....",
			});
		}

		await queryClient.invalidateQueries({
			queryKey: ["loggedInUser"],
		});

		setTimeout(() => {
			window.location.href = "/login";
		}, 1000);
	} catch (error) {
		toast({
			title: "Unable to Log Out!",
			description: `Something went wrong, server responded empty (error: ${error.message}). Please try again.`,
		});
	}
};

const handleUpdateProfile = async (
	formData: FormData,
	currentUser: User,
	emailOtp?: number,
) => {
	if (emailOtp) formData.append("otp", emailOtp.toString());

	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}api/user`,
		{
			method: "PUT",
			body: formData,
			credentials: "include",
		},
	);

	const responseData = response.headers
		.get("content-type")
		.includes("application/json")
		? await response.json()
		: null;

	if (responseData?.error || !response.ok) {
		// Not Logged-In/Authorized
		if (response.status === 401) {
			toast({
				title: "Failed to Update Profile",
				description: `${responseData?.error} | redirecting....`,
				variant: "destructive",
			});
			setTimeout(() => {
				window.location.href = "/login";
			}, 1000);
			return { statusCode: response.status };
		}

		const error = new Error(
			`${responseData?.error}` ||
				`Failed to Update Profile (request status code: ${response.status}). Please try again.)`,
		);
		error["code"] = response.status;

		throw error;
	}

	return {
		statusCode: response.status,
		body: responseData as { message: string },
	};
};

export default function Dashboard() {
	// states
	const [activeTab, setActiveTab] = useState("overview");
	const [formData, setFormData] = useState(new FormData());
	const [originalEmail, setOriginalEmail] = useState<string>();
	const [currentEmail, setCurrentEmail] = useState<string>("");

	// State to control when the OTP dialog should be open
	const [showOTPDialog, setShowOTPDialog] = useState(false);

	// State to track the OTP input value
	const [otpValue, setOtpValue] = useState("");

	// State to track loading states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSendingOTP, setIsSendingOTP] = useState(false);
	const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

	// State for Error Msgs.
	const [otpError, setOtpError] = useState("");

	const userMutation = useMutation({
		mutationFn: async (body: {
			formData: FormData;
			currentUser: User;
			emailOtp?: number;
		}) =>
			await handleUpdateProfile(body.formData, body.currentUser, body.emailOtp),
		onSuccess: async (data) => {
			const { statusCode, body } = data;

			// handleUpdateProfile, handles 401. & redirects the User.
			if (statusCode !== 401 && body.message) {
				toast({
					title: "Successfully Updated - User Profile",
					description: `${body.message}` || "User Updated",
				});
				await queryClient.invalidateQueries({ queryKey: ["LoggedInUser"] });

				setIsSubmitting(false);
				setIsVerifyingOTP(false);
				setOriginalEmail(currentEmail);
				return;
			}

			return;
		},
		onError: (error) => {
			toast({
				title: "Failed to Update Profile",
				description: `${error.message}`,
				variant: "destructive",
			});

			setOtpError(`${error.message}`);
			return;
		},
	});

	const queryClient = useQueryClient();
	const deletePluginMutation = useDeletePlugin();
	const {
		data: currentLoggedUser,
		isError,
		isLoading,
		...args
	} = useLoggedInUser();
	const {
		data: userPlugins,
		isLoading: isPluginsLoading,
		error: pluginsError,
		...pluginArgs
	} = useQuery({
		queryKey: ["loggedInUser", "plugins"],
		staleTime: 2 * 60 * 1000, // 2 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false,
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin?user=${currentLoggedUser.id}`,
			);
			const data = response.headers
				.get("content-type")
				.includes("application/json")
				? await response.json()
				: null;

			if (!response.ok) {
				throw new Error(
					`Could not get Your Plugins (request status code: ${response.status})`,
				);
			}

			return data;
		},
		enabled: !!currentLoggedUser?.id,
	});

	console.log(
		"Logged In User: ",
		currentLoggedUser,
		"IsError: ",
		isError,
		"isLoading: ",
		isLoading,
		"Args: ",
		args,
	);
	console.log(userPlugins, isPluginsLoading, pluginsError, pluginArgs);
	if (isError) {
		toast({
			title: "User Not Logged in. redirecting...",
		});
		//
		// setTimeout(() => {
		//   window.location.href = "/login"
		// }, 1000)
		return;
	}

	if (isLoading) {
		return <LoadingDashboard />;
	}

	// also using mocked data for now.
	const currentUser = {
		...currentMockUser,
		...currentLoggedUser,
	};

	const isAdmin = currentUser.role === "admin";
	// useEffect(() => setCurrentEmail(currentUser.email), [currentLoggedUser.email]);

	const handleDeletePlugin = async (
		pluginId: string,
		mode: "soft" | "hard",
	) => {
		try {
			await deletePluginMutation.mutateAsync({ pluginId, mode });
			toast({
				title: "Plugin Deleted",
				description: `Plugin ${mode === "hard" ? "permanently deleted" : "deleted"} successfully`,
			});
		} catch (error) {
			toast({
				title: "Delete Failed",
				description: "Failed to delete plugin. Please try again.",
				variant: "destructive",
			});
		}
	};

	const UserDashboard = () => (
		<div className="space-y-6">
			{/* Overview Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<UserPluginsOverview />
				</div>
				<div className="space-y-6">
					<EarningsOverview />

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<Link to="/submit-plugin" className="block">
									<Button className="w-full bg-gradient-primary hover:shadow-glow-primary">
										<Plus className="w-4 h-4 mr-2" />
										Submit New Plugin
									</Button>
								</Link>
								<Link to="/earnings" className="block">
									<Button variant="outline" className="w-full">
										<BarChart3 className="w-4 h-4 mr-2" />
										View Earnings
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);

	const AdminDashboard = () => (
		<div className="space-y-6">
			{/* Admin Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Plugins</CardTitle>
						<Upload className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allPlugins.length}</div>
						<p className="text-xs text-muted-foreground">
							{allPlugins.filter((p) => p.status === "approved").length}{" "}
							approved
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allUsers.length}</div>
						<p className="text-xs text-muted-foreground">Active developers</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Reviews
						</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{allPlugins.filter((p) => p.status === "pending").length}
						</div>
						<p className="text-xs text-muted-foreground">Need approval</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Platform Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$2,450</div>
						<p className="text-xs text-muted-foreground">This month</p>
					</CardContent>
				</Card>
			</div>

			{/* Management Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Plugin Management */}
				<Card>
					<CardHeader>
						<CardTitle>Plugin Management</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{allPlugins.map((plugin) => (
								<div
									key={plugin.id}
									className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
								>
									<div>
										<h4 className="font-medium">{plugin.name}</h4>
										<div className="flex items-center space-x-2">
											<Badge
												variant={
													plugin.status === "approved" ? "default" : "secondary"
												}
											>
												{plugin.status}
											</Badge>
											{"author" in plugin && (
												<span className="text-sm text-muted-foreground">
													by {plugin.author}
												</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-1">
										<Link to={`/plugins/${plugin.id}`}>
											<Button variant="outline" size="sm">
												<Eye className="w-3 h-3" />
											</Button>
										</Link>
										<div className="flex w-8 justify-center">
											{"revenue" in plugin && plugin.revenue > 0 ? (
												<Link to={`/plugin-orders/${plugin.id}`}>
													<Button variant="outline" size="sm">
														<BarChart3 className="w-3 h-3" />
													</Button>
												</Link>
											) : null}
										</div>
										<Button variant="outline" size="sm">
											<Edit className="w-3 h-3" />
										</Button>
										<Button variant="outline" size="sm">
											<Trash2 className="w-3 h-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* User Management */}
				<Card>
					<CardHeader>
						<CardTitle>User Management</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{allUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
								>
									<div className="flex items-center space-x-3">
										<Avatar>
											{currentUser.github ? (
												<AvatarImage
													src={`https://avatars.githubusercontent.com/${currentUser.github}`}
													alt={currentUser.name}
												/>
											) : null}
											<AvatarFallback className="text-2xl">
												{currentUser.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<h4 className="font-medium">{user.name}</h4>
											<p className="text-sm text-muted-foreground">
												{user.email}
											</p>
											<Badge variant="outline">{user.role}</Badge>
										</div>
									</div>
									<div className="flex items-center space-x-1">
										<Button variant="outline" size="sm">
											<Eye className="w-3 h-3" />
										</Button>
										<Button variant="outline" size="sm">
											<Settings className="w-3 h-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);

	// Profile Management Utils
	const hasEmailChanged = () => {
		return originalEmail !== currentEmail;
	};

	const sendOTPToNewEmail = async (
		email: string,
		type: "reset" | (string & {}) = "signup",
	) => {
		setIsSendingOTP(true);
		const formData = new FormData();
		formData.append("email", email);

		try {
			const res = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/otp?type=${type}`,
			);
			const responseData = res.headers
				.get("content-type")
				.includes("application/json")
				? await res.json()
				: null;

			if (!res.ok) {
				throw new Error(
					`Email OTP Sending Failed (request status: ${res.status}). As server responded: ${responseData?.error || "empty, Please Try again."}`,
				);
			}

			return responseData as { message: string };
		} catch (error) {
			setOtpError(
				`Failed to send OTP(Please Try Again). Error: ${error.message}`,
			);
		} finally {
			setIsSendingOTP(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setFormData(new FormData(e.target as HTMLFormElement));

		if (hasEmailChanged()) {
			// Email has changed, show OTP dialog and send OTP
			setShowOTPDialog(true);

			// send email OTP
			await sendOTPToNewEmail(currentEmail).catch((e) => {
				toast({
					title: `Email OTP Sending Failed to ${currentEmail} | Try again, by clicking Submit button.`,
					description: e.message,
					variant: "destructive",
				});
				// not closing the OTP Dialog as User could, click to resend button.
				return null;
			});

			return;
		} else {
			await handleActualSubmit();
		}
	};

	const handleActualSubmit = async (emailOtp?: number) => {
		setIsSubmitting(true);

		userMutation.mutate({
			formData,
			currentUser,
			emailOtp,
		});

		// not resetting the states here,
		// as we don't know if it success or failed. We clear/set updated states in mutation itself.
	};

	// Handle OTP verification

	const handleOTPVerification = async () => {
		if (!otpValue.trim()) {
			setOtpError("Please enter the OTP");
			return;
		}

		setIsVerifyingOTP(true);
		setOtpError("");

		if (otpValue.length === 6 && /^\d+$/.test(otpValue)) {
			// OTP is valid, proceed with form submission
			await handleActualSubmit(Number(otpValue));
		} else {
			setOtpError("Invalid OTP. Please check and try again.");
		}
	};

	// Handle when user cancels the OTP dialog
	const handleCancel = () => {
		setShowOTPDialog(false);
		setOtpValue("");
		setOtpError("");
		// Optionally reset the email to original value
		setCurrentEmail(originalEmail);
	};

	// Handle resending OTP
	const handleResendOTP = async () => {
		setOtpValue(""); // Clear current OTP input
		await sendOTPToNewEmail(currentEmail);
	};

	const ProfileManagement = () => (
		<div className="space-y-6">
			{/* Profile Information */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Settings className="w-5 h-5" />
							Profile Information
						</CardTitle>
						<Button
							variant="destructive"
							size="sm"
							onClick={(e) => handleLogOut(queryClient, e)}
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-subtle rounded-lg border border-border/50">
						<Avatar className="w-24 h-24 ring-2 ring-primary/20">
							{currentUser.github ? (
								<AvatarImage
									src={`https://avatars.githubusercontent.com/${currentUser.github}`}
									alt={currentUser.name}
								/>
							) : null}
							<AvatarFallback className="text-2xl bg-gradient-primary text-white">
								{currentUser.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 text-center sm:text-left">
							<h3 className="text-xl font-semibold">{currentUser.name}</h3>
							<p className="text-muted-foreground">{currentUser.email}</p>
							<div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
								<Badge variant="outline">{currentUser.role}</Badge>
								{currentUser.verified && (
									<Badge variant="default" className="bg-green-500">
										Verified
									</Badge>
								)}
							</div>
						</div>
						<Button variant="outline" size="sm">
							Change Avatar
						</Button>
					</div>
					<form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input id="name" defaultValue={currentUser.name} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									defaultValue={currentUser.email}
									onChange={(e) => setCurrentEmail(e.target.value)}
								/>
								{/* Visual indicator when email has changed */}
								{hasEmailChanged() && (
									<p className="text-sm text-orange-600 mt-1">
										Email will be changed from: {originalEmail}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input id="website" defaultValue={currentUser.website} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="github">GitHub</Label>
								<Input id="github" defaultValue={currentUser.github} />
							</div>
						</div>

						<Button
							className="bg-gradient-primary transition-colors disabled:bg-gradient-dark"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Updating..." : "Update Profile"}
						</Button>
					</form>

					{/* Radix-UI Dialog for OTP Verification */}

					<Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
						<DialogContent className="sm:max-w-md">
							<DialogTitle>Verify Your New Email</DialogTitle>
							<DialogDescription>
								We've sent a 6-digit verification code to{" "}
								<strong>{currentEmail}</strong>. Please enter the code below to
								confirm your email change.
							</DialogDescription>

							<div className="space-y-4">
								<div>
									<Label htmlFor="otp">Verification Code</Label>
									<Input
										id="otp"
										type="text"
										value={otpValue}
										onChange={(e) => {
											const value = e.target.value
												.replace(/\D/g, "")
												.slice(0, 6);
											setOtpValue(value);
											setOtpError("");
										}}
										placeholder="Enter 6-digit code"
										maxLength={6}
										className="text-center text-lg tracking-widest"
									/>
									{otpError && (
										<p className="text-sm text-destructive mt-1">{otpError}</p>
									)}
								</div>

								<div className="text-center">
									<Button
										variant="link"
										onClick={handleResendOTP}
										disabled={isSendingOTP}
									>
										{isSendingOTP ? "Sending..." : "Resend Code"}
									</Button>
								</div>

								<div className="flex gap-2 pt-4">
									<Button
										onClick={handleOTPVerification}
										disabled={isVerifyingOTP || !otpValue.trim()}
										className="flex-1"
									>
										{isVerifyingOTP ? "Verifying..." : "Verify & Update"}
									</Button>
									<Button
										variant="outline"
										onClick={handleCancel}
										className="flex-1"
									>
										Cancel
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</CardContent>
			</Card>

			{/* Payment Methods */}
			<PaymentMethods />
		</div>
	);

	const DetailedEarningsOverview = () => (
		<div className="space-y-6">
			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Earnings
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{/*<div className="text-2xl font-bold">${currentUser.totalEarnings.toFixed(2)}</div>*/}
						<div className="text-2xl font-bold">0</div>
						<p className="text-xs text-muted-foreground">
							Available for withdrawal
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">This Month</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$89.99</div>
						<p className="text-xs text-muted-foreground">
							+12% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Payment
						</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$156.78</div>
						<p className="text-xs text-muted-foreground">
							Next payment: Feb 15
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Link to="/earnings">
							<Button className="bg-gradient-primary">
								<BarChart3 className="w-4 h-4 mr-2" />
								View Detailed Earnings
							</Button>
						</Link>
						<Button variant="outline">
							<CreditCard className="w-4 h-4 mr-2" />
							Request Payout
						</Button>
						<Button variant="outline">
							<Building2 className="w-4 h-4 mr-2" />
							Update Bank Details
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Recent Transactions */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[
							{
								date: "2024-01-28",
								amount: 2.99,
								plugin: "Git Manager",
								type: "Sale",
							},
							{
								date: "2024-01-27",
								amount: 1.99,
								plugin: "Code Formatter Pro",
								type: "Sale",
							},
							{
								date: "2024-01-26",
								amount: 4.99,
								plugin: "My Theme Studio",
								type: "Sale",
							},
						].map((transaction, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
							>
								<div>
									<h4 className="font-medium">{transaction.plugin}</h4>
									<p className="text-sm text-muted-foreground">
										{transaction.type} • {transaction.date}
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium text-primary">
										+${transaction.amount.toFixed(2)}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);

	return isLoading ? (
		<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
			<div className="text-center">
				<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-muted-foreground">Loading dashboard...</p>
			</div>
		</div>
	) : (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="text-muted-foreground">
							Welcome back, {currentUser.name}
						</p>
					</div>
					<div className="flex items-center space-x-3">
						<Avatar>
							{currentUser.github ? (
								<AvatarImage
									src={`https://avatars.githubusercontent.com/${currentUser.github}`}
									alt={currentUser.name}
								/>
							) : null}
							<AvatarFallback className="text-2xl">
								{currentUser.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium">{currentUser.name}</p>
							<Badge variant="outline">{currentUser.role}</Badge>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					{isAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
				</TabsList>

				<TabsContent value="overview" className="space-y-6 mt-6">
					<UserDashboard />
				</TabsContent>

				{isAdmin && (
					<TabsContent value="admin" className="space-y-6 mt-6">
						<AdminDashboard />
					</TabsContent>
				)}

				<TabsContent value="profile" className="space-y-6 mt-6">
					<ProfileManagement />
				</TabsContent>
			</Tabs>
		</div>
	);
}

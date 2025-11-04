import {
	BarChart3,
	Plus,
	XCircle,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { EarningsOverview } from "@/components/dashboard/earnings-overview";
import { UserPluginsOverview } from "@/components/dashboard/user-plugins-overview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoggedInUser } from "@/hooks/useLoggedInUser.ts";
import ProfileManagement from "@/components/dashboard/profile-management";
import { useAuth } from "@/context/AuthContext";

// Note: Mock data removed - using real API data

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

// Kept for Reference. 
// biome-ignore lint: Kept for Reference Only Should be Removed in PROD.
// const handleLogOut = async (
// 	queryClient: QueryClient,
// 	e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
// ) => {
// 	// invalidate the Access Token received while Login.
// 	try {
// 		const response = await fetch(
// 			`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
// 			{
// 				method: "DELETE",
// 				credentials: "include",
// 			},
// 		);

// 		const responseData =
// 			response.headers.get("content-type") === "application/json"
// 				? await response.json()
// 				: null;
// 		if (responseData?.error || !response.ok) {
// 			toast({
// 				title: "Unable to Log Out!",
// 				description:
// 					responseData.error ||
// 					`Something went wrong, server responded empty (request status code: ${response.status}). Please try again.`,
// 			});
// 			// Bad Request, in this case means: response as {error: 'Not Logged in'}
// 			if (response.status === 400) {
// 				setTimeout(() => {
// 					window.location.href = "/login";
// 				}, 1000);
// 			}
// 		} else if (response.ok) {
// 			toast({
// 				title: "Logged Out!",
// 				description:
// 					responseData.message || "Logged Out Successfully, redirecting....",
// 			});
// 		}

// 		await queryClient.invalidateQueries({
// 			queryKey: ["loggedInUser"],
// 		});

// 		setTimeout(() => {
// 			window.location.href = "/login";
// 		}, 1000);
// 	} catch (error) {
// 		toast({
// 			title: "Unable to Log Out!",
// 			description: `Something went wrong, server responded empty (error: ${error.message}). Please try again.`,
// 		});
// 	}
// };

// const handleUpdateProfile = async (
// 	formData: FormData,
// 	currentUser: User,
// 	emailOtp?: number,
// ) => {
// 	if (emailOtp) formData.append("otp", emailOtp.toString());

// 	const response = await fetch(
// 		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user`,
// 		{
// 			method: "PUT",
// 			body: formData,
// 			credentials: "include",
// 		},
// 	);

// 	const responseData = response.headers
// 		.get("content-type")
// 		.includes("application/json")
// 		? await response.json()
// 		: null;

// 	if (responseData?.error || !response.ok) {
// 		// Not Logged-In/Authorized
// 		if (response.status === 401) {
// 			toast({
// 				title: "Failed to Update Profile",
// 				description: `${responseData?.error} | redirecting....`,
// 				variant: "destructive",
// 			});
// 			setTimeout(() => {
// 				window.location.href = "/login";
// 			}, 1000);
// 			return { statusCode: response.status };
// 		}

// 		const error = new Error(
// 			`${responseData?.error}` ||
// 				`Failed to Update Profile (request status code: ${response.status}). Please try again.)`,
// 		);
// 		error["code"] = response.status;

// 		throw error;
// 	}

// 	return {
// 		statusCode: response.status,
// 		body: responseData as { message: string },
// 	};
// };

// const hasEmailChanged = (originalEmail: string, currentEmail: string) => {
// 	return originalEmail !== currentEmail;
// };

// Memoized ProfileManagement component to prevent unnecessary re-renders
// const ProfileManagement = memo(({ 
// 	currentUser, 
// 	name, 
// 	currentEmail, 
// 	originalEmail, 
// 	website, 
// 	github, 
// 	handleSubmit, 
// 	isSubmitting, 
// 	showOTPDialog, 
// 	otpValue, 
// 	otpError, 
// 	isSendingOTP, 
// 	isVerifyingOTP, 
// 	handleOTPVerification, 
// 	handleResendOTP, 
// 	handleCancel,
// 	queryClient,
// 	handleLogOut,
// 	setName,
// 	setCurrentEmail,
// 	setWebsite,
// 	setGithub,
// 	setOtpValue,
// 	setOtpError
// }: {
// 	currentUser: any;
// 	name: string;
// 	currentEmail: string;
// 	originalEmail: string;
// 	website: string;
// 	github: string;
// 	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
// 	isSubmitting: boolean;
// 	showOTPDialog: boolean;
// 	otpValue: string;
// 	otpError: string;
// 	isSendingOTP: boolean;
// 	isVerifyingOTP: boolean;
// 	handleOTPVerification: () => void;
// 	handleResendOTP: () => void;
// 	handleCancel: () => void;
// 	queryClient: any;
// 	handleLogOut: (queryClient: any, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
// 	setName: (name: string) => void;
// 	setCurrentEmail: (email: string) => void;
// 	setWebsite: (website: string) => void;
// 	setGithub: (github: string) => void;
// 	setOtpValue: (value: string) => void;
// 	setOtpError: (error: string) => void;
// }) => (
// 	<div className="space-y-6">
// 		{/* Profile Information */}
// 		<Card>
// 			<CardHeader>
// 				<div className="flex items-center justify-between">
// 					<CardTitle className="flex items-center gap-2">
// 						<Settings className="w-5 h-5" />
// 						Profile Information
// 					</CardTitle>
// 					<Button
// 						variant="destructive"
// 						size="sm"
// 						onClick={(e) => handleLogOut(queryClient, e)}
// 					>
// 						<LogOut className="w-4 h-4 mr-2" />
// 						Logout
// 					</Button>
// 				</div>
// 			</CardHeader>
// 			<CardContent className="space-y-6">
// 				<div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-subtle rounded-lg border border-border/50">
// 					<Avatar className="w-24 h-24 ring-2 ring-primary/20">
// 						{currentUser.github ? (
// 							<AvatarImage
// 								src={`https://avatars.githubusercontent.com/${currentUser.github}`}
// 								alt={currentUser.name}
// 								loading="lazy"
// 							/>
// 						) : null}
// 						<AvatarFallback className="text-2xl bg-gradient-primary text-white">
// 							{currentUser.name
// 								.split(" ")
// 								.map((n) => n[0])
// 								.join("")}
// 						</AvatarFallback>
// 					</Avatar>
// 					<div className="flex-1 text-center sm:text-left">
// 						<h3 className="text-xl font-semibold">{currentUser.name}</h3>
// 						<p className="text-muted-foreground">{currentUser.email}</p>
// 						<div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
// 							<Badge variant="outline">{currentUser.role}</Badge>
// 							{currentUser.verified && (
// 								<Badge variant="default" className="bg-green-500">
// 									Verified
// 								</Badge>
// 							) || ""}
// 						</div>
// 					</div>
// 					<Button variant="outline" size="sm">
// 						Change Avatar
// 					</Button>
// 				</div>
// 				<form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 						<div className="space-y-2">
// 							<Label htmlFor="name">Full Name</Label>
// 							<Input 
// 								id="name" 
// 								name="name"
// 								value={name}
// 								onChange={(e) => setName(e.target.value)}
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<Label htmlFor="email">Email</Label>
// 							<Input
// 								id="email"
// 								name="email"
// 								type="email"
// 								value={currentEmail}
// 								onChange={(e) => setCurrentEmail(e.target.value)}
// 							/>
// 							{/* Visual indicator when email has changed */}
// 							{hasEmailChanged(originalEmail, currentEmail) && (
// 								<p className="text-sm text-orange-600 mt-1">
// 									Email will be changed from: {originalEmail}
// 								</p>
// 							)}
// 						</div>
// 						<div className="space-y-2">
// 							<Label htmlFor="website">Website</Label>
// 							<Input 
// 								id="website" 
// 								name="website"
// 								value={website}
// 								onChange={(e) => setWebsite(e.target.value)}
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<Label htmlFor="github">GitHub</Label>
// 							<Input 
// 								id="github" 
// 								name="github"
// 								value={github}
// 								onChange={(e) => setGithub(e.target.value)}
// 							/>
// 						</div>
// 					</div>

// 					<Button
// 						className="bg-gradient-primary transition-colors disabled:bg-gradient-dark"
// 						type="submit"
// 						disabled={isSubmitting}
// 					>
// 						{isSubmitting ? "Updating..." : "Update Profile"}
// 					</Button>
// 				</form>

// 				{/* Radix-UI Dialog for OTP Verification */}

// 				<Dialog open={showOTPDialog} onOpenChange={() => {}}>
// 					<DialogContent className="sm:max-w-md">
// 						<DialogTitle>Verify Your New Email</DialogTitle>
// 						<DialogDescription>
// 							We've sent a 6-digit verification code to{" "}
// 							<strong>{currentEmail}</strong>. Please enter the code below to
// 							confirm your email change.
// 						</DialogDescription>

// 						<div className="space-y-4">
// 							<div>
// 								<Label htmlFor="otp">Verification Code</Label>
// 								<Input
// 									id="otp"
// 									type="text"
// 									value={otpValue}
// 									onChange={(e) => {
// 										const value = e.target.value
// 											.replace(/\D/g, "")
// 											.slice(0, 6);
// 										setOtpValue(value);
// 										setOtpError("");
// 									}}
// 									placeholder="Enter 6-digit code"
// 									maxLength={6}
// 									className="text-center text-lg tracking-widest"
// 								/>
// 								{otpError && (
// 									<p className="text-sm text-destructive mt-1">{otpError}</p>
// 								)}
// 							</div>

// 							<div className="text-center">
// 								<Button
// 									variant="link"
// 									onClick={handleResendOTP}
// 									disabled={isSendingOTP}
// 								>
// 									{isSendingOTP ? "Sending..." : "Resend Code"}
// 								</Button>
// 							</div>

// 							<div className="flex gap-2 pt-4">
// 								<Button
// 									onClick={handleOTPVerification}
// 									disabled={isVerifyingOTP || !otpValue.trim()}
// 									className="flex-1"
// 								>
// 									{isVerifyingOTP ? "Verifying..." : "Verify & Update"}
// 								</Button>
// 								<Button
// 									variant="outline"
// 									onClick={handleCancel}
// 									className="flex-1"
// 								>
// 									Cancel
// 								</Button>
// 							</div>
// 						</div>
// 					</DialogContent>
// 				</Dialog>
// 			</CardContent>
// 		</Card>

// 		{/* Payment Methods */}
// 		<PaymentMethods />
// 	</div>
// ));

// All hooks must be called before any conditional returns
export default function Dashboard() {
	// states & Hooks
	// const [activeTab, setActiveTab] = useState("overview");
	// const [pluginSearchQuery, setPluginSearchQuery] = useState("");

	// const queryClient = useQueryClient();
	// const deletePluginMutation = useDeletePlugin();

	const {
		user: currentLoggedUser,
		isError,
		isLoading,
		...args
	} = useAuth();

	// Memoize currentUser to prevent unnecessary re-renders
	const currentUser = useMemo(() => ({
		...currentLoggedUser,
	}), [currentLoggedUser]);

	// biome-ignore lint: Kept for Reference Only Should be Removed in PROD.
	console.log(currentUser)

	useEffect(() => {
		if (currentLoggedUser?.email) {
			console.log("useEffect :: ran on change of currentUser")
		}
	}, [currentLoggedUser?.email]);

	// Memoize UserDashboard component to prevent unnecessary re-renders
	const UserDashboard = useMemo(() => (
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
	), []);


	// const {
	// 	data: userPlugins,
	// 	isLoading: isPluginsLoading,
	// 	error: pluginsError,
	// 	...pluginArgs
	// } = useQuery({
	// 	queryKey: ["loggedInUser", "plugins"],
	// 	staleTime: 2 * 60 * 1000, // 2 minutes
	// 	gcTime: 10 * 60 * 1000, // 10 minutes
	// 	refetchOnWindowFocus: false,
	// 	queryFn: async () => {
	// 		const response = await fetch(
	// 			`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin?user=${currentLoggedUser.id}`,
	// 		);
	// 		const data = response.headers
	// 			.get("content-type")
	// 			.includes("application/json")
	// 			? await response.json()
	// 			: null;

	// 		if (!response.ok) {
	// 			throw new Error(
	// 				`Could not get Your Plugins (request status code: ${response.status})`,
	// 			);
	// 		}

	// 		return data;
	// 	},
	// 	enabled: !!currentLoggedUser?.id,
	// });

	// biome-ignore lint: Kept for Reference Only Should be Removed in PROD.
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

	// biome-ignore lint: Kept for Reference Only Should be Removed in PROD.
	// console.log(userPlugins, isPluginsLoading, pluginsError, pluginArgs);

	// const handleDeletePlugin = async (
	// 	pluginId: string,
	// 	mode: "soft" | "hard",
	// ) => {
	// 	try {
	// 		await deletePluginMutation.mutateAsync({ pluginId, mode });
	// 		toast({
	// 			title: "Plugin Deleted",
	// 			description: `Plugin ${mode === "hard" ? "permanently deleted" : "deleted"} successfully`,
	// 		});
	// 	} catch (error) {
	// 		toast({
	// 			title: "Delete Failed",
	// 			description: "Failed to delete plugin. Please try again.",
	// 			variant: "destructive",
	// 		});
	// 	}
	// };


	if (isError) {
		// TODO: Move this to Middleware or make use of contexts.
		// biome-ignore lint: Kept for Reference Only Should be Removed in PROD.
		console.log("User Not Logged in. redirecting...")
		// setTimeout(() => {
			// navigate("/login")
		// }, 1000)
		return (
			<div className="min-h-80 bg-gradient-dark flex flex-col items-center justify-center">
					<XCircle className="w-16 h-16 text-destructive mb-4" />
					<h2 className="text-2xl font-bold mb-2 text-primary-foreground">User Not Logged In.</h2>
					<p className="text-muted-foreground mb-6 max-w-md">
						You're not logged in! Redirecting...
					</p>
				</div>
		);
	}

	return isLoading || isError ? (
		<LoadingDashboard />
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
									loading="lazy"
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
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="profile">Profile</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 mt-6">
					{UserDashboard}
				</TabsContent>

				<TabsContent value="profile" className="space-y-6 mt-6">
					<ProfileManagement
						currentUser={currentUser}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

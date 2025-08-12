import { useQuery } from "@tanstack/react-query";
import {
	BarChart3,
	Check,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Download,
	MoreHorizontal,
	Package,
	Search,
	ShieldCheck,
	ShieldX,
	ShoppingCart,
	Trash2,
	UserIcon,
	Users,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { VerificationToggle } from "@/components/ui/verification-toggle";
import { toast } from "@/hooks/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { formatCurrency, formatDate } from "@/lib/date-utils";
import { User } from "@/types";

interface AdminStats {
	users: number;
	plugins: number;
	amountPaid: number;
	pluginSales: number;
	pluginDownloads: number;
}

interface UsersResponse {
	pages: number;
	users: User[];
}

const LoadingSpinner = () => (
	<div className="flex items-center justify-center p-8">
		<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
	</div>
);

export default function AdminDashboard() {
	const { data: currentUser, isLoading: userLoading } = useLoggedInUser();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchName, setSearchName] = useState("");
	const [searchEmail, setSearchEmail] = useState("");
	const usersPerPage = 10;

	const {
		data: adminStats,
		isLoading: statsLoading,
		error: statsError,
	} = useQuery<AdminStats>({
		queryKey: ["adminStats"],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch admin stats: ${response.status}`);
			}

			const data = await response.json();
			return data;
		},
		enabled: currentUser?.role === "admin",
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const {
		data: usersData,
		isLoading: usersLoading,
		error: usersError,
	} = useQuery<UsersResponse>({
		queryKey: ["adminUsers", currentPage, searchName, searchEmail],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: currentPage.toString(),
				limit: usersPerPage.toString(),
			});

			if (searchName) params.append("name", searchName);
			if (searchEmail) params.append("email", searchEmail);

			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/users?${params}`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch users: ${response.status}`);
			}

			const data = await response.json();
			return data;
		},
		enabled: currentUser?.role === "admin",
		staleTime: 2 * 60 * 1000, // 2 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const error = statsError || usersError;

	// Redirect if not admin
	if (currentUser && currentUser.role !== "admin") {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
				<p className="text-muted-foreground mt-2">
					You don't have permission to access this page.
				</p>
			</div>
		);
	}

	if (userLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-bold text-destructive">Error</h1>
				<p className="text-muted-foreground mt-2">
					Failed to load admin dashboard data.
				</p>
			</div>
		);
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toString();
	};

	const handleDeleteUser = async (id: number) => {
		try {
			const res = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/user/${id}`,
				{
					method: "DELETE",
					credentials: "include",
				},
			);
			const json = await res.json();
			if (json.error) {
				alert(json.error);
			} else {
				toast({ title: "User deleted successfully" });
				// Refresh the users data
				window.location.reload();
			}
		} catch (error) {
			toast({ title: "Error deleting user", variant: "destructive" });
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users, plugins, and platform analytics
					</p>
				</div>
				<Button
					onClick={() => {
						const now = new Date();
						const year = now.getFullYear();
						const month = now.getMonth() + 1;
						const url = `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/reports/${year}/${month}`;
						window.open(url, "_blank");
					}}
					className="flex items-center gap-2"
				>
					<Download className="w-4 h-4" />
					Download Report
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{statsLoading ? "..." : formatNumber(adminStats?.users || 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							Registered developers and users
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₹
							{statsLoading
								? "..."
								: formatCurrency(adminStats?.amountPaid || 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							Total paid to developers
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Plugin Sales</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₹
							{statsLoading
								? "..."
								: formatCurrency(adminStats?.pluginSales || 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							Total plugin sales revenue
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Downloads
						</CardTitle>
						<Download className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{statsLoading
								? "..."
								: formatNumber(adminStats?.pluginDownloads || 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							All plugin downloads
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Plugins</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{statsLoading ? "..." : formatNumber(adminStats?.plugins || 0)}
						</div>
						<p className="text-xs text-muted-foreground">Published plugins</p>
					</CardContent>
				</Card>
			</div>

			{/* Users Table */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5" />
							All Users ({usersData?.users?.length || 0} of{" "}
							{adminStats?.users || 0})
						</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Search by name..."
									value={searchName}
									onChange={(e) => {
										setSearchName(e.target.value);
										setCurrentPage(1);
									}}
									className="pl-9 w-full sm:w-48"
								/>
							</div>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Search by email..."
									value={searchEmail}
									onChange={(e) => {
										setSearchEmail(e.target.value);
										setCurrentPage(1);
									}}
									className="pl-9 w-full sm:w-48"
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{usersLoading ? (
						<LoadingSpinner />
					) : (
						<>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Joined</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{usersData?.users?.map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<Link
														to={`/developer/${encodeURIComponent(user.email)}`}
														className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
													>
														#{user.id}
													</Link>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="w-8 h-8">
															{user.github ? (
																<AvatarImage
																	src={`https://avatars.githubusercontent.com/${user.github}`}
																	alt={user.name}
																/>
															) : null}
															<AvatarFallback className="text-xs">
																{user.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium flex items-center gap-1">
																{user.name}
																{user.verified === 1 && (
																	<CheckCircle className="w-4 h-4 text-green-500" />
																)}
															</p>
															{user.github && (
																<p className="text-xs text-muted-foreground">
																	@{user.github}
																</p>
															)}
														</div>
													</div>
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>
													<Badge
														variant={
															user.role === "admin" ? "default" : "outline"
														}
													>
														{user.role}
													</Badge>
												</TableCell>
												<TableCell>{formatDate(user.created_at)}</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0"
															>
																<MoreHorizontal className="w-4 h-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem asChild>
																<Link
																	to={`/developer/${encodeURIComponent(user.email)}`}
																>
																	<UserIcon className="w-4 h-4 mr-2" />
																	Profile
																</Link>
															</DropdownMenuItem>
															<DropdownMenuItem asChild>
																<Link to={`/earnings/${user.id}`}>
																	<Wallet className="w-4 h-4 mr-2" />
																	Earnings
																</Link>
															</DropdownMenuItem>
															<VerificationToggle
																userId={user.id.toString()}
																isVerified={user.verified === 1}
																userName={user.name}
																variant="menu"
															>
																<DropdownMenuItem
																	onSelect={(e) => e.preventDefault()}
																>
																	{user.verified === 1 ? (
																		<>
																			<ShieldX className="w-4 h-4 mr-2" />
																			Revoke Verification
																		</>
																	) : (
																		<>
																			<ShieldCheck className="w-4 h-4 mr-2" />
																			Verify User
																		</>
																	)}
																</DropdownMenuItem>
															</VerificationToggle>
															<AlertDialog>
																<AlertDialogTrigger asChild>
																	<DropdownMenuItem
																		onSelect={(e) => e.preventDefault()}
																	>
																		<Trash2 className="w-4 h-4 mr-2" />
																		Delete User
																	</DropdownMenuItem>
																</AlertDialogTrigger>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>
																			Delete User
																		</AlertDialogTitle>
																		<AlertDialogDescription>
																			Are you sure you want to delete user "
																			{user.name}"? This action cannot be undone
																			and will permanently delete their account
																			and all associated data.
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>
																			Cancel
																		</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() => handleDeleteUser(user.id)}
																			className="bg-red-600 hover:bg-red-700"
																		>
																			Delete User
																		</AlertDialogAction>
																	</AlertDialogFooter>
																</AlertDialogContent>
															</AlertDialog>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										)) || (
											<TableRow>
												<TableCell colSpan={7} className="text-center py-8">
													No users found
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{/* Pagination */}
							{usersData && usersData.pages > 1 && (
								<div className="flex items-center justify-between pt-4">
									<p className="text-sm text-muted-foreground">
										Page {currentPage} of {usersData.pages}
									</p>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setCurrentPage(Math.max(1, currentPage - 1))
											}
											disabled={currentPage === 1}
										>
											<ChevronLeft className="w-4 h-4" />
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setCurrentPage(
													Math.min(usersData.pages, currentPage + 1),
												)
											}
											disabled={currentPage === usersData.pages}
										>
											Next
											<ChevronRight className="w-4 h-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

import { useQuery } from "@tanstack/react-query";
import {
	Calendar,
	CheckCircle,
	ChevronDown,
	Clock,
	CreditCard,
	DollarSign,
	Eye,
	Filter,
	RefreshCw,
	Search,
	User,
	Wallet,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/date-utils";

interface AdminPayment {
	id: number;
	created_at: string;
	updated_at: string;
	user_id: number;
	amount: number;
	receipt?: string | null;
	date_from: string;
	date_to: string;
	status: string;
	payment_method_id: number;
	user_name: string;
	user_email: string;
	bank_name?: string | null;
	paypal_email?: string | null;
	bank_account_number?: string | null;
}
interface PaymentMethodDetails {
	user_name: string;
	user_email: string;
	bank_name?: string | null;
	bank_account_number?: string | null;
	bank_account_type?: string | null;
	bank_account_holder?: string | null;
	bank_ifsc_code?: string | null;
	bank_swift_code?: string | null;
	paypal_email?: string | null;
	wallet_type?: string | null;
	wallet_address?: string | null;
}

const LoadingGrid = () => (
	<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{Array.from({ length: 6 }).map((_, i) => (
			<Card key={i} className="p-4">
				<div className="space-y-3">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-6 w-1/2" />
					<Skeleton className="h-4 w-full" />
					<div className="flex justify-between items-center">
						<Skeleton className="h-6 w-16" />
						<Skeleton className="h-8 w-20" />
					</div>
				</div>
			</Card>
		))}
	</div>
);

const getStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case "paid":
			return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
		case "initiated":
			return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
		case "none":
		case "pending":
		default:
			return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
	}
};

const getPaymentMethodIcon = (payment: AdminPayment) => {
	if (payment.bank_name) return <CreditCard className="w-4 h-4" />;
	if (payment.paypal_email) return <Wallet className="w-4 h-4" />;
	return <DollarSign className="w-4 h-4" />;
};

export default function AdminPayments() {
	const { data: currentUser, isLoading: userLoading } = useLoggedInUser();
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(
		null,
	);

	const [paymentMethodDetails, setPaymentMethodDetails] =
		useState<PaymentMethodDetails | null>(null);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
	const [isUpdating, setIsUpdating] = useState<number | null>(null);

	const {
		data: payments,
		isLoading: paymentsLoading,
		error: paymentsError,
		refetch: refetchPayments,
	} = useQuery<AdminPayment[]>({
		queryKey: ["adminPayments"],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/payments`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch payments: ${response.status}`);
			}

			const data = await response.json();
			return Array.isArray(data) ? data : [];
		},
		enabled: currentUser?.role === "admin",
		staleTime: 2 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	// Client-side filtering
	const filteredPayments = useMemo(() => {
		if (!payments) return [];

		return payments.filter((payment) => {
			// Status filter
			if (statusFilter !== "all" && payment.status !== statusFilter) {
				return false;
			}

			// Search filter (name, email, ID)
			if (searchFilter) {
				const searchLower = searchFilter.toLowerCase();
				return (
					payment.user_name.toLowerCase().includes(searchLower) ||
					payment.user_email.toLowerCase().includes(searchLower) ||
					payment.id.toString().includes(searchFilter) ||
					payment.user_id.toString().includes(searchFilter)
				);
			}

			return true;
		});
	}, [payments, statusFilter, searchFilter]);

	const stats = useMemo(() => {
		if (!payments) return { total: 0, paid: 0, initiated: 0, amount: 0 };

		return {
			total: payments.length,
			paid: payments.filter((p) => p.status === "paid").length,
			initiated: payments.filter(
				(p) => p.status === "none" || p.status === "initiated",
			).length,
			amount: payments.reduce((sum, p) => sum + p.amount, 0),
		};
	}, [payments]);

	// Redirect if not admin
	if (currentUser && currentUser.role !== "admin") {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<div className="max-w-md mx-auto">
					<div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
						<h1 className="text-2xl font-bold text-destructive mb-2">
							Access Denied
						</h1>
						<p className="text-muted-foreground">
							You don't have permission to access this page.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (userLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-4 w-96" />
				</div>
				<LoadingGrid />
			</div>
		);
	}

	if (paymentsError) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<div className="max-w-md mx-auto">
					<div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
						<h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
						<p className="text-muted-foreground mb-4">
							Failed to load payments data.
						</p>
						<Button onClick={() => refetchPayments()} variant="outline">
							<RefreshCw className="w-4 h-4 mr-2" />
							Retry
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const updatePaymentStatus = async (paymentId: number, newStatus: string) => {
		setIsUpdating(paymentId);
		try {
			const formData = new FormData();
			formData.append("id", paymentId.toString());
			formData.append("status", newStatus);

			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/payment`,
				{
					method: "PATCH",
					body: formData,
					credentials: "include",
				},
			);

			const data = await response.json();

			if (!response.ok || data.error) {
				throw new Error(data.error || "Failed to update payment status");
			}

			toast({
				title: "Payment updated",
				description: `Payment #${paymentId} marked as ${newStatus}`,
			});

			refetchPayments();
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "An unknown error occurred";
			toast({
				title: "Error updating payment",
				description: message,
				variant: "destructive",
			});
		} finally {
			setIsUpdating(null);
		}
	};

	const fetchPaymentMethodDetails = async (paymentMethodId: number) => {
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/admin/payment-method/${paymentMethodId}`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch payment method: ${response.status}`);
			}

			const data = await response.json();
			setPaymentMethodDetails(data);
			setIsMethodDialogOpen(true);
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "An unknown error occurred";
			toast({
				title: "Error fetching payment method",
				description: message,
				variant: "destructive",
			});
		}
	};

	const clearFilters = () => {
		setStatusFilter("all");
		setSearchFilter("");
	};

	return (
		<div className="container mx-auto px-4 py-6 max-w-7xl">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<Wallet className="w-8 h-8 text-primary" />
					<h1 className="text-3xl font-bold">Payment Management</h1>
				</div>
				<p className="text-muted-foreground">
					Manage developer payments and payment methods
				</p>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<DollarSign className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Total
							</span>
						</div>
						<div className="text-2xl font-bold mt-1">{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full" />
							<span className="text-sm font-medium text-muted-foreground">
								Paid
							</span>
						</div>
						<div className="text-2xl font-bold mt-1">{stats.paid}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-yellow-500 rounded-full" />
							<span className="text-sm font-medium text-muted-foreground">
								Pending/Initiated
							</span>
						</div>
						<div className="text-2xl font-bold mt-1">{stats.initiated}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<Wallet className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Amount
							</span>
						</div>
						<div className="text-2xl font-bold mt-1">
							₹{formatCurrency(stats.amount)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card className="mb-6">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Search by name, email, or ID..."
									value={searchFilter}
									onChange={(e) => setSearchFilter(e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>
						<div className="w-full sm:w-48">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="none">Pending</SelectItem>
									<SelectItem value="initiated">Initiated</SelectItem>
									<SelectItem value="paid">Paid</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" onClick={clearFilters} size="sm">
								<X className="w-4 h-4 mr-1" />
								Clear
							</Button>
							<Button
								variant="outline"
								onClick={() => refetchPayments()}
								size="sm"
							>
								<RefreshCw className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Payments Grid */}
			{paymentsLoading ? (
				<LoadingGrid />
			) : filteredPayments.length === 0 ? (
				<Card className="p-8 text-center">
					<div className="flex flex-col items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
							<Wallet className="w-8 h-8 text-muted-foreground" />
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-1">No payments found</h3>
							<p className="text-muted-foreground">
								{searchFilter || statusFilter !== "all"
									? "Try adjusting your filters"
									: "No payments have been created yet"}
							</p>
						</div>
						{(searchFilter || statusFilter !== "all") && (
							<Button variant="outline" onClick={clearFilters}>
								Clear Filters
							</Button>
						)}
					</div>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredPayments.map((payment) => (
						<Card
							key={payment.id}
							className="hover:shadow-md transition-shadow"
						>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-start">
									<div>
										<CardTitle className="text-lg flex items-center gap-2">
											{getPaymentMethodIcon(payment)}#{payment.id}
										</CardTitle>
										<CardDescription className="mt-1">
											{payment.user_name}
										</CardDescription>
									</div>
									<Badge
										className={getStatusColor(payment.status)}
										variant="outline"
									>
										{payment.status === "none" ? "Pending" : payment.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-2xl font-bold">
											₹{formatCurrency(payment.amount)}
										</span>
									</div>

									<div className="space-y-1 text-sm text-muted-foreground">
										<div className="flex items-center gap-2">
											<User className="w-3 h-3" />
											<span>{payment.user_email}</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="w-3 h-3" />
											<span>
												{formatDate(payment.date_from)} -{" "}
												{formatDate(payment.date_to)}
											</span>
										</div>
									</div>

									<Separator />

									<div className="flex justify-between items-center">
										<span className="text-xs text-muted-foreground">
											Created {formatDate(payment.created_at)}
										</span>
										<div className="flex gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													setSelectedPayment(payment);
													setIsPaymentDialogOpen(true);
												}}
											>
												<Eye className="w-4 h-4" />
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														disabled={isUpdating === payment.id}
													>
														{isUpdating === payment.id ? (
															<RefreshCw className="w-4 h-4 animate-spin" />
														) : (
															<ChevronDown className="w-4 h-4" />
														)}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() =>
															fetchPaymentMethodDetails(
																payment.payment_method_id,
															)
														}
													>
														<CreditCard className="w-4 h-4 mr-2" />
														View Payment Method
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() =>
															updatePaymentStatus(payment.id, "initiated")
														}
														disabled={
															payment.status === "initiated" ||
															payment.status === "paid"
														}
													>
														<Clock className="w-4 h-4 mr-2" />
														Mark as Initiated
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															updatePaymentStatus(payment.id, "paid")
														}
														disabled={payment.status === "paid"}
													>
														<CheckCircle className="w-4 h-4 mr-2" />
														Mark as Paid
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Payment Details Dialog */}
			<Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<DollarSign className="w-5 h-5" />
							Payment Details #{selectedPayment?.id}
						</DialogTitle>
						<DialogDescription>
							Complete payment information and developer details
						</DialogDescription>
					</DialogHeader>
					{selectedPayment && (
						<div className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											Payment Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Payment ID</span>
											<span className="font-mono">#{selectedPayment.id}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Amount</span>
											<span className="font-semibold text-lg">
												₹{formatCurrency(selectedPayment.amount)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Status</span>
											<Badge
												className={getStatusColor(selectedPayment.status)}
												variant="outline"
											>
												{selectedPayment.status === "none"
													? "Pending"
													: selectedPayment.status}
											</Badge>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Created</span>
											<span>{formatDateTime(selectedPayment.created_at)}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Updated</span>
											<span>{formatDateTime(selectedPayment.updated_at)}</span>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											Developer Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Name</span>
											<span className="font-medium">
												{selectedPayment.user_name}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Email</span>
											<span>{selectedPayment.user_email}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">User ID</span>
											<span className="font-mono">
												#{selectedPayment.user_id}
											</span>
										</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<Calendar className="w-4 h-4" />
										Earnings Period
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex justify-between items-center p-4 bg-muted rounded-lg">
										<div className="text-center">
											<div className="text-sm text-muted-foreground">From</div>
											<div className="font-semibold">
												{formatDate(selectedPayment.date_from)}
											</div>
										</div>
										<div className="text-muted-foreground">→</div>
										<div className="text-center">
											<div className="text-sm text-muted-foreground">To</div>
											<div className="font-semibold">
												{formatDate(selectedPayment.date_to)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{selectedPayment.receipt && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">Receipt</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="p-4 bg-muted rounded-lg font-mono text-sm">
											{selectedPayment.receipt}
										</div>
									</CardContent>
								</Card>
							)}

							{(selectedPayment.bank_name || selectedPayment.paypal_email) && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											Payment Method Preview
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{selectedPayment.bank_name && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">Bank</span>
												<span>{selectedPayment.bank_name}</span>
											</div>
										)}
										{selectedPayment.bank_account_number && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">Account</span>
												<span className="font-mono">
													{selectedPayment.bank_account_number}
												</span>
											</div>
										)}
										{selectedPayment.paypal_email && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">PayPal</span>
												<span>{selectedPayment.paypal_email}</span>
											</div>
										)}
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Payment Method Details Dialog */}
			<Dialog open={isMethodDialogOpen} onOpenChange={setIsMethodDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<CreditCard className="w-5 h-5" />
							Payment Method Details
						</DialogTitle>
						<DialogDescription>
							Complete payment method information for this developer
						</DialogDescription>
					</DialogHeader>
					{paymentMethodDetails && (
						<div className="space-y-6">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base">
										Developer Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Name</span>
										<span className="font-medium">
											{paymentMethodDetails.user_name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Email</span>
										<span>{paymentMethodDetails.user_email}</span>
									</div>
								</CardContent>
							</Card>

							{paymentMethodDetails.bank_account_number && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<CreditCard className="w-4 h-4" />
											Bank Account Details
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Bank Name</span>
											<span className="font-medium">
												{paymentMethodDetails.bank_name}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Account Number
											</span>
											<span className="font-mono">
												{paymentMethodDetails.bank_account_number}
											</span>
										</div>
										{paymentMethodDetails.bank_account_type && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Account Type
												</span>
												<span className="capitalize">
													{paymentMethodDetails.bank_account_type}
													{paymentMethodDetails.bank_account_holder &&
														` (${paymentMethodDetails.bank_account_holder})`}
												</span>
											</div>
										)}
										{paymentMethodDetails.bank_ifsc_code && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">IFSC Code</span>
												<span className="font-mono">
													{paymentMethodDetails.bank_ifsc_code}
												</span>
											</div>
										)}
										{paymentMethodDetails.bank_swift_code && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													SWIFT Code
												</span>
												<span className="font-mono">
													{paymentMethodDetails.bank_swift_code}
												</span>
											</div>
										)}
									</CardContent>
								</Card>
							)}

							{paymentMethodDetails.paypal_email && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<Wallet className="w-4 h-4" />
											PayPal Details
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												PayPal Email
											</span>
											<span className="font-medium">
												{paymentMethodDetails.paypal_email}
											</span>
										</div>
									</CardContent>
								</Card>
							)}

							{paymentMethodDetails.wallet_address && (
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<DollarSign className="w-4 h-4" />
											Crypto Wallet Details
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Wallet Type</span>
											<span className="font-medium">
												{paymentMethodDetails.wallet_type}
											</span>
										</div>
										<div className="space-y-1">
											<span className="text-sm text-muted-foreground">
												Wallet Address
											</span>
											<div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
												{paymentMethodDetails.wallet_address}
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

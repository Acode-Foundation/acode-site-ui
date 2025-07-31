import {
	Calendar,
	Clock,
	CreditCard,
	DollarSign,
	Download,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEarnings } from "@/hooks/use-earnings";
import { usePaymentReceipt } from "@/hooks/use-payment-receipt";
import { usePayments } from "@/hooks/use-payments";
import { useToast } from "@/hooks/use-toast";
import { useUnpaidEarnings } from "@/hooks/use-unpaid-earnings";
import { useUpdateThreshold } from "@/hooks/use-update-threshold";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import {
	formatCurrency,
	formatDate,
	generateYearsArray,
	getCurrentDateDetails,
	MONTHS,
} from "@/lib/date-utils";

export default function Earnings() {
	const { year: currentYear, month: currentMonth } = getCurrentDateDetails();
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState(currentMonth - 1); // Keep 0-indexed for compatibility
	const [selectedPaymentYear, setSelectedPaymentYear] = useState<
		number | undefined
	>(undefined);
	const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(
		null,
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [newThreshold, setNewThreshold] = useState<string>("");
	const [showThresholdDialog, setShowThresholdDialog] = useState(false);

	const itemsPerPage = 10;

	const { data: user } = useLoggedInUser();
	const userId = user?.id?.toString() || "";
	const { toast } = useToast();

	const { data: unpaidEarnings } = useUnpaidEarnings(userId);
	const { data: monthlyEarnings } = useEarnings(
		selectedYear,
		selectedMonth,
		userId,
	);
	const { data: payments } = usePayments(userId, selectedPaymentYear);
	const { data: receipt } = usePaymentReceipt(selectedReceiptId);
	const updateThresholdMutation = useUpdateThreshold();

	const years = generateYearsArray();
	const months = MONTHS.map((m) => m.label); // Keep as string array for compatibility

	// Pagination for payments
	const paginatedPayments = payments
		? payments.slice(
				(currentPage - 1) * itemsPerPage,
				currentPage * itemsPerPage,
			)
		: [];
	const totalPages = payments ? Math.ceil(payments.length / itemsPerPage) : 0;

	const getNextPaymentDate = () => {
		const now = new Date();
		const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 16);
		return nextMonth.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const getPaymentStatus = () => {
		const earnings = unpaidEarnings?.earnings || 0;
		const threshold = unpaidEarnings?.threshold || 0;

		if (earnings >= threshold) {
			return `Will be paid on ${getNextPaymentDate()}`;
		} else {
			const remaining = threshold - earnings;
			return `₹${formatCurrency(remaining)} more needed to reach threshold`;
		}
	};

	const handleUpdateThreshold = async () => {
		const thresholdValue = parseInt(newThreshold);
		if (thresholdValue < 1000) {
			toast({
				title: "Error",
				description: "Threshold must be at least ₹1,000",
				variant: "destructive",
			});
			return;
		}

		try {
			await updateThresholdMutation.mutateAsync(thresholdValue);
			toast({
				title: "Success",
				description: "Payment threshold updated successfully",
			});
			setShowThresholdDialog(false);
			setNewThreshold("");
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Earnings Overview</h1>
				<p className="text-muted-foreground">
					Track your plugin sales and payments
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Unpaid Earnings
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-primary">
							₹{formatCurrency(unpaidEarnings?.earnings || 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							Period:{" "}
							{unpaidEarnings?.from && unpaidEarnings?.to
								? `${formatDate(unpaidEarnings.from)} - ${formatDate(unpaidEarnings.to)}`
								: "N/A"}
						</p>
						<div className="mt-2">
							<div className="text-xs text-muted-foreground mb-1">
								{getPaymentStatus()}
							</div>
							<div className="w-full bg-secondary rounded-full h-2">
								<div
									className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
									style={{
										width: `${Math.min(((unpaidEarnings?.earnings || 0) / (unpaidEarnings?.threshold || 1)) * 100, 100)}%`,
									}}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Monthly Earnings
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₹{formatCurrency(monthlyEarnings?.earnings || 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							{monthlyEarnings?.month} {monthlyEarnings?.year}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Payment Threshold
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<div className="text-2xl font-bold">
									₹{formatCurrency(user?.threshold || 0)}
								</div>
								<p className="text-xs text-muted-foreground">
									Minimum payout amount
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setNewThreshold(user?.threshold?.toString() || "");
									setShowThresholdDialog(true);
								}}
							>
								Update
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Monthly Earnings */}
			<Card className="mb-8">
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<CardTitle className="flex items-center gap-2">
							<Calendar className="w-5 h-5" />
							Monthly Earnings
						</CardTitle>
						<div className="flex gap-2">
							<Select
								value={selectedYear.toString()}
								onValueChange={(value) => setSelectedYear(Number(value))}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{years.map((year) => (
										<SelectItem key={year} value={year.toString()}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={selectedMonth.toString()}
								onValueChange={(value) => setSelectedMonth(Number(value))}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{months.map((month, index) => (
										<SelectItem key={index} value={index.toString()}>
											{month}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-center p-8">
						<div className="text-3xl font-bold text-primary mb-2">
							₹{formatCurrency(monthlyEarnings?.earnings || 0)}
						</div>
						<p className="text-muted-foreground">
							{months[selectedMonth]} {selectedYear} earnings
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Payment History */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<CardTitle className="flex items-center gap-2">
							<CreditCard className="w-5 h-5" />
							Payment History
						</CardTitle>
						<Select
							value={selectedPaymentYear?.toString() || "all"}
							onValueChange={(value) =>
								setSelectedPaymentYear(
									value === "all" ? undefined : Number(value),
								)
							}
						>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Time</SelectItem>
								{years.map((year) => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="hidden sm:table-cell">
										Payment Method
									</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedPayments?.map((payment) => (
									<TableRow key={payment.id}>
										<TableCell>{formatDate(payment.created_at)}</TableCell>
										<TableCell className="font-medium">
											₹{formatCurrency(payment.amount)}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													payment.status === "paid"
														? "default"
														: payment.status === "failed"
															? "destructive"
															: "secondary"
												}
											>
												{payment.status}
											</Badge>
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											{payment.paypal_email
												? `PayPal: ${payment.paypal_email}`
												: payment.bank_name
													? `${payment.bank_name} (${payment.bank_account_number})`
													: "Payment Method"}
										</TableCell>
										<TableCell>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setSelectedReceiptId(payment.id)}
											>
												<Download className="w-4 h-4 mr-1" />
												Receipt
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						{(!payments || payments.length === 0) && (
							<div className="text-center py-8">
								<p className="text-muted-foreground">
									No payments found for the selected period.
								</p>
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between pt-4">
								<div className="text-sm text-muted-foreground">
									Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
									{Math.min(currentPage * itemsPerPage, payments?.length || 0)}{" "}
									of {payments?.length || 0} payments
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage(currentPage - 1)}
										disabled={currentPage === 1}
									>
										Previous
									</Button>
									<span className="px-3 py-2 text-sm">
										Page {currentPage} of {totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage(currentPage + 1)}
										disabled={currentPage === totalPages}
									>
										Next
									</Button>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Receipt Dialog */}
			<Dialog
				open={!!selectedReceiptId}
				onOpenChange={() => setSelectedReceiptId(null)}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Payment Receipt</DialogTitle>
					</DialogHeader>
					{receipt && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium">Payment ID</p>
									<p className="text-sm text-muted-foreground">{receipt.id}</p>
								</div>
								<div>
									<p className="text-sm font-medium">Amount</p>
									<p className="text-sm text-muted-foreground">
										₹{formatCurrency(receipt.amount)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium">Date</p>
									<p className="text-sm text-muted-foreground">
										{formatDate(receipt.created_at)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium">Status</p>
									<p className="text-sm text-muted-foreground capitalize">
										{receipt.status}
									</p>
								</div>
							</div>

							<div className="border-t pt-4">
								<p className="text-sm font-medium mb-2">Payment Method</p>
								{receipt.paymentMethod.paypal_email && (
									<p className="text-sm text-muted-foreground">
										PayPal: {receipt.paymentMethod.paypal_email}
									</p>
								)}
								{receipt.paymentMethod.bank_account_number && (
									<div className="text-sm text-muted-foreground">
										<p>Bank: {receipt.bank_name}</p>
										<p>
											Account: ****
											{receipt.paymentMethod.bank_account_number.slice(-4)}
										</p>
										<p>Holder: {receipt.user_name}</p>
									</div>
								)}
								{receipt.paymentMethod.wallet_address && (
									<div className="text-sm text-muted-foreground">
										<p>Wallet: {receipt.paymentMethod.wallet_type}</p>
										<p>
											Address:{" "}
											{receipt.paymentMethod.wallet_address.slice(0, 20)}...
										</p>
									</div>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Threshold Update Dialog */}
			<Dialog open={showThresholdDialog} onOpenChange={setShowThresholdDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Update Payment Threshold</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">
								New Threshold Amount (₹)
							</label>
							<Input
								type="number"
								value={newThreshold}
								onChange={(e) => setNewThreshold(e.target.value)}
								placeholder="Enter minimum amount (min: 1000)"
								min="1000"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Minimum threshold is ₹1,000
							</p>
						</div>

						<div className="flex gap-2 pt-4">
							<Button
								onClick={handleUpdateThreshold}
								disabled={updateThresholdMutation.isPending || !newThreshold}
							>
								{updateThresholdMutation.isPending
									? "Updating..."
									: "Update Threshold"}
							</Button>
							<Button
								variant="outline"
								onClick={() => setShowThresholdDialog(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

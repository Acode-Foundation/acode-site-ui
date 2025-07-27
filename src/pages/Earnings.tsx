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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useUnpaidEarnings } from "@/hooks/use-unpaid-earnings";
import { usePayments } from "@/hooks/use-payments";
import { useEarnings } from "@/hooks/use-earnings";
import { usePaymentReceipt } from "@/hooks/use-payment-receipt";

export default function Earnings() {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [selectedPaymentYear, setSelectedPaymentYear] = useState<number | undefined>(undefined);
	const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

	const { data: user } = useLoggedInUser();
	const userId = user?.id?.toString() || "";

	const { data: unpaidEarnings } = useUnpaidEarnings(userId);
	const { data: monthlyEarnings } = useEarnings(selectedYear, selectedMonth, userId);
	const { data: payments } = usePayments(userId, selectedPaymentYear);
	const { data: receipt } = usePaymentReceipt(selectedReceiptId);

	const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

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
							₹{unpaidEarnings?.earnings?.toFixed(2) || "0.00"}
						</div>
						<p className="text-xs text-muted-foreground">
							Period: {unpaidEarnings?.from && unpaidEarnings?.to 
								? `${new Date(unpaidEarnings.from).toLocaleDateString()} - ${new Date(unpaidEarnings.to).toLocaleDateString()}`
								: "N/A"}
						</p>
						<div className="mt-2">
							<div className="text-xs text-muted-foreground mb-1">
								Payment threshold: ₹{unpaidEarnings?.threshold || 0}
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
							₹{monthlyEarnings?.earnings?.toFixed(2) || "0.00"}
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
						<div className="text-2xl font-bold">
							₹{user?.threshold || 0}
						</div>
						<p className="text-xs text-muted-foreground">Minimum payout amount</p>
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
							<Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{years.map(year => (
										<SelectItem key={year} value={year.toString()}>{year}</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{months.map((month, index) => (
										<SelectItem key={index} value={index.toString()}>{month}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-center p-8">
						<div className="text-3xl font-bold text-primary mb-2">
							₹{monthlyEarnings?.earnings?.toFixed(2) || "0.00"}
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
						<Select value={selectedPaymentYear?.toString() || "all"} onValueChange={(value) => setSelectedPaymentYear(value === "all" ? undefined : Number(value))}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Time</SelectItem>
								{years.map(year => (
									<SelectItem key={year} value={year.toString()}>{year}</SelectItem>
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
									<TableHead className="hidden sm:table-cell">Payment Method</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{payments?.map((payment) => (
									<TableRow key={payment.id}>
										<TableCell>
											{new Date(payment.created_at).toLocaleDateString()}
										</TableCell>
										<TableCell className="font-medium">
											₹{payment.amount.toFixed(2)}
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
											Payment Method
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
					</div>
				</CardContent>
			</Card>

			{/* Receipt Dialog */}
			<Dialog open={!!selectedReceiptId} onOpenChange={() => setSelectedReceiptId(null)}>
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
									<p className="text-sm text-muted-foreground">₹{receipt.amount.toFixed(2)}</p>
								</div>
								<div>
									<p className="text-sm font-medium">Date</p>
									<p className="text-sm text-muted-foreground">{new Date(receipt.created_at).toLocaleDateString()}</p>
								</div>
								<div>
									<p className="text-sm font-medium">Status</p>
									<p className="text-sm text-muted-foreground capitalize">{receipt.status}</p>
								</div>
							</div>
							
							<div className="border-t pt-4">
								<p className="text-sm font-medium mb-2">Payment Method</p>
								{receipt.paymentMethod.paypal_email && (
									<p className="text-sm text-muted-foreground">PayPal: {receipt.paymentMethod.paypal_email}</p>
								)}
								{receipt.paymentMethod.bank_account_number && (
									<div className="text-sm text-muted-foreground">
										<p>Bank: {receipt.paymentMethod.bank_name}</p>
										<p>Account: ****{receipt.paymentMethod.bank_account_number.slice(-4)}</p>
										<p>Holder: {receipt.paymentMethod.bank_account_holder}</p>
									</div>
								)}
								{receipt.paymentMethod.wallet_address && (
									<div className="text-sm text-muted-foreground">
										<p>Wallet: {receipt.paymentMethod.wallet_type}</p>
										<p>Address: {receipt.paymentMethod.wallet_address.slice(0, 20)}...</p>
									</div>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
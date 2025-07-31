import { useQuery } from "@tanstack/react-query";
import { Calendar, DollarSign, Package, TrendingUp, User } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import {
	formatCurrency,
	formatDate,
	generateYearsArray,
	getCurrentDateDetails,
	getMonthName,
	MONTHS,
} from "@/lib/date-utils";
import { Order, Plugin } from "@/types";

export default function PluginOrders() {
	const { pluginId } = useParams<{ pluginId: string }>();
	const { year: currentYear, month: currentMonth } = getCurrentDateDetails();

	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 10;
	const { data: user } = useLoggedInUser();
	const { toast } = useToast();

	const years = generateYearsArray();
	const months = MONTHS;

	// Fetch plugin details
	const { data: plugin, isLoading: isPluginLoading } = useQuery<Plugin>({
		queryKey: ["plugin", pluginId],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin/${pluginId}`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error("Failed to fetch plugin details");
			}

			return response.json();
		},
		enabled: !!pluginId,
	});

	// Fetch orders for the plugin
	const {
		data: orders,
		isLoading: isOrdersLoading,
		error,
	} = useQuery<Order[]>({
		queryKey: ["plugin-orders", pluginId, selectedYear, selectedMonth],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/plugin/orders/${pluginId}/${selectedYear}/${selectedMonth}`,
				{
					credentials: "include",
				},
			);

			if (!response.ok) {
				if (response.status === 403) {
					throw new Error("You don't have permission to view these orders");
				}
				if (response.status === 404) {
					throw new Error("Plugin not found");
				}
				throw new Error("Failed to fetch orders");
			}

			return response.json();
		},
		enabled: !!pluginId && !!user,
		retry: false,
	});

	// Calculate statistics
	const totalOrders = orders?.length || 0;
	const totalRevenue =
		orders?.reduce((sum, order) => sum + order.amount, 0) || 0;
	const successfulOrders =
		orders?.filter((order) => order.state === "0").length || 0;
	const successRate =
		totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

	// Pagination
	const paginatedOrders =
		orders?.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage,
		) || [];
	const totalPages = orders ? Math.ceil(orders.length / itemsPerPage) : 0;

	const getStatusColor = (state: string) => {
		switch (state) {
			case "0":
				return "default"; // Success
			default:
				return "destructive"; // Cancelled
		}
	};

	const getStatusText = (state: string) => {
		switch (state) {
			case "0":
				return "Completed";
			default:
				return "Cancelled";
		}
	};

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="text-center py-12">
						<div className="text-destructive text-lg font-medium mb-2">
							Error loading orders
						</div>
						<p className="text-muted-foreground">{error.message}</p>
						<Button className="mt-4" onClick={() => window.history.back()}>
							Go Back
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-2">
					<Package className="w-6 h-6" />
					<h1 className="text-3xl font-bold">Plugin Orders</h1>
				</div>
				{plugin && (
					<div className="flex items-center gap-4">
						<p className="text-xl text-muted-foreground">{plugin.name}</p>
						<Badge variant="outline">by {plugin.author}</Badge>
						<Badge
							variant="secondary"
							className="text-sm px-3 py-1 transition-colors bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/40"
						>
							₹{formatCurrency(plugin.price)}
						</Badge>
					</div>
				)}
			</div>

			{/* Filters */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="w-5 h-5" />
						Filter Orders
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">Year</label>
							<Select
								value={selectedYear.toString()}
								onValueChange={(value) => setSelectedYear(Number(value))}
							>
								<SelectTrigger>
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
						</div>
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">Month</label>
							<Select
								value={selectedMonth.toString()}
								onValueChange={(value) => setSelectedMonth(Number(value))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{months.map((month) => (
										<SelectItem
											key={month.value}
											value={month.value.toString()}
										>
											{month.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalOrders}</div>
						<p className="text-xs text-muted-foreground">
							{getMonthName(selectedMonth)} {selectedYear}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₹{formatCurrency(totalRevenue)}
						</div>
						<p className="text-xs text-muted-foreground">
							Total earnings this period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Successful Orders
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{successfulOrders}</div>
						<p className="text-xs text-muted-foreground">
							Completed successfully
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Success Rate</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
						<p className="text-xs text-muted-foreground">
							Order completion rate
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="w-5 h-5" />
						Orders List
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isOrdersLoading || isPluginLoading ? (
						<div className="text-center py-8">
							<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
							<p className="text-muted-foreground">Loading orders...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Order ID</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="hidden sm:table-cell">
											Package
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{paginatedOrders.map((order, index) => (
										<TableRow key={`${order.order_id}-${index}`}>
											<TableCell className="font-mono text-sm">
												****{order.order_id?.slice(-6)}
											</TableCell>
											<TableCell>{formatDate(order.created_at)}</TableCell>
											<TableCell className="font-medium">
												₹{formatCurrency(order.amount)}
											</TableCell>
											<TableCell>
												<Badge variant={getStatusColor(order.state)}>
													{getStatusText(order.state)}
												</Badge>
											</TableCell>
											<TableCell className="hidden sm:table-cell font-mono text-sm">
												{/free$/.test(order.package) ? "Free" : "Paid"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{(!orders || orders.length === 0) && (
								<div className="text-center py-8">
									<Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">
										No orders found for {getMonthName(selectedMonth)}{" "}
										{selectedYear}.
									</p>
								</div>
							)}

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between pt-4">
									<div className="text-sm text-muted-foreground">
										Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
										{Math.min(currentPage * itemsPerPage, orders?.length || 0)}{" "}
										of {orders?.length || 0} orders
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
					)}
				</CardContent>
			</Card>
		</div>
	);
}

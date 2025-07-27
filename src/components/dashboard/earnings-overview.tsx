import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentMonthEarnings } from "@/hooks/use-earnings";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export function EarningsOverview() {
	const { data: user } = useLoggedInUser();
	const { data: earnings, isLoading } = useCurrentMonthEarnings(
		user?.id?.toString() || "",
	);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<DollarSign className="w-5 h-5" />
						Monthly Earnings
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-4">
						<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
						<p className="text-sm text-muted-foreground">Loading earnings...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<DollarSign className="w-5 h-5" />
					Monthly Earnings
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<div className="text-2xl font-bold text-primary">
							₹{earnings?.earnings?.toFixed(2) || "0.00"}
						</div>
						<div className="text-sm text-muted-foreground">
							{earnings?.month} {earnings?.year}
						</div>
					</div>

					<div className="flex items-center gap-2 text-sm">
						<TrendingUp className="w-4 h-4 text-green-500" />
						<span className="text-muted-foreground">Current month revenue</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PluginCardSkeleton() {
	return (
		<Card className="bg-card/60 backdrop-blur-lg border border-border/50 h-full">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<Skeleton className="w-12 h-12 rounded-lg" />
					<Skeleton className="w-12 h-4 rounded" />
				</div>

				<div className="space-y-2">
					<Skeleton className="w-3/4 h-4 rounded" />
					<Skeleton className="w-1/2 h-3 rounded" />
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="w-12 h-4 rounded" />
					<Skeleton className="w-8 h-4 rounded" />
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Skeleton className="w-8 h-3 rounded" />
						<Skeleton className="w-8 h-3 rounded" />
					</div>
					<Skeleton className="w-12 h-3 rounded" />
				</div>
			</CardContent>
		</Card>
	);
}

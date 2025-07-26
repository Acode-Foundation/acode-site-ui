import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PluginCard } from "@/components/ui/plugin-card";
import { useFeaturedPlugins } from "@/hooks/use-plugins";

export function PluginsSection() {
	const { data: featuredPlugins = [], isLoading } = useFeaturedPlugins();

	return (
		<section className="py-20 relative">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Extend with
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							powerful plugins
						</span>
					</h2>
					<p className="text-xl text-muted-foreground mb-8">
						Discover amazing plugins created by our community to supercharge
						your coding experience.
					</p>
					<Link to="/plugins">
						<Button
							variant="outline"
							size="lg"
							className="border-primary/50 hover:bg-primary/10 group"
						>
							Explore All Plugins
							<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>
				</div>

				{/* Featured Plugins Grid */}
				{isLoading ? (
					<div className="flex justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{featuredPlugins.map((plugin, index) => (
							<PluginCard key={plugin.id} plugin={plugin} index={index} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}

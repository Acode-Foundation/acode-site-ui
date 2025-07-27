import { Code, Layers, Palette, Shield, Smartphone, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
	{
		icon: Code,
		title: "Syntax Highlighting",
		description:
			"Support for 100+ programming languages with beautiful syntax highlighting and code completion.",
		color: "text-blue-500",
	},
	{
		icon: Palette,
		title: "Customizable Themes",
		description:
			"Choose from dozens of themes or create your own. Dark mode, light mode, and everything in between.",
		color: "text-purple-500",
	},
	{
		icon: Zap,
		title: "Fast & Efficient",
		description:
			"Optimized for mobile devices. Lightning-fast performance even with large files.",
		color: "text-yellow-500",
	},
	{
		icon: Layers,
		title: "Plugin System",
		description:
			"Extend functionality with powerful plugins. Auto-completion, git integration, and more.",
		color: "text-green-500",
	},
	{
		icon: Shield,
		title: "Secure Coding",
		description:
			"Built-in security features to protect your code. Local storage and encrypted connections.",
		color: "text-red-500",
	},
	{
		icon: Smartphone,
		title: "Mobile Optimized",
		description:
			"Designed specifically for touch interfaces. Gesture support and mobile-friendly UI.",
		color: "text-indigo-500",
	},
];

export function FeaturesSection() {
	return (
		<section className="py-20 relative">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Powerful features for
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							modern developers
						</span>
					</h2>
					<p className="text-xl text-muted-foreground">
						Everything you need to code efficiently on your mobile device,
						packed into a beautiful and intuitive interface.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<Card
								key={feature.title}
								className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-elegant animate-slide-up"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<CardContent className="p-6">
									<div
										className={`inline-flex p-3 rounded-lg bg-gradient-secondary/20 mb-4 group-hover:scale-110 transition-transform duration-300`}
									>
										<Icon className={`w-6 h-6 ${feature.color}`} />
									</div>
									<h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
										{feature.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}

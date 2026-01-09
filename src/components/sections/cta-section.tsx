import { ArrowRight, Download, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
	return (
		<section className="py-20 relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-primary opacity-10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center max-w-4xl mx-auto">
					{/* Main CTA */}
					<h2 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
						Ready to code
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							anywhere?
						</span>
					</h2>

					<p
						className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up"
						style={{ animationDelay: "0.2s" }}
					>
						Join thousands of developers who are already coding on the go with
						Acode. Download now and transform your mobile device into a powerful
						development environment.
					</p>

					{/* Download Buttons */}
					<div
						className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up"
						style={{ animationDelay: "0.4s" }}
					>
						<Button
							size="lg"
							className="bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group rounded-full min-w-[200px]"
						>
							<Play className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
							Get on Play Store
							<ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
						</Button>

						<Button
							variant="outline"
							size="lg"
							className="border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group rounded-full min-w-[200px]"
						>
							<Download className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
							Download F-Droid
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

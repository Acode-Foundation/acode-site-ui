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
							className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group min-w-[200px]"
						>
							<Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
							Get on Play Store
							<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
						</Button>

						<Button
							variant="outline"
							size="lg"
							className="border-border hover:bg-secondary/50 group min-w-[200px]"
						>
							<Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
							Download F-Droid
							<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
						</Button>
					</div>

					{/* Stats */}
					<div
						className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in"
						style={{ animationDelay: "0.6s" }}
					>
						<div>
							<div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
								100K+
							</div>
							<p className="text-muted-foreground">Active Users</p>
						</div>
						<div>
							<div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
								4.7★
							</div>
							<p className="text-muted-foreground">App Store Rating</p>
						</div>
						<div>
							<div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
								50+
							</div>
							<p className="text-muted-foreground">Supported Languages</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

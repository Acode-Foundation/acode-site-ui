import {
	ArrowRight,
	Code,
	Download,
	GitFork,
	Monitor,
	Play,
	Smartphone,
	Star,
} from "lucide-react";
import acodeLogoSvg from "@/assets/acode-logo.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGitHubStats } from "@/hooks/use-github-stats";

export function HeroModern() {
	const { data: githubStats, isLoading } = useGitHubStats();

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
			{/* Background Grid */}
			<div className="absolute inset-0 opacity-20">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
						backgroundSize: "50px 50px",
					}}
				></div>
			</div>

			{/* Floating Elements */}
			<div className="absolute top-20 left-10 animate-float">
				<div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
					<Code className="w-6 h-6 text-primary" />
				</div>
			</div>

			<div
				className="absolute top-32 right-16 animate-float"
				style={{ animationDelay: "2s" }}
			>
				<div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
					<Smartphone className="w-6 h-6 text-primary" />
				</div>
			</div>

			<div
				className="absolute bottom-32 left-20 animate-float"
				style={{ animationDelay: "4s" }}
			>
				<div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
					<Monitor className="w-6 h-6 text-primary" />
				</div>
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="text-center max-w-4xl mx-auto">
					{/* Main Heading */}
					<h1
						className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8 animate-slide-up"
						style={{ animationDelay: "0.2s" }}
					>
						<span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
							Code
						</span>{" "}
						anywhere,
						<br />
						anytime
					</h1>

					{/* Subtitle */}
					<p
						className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up"
						style={{ animationDelay: "0.4s" }}
					>
						A powerful, feature-rich code editor for Android. Write, edit, and
						manage your code on the go with syntax highlighting, plugins, and
						more.
					</p>

					{/* Download Buttons */}
					<div
						className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-slide-up"
						style={{ animationDelay: "0.6s" }}
					>
						<Button
							size="lg"
							className="bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg transition-all duration-300 group text-lg px-8 py-4 h-14"
						>
							<Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
							Download for Android
							<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
						</Button>

						<Button
							variant="outline"
							size="lg"
							className="border-border hover:bg-accent/10 group text-lg px-8 py-4 h-14"
						>
							<Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
							Get from F-Droid
						</Button>
					</div>

					{/* GitHub Stats */}
					<div
						className="flex justify-center space-x-8 animate-slide-up"
						style={{ animationDelay: "0.8s" }}
					>
						<div className="flex items-center space-x-2">
							<Star className="w-5 h-5 text-yellow-500" />
							<span className="font-semibold text-lg">
								{githubStats?.stars.toLocaleString() || "3,000"}
							</span>
							<span className="text-muted-foreground">stars</span>
						</div>
						<div className="flex items-center space-x-2">
							<GitFork className="w-5 h-5 text-primary" />
							<span className="font-semibold text-lg">
								{githubStats?.forks.toLocaleString() || "500"}
							</span>
							<span className="text-muted-foreground">forks</span>
						</div>
					</div>

					{/* Version Info */}
					<div
						className="mt-16 mb-4 animate-fade-in"
						style={{ animationDelay: "1s" }}
					>
						<p className="text-sm text-muted-foreground">
							Latest version: {githubStats?.latestVersion || "1.11.0"} •
							Compatible with Android 5.0+ • Trusted by 2M+ developers
						</p>
					</div>
				</div>
			</div>

			{/* Large Background Glow */}
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
		</section>
	);
}

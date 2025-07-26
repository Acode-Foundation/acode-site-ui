import { ArrowRight, Download, GitFork, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import acodeLogoSvg from "@/assets/acode-logo.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GitHubStats {
	stars: number;
	forks: number;
}

export function HeroSection() {
	const [githubStats, setGithubStats] = useState<GitHubStats>({
		stars: 2400,
		forks: 450,
	});

	// Simulated GitHub API call - you can replace with real API
	useEffect(() => {
		// This would be replaced with actual GitHub API call
		// fetch('https://api.github.com/repos/deadlyjack/Acode')
		//   .then(res => res.json())
		//   .then(data => setGithubStats({ stars: data.stargazers_count, forks: data.forks_count }))
	}, []);

	return (
		<section className="relative overflow-hidden min-h-screen flex items-center">
			{/* Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-acode-blue/20 rounded-full blur-3xl animate-float" />
				<div
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-acode-blue-light/15 rounded-full blur-3xl animate-float"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div className="text-left space-y-8">
						{/* Badge */}
						<Badge
							variant="secondary"
							className="bg-secondary/50 backdrop-blur-sm border border-border/50"
						>
							<Star className="w-3 h-3 mr-1" />
							{githubStats.stars.toLocaleString()} stars on GitHub
						</Badge>

						{/* Main Heading */}
						<h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-slide-up">
							It's time to make your{" "}
							<span className="bg-gradient-primary bg-clip-text text-transparent">
								software
							</span>
						</h1>

						{/* Subtitle */}
						<p
							className="text-xl text-muted-foreground max-w-lg animate-slide-up"
							style={{ animationDelay: "0.2s" }}
						>
							What do you want to code today? Writing, editing, debugging
							software on the go? Everything just works.
						</p>

						{/* Download Buttons */}
						<div
							className="flex flex-col sm:flex-row gap-4 animate-slide-up"
							style={{ animationDelay: "0.4s" }}
						>
							<Button
								size="lg"
								className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group text-lg px-8 py-4"
							>
								<Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
								Download
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="border-border hover:bg-secondary/20 group text-lg px-8 py-4"
							>
								<Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
								F-Droid
							</Button>
						</div>

						{/* GitHub Stats */}
						<div
							className="flex space-x-6 animate-slide-up"
							style={{ animationDelay: "0.6s" }}
						>
							<div className="flex items-center space-x-2">
								<Star className="w-4 h-4 text-yellow-500" />
								<span className="font-semibold">
									{githubStats.stars.toLocaleString()}
								</span>
								<span className="text-muted-foreground text-sm">stars</span>
							</div>
							<div className="flex items-center space-x-2">
								<GitFork className="w-4 h-4 text-primary" />
								<span className="font-semibold">
									{githubStats.forks.toLocaleString()}
								</span>
								<span className="text-muted-foreground text-sm">forks</span>
							</div>
						</div>
					</div>

					{/* Right Content - App Showcase */}
					<div
						className="relative lg:h-[600px] flex items-center justify-center animate-slide-up"
						style={{ animationDelay: "0.8s" }}
					>
						{/* Code Editor Preview */}
						<div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl max-w-lg w-full">
							<div className="flex items-center space-x-2 mb-6">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div className="w-3 h-3 rounded-full bg-green-500"></div>
								<span className="text-sm text-muted-foreground ml-4">
									main.js
								</span>
							</div>
							<div className="font-mono text-sm space-y-2">
								<div className="text-blue-400">
									import {<span className="text-yellow-400">useState</span>}{" "}
									from <span className="text-green-400">'react'</span>;
								</div>
								<div className="text-blue-400">
									import {<span className="text-yellow-400">editor</span>} from{" "}
									<span className="text-green-400">'./acode'</span>;
								</div>
								<div className="h-4"></div>
								<div className="text-purple-400">
									function <span className="text-yellow-400">App</span>() {"{"}
								</div>
								<div className="pl-4 text-blue-400">
									const [<span className="text-white">code</span>,{" "}
									<span className="text-white">setCode</span>] ={" "}
									<span className="text-yellow-400">useState</span>(
									<span className="text-green-400">&apos;&apos;</span>);
								</div>
								<div className="h-2"></div>
								<div className="pl-4 text-blue-400">return (</div>
								<div className="pl-8 text-white">
									&lt;<span className="text-red-400">CodeEditor</span>
								</div>
								<div className="pl-12 text-white">
									<span className="text-blue-400">value</span>=
									<span className="text-green-400">
										{"{"}
										{"{"}code{"}"}
									</span>
								</div>
								<div className="pl-12 text-white">
									<span className="text-blue-400">onChange</span>=
									<span className="text-green-400">
										{"{"}
										{"{"}setCode{"}"}
									</span>
								</div>
								<div className="pl-8 text-white">/&gt;</div>
								<div className="pl-4 text-white">);</div>
								<div className="text-purple-400">{"}"}</div>
							</div>
						</div>

						{/* Floating Elements */}
						<div className="absolute -top-8 -right-8 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-float">
							<div className="flex items-center space-x-2 text-sm">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="text-green-400">Syntax Check</span>
							</div>
						</div>

						<div
							className="absolute -bottom-8 -left-8 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-float"
							style={{ animationDelay: "1s" }}
						>
							<div className="flex items-center space-x-2 text-sm">
								<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
								<span className="text-blue-400">Auto Complete</span>
							</div>
						</div>
					</div>
				</div>

				{/* Version Info */}
				<div
					className="text-center mt-16 animate-fade-in"
					style={{ animationDelay: "1s" }}
				>
					<p className="text-sm text-muted-foreground">
						Latest version: 1.8.5 • Compatible with Android 5.0+ • Trusted by
						2M+ developers
					</p>
				</div>
			</div>

			{/* Animated Background Grid */}
			<div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
						backgroundSize: "30px 30px",
					}}
				></div>
			</div>
		</section>
	);
}

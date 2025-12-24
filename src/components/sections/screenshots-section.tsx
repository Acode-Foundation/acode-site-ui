import {
	Code2,
	FileText,
	Layers,
	Monitor,
	Palette,
	Play,
	Settings,
	Smartphone,
	Tablet,
	Zap,
} from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import syntaxImage from "@/assets/syntax_highlighting.jpeg"
import fileManagement from "@/assets/filemanagement.png"
import settingsImage from "@/assets/settings.jpg"
import pluginsImage from "@/assets/plugins.jpg"
import customThemeEditor from "@/assets/customThemeEditor.jpg"
import terminalImage from "@/assets/terminal.jpg"

const screenshots = [
	{
		id: 1,
		title: "Syntax Highlighting",
		description: "Beautiful syntax highlighting for all major languages",
		image: syntaxImage,
		// device: "mobile",
		type: "screenshot",
	},
	{
		id: 2,
		title: "Plugin Ecosystem",
		description: "Extend functionality with powerful plugins",
		image: pluginsImage,
		// device: "tablet",
		type: "screenshot",
	},
	{
		id: 3,
		title: "Integrated Terminal (Alpine Linux)",
		description: "Powered by Alpine Linux, with touch and mouse support.",
		image: terminalImage,
		// device: "mobile",
		type: "screenshot",
	},
	{
		id: 4,
		title: "File Management",
		description: "Intuitive file tabs and project organization",
		image: fileManagement,
		// device: "desktop",
		type: "screenshot",
	},
	{
		id: 5,
		title: "Smart Settings",
		description: "Customizable settings for your workflow",
		image: settingsImage,
		// device: "mobile",
		type: "screenshot",
	},
	{
		id: 6,
		title: "Theme Editor",
		description: "Create and customize beautiful themes",
		image: customThemeEditor,
		// device: "tablet",
		type: "screenshot",
	},
];

export function ScreenshotsSection() {
	return (
		<section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
			{/* Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Section Header */}
				<div className="text-center max-w-4xl mx-auto mb-16">
					<h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
						Experience the
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							future of mobile coding
						</span>
					</h2>
					<p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
						Powerful features, beautiful interface, and seamless workflow - all
						optimized for every device and screen size.
					</p>
				</div>

				{/* Screenshots Carousel */}
				<div className="max-w-7xl mx-auto">
					<Carousel
						className="w-full"
						opts={{
							align: "start",
							loop: true,
						}}
					>
						<CarouselContent className="-ml-2 md:-ml-4">
							{screenshots.map((screenshot) => (
								<CarouselItem
									key={screenshot.id}
									className="pl-2 md:pl-4 basis-[280px] sm:basis-[320px] md:basis-[380px] lg:basis-[400px]"
								>
									<div className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 h-full">
										<div className="aspect-[1/1] relative overflow-hidden">
											<img
												src={screenshot.image}
												alt={screenshot.title}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

											{/* Play Button Overlay for clips */}
											{screenshot.type === "clip" && (
												<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm">
														<Play className="w-6 h-6 text-white ml-1" />
													</div>
												</div>
											)}

											{/* Device Badge */}
											{/* <div className="absolute top-4 left-4"> */}
											{/* 	<div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1"> */}
											{/* 		{screenshot.device === "mobile" && ( */}
											{/* 			<Smartphone className="w-4 h-4 text-white" /> */}
											{/* 		)} */}
											{/* 		{screenshot.device === "tablet" && ( */}
											{/* 			<Tablet className="w-4 h-4 text-white" /> */}
											{/* 		)} */}
											{/* 		{screenshot.device === "desktop" && ( */}
											{/* 			<Monitor className="w-4 h-4 text-white" /> */}
											{/* 		)} */}
											{/* 		<span className="text-white text-xs font-medium capitalize"> */}
											{/* 			{screenshot.device} */}
											{/* 		</span> */}
											{/* 	</div> */}
											{/* </div> */}

											{/* Content Type Badge */}
											<div className="absolute top-4 right-4">
												<div className="flex items-center space-x-1 bg-primary/20 backdrop-blur-sm rounded-full px-2 py-1">
													{screenshot.type === "clip" ? (
														<Play className="w-3 h-3 text-primary" />
													) : (
														<FileText className="w-3 h-3 text-primary" />
													)}
													<span className="text-primary text-xs font-medium capitalize">
														{screenshot.type}
													</span>
												</div>
											</div>
										</div>

										<div className="p-6">
											<h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
												{screenshot.title}
											</h3>
											<p className="text-muted-foreground text-sm leading-relaxed">
												{screenshot.description}
											</p>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="-left-4 bg-card/80 border-border/50 hover:bg-primary hover:text-white" />
						<CarouselNext className="-right-4 bg-card/80 border-border/50 hover:bg-primary hover:text-white" />
					</Carousel>
				</div>
			</div>
		</section>
	);
}

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
	{
		id: 1,
		name: "(Anonymized)",
		role: "Mobile Developer",
		company: "TechCorp",
		content:
			"I mean, what do you expect from me. the app is amazing, as someone who creates plugins for the app it's so fun seeing people use your plugins and share comments. also I love when I see that a new plugin has been created, makes me happy that I know there's still people out there with me!",
		rating: 5,
		avatar: "/api/placeholder/60/60",
	},
	{
		id: 2,
		name: "Alex Rodriguez",
		role: "Freelance Developer",
		company: "Independent",
		content:
			"I can now code anywhere, anytime. The plugin ecosystem is incredible and the performance is surprisingly smooth for a mobile editor.",
		rating: 5,
		avatar: "/api/placeholder/60/60",
	},
	{
		id: 3,
		name: "Priya Patel",
		role: "Full Stack Developer",
		company: "StartupXYZ",
		content:
			"The live preview feature is a game changer. I can test my web apps on real devices instantly. Acode is my go-to mobile code editor.",
		rating: 5,
		avatar: "/api/placeholder/60/60",
	},
	{
		id: 4,
		name: "Marcus Johnson",
		role: "Computer Science Student",
		company: "MIT",
		content:
			"As a student, having a powerful code editor on my phone means I can practice coding during commutes. The learning experience is seamless.",
		rating: 5,
		avatar: "/api/placeholder/60/60",
	},
];

export function TestimonialsSection() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const nextTestimonial = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		setTimeout(() => setIsAnimating(false), 300);
	};

	const prevTestimonial = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length,
		);
		setTimeout(() => setIsAnimating(false), 300);
	};

	useEffect(() => {
		const interval = setInterval(nextTestimonial, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="py-20 relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/3 left-1/3 w-96 h-96 bg-acode-blue/10 rounded-full blur-3xl animate-float" />
				<div
					className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-acode-purple/10 rounded-full blur-3xl animate-float"
					style={{ animationDelay: "3s" }}
				/>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Loved by
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							{" "}
							developers worldwide
						</span>
					</h2>
					<p className="text-xl text-muted-foreground">
						See what developers are saying about their experience with Acode
					</p>
				</div>

				{/* Testimonials Carousel */}
				<div className="max-w-4xl mx-auto">
					<div className="relative">
						<Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant">
							<CardContent className="p-8 md:p-12">
								<div
									className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
								>
									{/* Quote Icon */}
									<Quote className="w-12 h-12 text-primary/30 mb-6" />

									{/* Testimonial Content */}
									<blockquote className="text-xl md:text-2xl leading-relaxed mb-8 text-foreground">
										"{testimonials[currentIndex].content}"
									</blockquote>

									{/* Author Info */}
									<div className="text-center">
										<div className="font-semibold text-lg text-foreground">
											— {testimonials[currentIndex].name}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Navigation Buttons */}
						<Button
							variant="outline"
							size="icon"
							onClick={prevTestimonial}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-card/80 backdrop-blur-sm border-border hover:bg-secondary z-10"
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>

						<Button
							variant="outline"
							size="icon"
							onClick={nextTestimonial}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card/80 backdrop-blur-sm border-border hover:bg-secondary z-10"
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>

					{/* Indicators */}
					<div className="flex justify-center space-x-2 mt-8">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => {
									if (!isAnimating) {
										setIsAnimating(true);
										setCurrentIndex(index);
										setTimeout(() => setIsAnimating(false), 300);
									}
								}}
								className={`w-3 h-3 rounded-full transition-all duration-200 ${
									index === currentIndex
										? "bg-primary scale-110"
										: "bg-muted hover:bg-muted-foreground"
								}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

import { CTASection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroModern } from "@/components/sections/hero-modern";
import { PluginsSection } from "@/components/sections/plugins-section";
import { ScreenshotsSection } from "@/components/sections/screenshots-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

const Index = () => {
	return (
		<div className="min-h-screen">
			<HeroModern />
			<FeaturesSection />
			<PluginsSection />
			<ScreenshotsSection />
			<TestimonialsSection />
			<CTASection />
		</div>
	);
};

export default Index;

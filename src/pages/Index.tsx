import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { PluginsSection } from "@/components/sections/plugins-section"
import { ScreenshotsSection } from "@/components/sections/screenshots-section"
import { CTASection } from "@/components/sections/cta-section"
import { Footer } from "@/components/ui/footer"

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PluginsSection />
      <ScreenshotsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;

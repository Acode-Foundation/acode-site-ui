import { Smartphone, Monitor, Tablet, Play, Code2, Zap } from "lucide-react"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const screenshots = [
  {
    id: 1,
    title: "Mobile Editor",
    description: "Full-featured code editor optimized for mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    device: "mobile"
  },
  {
    id: 2,
    title: "Tablet Interface",
    description: "Perfect balance of power and portability",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    device: "tablet"
  },
  {
    id: 3,
    title: "Desktop Workspace",
    description: "Professional development environment",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    device: "desktop"
  },
  {
    id: 4,
    title: "Live Preview",
    description: "Real-time code preview and testing",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    device: "desktop"
  }
]

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
            Code anywhere,
            <span className="bg-gradient-primary bg-clip-text text-transparent"> anytime</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Experience the power of professional development on any device. From quick edits on mobile to full projects on desktop.
          </p>
        </div>

        {/* Screenshots Carousel */}
        <div className="max-w-6xl mx-auto mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {screenshots.map((screenshot) => (
                <CarouselItem key={screenshot.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      
                      {/* Device Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                          {screenshot.device === 'mobile' && <Smartphone className="w-4 h-4 text-white" />}
                          {screenshot.device === 'tablet' && <Tablet className="w-4 h-4 text-white" />}
                          {screenshot.device === 'desktop' && <Monitor className="w-4 h-4 text-white" />}
                          <span className="text-white text-xs font-medium capitalize">{screenshot.device}</span>
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
            <CarouselPrevious className="left-0 bg-card/80 border-border/50 hover:bg-primary hover:text-white" />
            <CarouselNext className="right-0 bg-card/80 border-border/50 hover:bg-primary hover:text-white" />
          </Carousel>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Touch First</h3>
            <p className="text-muted-foreground leading-relaxed">
              Intuitive gestures and touch controls make mobile coding feel natural and efficient.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Adaptation</h3>
            <p className="text-muted-foreground leading-relaxed">
              UI intelligently adapts to your screen size and device capabilities for optimal workflow.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Optimized performance ensures smooth coding experience across all devices and platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
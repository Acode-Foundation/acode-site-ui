import { ArrowRight, Download, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

const featuredPlugins = [
  {
    name: "Git Manager",
    description: "Complete Git integration for mobile development",
    downloads: "50.2k",
    rating: 4.8,
    price: "Free",
    category: "Version Control",
    featured: true
  },
  {
    name: "AI Assistant",
    description: "Code completion and suggestions powered by AI",
    downloads: "32.1k",
    rating: 4.9,
    price: "$2.99",
    category: "Productivity",
    featured: true
  },
  {
    name: "Theme Studio",
    description: "Create and customize your own editor themes",
    downloads: "28.5k",
    rating: 4.7,
    price: "Free",
    category: "Customization",
    featured: true
  },
  {
    name: "Live Preview",
    description: "Real-time preview for web development",
    downloads: "45.8k",
    rating: 4.8,
    price: "$1.99",
    category: "Web Dev",
    featured: true
  }
]

export function PluginsSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Extend with
            <span className="bg-gradient-primary bg-clip-text text-transparent"> powerful plugins</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover amazing plugins created by our community to supercharge your coding experience.
          </p>
          <Link to="/plugins">
            <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10 group">
              Explore All Plugins
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Featured Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlugins.map((plugin, index) => (
            <Card 
              key={plugin.name}
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-elegant animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {plugin.name.charAt(0)}
                  </div>
                  {plugin.featured && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plugin.description}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm mb-3">
                  <Badge variant="outline" className="text-xs">
                    {plugin.category}
                  </Badge>
                  <span className={`font-medium ${plugin.price === 'Free' ? 'text-green-400' : 'text-primary'}`}>
                    {plugin.price}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{plugin.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>{plugin.downloads}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plugin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              500+
            </div>
            <p className="text-muted-foreground">Available Plugins</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              2.1M+
            </div>
            <p className="text-muted-foreground">Total Downloads</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              150+
            </div>
            <p className="text-muted-foreground">Active Developers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
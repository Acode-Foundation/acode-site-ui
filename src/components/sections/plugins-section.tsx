import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { PluginCard } from "@/components/ui/plugin-card"

const featuredPlugins = [
  {
    id: "foxdebug.gitmanager",
    icon: "https://acode.foxdebug.com/plugin-icon/foxdebug.gitmanager",
    name: "Git Manager",
    price: 2.99,
    author: "FoxDebug",
    version: "1.5.2",
    license: "GPL-3.0",
    votes_up: 67,
    downloads: 124876,
    votes_down: 5,
    author_verified: 1
  },
  {
    id: "bajrangcoder.acodex",
    icon: "https://acode.foxdebug.com/plugin-icon/bajrangcoder.acodex",
    name: "AcodeX - Terminal",
    price: 0,
    author: "Raunak Raj",
    version: "3.1.11",
    license: "MIT",
    votes_up: 28,
    downloads: 157972,
    votes_down: 3,
    author_verified: 1
  },
  {
    id: "deadlyjack.console",
    icon: "https://acode.foxdebug.com/plugin-icon/deadlyjack.console",
    name: "Console",
    price: 0,
    author: "DeadlyJack",
    version: "2.1.0",
    license: "MIT",
    votes_up: 45,
    downloads: 89532,
    votes_down: 2,
    author_verified: 1
  },
  {
    id: "theme.studio",
    icon: "https://acode.foxdebug.com/plugin-icon/theme.studio",
    name: "Theme Studio",
    price: 1.99,
    author: "ThemeStudio",
    version: "2.0.5",
    license: "MIT",
    votes_up: 32,
    downloads: 45821,
    votes_down: 1,
    author_verified: 0
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
            <PluginCard key={plugin.id} plugin={plugin} index={index} />
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
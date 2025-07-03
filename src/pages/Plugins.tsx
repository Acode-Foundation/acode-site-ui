import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Star, Download, Heart, ExternalLink, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock plugin data
const plugins = [
  {
    id: 1,
    name: "Git Manager",
    description: "Complete Git integration for mobile development with commit, push, pull, and branch management",
    author: "DevTools Team",
    downloads: "50.2k",
    rating: 4.8,
    price: "Free",
    category: "Version Control",
    keywords: ["git", "version control", "github"],
    status: "approved",
    featured: true,
    lastUpdated: "2 days ago"
  },
  {
    id: 2,
    name: "AI Assistant",
    description: "Code completion and suggestions powered by AI. Get intelligent code suggestions as you type",
    author: "AI Innovations",
    downloads: "32.1k",
    rating: 4.9,
    price: "$2.99",
    category: "Productivity",
    keywords: ["ai", "completion", "suggestions"],
    status: "approved",
    featured: true,
    lastUpdated: "1 week ago"
  },
  {
    id: 3,
    name: "Theme Studio",
    description: "Create and customize your own editor themes with live preview and export functionality",
    author: "Theme Masters",
    downloads: "28.5k",
    rating: 4.7,
    price: "Free",
    category: "Customization",
    keywords: ["theme", "colors", "customization"],
    status: "approved",
    featured: true,
    lastUpdated: "3 days ago"
  },
  {
    id: 4,
    name: "Live Preview",
    description: "Real-time preview for web development with hot reload and device synchronization",
    author: "WebDev Pro",
    downloads: "45.8k",
    rating: 4.8,
    price: "$1.99",
    category: "Web Dev",
    keywords: ["preview", "web", "html", "css"],
    status: "approved",
    featured: true,
    lastUpdated: "5 days ago"
  },
  {
    id: 5,
    name: "Code Formatter",
    description: "Format your code automatically with support for multiple languages and style guides",
    author: "Format Co",
    downloads: "38.2k",
    rating: 4.6,
    price: "Free",
    category: "Productivity",
    keywords: ["format", "beautify", "style"],
    status: "approved",
    featured: false,
    lastUpdated: "1 week ago"
  },
  {
    id: 6,
    name: "Database Explorer",
    description: "Connect and manage databases directly from your mobile editor",
    author: "DB Tools",
    downloads: "15.3k",
    rating: 4.5,
    price: "$4.99",
    category: "Database",
    keywords: ["database", "sql", "mysql"],
    status: "approved",
    featured: false,
    lastUpdated: "2 weeks ago"
  }
]

const filters = [
  { value: "all", label: "All Plugins" },
  { value: "new", label: "New" },
  { value: "most-downloaded", label: "Most Downloaded" },
  { value: "featured", label: "Featured" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" }
]

const categories = [
  "All Categories",
  "Version Control",
  "Productivity", 
  "Customization",
  "Web Dev",
  "Database",
  "Tools"
]

export default function Plugins() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = selectedFilter === "all" ||
                         (selectedFilter === "featured" && plugin.featured) ||
                         (selectedFilter === "free" && plugin.price === "Free") ||
                         (selectedFilter === "paid" && plugin.price !== "Free")
    
    const matchesCategory = selectedCategory === "All Categories" || plugin.category === selectedCategory

    return matchesSearch && matchesFilter && matchesCategory
  })

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plugin
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and install plugins to extend Acode's functionality. From Git integration to AI assistance.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Filter */}
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-background/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filters.map(filter => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPlugins.length} of {plugins.length} plugins
          </p>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Submit Plugin
          </Button>
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map((plugin, index) => (
            <Link key={plugin.id} to={`/plugins/${plugin.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card 
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-elegant cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {plugin.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {plugin.featured && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {plugin.category}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by {plugin.author}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {plugin.description}
                </p>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className={`font-medium ${plugin.price === 'Free' ? 'text-green-400' : 'text-primary'}`}>
                    {plugin.price === 'Free' ? (
                      'Free'
                    ) : (
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {plugin.price.replace('$', '')}
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground">
                    Updated {plugin.lastUpdated}
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
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="p-1 h-auto hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {filteredPlugins.length === plugins.length && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Plugins
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
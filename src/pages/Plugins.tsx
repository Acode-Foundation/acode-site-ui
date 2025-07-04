import { useState, useEffect } from "react"
import { Search, Filter, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainLayout } from "@/components/layout/main-layout"
import { PluginCard } from "@/components/ui/plugin-card"

interface Plugin {
  id: string
  sku: string
  icon: string
  name: string
  price: number
  author: string
  user_id: number
  version: string
  keywords: string
  license: string
  votes_up: number
  downloads: number
  repository: string | null
  votes_down: number
  comment_count: number
  author_verified: number
  min_version_code: number
}


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
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  // Fallback plugins in case API fails
  const fallbackPlugins: Plugin[] = [
    {
      id: "bajrangcoder.acodex",
      sku: "plugin_55610502",
      icon: "https://acode.foxdebug.com/plugin-icon/bajrangcoder.acodex",
      name: "AcodeX - Terminal",
      price: 0,
      author: "Raunak Raj",
      user_id: 2,
      version: "3.1.11",
      keywords: "[\"terminal\",\"acodex\",\"termux\"]",
      license: "MIT",
      votes_up: 28,
      downloads: 157972,
      repository: null,
      votes_down: 3,
      comment_count: 23,
      author_verified: 1,
      min_version_code: -1
    },
    {
      id: "deadlyjack.console",
      sku: "plugin_55610503",
      icon: "https://acode.foxdebug.com/plugin-icon/deadlyjack.console",
      name: "Console",
      price: 0,
      author: "DeadlyJack",
      user_id: 1,
      version: "2.1.0",
      keywords: "[\"console\",\"debug\",\"javascript\"]",
      license: "MIT",
      votes_up: 45,
      downloads: 89532,
      repository: "https://github.com/deadlyjack/console",
      votes_down: 2,
      comment_count: 15,
      author_verified: 1,
      min_version_code: -1
    },
    {
      id: "foxdebug.gitmanager",
      sku: "plugin_55610504",
      icon: "https://acode.foxdebug.com/plugin-icon/foxdebug.gitmanager",
      name: "Git Manager",
      price: 2.99,
      author: "FoxDebug",
      user_id: 3,
      version: "1.5.2",
      keywords: "[\"git\",\"version control\",\"github\"]",
      license: "GPL-3.0",
      votes_up: 67,
      downloads: 124876,
      repository: "https://github.com/foxdebug/git-manager",
      votes_down: 5,
      comment_count: 32,
      author_verified: 1,
      min_version_code: -1
    }
  ]

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const response = await fetch('https://acode.app/api/plugins')
        const data = await response.json()
        console.log(data)
        setPlugins(data)
      } catch (err) {
        setError('Failed to load plugins from API, showing fallback plugins')
        setPlugins(fallbackPlugins)
        console.error('Error fetching plugins:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlugins()
  }, [fallbackPlugins])

  const filteredPlugins = plugins.filter(plugin => {
    const keywords = JSON.parse(plugin.keywords || '[]')
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         keywords.some((keyword: string) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = selectedFilter === "all" ||
                         (selectedFilter === "new") ||
                         (selectedFilter === "most-downloaded" && plugin.downloads > 10000) ||
                         (selectedFilter === "featured" && plugin.votes_up > 20) ||
                         (selectedFilter === "free" && plugin.price === 0) ||
                         (selectedFilter === "paid" && plugin.price > 0)
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
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
        <div className="bg-card/60 backdrop-blur-lg border border-border/50 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search plugins, authors, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background/80 border-border/50 rounded-lg text-base focus:border-primary focus:ring-primary"
              />
            </div>

            {/* Filter */}
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full lg:w-48 h-12 bg-background/80 border-border/50 rounded-lg focus:border-primary focus:ring-primary">
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
          </div>
        </div>

        {/* Ads Section */}
        <div className="mb-8">
          <div className="bg-gradient-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Boost Your Productivity</h3>
            <p className="text-muted-foreground mb-4">Discover premium plugins and themes to enhance your coding experience</p>
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
              Explore Premium
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlugins.map((plugin, index) => (
            <PluginCard key={plugin.id} plugin={plugin} index={index} />
          ))}
        </div>

        {/* No Results */}
        {filteredPlugins.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No plugins found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  )
}
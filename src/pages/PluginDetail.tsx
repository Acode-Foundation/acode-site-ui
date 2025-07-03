import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Star, Download, Heart, Shield, Code, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Hardcoded plugin data
const pluginData = {
  "git-manager": {
    name: "Git Manager",
    description: "Complete Git integration for mobile development with full version control capabilities",
    longDescription: "Git Manager provides complete Git integration for Acode, allowing you to manage repositories, commit changes, create branches, and collaborate with teams directly from your mobile device. Features include visual diff viewer, merge conflict resolution, and remote repository sync.",
    downloads: "50.2k",
    rating: 4.8,
    reviews: 342,
    price: "Free",
    category: "Version Control",
    author: "deadlyjack",
    version: "2.1.4",
    license: "MIT",
    size: "2.1 MB",
    lastUpdated: "2024-01-15",
    compatibility: "Acode 1.8.0+",
    features: [
      "Full Git repository management",
      "Visual diff viewer",
      "Branch creation and switching",
      "Merge conflict resolution",
      "Remote repository sync",
      "Commit history viewer",
      "Tag management",
      "Stash support"
    ],
    changelog: [
      {
        version: "2.1.4",
        date: "2024-01-15",
        changes: [
          "Fixed merge conflict resolution",
          "Improved performance on large repositories",
          "Added support for LFS files"
        ]
      },
      {
        version: "2.1.3",
        date: "2024-01-01",
        changes: [
          "Added dark theme support",
          "Fixed authentication issues",
          "Performance improvements"
        ]
      }
    ],
    screenshots: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200"
    ]
  },
  "ai-assistant": {
    name: "AI Assistant",
    description: "Code completion and suggestions powered by AI",
    longDescription: "AI Assistant brings the power of artificial intelligence to your coding workflow. Get intelligent code completion, suggestions, and explanations as you write code.",
    downloads: "32.1k",
    rating: 4.9,
    reviews: 156,
    price: "$2.99",
    category: "Productivity",
    author: "acode-dev",
    version: "1.5.2",
    license: "Commercial",
    size: "5.2 MB",
    lastUpdated: "2024-01-20",
    compatibility: "Acode 1.8.0+",
    features: [
      "Intelligent code completion",
      "Code explanations",
      "Bug detection",
      "Refactoring suggestions",
      "Multi-language support",
      "Context-aware suggestions"
    ],
    changelog: [
      {
        version: "1.5.2",
        date: "2024-01-20",
        changes: [
          "Improved AI model accuracy",
          "Added support for TypeScript",
          "Faster response times"
        ]
      }
    ],
    screenshots: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200"
    ]
  }
}

export default function PluginDetail() {
  const { id } = useParams()
  const plugin = pluginData[id as keyof typeof pluginData]

  if (!plugin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Plugin Not Found</h1>
        <Link to="/plugins">
          <Button>Back to Plugins</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/plugins" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plugins
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              {plugin.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{plugin.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{plugin.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{plugin.rating}</span>
                  <span className="text-muted-foreground">({plugin.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{plugin.downloads} downloads</span>
                </div>
                <Badge variant="outline">{plugin.category}</Badge>
                <span className={`font-medium ${plugin.price === 'Free' ? 'text-green-400' : 'text-primary'}`}>
                  {plugin.price}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-gradient-primary hover:shadow-glow-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Install Plugin
                </Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this plugin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{plugin.longDescription}</p>
                    
                    <h4 className="font-semibold mb-3">Features</h4>
                    <ul className="space-y-2">
                      {plugin.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="changelog" className="space-y-4">
                {plugin.changelog.map((release, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Version {release.version}</CardTitle>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {release.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                            <span className="text-muted-foreground">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Reviews coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="screenshots" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plugin.screenshots.map((screenshot, index) => (
                    <Card key={index}>
                      <CardContent className="p-0">
                        <img 
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Plugin Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{plugin.version}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{plugin.size}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">{plugin.license}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compatibility</span>
                  <span className="font-medium">{plugin.compatibility}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{plugin.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Developer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {plugin.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{plugin.author}</p>
                    <p className="text-sm text-muted-foreground">Plugin Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Verified Publisher</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Scanned for Malware</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Open Source</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
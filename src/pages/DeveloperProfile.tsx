import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Github, Globe, Mail, MapPin, Calendar, Star, Download, Package, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PluginCard } from "@/components/ui/plugin-card"
import { useQuery } from "@tanstack/react-query"

interface Developer {
  id: number
  name: string
  role: string
  email: string
  github: string
  website: string
  verified: number
  threshold: number
  created_at: string
  updated_at: string
}

interface Plugin {
  id: string
  sku: string
  icon: string
  name: string
  price: number
  author: string
  user_id: number
  version: string
  keywords: string | null
  license: string
  votes_up: number
  downloads: number
  repository: string | null
  votes_down: number
  comment_count: number
  author_verified: number
  min_version_code: number
}

const fetchDeveloper = async (email: string): Promise<Developer> => {
  const response = await fetch(`https://acode.app/api/user/${email}`)
  if (!response.ok) {
    throw new Error('Developer not found')
  }
  return response.json()
}

const fetchDeveloperPlugins = async (email: string): Promise<Plugin[]> => {
  const response = await fetch(`https://acode.app/api/plugins?user=${email}`)
  if (!response.ok) {
    return []
  }
  return response.json()
}

export default function DeveloperProfile() {
  const { email } = useParams<{ email: string }>()
  
  const { data: developer, isLoading: isDeveloperLoading, error: developerError } = useQuery({
    queryKey: ['developer', email],
    queryFn: () => fetchDeveloper(email!),
    enabled: !!email,
  })

  const { data: plugins = [], isLoading: isPluginsLoading } = useQuery({
    queryKey: ['developer-plugins', email],
    queryFn: () => fetchDeveloperPlugins(email!),
    enabled: !!email,
  })

  if (isDeveloperLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading developer profile...</p>
        </div>
      </div>
    )
  }

  if (developerError || !developer) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Developer Not Found</h1>
          <p className="text-muted-foreground mb-6">The developer profile you're looking for doesn't exist.</p>
          <Link to="/plugins">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plugins
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalDownloads = plugins.reduce((sum, plugin) => sum + plugin.downloads, 0)
  const averageRating = plugins.length > 0 
    ? plugins.reduce((sum, plugin) => sum + plugin.votes_up, 0) / plugins.length 
    : 0

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/plugins">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plugins
            </Button>
          </Link>
        </div>

        {/* Developer Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {developer.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{developer.name}</h1>
                  {developer.verified === 1 && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Verified
                      </Badge>
                    </div>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {developer.role}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{developer.email}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(developer.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {developer.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={developer.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {developer.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://github.com/${developer.github}`} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${developer.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{plugins.length}</div>
              <p className="text-sm text-muted-foreground">Plugins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{Math.round(averageRating)}</div>
              <p className="text-sm text-muted-foreground">Avg Upvotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Published Plugins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Published Plugins ({plugins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPluginsLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading plugins...</p>
              </div>
            ) : plugins.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plugins.map((plugin, index) => (
                  <PluginCard key={plugin.id} plugin={plugin} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No plugins published yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Star, Download, Heart, Shield, Code, User, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown'

interface PluginData {
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
  changelogs: string
  contributors: string
  description: string
  author_email: string
  author_github: string
}

const fetchPlugin = async (pluginId: string): Promise<PluginData> => {
  const response = await fetch(`https://acode.app/api/plugin/${pluginId}`)
  if (!response.ok) {
    throw new Error('Plugin not found')
  }
  return response.json()
}

export default function PluginDetail() {
  const { id } = useParams()
  
  const { data: plugin, isLoading, error } = useQuery({
    queryKey: ['plugin', id],
    queryFn: () => fetchPlugin(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading plugin...</p>
        </div>
      </div>
    )
  }

  if (error || !plugin) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plugin Not Found</h1>
          <Link to="/plugins">
            <Button>Back to Plugins</Button>
          </Link>
        </div>
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
            {plugin.icon ? (
              <img 
                src={plugin.icon} 
                alt={plugin.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                {plugin.name.charAt(0)}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{plugin.name}</h1>
                {plugin.author_verified === 1 && (
                  <Shield className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{plugin.votes_up}</span>
                  <span className="text-muted-foreground">({plugin.comment_count} comments)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{plugin.downloads.toLocaleString()} downloads</span>
                </div>
                <Badge variant="outline">
                  {JSON.parse(plugin.keywords || '[]')[0] || 'Plugin'}
                </Badge>
                <span className={`font-medium ${plugin.price === 0 ? 'text-green-400' : 'text-primary'}`}>
                  {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-gradient-primary hover:shadow-glow-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Install Plugin
                </Button>
                {plugin.repository && (
                  <Button variant="outline" asChild>
                    <a href={plugin.repository} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Source
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this plugin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{plugin.description}</ReactMarkdown>
                    </div>
                    
                    {plugin.keywords && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(plugin.keywords || '[]').map((keyword: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="changelog" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Version {plugin.version}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{plugin.changelogs || 'No changelog available'}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
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
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">{plugin.license}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votes</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">{plugin.votes_up}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-red-500">{plugin.votes_down}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium text-sm">{plugin.sku}</span>
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
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {plugin.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{plugin.author}</p>
                    <p className="text-sm text-muted-foreground">Plugin Developer</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {plugin.author_email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${plugin.author_email}`}>
                        Contact
                      </a>
                    </Button>
                  )}
                  {plugin.author_github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://github.com/${plugin.author_github}`} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-1" />
                        GitHub
                      </a>
                    </Button>
                  )}
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
                    <div className={`w-2 h-2 rounded-full ${plugin.author_verified === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">
                      {plugin.author_verified === 1 ? 'Verified Publisher' : 'Unverified Publisher'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Scanned for Malware</span>
                  </div>
                  {plugin.repository && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Open Source</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
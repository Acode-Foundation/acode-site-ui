import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Star, Download, Heart, Shield, Code, User, ExternalLink, Github, MessageSquare, ThumbsUp, ThumbsDown, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

interface Contributor {
  name: string
  github: string
  role: string
}

interface Comment {
  id: string
  comment: string
  vote: number
  user_id: number
  plugin_id: string
  created_at: string
  updated_at: string
  author_reply: string | null
  user_name: string
}

const fetchPlugin = async (pluginId: string): Promise<PluginData> => {
  const response = await fetch(`https://acode.app/api/plugin/${pluginId}`)
  if (!response.ok) {
    throw new Error('Plugin not found')
  }
  return response.json()
}

const fetchComments = async (pluginId: string): Promise<Comment[]> => {
  const response = await fetch(`https://acode.app/api/comment/${pluginId}`)
  if (!response.ok) {
    return []
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

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => fetchComments(id!),
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

  const contributors: Contributor[] = plugin.contributors 
    ? JSON.parse(plugin.contributors || '[]')
    : []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getVoteIcon = (vote: number) => {
    if (vote === 1) return <ThumbsUp className="w-4 h-4 text-green-500" />
    if (vote === -1) return <ThumbsDown className="w-4 h-4 text-red-500" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/plugins" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plugins
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Plugin Icon */}
            <div className="flex-shrink-0">
              {plugin.icon ? (
                <img 
                  src={plugin.icon} 
                  alt={plugin.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {plugin.name.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Plugin Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{plugin.name}</h1>
                  {plugin.author_verified === 1 && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <span>by</span>
                  <Link 
                    to={`/developer/${plugin.user_id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {plugin.author}
                  </Link>
                  <span>•</span>
                  <span>v{plugin.version}</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    <span className="font-bold">{plugin.votes_up}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Upvotes</div>
                </div>
                <div className="bg-card/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-500" />
                    <span className="font-bold">{plugin.downloads.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
                <div className="bg-card/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    <span className="font-bold">{plugin.comment_count}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="bg-card/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className={`font-bold ${plugin.price === 0 ? 'text-green-400' : 'text-primary'}`}>
                      {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Price</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow-primary">
                  <Download className="w-5 h-5 mr-2" />
                  Install Plugin
                </Button>
                {plugin.repository && (
                  <Button variant="outline" size="lg" asChild>
                    <a href={plugin.repository} target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5 mr-2" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{plugin.description}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {plugin.keywords && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(plugin.keywords || '[]').map((keyword: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Reviews ({comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="border-b border-border/50 pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                                  {comment.user_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{comment.user_name || 'Anonymous'}</span>
                                  {getVoteIcon(comment.vote)}
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(comment.created_at)}
                                  </span>
                                </div>
                                {comment.comment && (
                                  <p className="text-sm">{comment.comment}</p>
                                )}
                                {comment.author_reply && (
                                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">Developer Reply</Badge>
                                    </div>
                                    <p className="text-sm">{comment.author_reply}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No reviews yet. Be the first to review this plugin!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="changelog">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Changelog - Version {plugin.version}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{plugin.changelogs || 'No changelog available for this version.'}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Contributors ({contributors.length + 1})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Main Author */}
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {plugin.author.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{plugin.author}</span>
                            <Badge variant="default" className="text-xs">Author</Badge>
                            {plugin.author_verified === 1 && (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          {plugin.author_github && (
                            <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                              <a href={`https://github.com/${plugin.author_github}`} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-1" />
                                @{plugin.author_github}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Contributors */}
                      {contributors.map((contributor, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-secondary">
                              {contributor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{contributor.name}</span>
                              <Badge variant="outline" className="text-xs">{contributor.role}</Badge>
                            </div>
                            {contributor.github && (
                              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                <a href={`https://github.com/${contributor.github}`} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4 mr-1" />
                                  @{contributor.github}
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {contributors.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No additional contributors listed.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
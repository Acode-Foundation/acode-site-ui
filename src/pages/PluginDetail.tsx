import { useParams, Link } from "react-router-dom"
import { Star, Download, Shield, Github, MessageSquare, ThumbsUp, ThumbsDown, Calendar, Users, CheckCircle, Tag, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

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

interface Review {
  id: number
  plugin_id: string
  user_id: number
  comment: string
  vote: number
  created_at: string
  updated_at: string
  author_reply: string
  name: string
  github: string
}

const fetchPlugin = async (pluginId: string): Promise<PluginData> => {
  const response = await fetch(`https://acode.app/api/plugin/${pluginId}`)
  if (!response.ok) {
    throw new Error('Plugin not found')
  }
  return response.json()
}

const fetchReviews = async (pluginId: string): Promise<Review[]> => {
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

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => fetchReviews(id!),
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
          <p className="text-muted-foreground">The plugin you're looking for doesn't exist or has been removed.</p>
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

  // GitHub Alerts component
  const GitHubAlert = ({ type, children }: { type: string; children: React.ReactNode }) => {
    const alertTypes = {
      note: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500' },
      tip: { icon: CheckCircle2, bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500' },
      important: { icon: AlertTriangle, bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' },
      warning: { icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-500' },
      caution: { icon: XCircle, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500' }
    }
    
    const alert = alertTypes[type as keyof typeof alertTypes] || alertTypes.note
    const Icon = alert.icon
    
    return (
      <div className={`p-4 rounded-lg border ${alert.bg} ${alert.border} mb-4`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 ${alert.text}`} />
          <div className="flex-1">
            <div className={`font-semibold mb-1 ${alert.text} capitalize`}>{type}</div>
            <div className="text-foreground">{children}</div>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced markdown components
  const markdownComponents = {
    // HTML elements - GitHub Alerts will be handled via preprocessing
    div: ({ children, className, ...props }: any) => {
      // Check for GitHub alert patterns in className
      if (className?.includes('markdown-alert')) {
        const type = className.split('markdown-alert-')[1] || 'note'
        return <GitHubAlert type={type}>{children}</GitHubAlert>
      }
      return <div className={className} {...props}>{children}</div>
    },
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
    img: ({ src, alt, ...props }: any) => (
      <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" {...props} />
    ),
    a: ({ href, children, ...props }: any) => (
      <a 
        href={href} 
        className="text-primary hover:underline" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    
    // Typography
    p: ({ children }: any) => {
      // Handle GitHub alerts in paragraph content
      if (typeof children === 'string' && children.includes('[!')) {
        const alertMatch = children.match(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)/)
        if (alertMatch) {
          const type = alertMatch[1].toLowerCase()
          const content = alertMatch[2]
          return <GitHubAlert type={type}>{content}</GitHubAlert>
        }
      }
      return <p className="mb-4 text-foreground leading-relaxed">{children}</p>
    },
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-semibold mb-4 text-foreground border-b border-border/50 pb-1">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-medium mb-3 text-foreground">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-medium mb-2 text-foreground">{children}</h4>,
    h5: ({ children }: any) => <h5 className="text-base font-medium mb-2 text-foreground">{children}</h5>,
    h6: ({ children }: any) => <h6 className="text-sm font-medium mb-2 text-foreground">{children}</h6>,
    
    // Lists
    ul: ({ children }: any) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    li: ({ children }: any) => <li className="text-foreground">{children}</li>,
    
    // Code
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      if (!inline && language) {
        return (
          <div className="my-4">
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              className="rounded-lg border"
              customStyle={{
                margin: 0,
                background: 'hsl(var(--muted))',
                border: '1px solid hsl(var(--border))',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        )
      }
      
      return (
        <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
    
    pre: ({ children }: any) => {
      // If it's already handled by code component, return as is
      if (children?.props?.className?.includes('language-')) {
        return children
      }
      return (
        <pre className="bg-muted p-4 rounded-lg border overflow-x-auto mb-4">
          <code className="text-sm font-mono text-foreground">{children}</code>
        </pre>
      )
    },
    
    // Blockquotes - Handle GitHub alerts here too
    blockquote: ({ children }: any) => {
      // Check if this is a GitHub alert blockquote
      const content = Array.isArray(children) ? children.join(' ') : children
      if (typeof content === 'string' && content.includes('[!')) {
        const alertMatch = content.match(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)
        if (alertMatch) {
          const type = alertMatch[1].toLowerCase()
          const alertContent = content.replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '')
          return <GitHubAlert type={type}>{alertContent}</GitHubAlert>
        }
      }
      
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 bg-muted/30 rounded-r-lg italic text-muted-foreground">
          {children}
        </blockquote>
      )
    },
    
    // Tables
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-border rounded-lg">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-muted">{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => <tr className="border-b border-border">{children}</tr>,
    th: ({ children }: any) => (
      <th className="text-left p-3 font-semibold text-foreground border-r border-border last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="p-3 text-foreground border-r border-border last:border-r-0">
        {children}
      </td>
    ),
    
    // Horizontal rule
    hr: () => <hr className="border-border my-6" />,
    
    // Emphasis
    strong: ({ children }: any) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-foreground">{children}</em>,
    del: ({ children }: any) => <del className="line-through text-muted-foreground">{children}</del>,
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          
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
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border">
                      v{plugin.version}
                    </Badge>
                    <Badge className={`${plugin.price === 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                      {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      {plugin.license}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <span>by</span>
                  <Link 
                    to={`/developer/${plugin.user_id}`}
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    {plugin.author}
                    {plugin.author_verified === 1 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </Link>
                </div>
                
                {/* Keywords */}
                {plugin.keywords && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {JSON.parse(plugin.keywords || '[]').map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-muted/30 border-muted">
                        <Tag className="w-3 h-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
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
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                    <span className="font-bold">{plugin.votes_down}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Downvotes</div>
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
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                      allowedElements={[
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'p', 'br', 'strong', 'em', 'del', 'code', 'pre',
                        'ul', 'ol', 'li', 'blockquote', 'hr',
                        'table', 'thead', 'tbody', 'tr', 'th', 'td',
                        'a', 'img', 'div', 'span'
                      ]}
                    >
                      {plugin.description}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Reviews ({reviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-border/50 pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                                  {review.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{review.name || 'Anonymous'}</span>
                                    {review.github && (
                                      <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                                        <a href={`https://github.com/${review.github}`} target="_blank" rel="noopener noreferrer">
                                          <Github className="w-3 h-3 mr-1" />
                                          @{review.github}
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                  {getVoteIcon(review.vote)}
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(review.created_at)}
                                  </span>
                                </div>
                                {review.comment ? (
                                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                                ) : (
                                  <p className="text-sm text-muted-foreground/60 italic mb-2">
                                    {review.vote === 1 ? 'Gave a thumbs up' : 'Gave a thumbs down'}
                                  </p>
                                )}
                                {review.author_reply && (
                                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Developer Reply
                                      </Badge>
                                    </div>
                                    <p className="text-sm">{review.author_reply}</p>
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
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                      allowedElements={[
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'p', 'br', 'strong', 'em', 'del', 'code', 'pre',
                        'ul', 'ol', 'li', 'blockquote', 'hr',
                        'table', 'thead', 'tbody', 'tr', 'th', 'td',
                        'a', 'img', 'div', 'span'
                      ]}
                    >
                      {plugin.changelogs || 'No changelog available for this version.'}
                    </ReactMarkdown>
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
                    <div className="space-y-3">
                      {/* Main Author */}
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                            {plugin.author.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">{plugin.author}</span>
                            <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                              Plugin Author
                            </Badge>
                            {plugin.author_verified === 1 && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {plugin.author_github && (
                              <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary" asChild>
                                <a href={`https://github.com/${plugin.author_github}`} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4 mr-1" />
                                  @{plugin.author_github}
                                </a>
                              </Button>
                            )}
                            {plugin.author_email && (
                              <span className="text-xs">Contact: {plugin.author_email}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Contributors */}
                      {contributors.length > 0 && (
                        <div className="space-y-3">
                          <Separator />
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Additional Contributors</h4>
                          {contributors.map((contributor, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-secondary font-medium">
                                  {contributor.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{contributor.name}</span>
                                  <Badge variant="outline" className="text-xs bg-muted border-muted-foreground/20">
                                    {contributor.role}
                                  </Badge>
                                </div>
                                {contributor.github && (
                                  <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary" asChild>
                                    <a href={`https://github.com/${contributor.github}`} target="_blank" rel="noopener noreferrer">
                                      <Github className="w-4 h-4 mr-1" />
                                      @{contributor.github}
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
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
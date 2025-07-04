import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ExternalLink, Github, Globe, Mail, MapPin, Calendar, Star, Download, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PluginCard } from "@/components/ui/plugin-card"

// Mock developer data
const developers = {
  "deadlyjack": {
    id: "deadlyjack",
    name: "DeadlyJack",
    email: "deadlyjack@example.com",
    avatar: "https://github.com/deadlyjack.png",
    bio: "Passionate mobile app developer focused on creating powerful tools for developers. Creator of Acode and multiple popular plugins.",
    location: "San Francisco, CA",
    website: "https://deadlyjack.dev",
    github: "https://github.com/deadlyjack",
    joinDate: "2022-01-15",
    verified: true,
    stats: {
      totalPlugins: 8,
      totalDownloads: 245680,
      averageRating: 4.7,
      followers: 1250
    }
  },
  "foxdebug": {
    id: "foxdebug", 
    name: "FoxDebug",
    email: "fox@foxdebug.com",
    avatar: "https://github.com/foxdebug.png",
    bio: "Full-stack developer and open source enthusiast. Building tools that make developers more productive.",
    location: "Berlin, Germany", 
    website: "https://foxdebug.com",
    github: "https://github.com/foxdebug",
    joinDate: "2021-11-03",
    verified: true,
    stats: {
      totalPlugins: 12,
      totalDownloads: 189432,
      averageRating: 4.5,
      followers: 890
    }
  }
}

// Mock plugins by developer
const developerPlugins = {
  "deadlyjack": [
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
      id: "deadlyjack.formatter",
      sku: "plugin_55610505",
      icon: "https://acode.foxdebug.com/plugin-icon/deadlyjack.formatter",
      name: "Code Formatter",
      price: 1.99,
      author: "DeadlyJack",
      user_id: 1,
      version: "1.5.3",
      keywords: "[\"formatter\",\"beautify\",\"code\"]",
      license: "MIT",
      votes_up: 78,
      downloads: 156148,
      repository: "https://github.com/deadlyjack/formatter",
      votes_down: 4,
      comment_count: 28,
      author_verified: 1,
      min_version_code: -1
    }
  ],
  "foxdebug": [
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
}

export default function DeveloperProfile() {
  const { username } = useParams<{ username: string }>()
  const developer = username ? developers[username as keyof typeof developers] : null
  const plugins = username ? developerPlugins[username as keyof typeof developerPlugins] || [] : []

  if (!developer) {
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
                <AvatarImage src={developer.avatar} alt={developer.name} />
                <AvatarFallback className="text-2xl">{developer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{developer.name}</h1>
                  {developer.verified && (
                    <Badge className="bg-gradient-primary">Verified</Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-4">{developer.bio}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {developer.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {developer.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(developer.joinDate).toLocaleDateString('en-US', { 
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
                      <a href={developer.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{developer.stats.totalPlugins}</div>
              <p className="text-sm text-muted-foreground">Plugins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{developer.stats.totalDownloads.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{developer.stats.averageRating}</div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div className="text-2xl font-bold">{developer.stats.followers}</div>
              <p className="text-sm text-muted-foreground">Followers</p>
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
            {plugins.length > 0 ? (
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
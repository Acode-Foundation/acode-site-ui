import { Link } from "react-router-dom"
import { Star, Download, Verified } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Plugin {
  id: string
  icon: string
  name: string
  price: number
  author: string
  version: string
  license: string
  votes_up: number
  downloads: number
  votes_down: number
  author_verified: number
  author_email?: string
}

interface PluginCardProps {
  plugin: Plugin
  index?: number
}

export function PluginCard({ plugin, index = 0 }: PluginCardProps) {
  return (
    <Link key={plugin.id} to={`/plugins/${plugin.id}`}>
      <Card 
        className="bg-card/60 backdrop-blur-lg border border-border/50 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg cursor-pointer overflow-hidden h-full"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="relative">
              <img 
                src={plugin.icon} 
                alt={plugin.name}
                className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform border border-border/20"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform border border-border/20">
                {plugin.name.charAt(0)}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              v{plugin.version}
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
              {plugin.name}
            </h3>
            <div className="flex items-center space-x-1">
              <p className="text-sm text-muted-foreground truncate">
                by <span className="text-muted-foreground group-hover:text-primary">{plugin.author}</span>
              </p>
              {plugin.author_verified === 1 && (
                <Verified className="w-3 h-3 text-primary" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className={`font-medium ${plugin.price === 0 ? 'text-green-400' : 'text-primary'}`}>
              {plugin.price === 0 ? 'Free' : `₹${plugin.price}`}
            </span>
            <Badge variant="outline" className="text-xs px-1">
              {plugin.license}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-green-400" />
                <span className="text-green-400">{plugin.votes_up}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-red-400 rotate-180" />
                <span className="text-red-400">{plugin.votes_down}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{plugin.downloads.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
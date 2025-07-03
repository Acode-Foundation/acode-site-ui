import { useState, useEffect } from "react"
import { ArrowRight, Star, GitFork, Download, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import acodeLogoSvg from "@/assets/acode-logo.svg"

interface GitHubStats {
  stars: number
  forks: number
}

export function HeroSection() {
  const [githubStats, setGithubStats] = useState<GitHubStats>({ stars: 2400, forks: 450 })

  // Simulated GitHub API call - you can replace with real API
  useEffect(() => {
    // This would be replaced with actual GitHub API call
    // fetch('https://api.github.com/repos/deadlyjack/Acode')
    //   .then(res => res.json())
    //   .then(data => setGithubStats({ stars: data.stargazers_count, forks: data.forks_count }))
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-acode-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-acode-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Badge */}
          <div className="flex justify-center mb-8">
            <img 
              src={acodeLogoSvg} 
              alt="Acode" 
              className="h-24 w-24 animate-glow"
            />
          </div>

          <Badge variant="secondary" className="mb-6 bg-secondary/50 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1" />
            {githubStats.stars.toLocaleString()} stars on GitHub
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Code
            </span>{" "}
            <span className="text-foreground">anywhere,</span>
            <br />
            <span className="text-foreground">anytime</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            A powerful, feature-rich code editor for Android. Write, edit, and manage your code on the go with syntax highlighting, plugins, and more.
          </p>

          {/* GitHub Stats */}
          <div className="flex justify-center space-x-6 mb-10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{githubStats.stars.toLocaleString()}</span>
              <span className="text-muted-foreground">stars</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
              <GitFork className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">{githubStats.forks.toLocaleString()}</span>
              <span className="text-muted-foreground">forks</span>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Get on Play Store
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="border-border hover:bg-secondary/50 group">
              <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Download F-Droid
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Version Info */}
          <p className="text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            Latest version: 1.8.5 • Compatible with Android 5.0+
          </p>
        </div>
      </div>

      {/* Code Preview Background */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <pre className="text-xs leading-relaxed p-8 font-mono">
          {`function initializeEditor() {
  const editor = new CodeEditor({
    theme: 'acode-dark',
    language: 'javascript',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    autoCompletion: true,
    syntaxHighlighting: true
  });
  
  editor.onDidChangeContent(() => {
    saveFile(editor.getValue());
  });
  
  return editor;
}`}
        </pre>
      </div>
    </section>
  )
}
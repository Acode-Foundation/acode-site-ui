import { Github, Twitter, Heart, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import acodeLogoSvg from "@/assets/acode-logo.svg"

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Plugins", href: "/plugins" },
    { name: "Documentation", href: "https://docs.acode.app", external: true },
    { name: "Changelog", href: "/changelog" }
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Community", href: "https://discord.gg/acode", external: true },
    { name: "Bug Reports", href: "https://github.com/deadlyjack/Acode/issues", external: true },
    { name: "Contact", href: "/contact" }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "License", href: "/license" }
  ]
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img src={acodeLogoSvg} alt="Acode" className="h-8 w-8" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              Acode
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 text-sm">
            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/plugins" className="text-muted-foreground hover:text-primary transition-colors">
              Plugins
            </Link>
            <a 
              href="https://docs.acode.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Docs
            </a>
            <a 
              href="https://github.com/deadlyjack/Acode" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Acode. Made with <Heart className="w-4 h-4 mx-1 text-primary inline" /> for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
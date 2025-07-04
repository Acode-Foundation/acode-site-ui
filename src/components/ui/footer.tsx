import { Github, Twitter, Heart, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import acodeLogoSvg from "@/assets/acode-logo.svg"

const footerLinks = [
  { name: "FAQ", href: "/faq" },
  { name: "Plugins", href: "/plugins" },
  { name: "Documentation", href: "https://docs.acode.app", external: true },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "GitHub", href: "https://github.com/deadlyjack/Acode", external: true },
  { name: "Discord", href: "https://discord.gg/acode", external: true }
]

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <img src={acodeLogoSvg} alt="Acode" className="h-8 w-8" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              Acode
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            {footerLinks.map((link) => (
              <div key={link.name}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-border/20 w-full">
            <p className="text-muted-foreground text-sm">
              © 2024 Acode. Made with <Heart className="w-4 h-4 mx-1 text-primary inline" /> for developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
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
    <footer className="mt-16 border-t border-border/20 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <img src={acodeLogoSvg} alt="Acode" className="h-7 w-7" />
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              Acode
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm">
            {footerLinks.map((link) => (
              <div key={link.name}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-border/20 w-full max-w-md">
            <p className="text-muted-foreground text-xs">
              © 2024 Acode. Made with <Heart className="w-3 h-3 mx-1 text-primary inline" /> for developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
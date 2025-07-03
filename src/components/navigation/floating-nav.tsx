import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"
import acodeLogoSvg from "@/assets/acode-logo.svg"

const navItems = [
  { name: "FAQ", href: "/faq" },
  { name: "Plugins", href: "/plugins" },
  { name: "Docs", href: "https://docs.acode.app", external: true },
  { name: "Login", href: "/login" },
]

export function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card/80 backdrop-blur-lg border border-border shadow-elegant"
          : "bg-card/60 backdrop-blur-md"
      )}
      style={{
        borderRadius: "var(--radius)",
        padding: "0.75rem 1.5rem",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img 
            src={acodeLogoSvg} 
            alt="Acode" 
            className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            Acode
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 hover:text-primary",
                    "relative after:absolute after:bottom-0 after:left-0 after:h-0.5",
                    "after:w-0 after:bg-gradient-primary after:transition-all after:duration-300",
                    "hover:after:w-full"
                  )}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 hover:text-primary",
                    "relative after:absolute after:bottom-0 after:left-0 after:h-0.5",
                    "after:w-0 after:bg-gradient-primary after:transition-all after:duration-300",
                    "hover:after:w-full",
                    location.pathname === item.href && "text-primary after:w-full"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 p-0 hover:bg-secondary transition-colors duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-4 pt-4 border-t border-border md:hidden">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors duration-200 hover:text-primary block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 hover:text-primary block",
                      location.pathname === item.href && "text-primary"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="justify-start h-8 px-0 hover:bg-secondary transition-colors duration-200"
            >
              <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 ml-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="ml-6">Toggle theme</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
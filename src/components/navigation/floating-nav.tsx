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
        "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 max-w-6xl w-full mx-auto px-4",
        isScrolled
          ? "bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl"
          : "bg-card/70 backdrop-blur-lg border border-border/30"
      )}
      style={{
        borderRadius: "1rem",
        padding: "1rem 2rem",
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src={acodeLogoSvg} 
            alt="Acode" 
            className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Acode
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-base font-medium transition-all duration-200 hover:text-primary px-4 py-2 rounded-lg hover:bg-secondary/10",
                    "relative"
                  )}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "text-base font-medium transition-all duration-200 hover:text-primary px-4 py-2 rounded-lg hover:bg-secondary/10",
                    "relative",
                    location.pathname === item.href && "text-primary bg-secondary/20"
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
            className="h-10 w-10 p-0 hover:bg-secondary/20 transition-colors duration-200 rounded-lg"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-6 pt-6 border-t border-border lg:hidden">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium transition-colors duration-200 hover:text-primary block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "text-base font-medium transition-colors duration-200 hover:text-primary block py-2",
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
              className="justify-start h-10 px-0 hover:bg-secondary/20 transition-colors duration-200 mt-4"
            >
              <Sun className="h-5 w-5 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 ml-7 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="ml-7">Toggle theme</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
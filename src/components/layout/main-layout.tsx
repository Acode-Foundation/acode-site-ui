import { FloatingNav } from "@/components/navigation/floating-nav"
import { Footer } from "@/components/ui/footer"
import { useLocation } from "react-router-dom"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  const isDashboardPage = ["/dashboard", "/earnings"].includes(location.pathname)
  
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <FloatingNav />
      <main className={`flex-1 ${isHomePage ? "pt-6" : isDashboardPage ? "pt-8" : "pt-12"}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
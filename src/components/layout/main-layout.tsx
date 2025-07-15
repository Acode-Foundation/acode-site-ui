import { FloatingNav } from "@/components/navigation/floating-nav"
import { Footer } from "@/components/ui/footer"
import { useLocation } from "react-router-dom"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <FloatingNav />
      <main className={`flex-1 ${isHomePage ? "pt-6" : "pt-20"}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
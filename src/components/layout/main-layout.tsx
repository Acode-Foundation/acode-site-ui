import { FloatingNav } from "@/components/navigation/floating-nav"
import { Footer } from "@/components/ui/footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <FloatingNav />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
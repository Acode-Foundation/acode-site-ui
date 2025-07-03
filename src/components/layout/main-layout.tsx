import { FloatingNav } from "@/components/navigation/floating-nav"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <FloatingNav />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
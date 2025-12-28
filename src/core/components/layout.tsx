import { Outlet } from "react-router-dom"
import Navbar from "@/core/components/navbar"
import { AuthProvider } from "@/core/hooks/useAuth"

export default function Layout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Outlet />
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-4">
            <p className="text-sm text-muted-foreground">&copy; 2025 RecipeFlow. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:underline underline-offset-4">
                Terms
              </a>
              <a href="#" className="hover:underline underline-offset-4">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/core/hooks/useAuth"
import { Button } from "@/core/components/ui/button"
import { ChefHat, LogOut, User, Utensils, Tag, Carrot } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">RecipeFlow</span>
          </Link>
          {user && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/recipes" className="transition-colors hover:text-primary">
                Recipes
              </Link>
              <Link to="/tags" className="transition-colors hover:text-primary">
                Tags
              </Link>
              <Link to="/ingredients" className="transition-colors hover:text-primary">
                Ingredients
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link to="/recipes/create">Create Recipe</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/recipes" className="flex items-center gap-2">
                      <Utensils className="w-4 h-4" /> Recipes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/tags" className="flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Tags
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/ingredients" className="flex items-center gap-2">
                      <Carrot className="w-4 h-4" /> Ingredients
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

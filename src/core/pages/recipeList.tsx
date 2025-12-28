import { useState, useEffect, useCallback } from "react"
import { useSearchParams, Link } from "react-router-dom"
import type { RecipeListItem, Tag, Ingredient } from "@/core/types"
import RecipeCard from "@/core/components/recipeCard"
import { Spinner } from "@/core/components/ui/spinner"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Badge } from "@/core/components/ui/badge"
import { Plus, Search, Filter, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/core/components/ui/sheet"
import { Checkbox } from "@/core/components/ui/checkbox"
import { Label } from "@/core/components/ui/label"
import { Separator } from "@/core/components/ui/separator"
import apiClient from "@/core/lib/apiClient"

export default function RecipesList() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>(
    searchParams
      .get("tags")
      ?.split(",")
      .map(Number)
      .filter((n) => !isNaN(n)) || [],
  )
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>(
    searchParams
      .get("ingredients")
      ?.split(",")
      .map(Number)
      .filter((n) => !isNaN(n)) || [],
  )

  const fetchFilters = async () => {
    try {
      const [tagsData, ingredientsData] = await Promise.all([
        apiClient.get<Tag[]>("/recipe/tags/?assigned_only=1"),
        apiClient.get<Ingredient[]>("/recipe/ingredients/?assigned_only=1"),
      ])
      setTags(tagsData)
      setIngredients(ingredientsData)
    } catch (error) {
      console.error("Failed to fetch filters:", error)
    }
  }

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedTags.length > 0) params.append("tags", selectedTags.join(","))
      if (selectedIngredients.length > 0) params.append("ingredients", selectedIngredients.join(","))

      const data = await apiClient.get<RecipeListItem[]>(`/recipe/recipe/?${params.toString()}`)

      // Client-side search for title (as API documentation doesn't specify a search param)
      const filteredData = searchQuery
        ? data.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : data

      setRecipes(filteredData)
    } catch (error) {
      console.error("Failed to fetch recipes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedTags, selectedIngredients, searchQuery])

  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const toggleTag = (id: number) => {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const toggleIngredient = (id: number) => {
    setSelectedIngredients((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const applyFilters = () => {
    const params: any = {}
    if (selectedTags.length > 0) params.tags = selectedTags.join(",")
    if (selectedIngredients.length > 0) params.ingredients = selectedIngredients.join(",")
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedIngredients([])
    setSearchParams({})
  }

  const activeFiltersCount = selectedTags.length + selectedIngredients.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Recipes</h1>
          <p className="text-muted-foreground mt-1">Manage and discover your culinary creations.</p>
        </div>
        <Button asChild>
          <Link to="/recipes/create">
            <Plus className="mr-2 h-4 w-4" /> Create Recipe
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes by title..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 px-1.5 py-0.5 text-[10px] min-w-[1.5rem] justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Recipes</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div>
                <h3 className="text-sm font-semibold mb-3">Tags</h3>
                <div className="space-y-2">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => toggleTag(tag.id)}
                        />
                        <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
                          {tag.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No tags found</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {ingredients.length > 0 ? (
                    ingredients.map((ing) => (
                      <div key={ing.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ing-${ing.id}`}
                          checked={selectedIngredients.includes(ing.id)}
                          onCheckedChange={() => toggleIngredient(ing.id)}
                        />
                        <Label htmlFor={`ing-${ing.id}`} className="text-sm cursor-pointer">
                          {ing.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No ingredients found</p>
                  )}
                </div>
              </div>
            </div>
            <SheetFooter className="flex-col gap-2 pt-4">
              <SheetClose asChild>
                <Button className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </SheetClose>
              <Button variant="ghost" className="w-full" onClick={clearFilters}>
                Clear All
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {(selectedTags.length > 0 || selectedIngredients.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((id) => {
            const tag = tags.find((t) => t.id === id)
            return (
              tag && (
                <Badge key={`selected-tag-${id}`} variant="secondary" className="gap-1 px-2 py-1">
                  {tag.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(id)} />
                </Badge>
              )
            )
          })}
          {selectedIngredients.map((id) => {
            const ing = ingredients.find((i) => i.id === id)
            return (
              ing && (
                <Badge key={`selected-ing-${id}`} variant="secondary" className="gap-1 px-2 py-1">
                  {ing.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleIngredient(id)} />
                </Badge>
              )
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
          <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-semibold">No recipes found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Try adjusting your search or filters, or create a new recipe to get started.
          </p>
          <Button variant="outline" className="mt-6 bg-transparent" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" /> Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper icon not imported
function Utensils(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}

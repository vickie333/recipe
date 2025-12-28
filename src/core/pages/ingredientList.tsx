import { useState, useEffect } from "react"
import type { Ingredient } from "@/core/types"
import { Spinner } from "@/core/components/ui/spinner"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/card"
import { Carrot, Edit2, Trash2, Save, X, Search } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/ui/alert-dialog"
import apiClient from "@/core/lib/apiClient"

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchIngredients = async () => {
    try {
      const data = await apiClient.get<Ingredient[]>("/recipe/ingredients/")
      setIngredients(data)
    } catch (error) {
      console.error("Failed to fetch ingredients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

  const startEditing = (ingredient: Ingredient) => {
    setEditingId(ingredient.id)
    setEditName(ingredient.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName("")
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return
    try {
      const updatedIng = await apiClient.patch<Ingredient>(`/recipe/ingredients/${id}/`, { name: editName })
      setIngredients(ingredients.map((i) => (i.id === id ? updatedIng : i)))
      setEditingId(null)
    } catch (error) {
      console.error("Failed to update ingredient:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/recipe/ingredients/${id}/`)
      setIngredients(ingredients.filter((i) => i.id !== id))
    } catch (error) {
      console.error("Failed to delete ingredient:", error)
    }
  }

  const filteredIngredients = ingredients.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Ingredients</h1>
          <p className="text-muted-foreground mt-1">Keep your pantry items and list organized.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ingredients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Carrot className="h-5 w-5 text-primary" />
            Your Pantry
          </CardTitle>
          <CardDescription>Ingredients are automatically saved when you add them to a recipe.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card transition-colors hover:bg-muted/30 group"
                >
                  {editingId === ing.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 py-0 focus-visible:ring-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleUpdate(ing.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium">{ing.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEditing(ing)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Ingredient?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{ing.name}"? This will remove it from all assigned
                                recipes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(ing.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground italic border-2 border-dashed rounded-xl">
                No ingredients found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

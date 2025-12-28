import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Recipe } from "@/core/types";
import { getImageUrl, formatTime, formatPrice } from "@/core/utils/helpers";
import { Spinner } from "@/core/components/ui/spinner";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Clock,
  DollarSign,
  ChevronLeft,
  Edit,
  Trash2,
  ExternalLink,
  UtensilsCrossed,
  TagIcon,
} from "lucide-react";
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
} from "@/core/components/ui/alert-dialog";
import apiClient from "@/core/lib/apiClient";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await apiClient.get<Recipe>(`/recipe/recipe/${id}/`);
        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
        navigate("/recipes");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/recipe/recipe/${id}/`);
      navigate("/recipes");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        className="pl-0 hover:bg-transparent"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to recipes
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-muted border shadow-sm">
            <img
              src={recipe.image ? getImageUrl(recipe.image) : ""}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                  Time
                </p>
                <p className="font-semibold">
                  {formatTime(recipe.time_minutes)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                  Price
                </p>
                <p className="font-semibold">{formatPrice(recipe.price)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {recipe.title}
              </h1>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/recipes/${id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your recipe and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete Recipe"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {recipe.link && (
              <a
                href={recipe.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline font-medium"
              >
                View original source <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <TagIcon className="mr-2 h-4 w-4" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.length > 0 ? (
                  recipe.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No tags assigned
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <UtensilsCrossed className="mr-2 h-4 w-4" /> Ingredients
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm border"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {ing.name}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic col-span-2">
                    No ingredients listed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t">
        <h3 className="text-xl font-bold mb-4">Description & Instructions</h3>
        <div className="prose prose-orange max-w-none">
          {recipe.description ? (
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {recipe.description}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided for this recipe.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

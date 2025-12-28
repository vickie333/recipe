import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Recipe } from "@/core/types";
import { recipesService } from "@/core/services/recipes.service";
import { Spinner } from "@/core/components/ui/spinner";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Plus, Trash2, Upload, ChevronLeft, Save } from "lucide-react";
import { getImageUrl } from "@/core/utils/helpers";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(1000).optional(),
  time_minutes: z.coerce.number().min(1, "Must be at least 1 minute"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  tags: z.array(z.object({ name: z.string().min(1, "Tag name required") })),
  ingredients: z.array(
    z.object({ name: z.string().min(1, "Ingredient name required") })
  ),
  image: z.string().nullable().optional(),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export default function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      tags: [],
      ingredients: [],
      image: null,
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        try {
          const data = await recipesService.getById(Number(id));
          reset({
            title: data.title,
            description: data.description || "",
            time_minutes: data.time_minutes,
            price: data.price,
            link: data.link || "",
            tags: data.tags.map((t) => ({ name: t.name })),
            ingredients: data.ingredients.map((i) => ({ name: i.name })),
            image: data.image,
          });
          if (data.image) {
            setImagePreview(getImageUrl(data.image) || null);
          }
        } catch (err: any) {
          setError("Failed to load recipe details");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id, isEditMode, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: RecipeFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let recipeId: number;

      // Preparar payload con todos los datos del formulario
      const payload: any = {
        title: formData.title,
        description: formData.description,
        time_minutes: formData.time_minutes,
        price: formData.price,
        link: formData.link,
        tags: formData.tags,
        ingredients: formData.ingredients,
      };

      // Si hay un archivo de imagen, agregarlo al payload
      if (imageFile) {
        payload.image_file = imageFile;
      } else if (formData.image) {
        // Si no hay archivo nuevo pero hay una imagen existente, mantenerla
        payload.image = formData.image;
      }

      if (isEditMode) {
        const response = await recipesService.update(Number(id), payload);
        recipeId = response.id;
      } else {
        const response = await recipesService.create(payload);
        recipeId = response.id;
      }

      navigate(`/recipes/${recipeId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="pl-0 hover:bg-transparent"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? "Edit Recipe" : "New Recipe"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Start with the essential details of your dish.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Recipe Title</label>
                <Input
                  placeholder="e.g. Grandma's Famous Lasagna"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Preparation Time (minutes)
                </label>
                <Input type="number" {...register("time_minutes")} />
                {errors.time_minutes && (
                  <p className="text-xs text-destructive">
                    {errors.time_minutes.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Estimated Price ($)
                </label>
                <Input placeholder="15.50" {...register("price")} />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  External Link (optional)
                </label>
                <Input
                  placeholder="https://example.com/recipe"
                  {...register("link")}
                />
                {errors.link && (
                  <p className="text-xs text-destructive">
                    {errors.link.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipe Media</CardTitle>
            <CardDescription>
              Add a high-quality photo to make your recipe stand out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative group aspect-video w-full max-w-md rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground opacity-20" />
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Change Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredients & Tags</CardTitle>
            <CardDescription>
              List what you need and how to categorize this recipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Ingredients</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendIngredient({ name: "" })}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g. 2 Eggs"
                        {...register(`ingredients.${index}.name`)}
                      />
                      {errors.ingredients?.[index]?.name && (
                        <p className="text-[10px] text-destructive mt-1">
                          {errors.ingredients[index].name?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {ingredientFields.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/30 rounded-lg">
                  No ingredients added yet.
                </p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Tags</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTag({ name: "" })}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {tagFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md border"
                  >
                    <Input
                      className="h-7 w-24 text-xs p-0 focus-visible:ring-0 border-none bg-transparent"
                      placeholder="Tag"
                      {...register(`tags.${index}.name`)}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeTag(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {tagFields.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/30 rounded-lg">
                  No tags added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Explain how to prepare this delicious dish.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Step 1: Boil water... Step 2: Mix ingredients..."
              className="min-h-[200px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />{" "}
                {isEditMode ? "Update Recipe" : "Save Recipe"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

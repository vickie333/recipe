"use client";

import { useState, useEffect } from "react";
import apiClient from "@/core/lib/apiClient";
import type { Tag } from "@/core/types";
import { Spinner } from "@/core/components/ui/spinner";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/core/components/ui/card";
import { TagIcon, Edit2, Trash2, Save, X, Search } from "lucide-react";
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

export default function TagsList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTags = async () => {
    try {
      const data = await apiClient.get<Tag[]>("/recipe/tags/");
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      const updatedTag = await apiClient.patch<Tag>(`/recipe/tags/${id}/`, {
        name: editName,
      });
      setTags(tags.map((t) => (t.id === id ? updatedTag : t)));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/recipe/tags/${id}/`);
      setTags(tags.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Tags</h1>
          <p className="text-muted-foreground mt-1">
            Organize and refine your recipe categories.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-primary" />
            Your Tags
          </CardTitle>
          <CardDescription>
            Note: Tags are created automatically when you add them to a recipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card transition-colors hover:bg-muted/30 group"
                >
                  {editingId === tag.id ? (
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
                        onClick={() => handleUpdate(tag.id)}
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
                      <span className="text-sm font-medium">{tag.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => startEditing(tag)}
                        >
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
                              <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{tag.name}"?
                                This will remove it from all assigned recipes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(tag.id)}
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
                No tags found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

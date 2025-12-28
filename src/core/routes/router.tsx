import { createBrowserRouter, Navigate } from "react-router-dom"
import Profile from "@/core/pages/profile"
import RecipeDetails from "@/core/pages/recipeDetail"
import { PrivateRoutes } from "@/core/routes/privateRoutes"
import Recipes from "@/core/pages/recipeList"
import Layout from "@/core/components/layout"
import Login from "@/core/pages/login"
import Register from "@/core/pages/register"
import RecipeForm from "@/core/pages/recipeForm"
import TagsList from "@/core/pages/tagsList"
import IngredientList from "@/core/pages/ingredientList"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/recipes" replace /> },
      { path: "recipes", element: <PrivateRoutes><Recipes /></PrivateRoutes> },
      { path: "recipes/create", element: <PrivateRoutes><RecipeForm /></PrivateRoutes> },
      { path: "recipes/:id", element: <PrivateRoutes><RecipeDetails /></PrivateRoutes> },
      { path: "recipes/:id/edit", element: <PrivateRoutes><RecipeForm /></PrivateRoutes> },
      { path: "tags", element: <PrivateRoutes><TagsList /></PrivateRoutes> },
      { path: "ingredients", element: <PrivateRoutes><IngredientList /></PrivateRoutes> },
      { path: "profile", element: <PrivateRoutes><Profile /></PrivateRoutes> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ],
  }
]);
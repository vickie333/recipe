export interface User {
  email: string
  name: string
}

export interface Tag {
  id: number
  name: string
}

export interface Ingredient {
  id: number
  name: string
}

export interface Recipe {
  id: number
  title: string
  description?: string
  time_minutes: number
  price: string
  link?: string
  image: string | null
  tags: Tag[]
  ingredients: Ingredient[]
}

export interface AuthResponse {
  token: string
}

export interface Props {
  children: React.ReactNode
}

export interface RecipeListItem {
  id: number
  title: string
  description?: string
  time_minutes: number
  price: string
  link?: string
  image: string | null
}
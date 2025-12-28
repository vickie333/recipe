import { Link } from "react-router-dom"
import type { RecipeListItem } from "@/core/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Clock, DollarSign, ExternalLink } from "lucide-react"
import { getImageUrl, formatPrice, formatTime } from "@/core/utils/helpers"

interface RecipeCardProps {
  recipe: RecipeListItem
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <Link to={`/recipes/${recipe.id}`} className="block">
        <div className="aspect-video w-full overflow-hidden bg-muted relative">
          <img
            src={recipe.image ? getImageUrl(recipe.image) : ""}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Clock className="mr-1 h-3 w-3" />
              {formatTime(recipe.time_minutes)}
            </Badge>
          </div>
        </div>
      </Link>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/recipes/${recipe.id}`} className="hover:text-primary transition-colors">
            <h3 className="text-lg font-bold leading-tight line-clamp-2">{recipe.title}</h3>
          </Link>
          {recipe.link && (
            <a
              href={recipe.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag.name}
            </Badge>
          ))}
          {recipe.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{recipe.tags.length - 3}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t bg-muted/30">
        <div className="flex items-center text-sm font-medium text-primary">
          <DollarSign className="h-4 w-4" />
          {formatPrice(recipe.price)}
        </div>
        <Link
          to={`/recipes/${recipe.id}`}
          className="text-xs font-semibold text-muted-foreground hover:text-primary uppercase tracking-wider"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}

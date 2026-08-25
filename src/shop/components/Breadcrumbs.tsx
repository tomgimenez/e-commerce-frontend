import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

export interface BreadcrumbItem {
  label: string;
  to?: string; // si no tiene `to`, se renderiza como texto (último nivel)
}

interface Props {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({items}: Props) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
      <Link to="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </span>
      ))}
    </nav>
  )
}
import { CustomLogo } from '@/components/custom/CustomLogo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Users, 
  BarChart3, 
  Settings,  
  ShoppingCart, 
  ChevronLeft,
  LayoutDashboard,
  Menu,
  BookOpen,
  FolderTree,
  CreditCard,
  Boxes
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

export const AdminSidebar = () => {

  const { pathname } = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: BookOpen },
    { name: "Product Types", href: "/admin/product-types", icon: Boxes },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Subscription", href: "/admin/subscription", icon: CreditCard },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const isActiveRoute = (to: string) => {
    return pathname === to;
  }

  return (
    <>

      {/* Botón mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label='menu'
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: colapsa el ancho
          sidebarCollapsed ? "lg:w-18" : "lg:w-64",
          // Mobile siempre ancho completo
          "w-64"
        )}
        aria-label="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            {/* Mobile: siempre mostrar | Desktop: solo si no está colapsado */}
            <CustomLogo 
              subtitle='Admin Panel' 
              to='/admin' 
              shouldShow={!sidebarCollapsed}
            />
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href || '#'}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {/* Texto oculto si está colapsado (solo desktop) */}
                <span className={cn("lg:block", sidebarCollapsed ? "lg:hidden" : "")}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              to="/"
              onClick={() => {
                setSidebarCollapsed(false);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className={cn(sidebarCollapsed ? "lg:hidden" : "")}>
                Back to Store
              </span>
            </Link>
          </div>

        </div>

      </aside>
    </>
  );
};

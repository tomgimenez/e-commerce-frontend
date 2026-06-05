import { useAuthStore } from '@/auth/store/auth.store';
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
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

export const AdminSidebar = () => {

  const { pathname } = useLocation();
  const { user } = useAuthStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: BookOpen },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "", icon: ShoppingCart },
    { name: "Customers", href: "", icon: Users },
    { name: "Analytics", href: "", icon: BarChart3 },
    { name: "Settings", href: "", icon: Settings },
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
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 bg-card",
          // Mobile: entra/sale con slide basado en mobileMenuOpen
          "lg:relative lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: colapsa el ancho
          sidebarCollapsed ? "lg:w-18" : "lg:w-64",
          // Mobile siempre ancho completo
          "w-64"
        )}
        aria-label="sidebar"
      >

        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {/* Mobile: siempre mostrar | Desktop: solo si no está colapsado */}
          <CustomLogo 
            subtitle='Admin Panel' 
            to='/admin' 
            shouldShow={!sidebarCollapsed}
          />
          {/* Desktop: colapsa | Mobile: cierra */}
          <Button
            variant="ghost"
            aria-label='Collapse sidebar'
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileMenuOpen(false);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
          >
            {window.innerWidth < 1024 ? <ChevronLeft size={20} /> : (sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)}
          </Button>
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

        {!sidebarCollapsed && !mobileMenuOpen && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center font-semibold">
                {
                  !user
                    ? `JD`
                    : `${user.name.substring(0, 1)}${user.lastname.substring(0, 1)}`
                }
              </div>
              <div className="flex-1 min-w-0 text-muted-foreground hover:text-foreground">
                <p className="text-sm font-medium truncate">{
                  !user
                    ? `John Doe`
                    : `${user.name} ${user.lastname}`
                  }</p>
                <p className="text-xs truncate">{
                  !user
                  ? `john@company.com`
                  : user.email
                }</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

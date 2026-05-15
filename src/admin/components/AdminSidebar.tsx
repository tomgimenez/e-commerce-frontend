// import { useAuthStore } from '@/auth/store/auth.store';
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
  FolderTree
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

// interface Props {
//   isCollapsed: boolean;
//   onToggle: () => void;
// }

export const AdminSidebar = (/* { isCollapsed, onToggle }: Props */) => {

  const { pathname } = useLocation();
  // const { user } = useAuthStore();

  // TODO: EXTERNO
  const [mobileOpen, setMobileOpen] = useState(false)

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
    // <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
    //   isCollapsed ? 'w-18' : 'w-64'
    // } flex flex-col`}>
    //   {/* Header */}
    //   <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        // {!isCollapsed && <CustomLogo />}
        // <button
        //   onClick={onToggle}
        //   className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        // >
        //   {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        // </button>
    //   </div>

    //   {/* Navigation */}
    //   <nav className="flex-1 p-4">
    //     <ul className="space-y-2">
    //       {menuItems.map((item, index) => {
    //         const Icon = item.icon;
    //         return (
    //           <li key={index}>
    //             <Link
    //               to={item.to || '/admin'}
    //               className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
    //                 isActiveRoute(item.to || 'xxxx')
    //                   ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
    //                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    //               }`}
    //             >
    //               <Icon size={20} className="shrink-0" />
    //               {!isCollapsed && (
    //                 <span className="font-medium">{item.label}</span>
    //               )}
    //             </Link>
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   </nav>

    //   {/* User Profile */}
    //   {!isCollapsed && (
    //     <div className="p-4 border-t border-gray-200">
    //       <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
    //         <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
    //           {
    //             !user
    //               ? `JD`
    //               : user.fullName.substring(0, 2)
    //           }
    //         </div>
    //         <div className="flex-1 min-w-0">
    //           <p className="text-sm font-medium text-gray-900 truncate">{
    //             !user
    //               ? `John Doe`
    //               : user.fullName
    //             }</p>
    //           <p className="text-xs text-gray-500 truncate">{
    //             !user
    //             ? `john@company.com`
    //             : user.email
    //           }</p>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <CustomLogo to="/admin" subtitle='Admin Panel' />

                        <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              return (
                
                <Link
                  key={item.name}
                  to={item.href.length > 0 ? item.href : '#'}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActiveRoute(item.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Store
            </Link>
          </div>
        </div>
      </aside>
    </>


  );
};

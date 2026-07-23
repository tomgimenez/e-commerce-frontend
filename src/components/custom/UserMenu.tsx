import { useAuthStore } from "@/auth/store/auth.store";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, LayoutDashboard, LogOut, MapPin, Package, User, UserCircle } from "lucide-react";
import { Link } from "react-router";

const userMenuItems = [
  { label: "My Profile", href: "/user/profile", icon: UserCircle },
  { label: "My Orders", href: "/user/orders", icon: Package },
  { label: "My Addresses", href: "/user/address", icon: MapPin },
  { label: "Favorites", href: "/user/favorites", icon: Heart },
];

export const UserMenu = () => {

  const isAdmin = useAuthStore(state => state.isAdmin());
  const logout = useAuthStore(state => state.logout);
  const user  = useAuthStore(state => state.user);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <User className="h-5 w-5" />
          <span className="sr-only">Account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{user?.name} {user?.lastname}</span>
            <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} className="cursor-pointer">
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground focus:text-foreground flex items-center w-full h-full"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          })}

          {
            isAdmin && (
              <>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="bg-primary/10 cursor-pointer">
                  <Link
                    to="/admin"
                    className="text-primary focus:bg-primary/20 focus:text-primary flex items-center w-full h-full"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              </>
            )
          }

          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="cursor-pointer text-destructive hover:bg-transparent hover:text-destructive focus:text-destructive w-full h-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

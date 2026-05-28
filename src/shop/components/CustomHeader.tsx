import { useRef, useState, type KeyboardEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronDown, Gauge, LogOut, Search, ShoppingCart, User, X } from "lucide-react";

import { useAuthStore } from "@/auth/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";

export const CustomHeader = () => {

  const [ searchParams, setSearchParams ] = useSearchParams();

  const { authStatus, isAdmin, logout } = useAuthStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: categories } = useCategories();

  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || '';

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = inputRef.current?.value;
    const newSearchParams = new URLSearchParams();

    if (!query) {
      newSearchParams.delete('query');
    } else {
      newSearchParams.set('query', query);
    }

    setSearchParams(newSearchParams);
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      searchParams.delete('query');
    }
  };

  const cartCount = 3; // Placeholder for cart item count
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">

        {/* Logo */}
        <CustomLogo />

        {/* Search Bar - Desktop */}
        <div className="relative flex-1 max-w-xl hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
          ref={inputRef}
            type="search"
            placeholder="Search for enchanted tomes..."
            className="w-full pl-10 bg-secondary border-border placeholder:text-muted-foreground focus-visible:ring-primary"
            defaultValue={query}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Mobile Search Expanded */}
        {isSearchOpen && (
          <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center gap-2 bg-background px-4 md:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search for enchanted tomes..."
                className="w-full pl-10 bg-secondary border-border placeholder:text-muted-foreground focus-visible:ring-primary"
                defaultValue={query}
                onKeyDown={handleSearch}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchToggle}
              className="shrink-0 text-foreground hover:bg-secondary hover:text-primary"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSearchToggle}
            className="md:hidden text-foreground hover:bg-secondary hover:text-primary"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Login Button */}
          {
            authStatus === 'not-authenticated' ? (
              <Link to='/auth/login'>
                <Button
                  variant="outline"
                  className="text-foreground hover:bg-secondary hover:text-primary md:h-8 md:w-auto md:px-3"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">Login</span>
                </Button>

              </Link>
            ) : (

              <Button
                  variant="outline"
                  className="text-foreground hover:bg-secondary hover:text-primary md:h-8 md:w-auto md:px-3"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
            )
          }

          {/* Admin Button */}
          {
            isAdmin() && (
              <Link to='/admin'>
                <Button
                  variant='default'
                  className='md:h-8 md:w-auto md:px-3'
                >
                  <Gauge className="h-5 w-5" />
                  <span className="hidden md:inline">Admin</span>
                </Button>
              </Link>
            )
          }

          {/* Cart Button */}
          <Link to={'/checkout'}>
            <Button
              variant="outline"
              className="relative border-border text-foreground hover:bg-secondary hover:text-primary md:h-8 md:w-auto md:px-3"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

      </div>

      {/* Navigation Bar */}
      <nav>
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 h-10 text-sm">
            {/* Categories Dropdown */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="flex items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                    Categories
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-card border-border">
                  {categories?.map((category) => (
                    <DropdownMenuItem key={category.id}>
                      <Link
                        to='#'
                        className="cursor-pointer text-secondary-foreground hover:text-foreground focus:text-foreground"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            {/* Offers */}
            <li>
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                Offers
              </Link>
            </li>

            {/* Help */}
            <li>
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                Help
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

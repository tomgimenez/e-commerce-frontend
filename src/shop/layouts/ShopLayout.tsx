import { Outlet } from "react-router"
import { CustomHeader } from "../components/header/CustomHeader"
import { CustomFooter } from "../components/CustomFooter"
import { CartDrawer } from "../components/cart/CartDrawer"
import { useCartStore } from "../store/cart.store"

export const ShopLayout = () => {

  const { lastAdded, isDrawerOpen, closeDrawer } = useCartStore();

  return (
    <div className="min-h-screen bg-background">

      <CustomHeader />

      <main className="container mx-auto px-4 py-8">

        <Outlet />

      </main>

      <CustomFooter />

      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} lastAdded={lastAdded}  />

    </div>
  )
}

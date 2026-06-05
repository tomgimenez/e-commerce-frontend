import { Outlet } from "react-router"
import { CustomHeader } from "../components/header/CustomHeader"
import { CustomFooter } from "../components/CustomFooter"

export const ShopLayout = () => {
  return (
    <div className="min-h-screen bg-background">

      <CustomHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 md:gap-8 flex-col md:flex-row">

          <Outlet />

        </div>
      </main>

      <CustomFooter />
    </div>
  )
}

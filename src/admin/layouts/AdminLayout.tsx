import { Outlet } from "react-router";

import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";


const AdminLayout = () => {

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="lg:pl-64">
        <AdminHeader />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )

}

export default AdminLayout;

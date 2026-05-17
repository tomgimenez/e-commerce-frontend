import { Outlet } from "react-router";

import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";


const AdminLayout = () => {

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )

}

export default AdminLayout;

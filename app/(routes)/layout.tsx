import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const LayoutDashboard = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="flex w-full">
      {/* <div className="hidden xl:block w-80 h-full xl:fixed overflow-x-auto">
         <Sidebar /> 
      </div>*/}
      <div
        className="w-full  overflow-x-hidden overflow-y-hidden 
        "
      >
        
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <Navbar />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default LayoutDashboard;

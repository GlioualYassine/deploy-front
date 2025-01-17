import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";

const LayoutDashboard = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="flex w-full">
      <div className="hidden xl:block w-80 h-full xl:fixed overflow-x-auto">
        <Sidebar />
      </div>
      <div className="w-full xl:ml-80  overflow-x-hidden overflow-y-hidden 
        ">
        <Navbar />
        <div className="p-6  bg-[#fafbfc] dark:bg-secondary   ">{children}</div>
      </div>
    </div>
  );
};

export default LayoutDashboard;

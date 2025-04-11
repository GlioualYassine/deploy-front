"use client";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";
import { usePathname } from "next/navigation";

const LayoutDashboard = ({ children }: { children: React.ReactElement }) => {
  // find route active

  const pathname = usePathname();
  const activePath = pathname === "/";

  return (
    <div className="flex w-full " >
      {!activePath && (
        <div className="hidden xl:block w-80 h-full xl:fixed overflow-x-auto" style={{ backgroundColor: "#264773" , color: "#fff"}}>
          <Sidebar />
        </div>
      )}
      <div
        className="w-full xl:ml-80  overflow-x-hidden overflow-y-hidden 
        "
      >
        {!activePath && <Navbar />}
        <div className="p-6  bg-[#fafbfc] dark:bg-secondary   ">{children}</div>
      </div>
    </div>
  );
};

export default LayoutDashboard;

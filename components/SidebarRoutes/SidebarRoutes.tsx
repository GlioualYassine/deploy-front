"use client";
import {
  dataGeneralSidebar,
  dataSupportSidebar,
  dataToolsSidebar,
} from "@/components/SidebarRoutes/SidebarRoutes.data";
import SidebarItem from "@/components/SidebarItem/SidebarItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchAuthData } from "@/servises/auth";

const SidebarRoutes = () => {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.role === "" || user.role === undefined || user.role === null) {
      dispatch(fetchAuthData());
    }
  }, []);

  let GeneralSidebar =
    user.role === "ROLE_GENERAL_ADMIN"
      ? dataGeneralSidebar
      : dataGeneralSidebar.filter(
          (item) => item.label != "Utilisateurs" && item.label != "Entreprises"
        );

  return (
    <div className="flex flex-col mt-2 justify-between h-full">
      <div>
        <div className="p-2 md:p-6">
          <p className="text-slate-500 mb-2">GENERAL</p>
          {GeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className="p-2 md:p-6">
          <p className="text-slate-500 mb-2">TOOLS</p>
          {dataToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        {/* <div className="p-2 md:p-6">
            <p className="text-slate-500 mb-2">SUPPORT</p>
            {dataSupportSidebar.map((item)=>(
              <SidebarItem key={item.label} item={item}/>
            ))}
          </div> */}
      </div>
      <div>
        <Separator />
        <footer className=" p-3 text-center">
          ©2024 Ramycan ,Created by NOSTRUM
        </footer>
      </div>
    </div>
  );
};

export default SidebarRoutes;

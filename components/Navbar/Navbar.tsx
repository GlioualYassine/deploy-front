"use client";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import SidebarRoutes from "../SidebarRoutes/SidebarRoutes";
import { ModeToggle } from "../ToggleTheme";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import Notification from "./Notification";
import Logo from '../Logo/Logo'

const Navbar = () => {
  const [userFromLocalStorage, setUserFromLocalStorage] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user) {
      setUserFromLocalStorage(JSON.parse(user));
    }
    if (token) {
      setToken(token);
    }
  }, []); // Exécute uniquement lors du premier montage

  return (
    <div className="flex items-center px-2 gap-4 md:px-6 justify-between w-full bg-background border-b h-20">
      <div className="block hidden ">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <Logo />
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative w-[300px]">
        <Input placeholder="Search ..." className="rounded-lg " />
        <Search strokeWidth={1} className="absolute top-2 right-2" />
      </div>
      <div className="flex gap-x-3 items-center">
        {userFromLocalStorage && token && (
          <Notification userFromLocalStorage={userFromLocalStorage} token={token} />
        )}
        <ModeToggle />
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;

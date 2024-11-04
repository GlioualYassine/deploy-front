import Logo from "@/components/Logo/Logo";
import React from "react";

const layoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center h-full items-center">
      <Logo />
      {/* <h1 className="text-3xl my-2">Welcome to my Dahboard!</h1>
      <h2 className="text-2xl mb-3">Geolocation</h2> */}
      {children}
    </div>
  );
};

export default layoutAuth;

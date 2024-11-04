"use client";

import dynamic from "next/dynamic";
import "./globals.scss";

const MapsApp = dynamic(() => import("./Components/MapsApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className=" w-full h-[84.5vh]">
      <MapsApp />
    </main>
  );
}

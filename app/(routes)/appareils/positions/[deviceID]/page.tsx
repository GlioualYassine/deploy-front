"use client";

import dynamic from "next/dynamic";
import "./globals.scss";

const MapsApp = dynamic(() => import("./Components/MapsApp"), {
  ssr: false,
});

export default function Home({ params }: { params: {deviceID: string } }) {
  return (
    <main className=" w-full h-[84.5vh]">
      
      <MapsApp imei={params.deviceID} />
    </main>
  );
}

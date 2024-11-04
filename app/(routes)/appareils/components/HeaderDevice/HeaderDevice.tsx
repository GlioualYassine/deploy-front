"use client";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { useState } from "react";

const HeaderDevice = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl">Liste des Appareil GPS</h2>
      <Link href="/appareils/create">
        <Button>Ajouter un appareil</Button>
      </Link>
    </div>
  );
};

export default HeaderDevice;

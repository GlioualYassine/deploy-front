"use client";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { useState } from "react";
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";

const HeaderDevice = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const user = useSelector(selectUser);
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl">Liste des Appareil GPS</h2>
      {user.role === "ROLE_GENERAL_ADMIN" && (
        <Link href="/appareils/create">
          <Button>Ajouter un appareil</Button>
        </Link>
      )}
    </div>
  );
};

export default HeaderDevice;

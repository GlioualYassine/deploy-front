"use client";
import React from "react";
import List from "./components/list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
const Companie = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List of companies</h2>
        {user.role === "ROLE_GENERAL_ADMIN" && ( <Link href="companies/create">
          <Button>Créer une entreprise</Button>
        </Link>)}
      </div>
      <List />
    </div>
  );
};

export default Companie;

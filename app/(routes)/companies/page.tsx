"use client";
import React from "react";
import List from "./components/list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Companie = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List of companies</h2>
        <Link href="companies/create">
          <Button>Créer une entreprise</Button>
        </Link>
      </div>
      <List />
    </div>
  );
};

export default Companie;

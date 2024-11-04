"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import FormCreateAutomobile from "../FormCreateAutomobile/FormCreateAutomobile";

const HeaderAutomobiles = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl">Liste des Automobiles</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Créer Automobile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Créer Automobile</DialogTitle>
            <DialogDescription>
              Créer et configurer votre Automobile
            </DialogDescription>
          </DialogHeader>
          <FormCreateAutomobile setOPenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeaderAutomobiles;

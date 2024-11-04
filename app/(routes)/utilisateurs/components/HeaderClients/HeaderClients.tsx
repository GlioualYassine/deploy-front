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
import FormCreateAutomobile from "../FormCreateClient/FormCreateClient";

const HeaderClients = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex justify-between items-center ">
      <h2 className="text-2xl">Liste des Clients</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Créer Client</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-1/2">
          <DialogHeader>
            <DialogTitle>Créer Client</DialogTitle>
            <DialogDescription>
              Créer et configurer un nouveau Client
            </DialogDescription>
          </DialogHeader>
          <FormCreateAutomobile setOPenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeaderClients;

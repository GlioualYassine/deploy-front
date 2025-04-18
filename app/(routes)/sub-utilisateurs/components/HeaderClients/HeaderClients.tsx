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
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import FormCreateAutomobile from "../FormCreateClient/FormCreateClient";

const HeaderClients = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const user = useSelector(selectUser);

  return (
    <div className="flex justify-between items-center ">
      <h2 className="text-2xl">Liste des sous clients</h2>
      {user.role == "ROLE_USER" && ( <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Créer un sous client</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Créer un sous client</DialogTitle>
            <DialogDescription>
              Créer et configurer un nouveau sous client.
            </DialogDescription>
          </DialogHeader>
          <FormCreateAutomobile setOPenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>)}
    </div>
  );
};

export default HeaderClients;

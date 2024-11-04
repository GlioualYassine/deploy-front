import React from "react";
import { FooterAutomobileProps } from "./FooterAutomobile.types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FooterAutomobile = (props: FooterAutomobileProps) => {
  const { VoitureId } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const onCloseDialog = () => {
    setIsOpen(false); // Fermer le dialogue
  };

  const onDeleteAutomobile = async () => {
    try {
      const resp = await axios.delete(
        "http://localhost:8080/api/v1/voitures/" + VoitureId
      );
      toast({
        title: "Automobile Supprimée",
      });
      router.push("/automobiles");
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsOpen(false); // Fermer le dialogue après la suppression
    }
  };
  return (
    <div className="flex justify-end mt-5">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Supprimer Automobile
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la
              voiture et effacera toutes ses données de nos serveurs.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onDeleteAutomobile} variant="destructive">
            Supprimer
          </Button>
          <Button variant="secondary" onClick={onCloseDialog}>
            Annuler
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FooterAutomobile;

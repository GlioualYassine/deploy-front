"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { deleteClient, setClients, User } from "@/app/store/clientsSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"; // Assurez-vous que ces hooks sont bien importés

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "@/components/ui/use-toast";
import { client } from "stompjs";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyId: string;
}

const ActionCell = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const onCloseDialog = () => setIsOpen(false);
  const clients = useAppSelector((state) => state.clients.clients);

  const onDeleteClient = async () => {
    try {
      await axiosInstance.delete(`users/${id}`);
      toast({
        title: "Utilisateur supprimé avec succès",
        variant: "default",
        className: "bg-blue-500 text-white",
      });
      let client: User = clients.filter(
        (client) => client.id == id
      )[0];
      dispatch(deleteClient(client));
    } catch (error) {
      console.log("Error deleting client : ", error);
      toast({ title: "Failed to delete client.", variant: "destructive" });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Menu Item pour Supprimer */}
      <DropdownMenuItem
        className="cursor-pointer"
        onSelect={(event) => {
          event.preventDefault(); // Empêcher la fermeture automatique
          setIsOpen(true); // Ouvrir le dialog de confirmation
        }}
      >
        <div className="flex items-center">
          <Trash className="w-4 h-4 mr-2 text-red-500" />
          <span className="text-red-500">Supprimer</span>
        </div>
      </DropdownMenuItem>

      {/* Dialog de confirmation */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Utiliser un Button invisible pour respecter le type d'enfant requis */}
        <DialogTrigger asChild>
          <Button className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Es-tu sûr de vouloir supprimer ce client ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteClient} // Appeler la fonction pour supprimer
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID Client
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom Client
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom Client
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Client
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
  },

  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom Company
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const companyName = row.getValue("companyName");
      return companyName ? companyName : "Non renseigné"; // Utilise une valeur par défaut au lieu de " "
    },
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/utilisateurs/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <ActionCell id={id}/>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

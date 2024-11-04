"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BellDot,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Device } from "./ListDevice.type";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { deleteDevice } from "@/app/store/deviceSlise";

import { Eye } from "lucide-react"; // Assurez-vous que les icônes sont importées correctement

// Composant pour les actions (supprimer, éditer, notifications, et historique des positions)
const ActionCell = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const onCloseDialog = () => setIsOpen(false);

  const onDeleteDevice = async () => {
    try {
      const response = await axiosInstance.delete("gpsDevices/" + id);
      toast({ title: "Device deleted successfully." });

      dispatch(deleteDevice(response.data.id));
    } catch (error) {
      console.error("Error deleting device:", error);
      toast({ title: "Failed to delete device.", variant: "destructive" });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex gap-3 justify-center items-center">
      {/* Bouton pour éditer */}
      <Link href={`appareils/${id}`}>
        <Button className="flex gap-1 justify-center items-center dark:bg-slate-700 text-white bg-sky-950">
          <Pencil className="w-4 h-4 mr-2" />
          <p>Editer</p>
        </Button>
      </Link>

      {/* Bouton pour supprimer */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={onCloseDialog}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={onDeleteDevice}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Nouveau bouton pour l'historique des positions */}
      <Link href={`appareils/positions/${id}`}>
      <Button className="flex gap-1 justify-center items-center dark:bg-[#4b5563] text-white bg-[#16a34a]">
          <Eye className="w-4 h-4 mr-2" />
          <p>Positions</p>
        </Button>
      </Link>

      {/* Bouton pour afficher les notifications */}
      <Link href={`appareils/notifications/${id}`}>
        <Button className="flex gap-1 justify-center items-center dark:bg-[#84385f] text-white bg-[#60a5fa]">
          <BellDot className="w-4 h-4 mr-2" />
          <p>Notifications</p>
        </Button>
      </Link>
    </div>
  );
};

export default ActionCell;

// Colonne des appareils avec leurs actions
export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        id
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "imei",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        IMEI
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("imei")}</div>
    ),
  },
  {
    accessorKey: "deviceConnected",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        IMEI
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("deviceConnected") ? (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Connecté
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Déconnecté
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "serverType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        type de serveur
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("serverType")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "simNumber1",
    header: "simNumber1",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("simNumber1")}</div>
    ),
  },
  {
    accessorKey: "simNumber2",
    header: "simNumber2",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("simNumber2")}</div>
    ),
  },
  {
    accessorKey: "smsEmail",
    header: "smsEmail",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("smsEmail")}</div>
    ),
  },
  {
    accessorKey: "VoitureNom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom voiture
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("VoitureNom")}
      </div>
    ),
  },
  {
    accessorKey: "Voitureimmatricule",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Immatricule voiture
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("Voitureimmatricule")}
      </div>
    ),
  },
  {
    accessorKey: "Voituremarque",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Marque Voiture
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("Voituremarque")}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell id={row.original.id.toString()} />,
  },
];
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BellDot,
  Locate,
  LocateIcon,
  MapPin,
  MapIcon,
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
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";

const ActionCell = ({ divice }: { divice: Device }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const onCloseDialog = () => setIsOpen(false);

  const onDeleteDevice = async () => {
    try {
      const response = await axiosInstance.delete("gpsDevices/" + divice.id);
      toast({ title: "Device deleted successfully." });

      dispatch(deleteDevice(response.data.id));
    } catch (error) {
      console.error("Error deleting device:", error);
      toast({ title: "Failed to delete device.", variant: "destructive" });
    } finally {
      setIsOpen(false);
    }
  };
  const user = useSelector(selectUser);

  return (
    <div className="flex gap-1 justify-center items-center">
      {user.role === "ROLE_GENERAL_ADMIN" && (
        <Link href={`appareils/${divice.id}`}>
          <button className=" bg-green-100 p-2 rounded-full">
            <Pencil className="w-3 h-3 text-green-600 " />
          </button>
        </Link>
      )}
      {user.role === "ROLE_GENERAL_ADMIN" && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <button
              className=" bg-red-100 p-2 rounded-full"
              onClick={() => setIsOpen(true)}
            >
              <Trash className="w-3 h-3 text-red-500" />
            </button>
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
      )}
      {/* Nouveau bouton pour l'historique des positions */}
      <Link href={`appareils/positions/${divice.imei}`}>
        <button className=" bg-amber-100 p-2 rounded-full">
          <MapPin className="w-3 h-3 text-amber-500" />
        </button>
      </Link>

      {/* Bouton pour afficher les notifications */}
        <Link href={`appareils/notifications/${divice.id}`}>
          <button className=" bg-sky-100 p-2 rounded-full">
            <BellDot className="w-3 h-3 text-sky-600" />
          </button>
        </Link>
    </div>
  );
};

export default ActionCell;

// Colonne des appareils avec leurs actions
export const columns: ColumnDef<Device>[] = [
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
      <div className="text-center font-medium text-xs">
        {row.getValue("nom")}
        <div className="text-center text-xs  text-muted-foreground">
          {row.getValue("imei")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom de client
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row?.original?.user?.firstName;
      const lastName = row?.original?.user?.lastName;

      return (
        <div className="text-center font-medium text-xs">
          {firstName} {lastName}
        </div>
      );
    },
  },

  {
    accessorKey: "deviceConnected",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Etat
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-xs">
        {row.getValue("deviceConnected") ? (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-xs bg-green-100 text-green-800">
            Connecté
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-xs bg-red-100 text-red-800">
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
        Serveur
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-xs">
        {row.getValue("serverType")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-center font-medium text-xs">
        {row.getValue("description")}
      </div>
    ),
  },
  // {
  //   accessorKey: "simNumber1",
  //   header: "Numéro1",
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("simNumber1")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "simNumber2",
  //   header: "Numéro2",
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("simNumber2")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "smsEmail",
  //   header: "Email",
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("smsEmail")}</div>
  //   ),
  // },

  // {
  //   accessorKey: "voitureNom",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Voiture
  //       <ArrowUpDown className="mh-2 h-4 ml-2" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="text-center font-medium text-xs">
  //       {row.getValue("voitureNom")}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionCell divice={row.original} />,
  },
];

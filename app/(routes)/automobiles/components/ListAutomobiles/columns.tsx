"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Voiture } from "./ListAutomobiles.type";

export const columns: ColumnDef<Voiture>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          id
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const nom : string = row.getValue("nom");
      return <div className="text-center font-medium">{nom}</div>
    }
  },
  {
    accessorKey: "marque",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          marque
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const marque : string = row.getValue("marque");
      return <div className="text-center font-medium">{marque}</div>
    }
  },
  {
    accessorKey: "modele",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          modele
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const modele : string = row.getValue("modele");
      return <div className="text-center font-medium">{modele}</div>
    }
  },
  {
    accessorKey: "immatricule",
    header: "immatricule",
    cell: ({ row }) => {
      const immatricule : string = row.getValue("immatricule");
      return <div className="text-center font-medium">{immatricule}</div>
    }
  },
 
  {
    accessorKey: "idConducteur",
    header: "idConducteur",
    cell: ({ row }) => {
      const idConducteur : string = (row.getValue("idConducteur"));
      return <div className=" font-medium">{idConducteur}</div>
    }
  },
  {
    accessorKey: "conducteur",
    header: "conducteur",
    cell: ({ row }) => {
      const conducteur : string = row.getValue("conducteur");
      return <div className=" font-medium">{conducteur}</div>
    }
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
            <Link href={`/automobiles/${id}`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

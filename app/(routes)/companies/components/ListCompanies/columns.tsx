"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Info } from 'lucide-react';

import Link from "next/link";
import Image from "next/image";
import { Company } from "./ListCompanies.types";

export const columns: ColumnDef<Company>[] = [
  
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom de l&#39;entreprise
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "admin_last_name",
    header: "nom de l'admin",
  },
  {
    accessorKey: "admin_first_name",
    header: "prenom de l'admin",
  },
  {
    accessorKey: "adress",
    header: "adresse",
  },
  {
    accessorKey: "phone",
    header: "Telephone",
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
            <Link href={`/companies/edit/${id}`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <Link href={`/companies/${id}`}>
              <DropdownMenuItem>
                <Info className="w-4 h-4 mr-2" />
                Info
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

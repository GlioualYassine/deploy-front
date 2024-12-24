"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Pencil, Trash } from "lucide-react";
import DeleteDialog from "../../../components/deleteModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { deleteCompany } from "@/app/store/companySlice";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Company } from "./companie.types";
import axiosInstance from "@/lib/axiosInstance";

import { useDispatch } from "react-redux";

// Component for Actions Column
const ActionsCell = ({ row }: { row: any }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id } = row.original;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    await axiosInstance
      .delete(`/company/${id}`)
      .then(() => {
        dispatch(deleteCompany(id));
        toast({
          title: "Success",
          description: "Company deleted successfully",
          className: "bg-green-500 text-white",
        });
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while deleting the company",
          className: "bg-red-500 text-white",
        });
        console.log(error);
      });
  };

  return (
    <div className="flex items-center justify-center">
      <Link href={`/companies/edit/${id}`}>
        <button className=" bg-green-100 p-2 rounded-full mr-2">
          <Pencil className="h-3 w-3 text-green-500 " />
        </button>
      </Link>

      <button
        className=" bg-red-100 p-2 rounded-full mr-2"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <Trash className="w-3 h-3 text-red-500" />
      </button>

      <DeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Êtes-vous sûr ?"
        description="Cette action ne peut pas être annulée. Cela supprimera définitivement votre élément."
      />
    </div>
  );
};

export const columns: ColumnDef<Company>[] = [
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
    cell: ({ row }) => {
      const name: String = row.original?.name;
      return <div className="text-start ml-4 font-medium text-xs">{name}</div>;
    },
  },
  {
    accessorKey: "admin_last_name",
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
      const nom: String = row.original?.admin_last_name;
      return <div className="text-start ml-4 font-medium text-xs">{nom}</div>;
    },
  },
  {
    accessorKey: "admin_first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const prenom: String = row.original?.admin_first_name;
      return (
        <div className="text-start ml-4 font-medium text-xs">{prenom}</div>
      );
    },
  },
  {
    accessorKey: "adress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Adresse
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const adress: String = row.original?.adress;
      return (
        <div className="text-start ml-4 font-medium text-xs">{adress}</div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Téléphone
          <ArrowUpDown className="mh-2 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const phone: String = row.original?.phone;
      return <div className="text-start ml-4 font-medium text-xs">{phone}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionsCell, // Use the React Component here
  },
];

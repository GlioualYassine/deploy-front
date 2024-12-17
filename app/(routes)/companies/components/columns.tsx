"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
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
        <Button className="bg-transparent hover:bg-transparent">
          <Edit className="h-1 w-1 text-emerald-500" />
        </Button>
      </Link>

      <Button
        className="bg-transparent hover:bg-transparent"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <Trash className="h-1 w-1 text-red-500" />
      </Button>

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
    cell: ActionsCell, // Use the React Component here
  },
];

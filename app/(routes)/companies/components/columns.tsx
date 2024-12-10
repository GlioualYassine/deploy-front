"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import DeleteDialog from "../../../components/deleteModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { deleteCompany } from "@/app/store/companySlice";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Company } from "./list/ListCompanies.types";
import axiosInstance from "@/lib/axiosInstance";

import { useDispatch } from "react-redux";

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
            // create a toast
            toast({
              title: "Error",
              description: "An error occurred while deleting the company",
              className: "bg-red-500 text-white",
            });
            console.log(error);
          });
      };

      return (
        <div className="flex items-center gap-2 justify-end">
          <Link href={`/companies/edit/${id}`}>
            <Button className="bg-emerald-500">
              <Edit className="h-1 w-1" />
            </Button>
          </Link>

          <Button
            className="bg-red-500"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash className="h-1 w-1" />
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
    },
  },
];

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Download, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";
import { Payment } from "./historique.types"; // Adjust the path to where PaiementResponse is defined
import axiosInstance from "@/lib/axiosInstance";
import { Badge } from "@/components/ui/badge";
import DownloadInvoice from "./pdf/DownloadInvoice";

// Define columns for the table
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom Client
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const clientName: string = row.getValue("clientName");
      return <div className="text-center font-medium">{clientName}</div>;
    },
  },
  {
    accessorKey: "datePaiement",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Paiement
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("datePaiement");
      return (
        <div className="text-center font-medium">
          {format(new Date(date), "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total (DHS)
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const total: number = row.getValue("total");
      return (
        <div className="text-center font-medium">{total.toFixed(2)} DHS</div>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        état de paiement
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const isPaid = row.getValue("isPaid");
      const badgeColor = isPaid
        ? "border-green-500 text-green-500"
        : "border-red-500 text-red-500 ";

      return (
        <div className="text-center font-medium">
          <Badge
            className={`border ${badgeColor} px-2 py-1 rounded bg-transparent hover:bg-transparent`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;

      // const handleDownloadReceipt = async (id: string) => {
      //   try {
      //     const response = await axiosInstance.get(`/paiements/${id}/receipt`, {
      //       responseType: "blob", // Ensures response is processed as binary data
      //     });

      //     const url = window.URL.createObjectURL(
      //       new Blob([response.data], { type: "application/pdf" })
      //     );
      //     const link = document.createElement("a");
      //     link.href = url;
      //     link.setAttribute("download", `PaymentReceipt_${id}.pdf`); // Set the download file name
      //     document.body.appendChild(link);
      //     link.click();
      //     document.body.removeChild(link);
      //   } catch (error) {
      //     console.error("Error downloading the receipt:", error);
      //     alert("Échec du téléchargement du reçu.");
      //   }
      // };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/paiement/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pen className="w-4 h-4 mr-2" />
                éditer
              </DropdownMenuItem>
            </Link>

            <DownloadInvoice invoice={row.original} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

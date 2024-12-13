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
import { Badge } from "@/components/ui/badge";

// Define columns for the table
export const columns: ColumnDef<any>[] = [
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
    accessorKey: "Vitesse",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Vitesse
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("iitesse")}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date de création
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("datePaiement");
      return (
        <div className="text-center font-medium">
          {format(date, "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Address
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          <Badge
            className={`border px-2 py-1 rounded bg-transparent hover:bg-transparent`}
          >
            {row.getValue("address")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <div></div>;
    },
  },
];

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Download, Pen, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";

// Define columns for the table
export const columns: ColumnDef<any>[] = [
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
      <div className="text-center font-medium">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "deviceName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original.deviceName}</div>;
    },
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.title}
        </div>
      );
    },
  },
  
  {
    accessorKey: "message",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      
      return (
        <div className="text-center font-medium">
          {row.original.message}
        </div>
      );
    },
  },
  
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date de notification
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      
      return (
        <div className="text-center font-medium">
           {format(new Date(row.original.timestamp), "dd/MM/yyyy HH:mm:ss")}
        </div>
      );
    },
  },

];

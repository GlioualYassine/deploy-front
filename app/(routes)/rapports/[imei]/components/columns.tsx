import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
    cell: ({ row }) => {
      const imei = row.original?.imei || "";
      return <div className="text-start ml-4 font-medium text-xs">{imei}</div>;
    },
  },
  // {
  //   accessorKey: "clientName",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Nom Client
  //       <ArrowUpDown className="mh-2 h-4 ml-2" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const firstName = row.original?.user?.firstName || "";
  //     const lastName = row.original?.user?.lastName || "";
  //     return (
  //       <div className="text-start ml-4 font-medium text-xs">{`${firstName} ${lastName}`}</div>
  //     );
  //   },
  // },
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
      const vitesse = row.original?.speed || 0;
      return (
        <div className="text-start ml-4 font-medium text-xs">
          {vitesse} Km/h
        </div>
      );
    },
  },

  {
    accessorKey: "distance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Distance
        <ArrowUpDown className="mh-2 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-start ml-4 font-medium text-xs">
          {(row.getValue("distance") as number)?.toFixed(2)} Km
        </div>
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
      const date: Date = row.original?.timestamp;
      return (
        <div className="text-start ml-4 font-medium text-xs">
          {format(date, "dd-MM-yyyy HH:mm:ss")}
        </div>
      );
    },
  },
];

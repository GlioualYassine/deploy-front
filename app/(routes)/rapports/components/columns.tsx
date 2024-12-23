import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Download,
  Pen,
  EyeIcon,
} from "lucide-react";
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
    cell: ({ row }) => {
      const imei = row.original?.imei || "";
      const nom = row.original?.nom || "";
      return (
        <div className="text-center font-medium text-xs">
          {nom}
          <div className="text-center text-xs  text-muted-foreground">
            {imei}
          </div>
        </div>
      );
    },
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
      const firstName = row.original?.user?.firstName || "";
      const lastName = row.original?.user?.lastName || "";
      return (
        <div className="text-center font-medium text-xs">{`${firstName} ${lastName}`}</div>
      );
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
      const vitesse = row.original?.topVitesse || 0;
      return (
        <div className="text-center font-medium text-xs">{vitesse} Km/h</div>
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
        <div className="text-center font-medium text-xs">
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
      const date: Date = row.original?.dateCreation;
      return (
        <div className="text-center font-medium text-xs">
          {format(date, "dd-MM-yyyy")}
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <Link href={`/rapports/${row.original.imei}`}>
            <EyeIcon className="h-4 w-4 " />
          </Link>
        </div>
      );
    },
  },
];

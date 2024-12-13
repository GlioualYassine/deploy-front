import React from "react";
import { DataTable } from "./data-table";
import { listHistoriqueProps } from "./historique.types";
import { columns } from "./columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ListHistorique = (props: listHistoriqueProps) => {
  return (
    <Card className="p-3 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-wide text-gray-800">
          Historique des factures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={props.paiements} />
      </CardContent>
    </Card>
  );
};

export default ListHistorique;

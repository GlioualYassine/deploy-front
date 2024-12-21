import React from "react";
import { DataTable } from "./data-table";
import { listHistoriqueProps } from "./historique.types";
import { columns } from "./columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ListHistorique = (props: listHistoriqueProps) => {
  return (
    <DataTable
      columns={columns}
      data={props.paiements}
      pagination={props.pagination}
      fetch={props.fetch}
    />
  );
};

export default ListHistorique;

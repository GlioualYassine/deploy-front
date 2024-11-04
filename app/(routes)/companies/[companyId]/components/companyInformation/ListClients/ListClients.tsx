"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";

import { ClientsEntreprise } from "../companyInformation.types";

const ListClients = (props: ClientsEntreprise) => {
  const {clients} = props;

  return <DataTable columns={columns} data={clients} />;
};

export default ListClients;

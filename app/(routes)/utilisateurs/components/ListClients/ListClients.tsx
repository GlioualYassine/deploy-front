"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setClients, User } from "@/app/store/clientsSlice";
import { useEffect } from "react";

const ListClients = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(
    (state: { clients: { clients: User[] } }) => state.clients.clients
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get("users/clients");
  
        const cleanedData = response.data.map((client: User) => ({
          ...client,
          companyName: client.companyName || "Non renseigné", // Remplace les valeurs nulles
        }));
        
        dispatch(setClients(cleanedData));
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };

    fetchClients();
  }, [dispatch]);

  return <DataTable columns={columns} data={clients} />;
};

export default ListClients;

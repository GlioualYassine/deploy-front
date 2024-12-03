"use client";
import { redirect } from "next/navigation";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Device } from "./ListDevice.type";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setDevices } from "@/app/store/deviceSlise";
import axiosInstance from "@/lib/axiosInstance";
const ListDevices = () => {
  //const { voitures, setVoitures } = useAutomobileContext();
  const dispatch = useAppDispatch();
  const devices = useAppSelector(
    (state: { devices: { devices: Device[] } }) => state.devices.devices
  );

  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await axiosInstance.get("gpsDevices");
        

        //setVoitures(fetchedVoitures);
        dispatch(setDevices(response.data));
        console.log("devices",response.data);

      } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
      }
    };

    fetchVoitures();

    // Set interval to fetch every minute
    const interval = setInterval(fetchVoitures, 60000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]); // Le tableau de dépendances vide [] signifie que ce useEffect est appelé une seule fois au montage du composant
  return <DataTable columns={columns} data={devices} />;
};

export default ListDevices;

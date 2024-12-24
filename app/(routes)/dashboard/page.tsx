"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import StatisticsNumerique from "../dashbord/statisticsNumerique";
import { BaseSelectWithFetch } from "../../components/base/BaseSelectWithFitch";
import MapComponent from "../MapComponent";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/gpsDevices/all");
        setData(response.data);
        setMarkers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchData();
  }, []);

  const handleDeviceSelection = (value: any) => {
    setSelectedValue(value);
  };

  return (
    <div className="">
      <h2 className="text-2xl mb-4">Tableau de Bord</h2>
      <StatisticsNumerique />
      
        <div className="flex gap-4 items-center mt-4 mb-4 z-50 border-b pb-4">
          <BaseSelectWithFetch
            placeholder="Choisir un Appareil"
            labelOption="nom"
            valueOption="imei"
            data={data}
            value={selectedValue}
            setValue={handleDeviceSelection}
          />
        </div>
        <div className="flex flex-col gap-2 w-full h-[80vh] relative z-index-0">
          <MapComponent markers={markers} selectedValue={selectedValue || ""} />
        </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import StatisticsNumerique from "./dashbord/statisticsNumerique";
import { BaseSelectWithFetch } from "../components/base/BaseSelectWithFitch";
import MapComponent from "./MapComponent";

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

  const handleDeviceSelection = (value:any) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Tableau de Bord</h2>
      <StatisticsNumerique />

      <div className="mt-4 mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.length > 0 && (
          <BaseSelectWithFetch
            placeholder="Choisir un Appareil"
            labelOption="nom"
            valueOption="imei"
            data={data}
            value={selectedValue}
            setValue={handleDeviceSelection}
          />
        )}
      </div>

      <MapComponent markers={markers} selectedValue={selectedValue || ''} />
    </div>
  );
}

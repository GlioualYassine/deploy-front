"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import StatisticsNumerique from "./dashbord/statisticsNumerique";
import { BaseSelectWithFetch } from "../components/base/BaseSelectWithFitch";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import FlyToMarker from "../components/map/FlyToMarker";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState();
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [markers, setMarkers] = useState<any>([]);
  const [newMarkers, setNewMarkers] = useState<any>();

  const coloredIcon = (color: string = "blue") =>
    new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="25" height="41">
          <path d="M12 0C8.13 0 5 3.13 5 7c0 4.9 7 17 7 17s7-12.1 7-17c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 9.5 12 9.5z" />
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

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

  const choiaserAppareil = (value: any) => {

    // i need find last position of the selected device
    const result = markers.find((marker: any) => marker.imei === value);

    console.log("result", result);
    
    setNewMarkers(result);
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
            setValue={choiaserAppareil}
          />
        )}
      </div>

      <div className="flex flex-col gap-2 w-full h-[60vh] relative ">
        <MapContainer
          center={[35.7632743, -5.8344698]}
          zoom={10}
          style={{ height: "100vh", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers
            .filter((marker: any) => marker?.lastPosition != null) // Filter out markers with null lastPosition
            .map((marker: any) => (
              <Marker
                key={marker.id}
                position={[
                  marker.lastPosition.latitude,
                  marker.lastPosition.longitude,
                ]}
                icon={coloredIcon(marker.deviceConnected ? "green" : "red")}
              >
                <Popup>{marker.nom}</Popup>
              </Marker>
            ))}

          {newMarkers && (
            <FlyToMarker
              position={[
                newMarkers?.lastPosition?.latitude,
                newMarkers?.lastPosition?.longitude,
              ]}
              zoomLevel={15}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";

const Page = () => {
  const icon: Icon = new Icon({
    iconUrl: "/marker.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedValue, setSelectedValue] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [urlApapreil, setUrlApapreil] = useState("");

  const markers = [
    { id: 1, name: "Marker 1", position: [35.7632743,-5.8344698] as [number, number] },
    { id: 2, name: "Marker 2", position: [35.7632743,-5.78] as [number, number] },
    { id: 3, name: "Marker 3", position: [35.7632743,-5.8] as [number, number] },
  ];

  useEffect(() => {}, []);

  const selectedData = (data: any) => {
    setSelectedClient(data);
    setUrlApapreil(`/gpsDevices/user/${data}`);
  };
  return (
    <div>
      <div className="flex gap-4 items-center mt-0 mb-4 z-50">
        <BaseSelectWithFetch
          placeholder="Choisir un Client"
          labelOption="firstName"
          valueOption="id"
          fetchUrl="users/clients"
          value={selectedClient}
          setValue={selectedData}
        />

        <BaseSelectWithFetch
          // label="Choisir un Appareil"
          placeholder="Choisir un Appareil"
          labelOption="VoitureNom"
          valueOption="imei"
          fetchUrl={urlApapreil}
          value={selectedValue}
          setValue={setSelectedValue}
        />

        <BaseRangeDate
          placeholder="Choisir une date"
          value={date}
          setValue={setDate}
        />

        <Button>Rechercher</Button>
      </div>

      <div className="flex flex-col gap-2 w-full h-[80vh] relative">
        <MapContainer
          center={[35.7632743,-5.8344698]}
          zoom={10}
          style={{ height: "100vh", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position} icon={icon}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Page;

"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
import axiosInstance from "@/lib/axiosInstance";
import { useSelector } from "react-redux";
import { selectUser } from "@/app/store/authSlice";

const Page = () => {
  const user = useSelector(selectUser);

  const [apapreils, setApapreils] = useState<Record<string, string>[]>([]);
  const [selectedValue, setSelectedValue] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [newMarkers, setNewMarkers] = useState<any>();
  const [history, setHistory] = useState<any>([]);
  const [date, setDate] = useState({ from: undefined, to: undefined });
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    const loadMapComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");
      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    };

    loadMapComponents();
  }, []);

  const coloredIcon = (color: string = "blue") =>
    new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`...`)}`, // Votre SVG ici
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

  const fetchData = useCallback(async (url: string) => {
    try {
      const response = await axiosInstance.get(url);
      setApapreils(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(`/gpsDevices/all`);
  }, [fetchData]);

  const selectedData = (data: any) => {
    setSelectedClient(data);
    if (data == null) {
      fetchData(`/gpsDevices/all`);
    } else {
      fetchData(`/gpsDevices/user/${data}`);
    }
  };

  const handleMarkerClick = (value: any) => {
    const result = apapreils.find((marker: any) => marker.imei === value);
    setNewMarkers(result);
    setSelectedValue(value);
    if (date?.from && date?.to) {
      choisirDate(date);
    }
  };

  const choisirDate = async (value: any) => {
    setDate(value);
    if (value?.from && value?.to) {
      const startDate = format(value.from, "yyyy-MM-dd");
      const endDate = format(value.to, "yyyy-MM-dd");
      const response = await axiosInstance.get(
        `/positions/${selectedValue}/range?startDate=${startDate}&endDate=${endDate}`
      );
      setHistory(response.data);
      if (response.data.length > 0) {
        setNewMarkers({
          lastPosition: {
            latitude: response.data[0].latitude,
            longitude: response.data[0].longitude,
          },
        });
      }
    }
  };

  if (!MapComponents) return <div>Loading map...</div>;

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="flex gap-4 items-center mt-0 mb-4 z-50 border-b pb-4">
        {(user.role === "ROLE_GENERAL_ADMIN" ||
          user.role === "ROLE_COMPANY_ADMIN") && (
          <BaseSelectWithFetch
            placeholder="Choisir un Client"
            labelOption="firstName"
            valueOption="id"
            fetchUrl="users/clients"
            value={selectedClient}
            setValue={selectedData}
          />
        )}

        <BaseSelectWithFetch
          placeholder="Choisir un Appareil"
          labelOption="nom"
          valueOption="imei"
          data={apapreils}
          value={selectedValue}
          setValue={handleMarkerClick}
        />

        <BaseRangeDate
          placeholder="Choisir une date"
          value={date}
          setValue={choisirDate}
        />
      </div>

      <div className="flex flex-col gap-2 w-full h-[80vh] relative">
        <MapContainer
          center={[35.7632743, -5.8344698]}
          zoom={10}
          style={{ height: "100vh", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {apapreils
            .filter((marker: any) => marker?.lastPosition != null)
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

          {history.map((marker: any) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={coloredIcon(marker.deviceConnected ? "green" : "red")}
            >
              <Popup>
                <div className="text-center">
                  <span className="text-xs font-semibold">{marker.imei}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Page;

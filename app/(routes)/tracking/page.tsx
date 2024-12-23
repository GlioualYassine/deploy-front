"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
import FlyToMarker from "@/app/components/map/FlyToMarker";
import axiosInstance from "@/lib/axiosInstance";
import { CalendarDays, CircleGauge, Space } from "lucide-react";

const Page = () => {
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

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedValue, setSelectedValue] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [newMarkers, setNewMarkers] = useState<any>();
  const [history, setHistory] = useState<any>([]);
  const [apapreils, setApapreils] = React.useState<Record<string, string>[]>(
    []
  );
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchData(`/gpsDevices/all`);
  }, []);

  const fetchData = async (url: string) => {
    try {
      const response = await axiosInstance.get(url);
      setApapreils(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

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
  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="flex gap-4 items-center mt-0 mb-4 z-50 border-b pb-4">
        <BaseSelectWithFetch
          placeholder="Choisir un Client"
          labelOption="firstName"
          valueOption="id"
          fetchUrl="users/clients"
          value={selectedClient}
          setValue={selectedData}
        />

        <BaseSelectWithFetch
          placeholder="Choisir un Appareil"
          labelOption="nom"
          valueOption="imei"
          data={apapreils}
          // fetchUrl={urlApapreil}
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

          {history.map((marker: any) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={coloredIcon(marker.deviceConnected ? "green" : "red")}
            >
              <Popup>
                <div className="">
                  <div className="text-center">
                    <span className="text-xs font-semibold">{marker.imei}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex  items-center mt-0">
                      <CircleGauge className="h-3 w-3 mr-1 ml-1 text-muted-foreground " />
                      <span className="text-xs ">{marker.speed} km/h</span>
                    </div>
                    <div className="flex  items-center mt-0">
                      <Space className="h-3 w-3 mr-1 ml-1 text-muted-foreground " />
                      <span className="text-xs ">{marker.distance} km</span>
                    </div>
                  </div>
                  <div className="flex  items-center mt-0">
                    <CalendarDays className="h-3 w-3 mr-1 ml-1 text-muted-foreground " />
                    <span className="text-xs text-muted-foreground ">
                      {format(new Date(marker.timestamp), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {newMarkers && newMarkers?.lastPosition && newMarkers?.lastPosition != undefined  && (
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
};

export default Page;

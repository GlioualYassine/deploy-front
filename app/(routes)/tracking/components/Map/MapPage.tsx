"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Polyline } from "react-leaflet";
import moment from "moment";

const FlyToMarker = dynamic(
  () => import("../../../../components/map/FlyToMarker"),
  {
    ssr: false,
  }
);

interface MapComponentProps {
  apapreils: any[];
  history: any[];
  selectedValue: string;
}

let LeafletIcon: any = null;

if (typeof window !== "undefined") {
  // Importer leaflet uniquement si on est côté client
  const L = require("leaflet");
  LeafletIcon = L.Icon;
}

interface Marker {
  id: string;
  imei: string;
  nom: string;
  lastPosition: {
    latitude: number;
    longitude: number;
  };
  deviceConnected: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  apapreils,
  history,
  selectedValue,
}) => {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [newMarkers, setNewMarkers] = useState<Marker | null>(null);

  useEffect(() => {
    const loadMapComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import(
        "react-leaflet"
      );
      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    };

    loadMapComponents();
  }, []);

  useEffect(() => {
    if (selectedValue) {
      const result = apapreils.find((marker) => marker.imei === selectedValue);
      setNewMarkers(result || null);
    }
  }, [selectedValue, apapreils]);

  const coloredIcon = (color = "blue") => {
    if (!LeafletIcon) return null;
    return new LeafletIcon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="25" height="41">
          <path d="M12 0C8.13 0 5 3.13 5 7c0 4.9 7 17 7 17s7-12.1 7-17c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 9.5 12 9.5z" />
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  if (!MapComponents) return <div>Loading map...</div>;

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <MapContainer
      center={[31.9108605, -14.1978022]}
      zoom={5}
      style={{ height: "100vh", width: "100%", zIndex: 0 }}
    >
      {history.length > 1 && (
        <Polyline
          positions={history.map((pos: any) => [pos.latitude, pos.longitude])}
          pathOptions={{ color: "blue", weight: 2 }}
        />
      )}

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
              marker.lastPosition?.latitude ?? 0,
              marker.lastPosition?.longitude ?? 0,
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
          icon={coloredIcon(
            parseFloat(marker.speed) > 120
              ? "#35d7ca"
              : parseFloat(marker.speed) > 100
              ? "#71b0ff"
              : parseFloat(marker.speed) > 80
              ? "#bee131"
              : parseFloat(marker.speed) > 60
              ? "#54c254"
              : parseFloat(marker.speed) > 5
              ? "#f7f301"
              : parseFloat(marker.speed) > 0
              ? "red"
              : "blue"
          )}
        >
          <Popup>
            <div className="text-center">
              <span className="text-xs font-semibold">{marker.imei}</span>
              <br />
              <span className="text-xs font-semibold">{marker.speed} Km/h  -  {moment(marker?.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {newMarkers && newMarkers?.lastPosition && (
        <FlyToMarker
          position={[
            newMarkers?.lastPosition?.latitude,
            newMarkers?.lastPosition?.longitude,
          ]}
          zoomLevel={15}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;

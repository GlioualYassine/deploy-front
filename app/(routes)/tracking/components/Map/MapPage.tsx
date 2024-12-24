"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  apapreils: any[];
  history: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ apapreils, history }) => {
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
      iconUrl: `data:image/svg+xml;base64,${btoa(`...`)}`, // Your SVG here
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

  if (!MapComponents) return <div>Loading map...</div>;

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
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
  );
};

export default MapComponent;

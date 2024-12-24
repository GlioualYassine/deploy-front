"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// Retire l'import direct du Icon de Leaflet
// import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Ici, on déclare une variable `LeafletIcon` qui sera définie
 * uniquement quand 'window' est disponible (côté client).
 */
let LeafletIcon: any = null;

if (typeof window !== "undefined") {
  // Importer leaflet uniquement si on est côté client
  const L = require("leaflet");
  LeafletIcon = L.Icon;
}

// Désactiver la SSR pour les composants react-leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const FlyToMarker = dynamic(() => import("../components/map/FlyToMarker"), {
  ssr: false,
});

// Garde la même interface pour tes markers
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

interface MapComponentProps {
  markers: Marker[];
  selectedValue: string;
}

export default function MapComponent({
  markers,
  selectedValue,
}: MapComponentProps) {
  const [newMarkers, setNewMarkers] = useState<Marker | null>(null);

  /**
   * Fonction pour construire l'icône colorée.
   * On vérifie d'abord si LeafletIcon est défini.
   */
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

  useEffect(() => {
    if (selectedValue) {
      const result = markers.find((marker) => marker.imei === selectedValue);
      setNewMarkers(result || null);
    }
  }, [selectedValue, markers]);

  return (
    <MapContainer
      center={[35.7632743, -5.8344698]}
      zoom={10}
      style={{ height: "100vh", width: "100%" , zIndex: 0}}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {markers.map((marker) => {
        // On crée l’icône dynamiquement
        const icon = coloredIcon(marker.deviceConnected ? "green" : "red");
        // Si l’icône est null (LeafletIcon pas dispo), on peut ignorer ou gérer différemment
        if (!icon) return null;

        return (
          <Marker
            key={marker.id}
            position={[
              marker?.lastPosition?.latitude ?? 0,
              marker?.lastPosition?.longitude ?? 0,
            ]}
            icon={icon}
          >
            <Popup>{marker.nom}</Popup>
          </Marker>
        );
      })}

      {newMarkers && newMarkers.lastPosition && (
        <FlyToMarker
          position={[
            newMarkers.lastPosition.latitude,
            newMarkers.lastPosition.longitude,
          ]}
          zoomLevel={15}
        />
      )}
    </MapContainer>
  );
}

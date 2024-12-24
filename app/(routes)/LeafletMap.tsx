"use client";

import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";

const LeafletMap = ({ markers, newMarkers, FlyToMarker, coloredIcon }: any) => {
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
      {markers
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

      {newMarkers?.lastPosition && (
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

export default LeafletMap;

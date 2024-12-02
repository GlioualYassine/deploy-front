"use client";
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapsProps {
  style?: React.CSSProperties;
  latitude: number;
  longitude: number;
}

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const GoogleMaps: React.FC<GoogleMapsProps> = ({ style, latitude, longitude }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBUT26jLFeeWY8o95fI7LNNb7Fgl-nXpHk",
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ ...style, height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: latitude, lng: longitude }}
        zoom={14}
      >
        {/* Affiche uniquement un marqueur à la position actuelle */}
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMaps;

"use client"
import React, { useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

interface GoogleMapsProps {
  path: { lat: number; lng: number }[]; // Liste des positions GPS
  style?: React.CSSProperties;
  latitude: number;
  longitude: number;
}

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  path,
  style,
  latitude,
  longitude,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBUT26jLFeeWY8o95fI7LNNb7Fgl-nXpHk',
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ ...style, height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: latitude, lng: longitude }}
        zoom={14}
      >
        {/* Affiche un marqueur à la position actuelle */}
        <Marker position={{ lat: latitude, lng: longitude }} />

        {/* Trace le chemin du véhicule */}
        <Polyline
          path={path}
          options={{
            strokeColor: "#FF0000", // Couleur de la ligne
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMaps;

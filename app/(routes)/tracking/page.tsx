"use client";
import React, { useState, useEffect, useRef } from "react";
import GoogleMaps from "./components/Map/GoogleMap";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";

let url: string = "https://api.ramycan.com/ws";

const Page = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : null;
  const User =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const socketClientRef = useRef<any>(null);

  useEffect(() => {
<<<<<<< HEAD
    // Déconnecter et reconnecter à chaque changement de User ou token
=======
>>>>>>> dce5baf268c48989ccb86dc3f6080b4ecfee48f1
    

    const ws = new SockJS(url);
    const stompClient = Stomp.over(ws);
    stompClient.connect(
      { Authorization: "Bearer " + token, userId: User.id },
      () => {
        console.log("Connected to WebSocket with user:", User);
        stompClient.subscribe(`/user/${User.id}/positions`, (message) => {
          const position = JSON.parse(message.body);
          console.log("Message received:", position); // Log chaque message reçu
          const lat = parseFloat(position.latitude);
          const lng = parseFloat(position.longitude);
          
          if (isFinite(lat) && isFinite(lng)) {
            setCurrentPosition({ lat, lng });
            console.log("Position updated to:", { lat, lng }); // Log la mise à jour de position
          } else {
            console.warn("Invalid latitude or longitude received:", position);
          }
        });
      },
      (error) => {
        console.error("Connection error:", error);
      }
    );

    socketClientRef.current = stompClient;

    return () => {
      if (socketClientRef.current && socketClientRef.current.connected) {
        socketClientRef.current.disconnect();
        console.log("Disconnected from WebSocket");
      }
    };
  }, [token, User]); // Réinitialiser la connexion WebSocket si token ou User change

  return (
    <div>
      {currentPosition ? (
        <GoogleMaps
          path={[currentPosition]}
          latitude={currentPosition.lat}
          longitude={currentPosition.lng}
        />
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
};

export default Page;

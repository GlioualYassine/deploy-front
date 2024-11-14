"use client";
import React, { useState, useEffect, useRef } from "react";
import GoogleMaps from "./components/Map/GoogleMap";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";

const Page = () => {
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const User =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const socketClientRef = useRef<any>(null); // Utiliser un ref pour stocker le client WebSocket

  useEffect(() => {
    if (User && User.token) {
      if (!socketClientRef.current) {
        const ws = new SockJS("https://18.209.226.16/ws");  //        const ws = new SockJS("http://localhost:8080/ws");

        const stompClient = Stomp.over(ws);
        stompClient.connect(
          { Authorization: "Bearer " + User.token, userId: User.id },
          () => {
            console.log("Connected to WebSocket with user:", User);
            stompClient.subscribe(`/user/${User.id}/positions`, (message) => {
              const position = JSON.parse(message.body);
              if (position) {
                setPath((prevPath) => [...prevPath, position]);
              }
            });
          },
          (error) => {
            console.error("Connection error:", error);
          }
        );
        socketClientRef.current = stompClient;
      }
    }

    return () => {
      if (socketClientRef.current && socketClientRef.current.connected) {
        socketClientRef.current.disconnect();
        console.log("Disconnected from WebSocket");
      }
    };
  }, [User]); // Ajouter `User` comme dépendance pour le hook

  return (
    <div>
      <GoogleMaps
        path={path}
        latitude={35.7673} // Centre de la carte sur le premier point
        longitude={-5.7998}
      />
    </div>
  );
};

export default Page;

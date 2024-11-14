"use client"
import React, { useState, useEffect, useRef } from 'react';
import GoogleMaps from './components/Map/GoogleMap';
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";



const Page = () => {
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const User : any = JSON.parse(localStorage.getItem('user') || '{}');
  const socketClientRef = useRef<any>(null); // Utiliser un ref pour stocker le client WebSocket

  
  useEffect(() => {
    if (User && User.token) {
      if (!socketClientRef.current) {
        // S'assurer que le client WebSocket est initialisé une seule fois
        const ws = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(ws);
        stompClient.connect(
          { Authorization: "Bearer " + User.token, userId: User.id },
          () => {
            console.log(
              "Connected to WebSocket with user:",
              User
            );
            stompClient.subscribe(
              `/user/${User.id}/positions`,
              (message: any) => {
                const position: { lat: number; lng: number } = JSON.parse(message.body);
                if (position) {
                  setPath((prevPath) => [...prevPath, position]);
                }
              }
            );
          },
          (error: any) => {
            console.error("Connection error:", error);
          }
        );
        socketClientRef.current = stompClient; // Stocker le client WebSocket dans le ref
      }
    }

    return () => {
      if (socketClientRef.current && socketClientRef.current.connected) {
        socketClientRef.current.disconnect();
        console.log("Disconnected from WebSocket");
      }
    };
  }, []);

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

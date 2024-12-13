"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import eventsData from "../historyEvents";
import FlyToMarker from "./FyToMarker";
import Filter from "./Filter";
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance";
import { format } from "date-fns";
import { useFetch } from "@/servises/useFetch";
import { Pagination } from "@/typs/pagination";
import { defaultFilter } from "@/typs/filter";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export interface HistoricalEvent {
  id: number;
  title: string;
  position: [number, number];
  category: string;
  timestamp: string;
}
export interface Historique {
  id: number;
  imei: string;
  latitude: string;
  longitude: string;
  timestamp : any
}

const defaultPosition: [number, number] = [
  35.76185321080379, -5.836189754217148,
];

const emptyStar = <i className="fa-regular fa-star"></i>;
const fullStar = (
  <i
    className="fa-solid fa-star"
    style={{
      color: "#fdc401",
    }}
  ></i>
);

function MapsApp({ imei }: { imei: string }) {
  const icon: Icon = new Icon({
    iconUrl: "/marker.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<Historique | null>(null);
  const [historyEvents, setHistoryEvents] = useState<Historique[]>([]);
  const [favourites, setFavourites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem("favourites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });


  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();


  const handleFavouriteClick = (eventId: number) => {
    let updatedFavourites = favourites.filter((id) => id !== eventId);

    if (!favourites.includes(eventId)) {
      updatedFavourites = [eventId, ...updatedFavourites];
    }

    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  const handleListItemClick = (eventId: number) => {
    const event = historyEvents.find((event) => event.id === eventId);
    if (event) {
      setActiveEvent(event);
    }
  };

const { fetchAll } = useFetch(`positions/${imei}`);

  /// FETCHIN DATA
  useEffect(() => {
    // Appeler fitchData une fois dès le chargement du composant
    fitchData(filter);

    // // Répéter l'appel toutes les 10 secondes (10000 ms)
    // const intervalId = setInterval(() => {
    //   fitchData();
    // }, 10000);

    // Nettoyer l'intervalle à la destruction du composant pour éviter les fuites de mémoire
    // return () => clearInterval(intervalId);
  }, []);

  const fitchData = async (baseFilter: any) => {
    try {
      const response = await fetchAll(baseFilter);
      setPagination(response.pagination);
      console.log("response", response.data);

      setHistoryEvents(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des voitures :", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2  w-full h-full">
      <ScrollArea className="h-[80vh] w-72 border rounded-lg overflow-hidden shadow-md">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium text-gray-600 leading-none">
            Les Historiques
          </h4>
          {historyEvents.map((tag: any) => (
            <Card
              key={tag.id}
              className="p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleListItemClick(tag.id)}
            >
              <div className="flex flex-col space-y-2">
                <div className="text-sm text-gray-700 font-semibold">
                  {tag.imei}
                </div>
                <div className="text-xs text-gray-500">
                  {/* Formater la date pour qu'elle soit plus lisible */}
                  {tag.timestamp
                    ? format(new Date(tag.timestamp), "dd MMM yyyy, HH:mm:ss")
                    : "Date non disponible"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Left Section: Map */}
      <div className="flex flex-col gap-2 w-full  h-[80vh]">
        {/* <Filter setSelectedCategory={setSelectedCategory} /> */}
        <MapContainer
          center={defaultPosition}
          zoom={13}
          className="w-full h-full relative rounded-lg border-2 border-gray-300 shadow-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {historyEvents
            .filter(
              (event) => !selectedCategory || event.imei === selectedCategory
            )
            .map((event) => (
              <Marker
                key={event.id}
                position={[
                  parseFloat(event.latitude),
                  parseFloat(event.longitude),
                ]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setActiveEvent(event);
                  },
                }}
              />
            ))}
          {activeEvent && (
            <Popup
            className=" !bg-white rounded-lg"
            position={[
              parseFloat(activeEvent.latitude),
              parseFloat(activeEvent.longitude),
            ]}
            closeOnClick={false}
          >
            <div className="">
              {/* Titre avec un style soigné */}
              <h2 className="font-bold text-xl text-blue-600 mb-3 truncate">
                {activeEvent.imei}
              </h2>
              {/* Affichage de la date de manière lisible */}
              <p className="text-gray-700 text-sm mb-4">
                {/* Formater la date pour la rendre lisible */}
                {activeEvent.timestamp
                  ? format(new Date(activeEvent.timestamp), 'dd MMM yyyy, HH:mm:ss')
                  : 'Date non disponible'}
              </p>
            
            </div>
          </Popup>
          )}
          {activeEvent && (
            <FlyToMarker
              position={[activeEvent.latitude, activeEvent.longitude]}
              zoomLevel={15}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapsApp;

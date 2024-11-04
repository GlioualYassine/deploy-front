"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import eventsData from "../historyEvents";
import FlyToMarker from "./FyToMarker";
import Filter from "./Filter";
import { MapPin } from "lucide-react";

export interface HistoricalEvent {
  id: number;
  title: string;
  position: [number, number];
  category: string;
  timestamp: string;
}

const defaultPosition: [number, number] = [35.76185321080379, -5.836189754217148];

const emptyStar = <i className="fa-regular fa-star"></i>;
const fullStar = (
  <i
    className="fa-solid fa-star"
    style={{
      color: "#fdc401",
    }}
  ></i>
);

function MapsApp() {
  const icon: Icon = new Icon({
    iconUrl: "/marker.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);
  const [favourites, setFavourites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem("favourites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleFavouriteClick = (eventId: number) => {
    let updatedFavourites = favourites.filter((id) => id !== eventId);

    if (!favourites.includes(eventId)) {
      updatedFavourites = [eventId, ...updatedFavourites];
    }

    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  const handleListItemClick = (eventId: number) => {
    const event = eventsData.find((event) => event.id === eventId);
    if (event) {
      setActiveEvent(event);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pl-5 pr-2 w-full h-full">
      {/* Left Section: Map */}
      <div className="flex flex-col gap-6 w-full md:w-full h-[80vh]">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          className="w-full h-full relative rounded-lg border-2 border-gray-800 shadow-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {eventsData
            .filter(
              (event) =>
                !selectedCategory || event.category === selectedCategory
            )
            .map((event) => (
              <Marker
                key={event.id}
                position={event.position}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setActiveEvent(event);
                  },
                }}
              />
            ))}
          {activeEvent && (
            <Popup position={activeEvent.position} closeOnClick={false}>
              <div className="p-4 bg-white rounded-lg ">
                <h2 className="font-bold text-xl text-blue-600 mb-3">
                  {activeEvent.title}
                </h2>
                <p className="text-gray-700 mb-4">
                  {new Date(activeEvent.timestamp).toLocaleString()}
                </p>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    favourites.includes(activeEvent.id)
                      ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleFavouriteClick(activeEvent.id)}
                >
                  {favourites.includes(activeEvent.id) ? (
                    <span>{fullStar} Unfavourite</span>
                  ) : (
                    <span>{emptyStar} Favourite</span>
                  )}
                </button>
              </div>
            </Popup>
          )}
          {activeEvent && (
            <FlyToMarker position={activeEvent.position} zoomLevel={15} />
          )}
        </MapContainer>
      </div>

     
    </div>
  );
}

export default MapsApp;

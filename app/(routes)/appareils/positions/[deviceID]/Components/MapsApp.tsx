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
      <div className="flex flex-col gap-6 w-full md:w-2/3 h-[80vh]">
        <Filter setSelectedCategory={setSelectedCategory} />
        <MapContainer
          center={defaultPosition}
          zoom={13}
          className="w-full h-full relative rounded-lg border-2 border-gray-300 shadow-lg"
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
              <div className="p-4 bg-white rounded-lg shadow-xl">
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

      {/* Right Section: History List */}
      <div className="flex-1 p-5 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto h-[80vh] w-full md:w-1/3">
        <h2 className="font-bold text-2xl flex items-center gap-3 text-gray-800 mb-6 ">
          <MapPin className="text-blue-500" />
          <p>Vehicle Fleet Events</p>
        </h2>

        <ul className="space-y-4">
          {eventsData.map((event) => (
            <li
              key={event.id}
              className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleListItemClick(event.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-blue-700">
                  {event.title}
                </h3>
                <span className="text-xs text-gray-600">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Position: {event.position[0]}, {event.position[1]}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MapsApp;

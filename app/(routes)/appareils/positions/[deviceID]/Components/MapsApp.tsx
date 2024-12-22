"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";
import { FiMapPin, FiClock, FiTrendingUp } from "react-icons/fi";

export interface Historique {
  id: number;
  latitude: string;
  longitude: string;
  speed: string;
  imei: string;
  timestamp: string;
}

const defaultPosition = { lat: 35.76185321080379, lng: -5.836189754217148 };

const containerStyle = {
  width: "100%",
  height: "100%",
};

function MapsApp({ imei }: { imei: string }) {
  const [historyEvents, setHistoryEvents] = useState<Historique[]>([]);
  const [activeEvent, setActiveEvent] = useState<Historique | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { fetchAll } = useFetch(`positions/${imei}`);
  const [filter, setFilter] = useState({ ...defaultFilter, size: 10 });

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    console.log("Fetching data for page:", page);
    try {
      const response = await fetchAll({ ...filter, currentPage: page });
      console.log("API response:", response);
      if (response && response.data) {
        setHistoryEvents(response.data);
        setTotalPages(response.pagination?.totalPage || 1);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des historiques :", error);
    }
  };

  const getIndicatorStyle = (speed: string) => {
    return speed === "0"
      ? "bg-red-500 w-4 h-4 rounded-full"
      : "bg-green-500 w-4 h-4 rounded-full";
  };

  const flyToMarker = (position: google.maps.LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo(position);
      mapRef.current.setZoom(15);
    } else {
      console.error("Map reference is not initialized");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log("Next page:", currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      console.log("Previous page:", currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full md:flex-row">
      {/* Map Section */}
      <div className="flex-grow h-[50vh] md:h-full relative">
        <LoadScript googleMapsApiKey="AIzaSyBUT26jLFeeWY8o95fI7LNNb7Fgl-nXpHk">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultPosition}
            zoom={13}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {historyEvents.map((event) => (
              <Marker
                key={event.id}
                position={{
                  lat: parseFloat(event.latitude),
                  lng: parseFloat(event.longitude),
                }}
                onClick={() => {
                  setActiveEvent(event);
                  flyToMarker({
                    lat: parseFloat(event.latitude),
                    lng: parseFloat(event.longitude),
                  });
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>

        {activeEvent && (
          <div
            className="absolute bg-white p-4 rounded-lg shadow-md border top-16 left-1/2 transform -translate-x-1/2"
            style={{ maxWidth: "300px" }}
          >
            <h3 className="font-semibold text-lg text-blue-500 mb-2">
              <FiMapPin className="inline mr-2" /> {activeEvent.imei}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              <FiClock className="inline mr-2" />{" "}
              {format(new Date(activeEvent.timestamp), "dd MMM yyyy, HH:mm:ss")}
            </p>
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="inline text-gray-700" />
              <div className="flex items-center space-x-2">
                <span className={getIndicatorStyle(activeEvent.speed)}></span>
                <span>
                  {activeEvent.speed === "0"
                    ? "Arrêt"
                    : `${activeEvent.speed} km/h`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

     {/* History Section */}
<div className="w-full h-[50vh] md:h-full border-t md:border-t-0 md:w-1/3 flex flex-col">
  <ScrollArea className="flex-grow h-full overflow-auto">
    <div className="p-4">
      <h4 className="mb-4 text-sm font-medium text-gray-600">
        Les Historiques
      </h4>
      {historyEvents.map((event, index) => (
        <Card
          key={event.id}
          className={`p-4 mb-4 ${
            index === 0 ? "bg-blue-100" : "bg-gray-50"
          } rounded-lg shadow hover:shadow-lg transition-shadow`}
          onClick={() => {
            setActiveEvent(event);
            flyToMarker({
              lat: parseFloat(event.latitude),
              lng: parseFloat(event.longitude),
            });
          }}
        >
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-semibold text-gray-800">
              <FiMapPin className="inline mr-2" /> IMEI: {event.imei}
            </div>
            <div className="text-xs text-gray-500">
              <FiClock className="inline mr-2" />{" "}
              {format(
                new Date(event.timestamp),
                "dd MMM yyyy, HH:mm:ss"
              )}
            </div>
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="inline text-gray-700" />
              <div className="flex items-center space-x-2">
                <span className={getIndicatorStyle(event.speed)}></span>
                <span>
                  {event.speed === "0"
                    ? "Arrêt"
                    : `${event.speed} km/h`}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </ScrollArea>

  {/* Pagination */}
  <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
    <Button
      disabled={currentPage === 1}
      onClick={handlePreviousPage}
      className="px-4 py-2"
    >
      Précédent
    </Button>
    <span className="text-sm text-gray-600">
      Page {currentPage} sur {totalPages}
    </span>
    <Button
      disabled={currentPage === totalPages}
      onClick={handleNextPage}
      className="px-4 py-2"
    >
      Suivant
    </Button>
  </div>
</div>

    </div>
  );
}

export default MapsApp;

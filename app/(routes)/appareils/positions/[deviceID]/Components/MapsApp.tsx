"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "./MapsApp.css";
import { CircleGauge, Clock9, MapPin } from "lucide-react";

export interface Historique {
  id: number;
  latitude: string;
  longitude: string;
  speed: string;
  imei: string;
  timestamp: string;
}

const defaultPosition = { lat: 35.76185321080379, lng: -5.836189754217148 };

const coloredIcon = (color: string = "blue") =>
  new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(` 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="25" height="41">
        <path d="M12 0C8.13 0 5 3.13 5 7c0 4.9 7 17 7 17s7-12.1 7-17c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 9.5 12 9.5z" />
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

function FlyToMarker({
  position,
  zoomLevel,
}: {
  position: [number, number];
  zoomLevel: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.flyTo(position, zoomLevel);
    }
  }, [map, position, zoomLevel]);

  return null;
}

function MapsApp({ imei }: { imei: string }) {
  const [historyEvents, setHistoryEvents] = useState<Historique[]>([]);
  const [activeEvent, setActiveEvent] = useState<Historique | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const markerRefs = useRef<Record<number, L.Marker>>({});
  const { fetchAll } = useFetch(`positions/${imei}`);
  const [filter, setFilter] = useState({ ...defaultFilter, size: 10 });

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    try {
      const response = await fetchAll({ ...filter, currentPage: page });
      if (response && response.data) {
        setHistoryEvents(response.data);
        setTotalPages(response.pagination?.totalPage || 1);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des historiques :", error);
    }
  };

  const handleEventClick = (event: Historique) => {
    setActiveEvent(event);
    const marker = markerRefs.current[event.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full md:flex-row">
      {/* Map Section */}
      <div className="flex-grow h-[50vh] md:h-full relative">
        <MapContainer
          center={[35.7632743, -5.8344698]}
          zoom={10}
          style={{ height: "100vh", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {historyEvents.map((event) => (
            <Marker
              key={event.id}
              position={[
                parseFloat(event.latitude),
                parseFloat(event.longitude),
              ]}
              icon={coloredIcon(event.speed === "0" ? "red" : "green")}
              ref={(marker) => {
                if (marker) {
                  markerRefs.current[event.id] = marker;
                }
              }}
            >
              <Popup className="p-0 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow">
                <Card
                  key={event.id}
                  className=" mb-0 bg-transparent border-0 shadow-none cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="text-xs font-semibold">
                      <MapPin className="inline mr-2" />
                      IMEI: {event.imei}
                    </div>
                    <div className="text-xs">
                      <Clock9 className="inline mr-2" />

                      {format(
                        new Date(event.timestamp),
                        "dd MMM yyyy, HH:mm:ss"
                      )}
                    </div>
                    <div className="text-xs">
                      <CircleGauge className="inline mr-2  " />
                      {event.speed === "0" ? (
                        <span className="text-red-500">{event.speed} km/h</span>
                      ) : (
                        <span>{event.speed} km/h</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Popup>
            </Marker>
          ))}
          {activeEvent && (
            <FlyToMarker
              position={[
                parseFloat(activeEvent.latitude),
                parseFloat(activeEvent.longitude),
              ]}
              zoomLevel={15}
            />
          )}
        </MapContainer>
      </div>

      {/* History Section */}
      <div className="w-full h-[50vh] md:h-full border-t md:border-t-0 md:w-1/4 flex flex-col">
      <h4 className=" p-4 mb-0 text-sm font-medium text-gray-600">
              Les Historiques
            </h4>
        <ScrollArea className="flex-grow h-full overflow-auto">
          <div className="p-4">
            {historyEvents.map((event) => (
              <Card
                key={event.id}
                className="p-4 mb-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex flex-col space-y-2">
                  <div className="text-xs font-semibold">
                    <MapPin className="inline mr-2" />
                    IMEI: {event.imei}
                  </div>
                  <div className="text-xs">
                    <Clock9 className="inline mr-2" />

                    {format(new Date(event.timestamp), "dd MMM yyyy, HH:mm:ss")}
                  </div>
                  <div className="text-xs">
                    <CircleGauge className="inline mr-2  " />
                    {event.speed === "0" ? (
                      <span className="text-red-500">{event.speed} km/h</span>
                    ) : (
                      <span>{event.speed} km/h</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Pagination */}
        <div className="sticky bottom-0 bg-transparent border-t px-4 pt-2 flex flex-col justify-between items-center">
          <div className="text-sm">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-4 mt-3">
            <Button disabled={currentPage === 1} onClick={handlePreviousPage}>
              Précédent
            </Button>

            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Suivant
            </Button>
          </div>
          </div>
      </div>
    </div>
  );
}

export default MapsApp;

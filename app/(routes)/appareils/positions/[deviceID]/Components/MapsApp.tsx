"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "./MapsApp.css";
import { CircleGauge, Clock9, MapPin } from "lucide-react";
import moment from "moment";
import L from "leaflet";

export interface Historique {
  id: number;
  latitude: string;
  longitude: string;
  speed: string;
  imei: string;
  timestamp: string;
}

const defaultPosition = { lat: 35.76185321080379, lng: -5.836189754217148 };

const createArrowIcon = (color: string, rotation: number) =>
  L.divIcon({
    className: "",
    html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
          <defs>
            <filter id="arrowShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.4"/>
            </filter>
          </defs>
  
          <!-- Marker shape without inner circle -->
          <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  
          <!-- Fancy arrow with rotation and shadow -->
          <g transform="rotate(${rotation}, 12, 12)" filter="url(#arrowShadow)">
            <path 
              d="M12 6l-3 6h2v6h2v-6h2z" 
              fill="#ffffff" 
              stroke="#333" 
              stroke-width="0.8"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      `,
    iconSize: [40, 40],
    iconAnchor: [20, 40], // bottom center anchor
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
        handleEventClick(response.data[0]);
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

  function calculateBearing(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.cos(toRad(lon2 - lon1));
    const brng = Math.atan2(y, x);
    return (toDeg(brng) + 360) % 360;
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full md:flex-row">
      {/* Map Section */}
      <div className="flex-grow h-[50vh] md:h-full relative">
        <MapContainer
          center={[31.9108605, -14.1978022]}
          zoom={5}
          style={{ height: "100vh", width: "100%", zIndex: 0 }}
        >
          {historyEvents.length > 1 && (
            <Polyline
              positions={historyEvents.map((pos: any) => [
                pos.latitude,
                pos.longitude,
              ])}
              pathOptions={{ color: "blue", weight: 2 }}
            />
          )}

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {historyEvents.map((event: any, index: number) => {
            const prev = historyEvents[index - 1];
            const bearing = prev
              ? calculateBearing(
                  event.latitude,
                  event.longitude,
                  parseFloat(prev.latitude),
                  parseFloat(prev.longitude)
                )
              : 0;

            const color =
              parseFloat(event.speed) > 120
                ? "#35d7ca"
                : parseFloat(event.speed) > 100
                ? "#71b0ff"
                : parseFloat(event.speed) > 80
                ? "#bee131"
                : parseFloat(event.speed) > 60
                ? "#54c254"
                : parseFloat(event.speed) > 5
                ? "#f7f301"
                : parseFloat(event.speed) > 0
                ? "red"
                : "blue";

            return (
              <Marker
                key={event.id}
                position={[
                  parseFloat(event.latitude),
                  parseFloat(event.longitude),
                ]}
                icon={createArrowIcon(color, bearing)}
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
                          <span className="text-red-500">
                            {event.speed} km/h -{" "}
                            {moment(event?.timestamp).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </span>
                        ) : (
                          <span>{event.speed} km/h</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Popup>
              </Marker>
            );
          })}
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

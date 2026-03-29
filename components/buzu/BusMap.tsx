"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeStop, extractStops } from "@/lib/bus-geo";

// Fix for default marker icon in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BusMapProps {
  itinerary: string;
}

// Helper to auto-center the map when coords change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function BusMap({ itinerary }: BusMapProps) {
  const [positions, setPositions] = useState<Array<{ name: string; coords: [number, number] }>>([]);
  const [loading, setLoading] = useState(false);
  
  const VCA_CENTER: [number, number] = [-14.8617, -40.8442];

  useEffect(() => {
    async function loadPositions() {
      const stops = extractStops(itinerary);
      // To avoid flooding Nominatim, we'll only geocode the first, middle and last stops
      // Or we can try to geocode up to 5 main points
      const mainStops = stops.length > 5 
        ? [stops[0], stops[Math.floor(stops.length / 2)], stops[stops.length - 1]] 
        : stops;

      setLoading(true);
      const results = [];
      for (const stop of mainStops) {
        const coords = await geocodeStop(stop);
        if (coords) {
          results.push({ name: stop, coords });
        }
      }
      setPositions(results);
      setLoading(false);
    }

    if (itinerary) {
      loadPositions();
    }
  }, [itinerary]);

  const polylineCoords = positions.map(p => p.coords);
  const center = positions.length > 0 ? positions[0].coords : VCA_CENTER;

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-card relative group">
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-xs font-medium">Buscando coordenadas...</span>
          </div>
        </div>
      )}
      
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {positions.map((pos, idx) => (
          <Marker key={`${pos.name}-${idx}`} position={pos.coords}>
            <Popup>
              <div className="p-2">
                <p className="font-bold text-sm mb-1">{pos.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Ponto da Linha</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline positions={polylineCoords} color="hsl(var(--primary))" weight={4} opacity={0.6} dashArray="10, 10" />
        )}
        
        <ChangeView center={center} />
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] bg-card/80 backdrop-blur-md p-3 rounded-xl border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[10px] font-bold text-primary uppercase mb-1">Mapa de Itinerário</p>
        <p className="text-xs text-muted-foreground leading-tight max-w-[150px]">
          Exibindo principais marcos baseados nos nomes das ruas.
        </p>
      </div>
    </div>
  );
}

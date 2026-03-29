"use client";

// Simple in-memory cache to avoid redundant geocoding calls during a session
const geoCache: Record<string, [number, number]> = {
  "Vitoria da Conquista": [-14.8617, -40.8442],
  "Estação Herzem Gusmão": [-14.8541, -40.8407],
  "UESB": [-14.8361, -40.8033],
};

export async function geocodeStop(street: string): Promise<[number, number] | null> {
  const query = `${street}, Vitória da Conquista, BA, Brazil`;
  
  if (geoCache[street]) return geoCache[street];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          "User-Agent": "VcaBuzu-App-VCANews",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.length > 0) {
      const result: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geoCache[street] = result;
      return result;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  return null;
}

export function extractStops(itinerary: string): string[] {
  if (!itinerary) return [];
  return itinerary
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 3 && !s.includes("----"));
}

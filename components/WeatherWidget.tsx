"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Thermometer, CloudLightning, CloudSnow } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  rainProbability: number;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const lat = -14.8661;
        const lon = -40.8394;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,weather_code&hourly=temperature_2m,precipitation_probability&timezone=auto&forecast_days=1`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            condition: getWeatherIcon(data.current.weather_code),
            rainProbability: data.hourly.precipitation_probability[new Date().getHours()],
          });
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  function getWeatherIcon(code: number) {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return "sun";
    if (code >= 1 && code <= 3) return "cloud-sun";
    if (code >= 45 && code <= 48) return "fog";
    if (code >= 51 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 80 && code <= 82) return "showers";
    if (code >= 95 && code <= 99) return "thunderstorm";
    return "cloud";
  }

  const RenderIcon = ({ condition }: { condition: string }) => {
    switch (condition) {
      case "sun":
        return <Sun className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case "cloud-sun":
        return <Cloud className="h-4 w-4 text-slate-400" />;
      case "rain":
      case "showers":
        return <CloudRain className="h-4 w-4 text-blue-500 animate-bounce" />;
      case "thunderstorm":
        return <CloudLightning className="h-4 w-4 text-purple-500" />;
      case "snow":
        return <CloudSnow className="h-4 w-4 text-blue-200" />;
      default:
        return <Cloud className="h-4 w-4 text-slate-400" />;
    }
  };

  if (loading) {
    return <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-full hidden sm:block" />;
  }

  if (!weather) return null;

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md group cursor-default">
      <div className="flex items-center justify-center">
        <RenderIcon condition={weather.condition} />
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-0.5">
          <span className="text-xs font-black text-slate-700">{weather.temp}°</span>
          <Thermometer className="h-2 w-2 text-slate-400 group-hover:text-primary transition-colors" />
        </div>
        {weather.rainProbability > 20 && (
          <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">
            {weather.rainProbability}% chuva
          </span>
        )}
      </div>
      <div className="h-4 w-[1px] bg-slate-200 mx-1" />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">VCA</span>
    </div>
  );
}


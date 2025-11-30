import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapIcon, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OPENWEATHER_API_KEY } from "@/config/constants";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface WeatherMapProps {
  lat: number;
  lon: number;
}

// Component to handle map center updates
const MapUpdater = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  
  return null;
};

export const WeatherMap = ({ lat, lon }: WeatherMapProps) => {
  const [mapLayer, setMapLayer] = useState<string>("precipitation");

  const getLayerUrl = () => {
    let layerType = "precipitation_new";
    
    if (mapLayer === "clouds") {
      layerType = "clouds_new";
    } else if (mapLayer === "temperature") {
      layerType = "temp_new";
    } else if (mapLayer === "wind") {
      layerType = "wind_new";
    }

    return `https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-border/20 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapIcon className="w-6 h-6 text-primary" />
          <h3 className="font-heading text-xl font-bold">Weather Radar</h3>
        </div>

        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <Select value={mapLayer} onValueChange={setMapLayer}>
            <SelectTrigger className="w-[140px] h-9 text-sm glass-card border-border/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="precipitation">Precipitation</SelectItem>
              <SelectItem value="clouds">Clouds</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="wind">Wind Speed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-border/10">
        <MapContainer
          center={[lat, lon]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <MapUpdater lat={lat} lon={lon} />
          
          {/* Base map layer - OpenStreetMap with dark theme */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Weather overlay from OpenWeatherMap */}
          <TileLayer
            url={getLayerUrl()}
            opacity={0.7}
          />
          
          {/* Marker for current location */}
          <Marker position={[lat, lon]}>
            <Popup>
              Your selected location
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <p className="mt-3 text-sm text-muted-foreground text-center">
        Interactive map showing real-time weather patterns
      </p>
    </div>
  );
};

import { Eye, Gauge, Thermometer, Sunrise, Sunset } from "lucide-react";

interface ExtendedDetailsProps {
  feelsLike: number;
  visibility: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  unit: "metric" | "imperial";
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ExtendedDetails = ({
  feelsLike,
  visibility,
  pressure,
  sunrise,
  sunset,
  unit,
}: ExtendedDetailsProps) => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-border/20 backdrop-blur-xl animate-fade-in">
      <h3 className="font-heading text-2xl font-bold mb-4">Extended Details</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Thermometer className="w-5 h-5" />
            <span className="text-sm">Feels Like</span>
          </div>
          <p className="text-2xl font-bold">
            {Math.round(feelsLike)}°{unit === "metric" ? "C" : "F"}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-5 h-5" />
            <span className="text-sm">Visibility</span>
          </div>
          <p className="text-2xl font-bold">
            {(visibility / 1000).toFixed(1)} km
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-5 h-5" />
            <span className="text-sm">Pressure</span>
          </div>
          <p className="text-2xl font-bold">{pressure} hPa</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sunrise className="w-5 h-5" />
            <span className="text-sm">Sunrise</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(sunrise)}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sunset className="w-5 h-5" />
            <span className="text-sm">Sunset</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(sunset)}</p>
        </div>
      </div>
    </div>
  );
};
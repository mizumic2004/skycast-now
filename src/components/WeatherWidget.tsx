import { useState } from "react";
import { Cloud, ChevronDown, ChevronUp, Droplets, Wind } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weatherIcons";

interface WeatherWidgetProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherWidget = ({ weather, unit }: WeatherWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tempSymbol = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "km/h" : "mph";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      {isExpanded ? (
        <Card className="glass-card border border-border/20 p-4 w-64 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              <span className="font-heading font-bold text-sm">SkyScope</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 rounded-full hover:bg-muted/50"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {weather.district ? `${weather.district}, ${weather.city}` : weather.city}
                </p>
                <p className="text-3xl font-bold font-heading">
                  {Math.round(weather.temperature)}{tempSymbol}
                </p>
              </div>
              <div className="text-5xl">{getWeatherIcon(weather.condition)}</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Wind className="w-4 h-4" />
                <span>{Math.round(weather.windSpeed)} {windUnit}</span>
              </div>
            </div>

            <p className="text-sm text-center text-muted-foreground capitalize">
              {weather.condition}
            </p>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full h-14 w-14 shadow-2xl glass-card border border-border/20 hover:scale-110 transition-transform"
          size="icon"
        >
          <div className="flex flex-col items-center justify-center">
            <Cloud className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-bold">
              {Math.round(weather.temperature)}°
            </span>
          </div>
        </Button>
      )}
    </div>
  );
};

import { Card } from "@/components/ui/card";
import { Wind, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

interface WindCompassProps {
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  unit: "metric" | "imperial";
}

export const WindCompass = ({ windSpeed, windDeg, windGust, unit }: WindCompassProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Animate rotation
    setRotation(windDeg);
  }, [windDeg]);

  const getWindDirection = (deg: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  const getWindDescription = (speed: number, unit: string) => {
    const threshold = unit === "metric" ? [1, 12, 29, 39, 50, 62, 75, 89, 103, 118] : [1, 7, 18, 24, 31, 39, 47, 55, 64, 73];
    const descriptions = ["Calm", "Light Air", "Light Breeze", "Gentle Breeze", "Moderate Breeze", "Fresh Breeze", "Strong Breeze", "Near Gale", "Gale", "Strong Gale", "Storm"];
    
    for (let i = 0; i < threshold.length; i++) {
      if (speed < threshold[i]) return descriptions[i];
    }
    return descriptions[descriptions.length - 1];
  };

  const direction = getWindDirection(windDeg);
  const description = getWindDescription(windSpeed, unit);

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Wind className="w-5 h-5 text-primary" />
        Wind Compass
      </h3>

      <div className="space-y-6">
        {/* Compass Visual */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Compass Circle */}
          <div className="absolute inset-0 rounded-full border-4 border-border/20 bg-background/50">
            {/* Cardinal Directions */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-primary">N</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-muted-foreground">S</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">W</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">E</div>
            
            {/* Degree Marks */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) - 90;
              const x = 50 + 42 * Math.cos((angle * Math.PI) / 180);
              const y = 50 + 42 * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-border rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              );
            })}
          </div>

          {/* Wind Arrow */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <Navigation className="w-16 h-16 text-primary fill-primary" />
          </div>

          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Wind Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Direction</span>
            <span className="font-semibold">{direction} ({windDeg}°)</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Speed</span>
            <span className="font-semibold">
              {Math.round(windSpeed)} {unit === "metric" ? "km/h" : "mph"}
            </span>
          </div>

          {windGust && windGust > windSpeed && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Gusts</span>
              <span className="font-semibold">
                {Math.round(windGust)} {unit === "metric" ? "km/h" : "mph"}
              </span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-center font-semibold">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

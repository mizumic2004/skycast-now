import { Sunrise, Sunset } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SunriseSunsetProps {
  sunrise: number;
  sunset: number;
}

export const SunriseSunset = ({ sunrise, sunset }: SunriseSunsetProps) => {
  const now = Date.now() / 1000;
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);
  
  const sunriseTime = sunriseDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const sunsetTime = sunsetDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate progress (0-100)
  const dayLength = sunset - sunrise;
  const timeSinceSunrise = now - sunrise;
  const progress = Math.max(0, Math.min(100, (timeSinceSunrise / dayLength) * 100));
  
  const isDaytime = now >= sunrise && now <= sunset;

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Sunrise className="w-5 h-5 text-primary" />
        Sun Position
      </h3>
      
      <div className="space-y-6">
        {/* Sun Arc Visualization */}
        <div className="relative h-32">
          {/* Arc background */}
          <svg className="w-full h-full" viewBox="0 0 200 100">
            <path
              d="M 10 90 Q 100 10, 190 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border/30"
            />
            {/* Progress arc */}
            <path
              d="M 10 90 Q 100 10, 190 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-primary"
              strokeDasharray={`${progress * 2.4} 240`}
              strokeLinecap="round"
            />
            {/* Sun indicator */}
            {isDaytime && (
              <circle
                cx={10 + (180 * progress) / 100}
                cy={90 - Math.sin((progress * Math.PI) / 100) * 80}
                r="6"
                fill="currentColor"
                className="text-primary animate-pulse"
              />
            )}
          </svg>
        </div>

        {/* Times */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="font-semibold">{sunriseTime}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sunset className="w-5 h-5 text-purple-400" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Sunset</p>
              <p className="font-semibold">{sunsetTime}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isDaytime 
              ? `${Math.round(progress)}% of daylight remaining`
              : "Currently nighttime"
            }
          </p>
        </div>
      </div>
    </Card>
  );
};

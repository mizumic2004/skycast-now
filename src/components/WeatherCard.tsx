import { Cloud, CloudRain, Sun, CloudSnow, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherCardProps {
  temperature: number;
  condition: string;
  city: string;
  district?: string;
  country: string;
  humidity: number;
  windSpeed: number;
  unit?: "metric" | "imperial";
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain")) return CloudRain;
  if (lowerCondition.includes("cloud")) return Cloud;
  if (lowerCondition.includes("snow")) return CloudSnow;
  if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) return Sun;
  return Wind;
};

export const WeatherCard = ({ 
  temperature, 
  condition, 
  city,
  district,
  country,
  humidity,
  windSpeed,
  unit = "metric"
}: WeatherCardProps) => {
  const WeatherIcon = getWeatherIcon(condition);

  // Tạo tên địa điểm đầy đủ
  const locationName = district ? `${district}, ${city}` : city;

  return (
    <Card className="glass-card shadow-card p-8 md:p-12 border-border/20 animate-fade-in">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-2xl md:text-3xl mb-2">
            {locationName}, {country}
          </h2>
          <p className="text-muted-foreground text-lg">{condition}</p>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <WeatherIcon className="w-24 h-24 md:w-32 md:h-32 text-primary animate-float" strokeWidth={1.5} />
          <div className="text-8xl md:text-9xl font-heading font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            {Math.round(temperature)}°{unit === "metric" ? "C" : "F"}
          </div>
        </div>

        <div className="flex gap-8 mt-6 text-center">
          <div className="flex flex-col">
            <span className="text-3xl font-heading font-bold text-primary">
              {humidity}%
            </span>
            <span className="text-sm text-muted-foreground mt-1">Humidity</span>
          </div>
          <div className="w-px bg-border/50" />
          <div className="flex flex-col">
            <span className="text-3xl font-heading font-bold text-secondary">
              {Math.round(windSpeed)}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              Wind {unit === "metric" ? "km/h" : "mph"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

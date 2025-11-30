import { Cloud, CloudRain, Sun, CloudSnow, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ForecastCardProps {
  day: string;
  temperature: number;
  condition: string;
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

export const ForecastCard = ({ day, temperature, condition, unit = "metric" }: ForecastCardProps) => {
  const WeatherIcon = getWeatherIcon(condition);

  return (
    <Card className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 border-border/20">
      <p className="font-heading text-lg mb-4 text-muted-foreground">{day}</p>
      <WeatherIcon className="w-12 h-12 mx-auto mb-4 text-primary" strokeWidth={1.5} />
      <p className="font-heading text-3xl font-bold">
        {Math.round(temperature)}°{unit === "metric" ? "C" : "F"}
      </p>
      <p className="text-sm text-muted-foreground mt-2">{condition}</p>
    </Card>
  );
};

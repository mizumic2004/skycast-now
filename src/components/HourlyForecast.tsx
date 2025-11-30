import { Cloud, CloudRain, CloudSnow, Sun } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface HourlyData {
  time: string;
  temperature: number;
  condition: string;
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
  unit: "metric" | "imperial";
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "rain":
    case "drizzle":
      return <CloudRain className="w-8 h-8 text-primary" />;
    case "snow":
      return <CloudSnow className="w-8 h-8 text-blue-400" />;
    case "clouds":
      return <Cloud className="w-8 h-8 text-gray-400" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-400" />;
  }
};

export const HourlyForecast = ({ hourlyData, unit }: HourlyForecastProps) => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-border/20 backdrop-blur-xl animate-fade-in">
      <h3 className="font-heading text-2xl font-bold mb-4">24-Hour Forecast</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl bg-background/40 border border-border/10"
            >
              <span className="text-sm font-medium">{hour.time}</span>
              {getWeatherIcon(hour.condition)}
              <span className="text-lg font-bold">
                {Math.round(hour.temperature)}°{unit === "metric" ? "C" : "F"}
              </span>
              <span className="text-xs text-muted-foreground">{hour.condition}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
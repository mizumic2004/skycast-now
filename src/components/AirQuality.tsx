import { Wind } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AirQualityProps {
  aqi: number;
  components: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
  };
}

const getAQILevel = (aqi: number) => {
  switch (aqi) {
    case 1: return { level: "Good", color: "text-green-500", desc: "Air quality is excellent" };
    case 2: return { level: "Fair", color: "text-yellow-500", desc: "Air quality is acceptable" };
    case 3: return { level: "Moderate", color: "text-orange-500", desc: "Sensitive people should reduce outdoor exercise" };
    case 4: return { level: "Poor", color: "text-red-500", desc: "Everyone should reduce outdoor activities" };
    case 5: return { level: "Very Poor", color: "text-purple-500", desc: "Avoid outdoor activities" };
    default: return { level: "Unknown", color: "text-gray-500", desc: "No data available" };
  }
};

export const AirQuality = ({ aqi, components }: AirQualityProps) => {
  const aqiInfo = getAQILevel(aqi);
  
  return (
    <div className="glass-card p-6 rounded-3xl border border-border/20 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Wind className="w-6 h-6 text-primary" />
        <h3 className="font-heading text-xl font-bold">Air Quality</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{aqi}</span>
          <span className={`text-lg font-semibold ${aqiInfo.color}`}>{aqiInfo.level}</span>
        </div>
        
        <Progress value={(aqi / 5) * 100} className="h-2" />
        
        <p className="text-sm text-muted-foreground mb-4">{aqiInfo.desc}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">PM2.5</span>
              <span className="font-medium">{components.pm2_5.toFixed(1)} μg/m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PM10</span>
              <span className="font-medium">{components.pm10.toFixed(1)} μg/m³</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">O₃</span>
              <span className="font-medium">{components.o3.toFixed(1)} μg/m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NO₂</span>
              <span className="font-medium">{components.no2.toFixed(1)} μg/m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
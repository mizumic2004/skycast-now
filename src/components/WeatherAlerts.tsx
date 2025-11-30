import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WeatherAlert {
  event: string;
  description: string;
  start: number;
  end: number;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (alerts.length === 0) return null;
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="font-heading text-2xl font-bold flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-destructive" />
        Weather Alerts
      </h3>
      
      {alerts.map((alert, index) => (
        <Alert key={index} variant="destructive" className="glass-card border-destructive/50">
          <AlertTitle className="font-bold text-lg">{alert.event}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">{alert.description}</p>
            <p className="text-sm">
              <span className="font-medium">Valid:</span> {formatDate(alert.start)} - {formatDate(alert.end)}
            </p>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
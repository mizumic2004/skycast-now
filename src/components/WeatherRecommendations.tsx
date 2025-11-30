import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Umbrella, 
  Sun, 
  Wind, 
  Snowflake, 
  Cloud,
  AlertTriangle,
  ThumbsUp,
  Coffee
} from "lucide-react";

interface WeatherRecommendationsProps {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  unit: "metric" | "imperial";
}

export const WeatherRecommendations = ({
  temperature,
  condition,
  humidity,
  windSpeed,
  unit,
}: WeatherRecommendationsProps) => {
  const getRecommendations = () => {
    const recommendations: Array<{ text: string; icon: any; type: "info" | "warning" | "success" }> = [];
    
    // Temperature-based recommendations
    if (temperature > (unit === "metric" ? 30 : 86)) {
      recommendations.push({
        text: "Very hot! Stay hydrated and avoid prolonged sun exposure",
        icon: AlertTriangle,
        type: "warning",
      });
    } else if (temperature > (unit === "metric" ? 25 : 77)) {
      recommendations.push({
        text: "Perfect weather for outdoor activities!",
        icon: ThumbsUp,
        type: "success",
      });
    } else if (temperature < (unit === "metric" ? 0 : 32)) {
      recommendations.push({
        text: "Freezing temperatures! Dress warmly and be careful of ice",
        icon: Snowflake,
        type: "warning",
      });
    } else if (temperature < (unit === "metric" ? 10 : 50)) {
      recommendations.push({
        text: "Cold weather - wear layers and a warm jacket",
        icon: Wind,
        type: "info",
      });
    }

    // Condition-based recommendations
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      recommendations.push({
        text: "Don't forget your umbrella!",
        icon: Umbrella,
        type: "info",
      });
    } else if (lowerCondition.includes("snow")) {
      recommendations.push({
        text: "Snowy conditions - drive carefully and dress warmly",
        icon: Snowflake,
        type: "warning",
      });
    } else if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      recommendations.push({
        text: "Clear skies - great day for a walk or picnic!",
        icon: Sun,
        type: "success",
      });
    } else if (lowerCondition.includes("cloud")) {
      recommendations.push({
        text: "Cloudy but comfortable - good for outdoor errands",
        icon: Cloud,
        type: "info",
      });
    }

    // Wind-based recommendations
    if (windSpeed > (unit === "metric" ? 40 : 25)) {
      recommendations.push({
        text: "Very windy conditions - secure loose objects",
        icon: Wind,
        type: "warning",
      });
    }

    // Humidity-based recommendations
    if (humidity > 80) {
      recommendations.push({
        text: "High humidity - might feel uncomfortable outdoors",
        icon: Coffee,
        type: "info",
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <ThumbsUp className="w-5 h-5 text-primary" />
        Recommendations
      </h3>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/20"
            >
              <Badge
                variant={
                  rec.type === "warning"
                    ? "destructive"
                    : rec.type === "success"
                    ? "default"
                    : "secondary"
                }
                className="mt-0.5"
              >
                <Icon className="w-3 h-3" />
              </Badge>
              <p className="text-sm flex-1">{rec.text}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

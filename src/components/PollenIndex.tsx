import { Card } from "@/components/ui/card";
import { Flower2, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PollenIndexProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export const PollenIndex = ({ temperature, humidity, windSpeed, condition }: PollenIndexProps) => {
  // Estimate pollen levels based on weather conditions
  const estimatePollenLevel = () => {
    let score = 0;
    
    // Temperature factor (higher temps = more pollen)
    if (temperature > 15 && temperature < 25) score += 3;
    else if (temperature >= 25) score += 4;
    else if (temperature > 10) score += 2;
    else score += 1;
    
    // Humidity factor (moderate humidity = more pollen)
    if (humidity > 40 && humidity < 70) score += 2;
    else if (humidity >= 70) score += 1;
    else score += 3;
    
    // Wind factor (windy = more pollen spread)
    if (windSpeed > 20) score += 3;
    else if (windSpeed > 10) score += 2;
    else score += 1;
    
    // Weather condition factor
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain")) score -= 4;
    else if (lowerCondition.includes("cloud")) score += 1;
    else if (lowerCondition.includes("clear")) score += 2;
    
    return Math.max(1, Math.min(5, Math.round(score / 3)));
  };

  const pollenLevel = estimatePollenLevel();

  const getPollenInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: "Low",
          color: "text-green-500",
          icon: CheckCircle,
          description: "Most people won't be affected by pollen",
          recommendations: ["Great day for outdoor activities", "Minimal allergy symptoms expected"],
        };
      case 2:
        return {
          label: "Low-Medium",
          color: "text-blue-500",
          icon: CheckCircle,
          description: "Pollen levels are relatively low",
          recommendations: ["Good conditions for most people", "Sensitive individuals may experience mild symptoms"],
        };
      case 3:
        return {
          label: "Medium",
          color: "text-yellow-500",
          icon: AlertCircle,
          description: "Moderate pollen levels in the air",
          recommendations: ["Consider taking antihistamines if allergic", "Limit time outdoors if sensitive"],
        };
      case 4:
        return {
          label: "Medium-High",
          color: "text-orange-500",
          icon: AlertTriangle,
          description: "High pollen levels expected",
          recommendations: ["Take allergy medication", "Keep windows closed", "Wear sunglasses outdoors"],
        };
      case 5:
        return {
          label: "High",
          color: "text-red-500",
          icon: AlertTriangle,
          description: "Very high pollen levels",
          recommendations: ["Stay indoors when possible", "Take prescribed allergy medication", "Shower after being outside"],
        };
      default:
        return {
          label: "Unknown",
          color: "text-muted-foreground",
          icon: AlertCircle,
          description: "Unable to determine pollen levels",
          recommendations: [],
        };
    }
  };

  const info = getPollenInfo(pollenLevel);
  const Icon = info.icon;

  // Common pollen types by season
  const getPollenTypes = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) {
      return ["Tree Pollen", "Grass Pollen"];
    } else if (month >= 6 && month <= 8) {
      return ["Grass Pollen", "Weed Pollen"];
    } else if (month >= 9 && month <= 10) {
      return ["Weed Pollen", "Ragweed"];
    } else {
      return ["Low Pollen Season"];
    }
  };

  const pollenTypes = getPollenTypes();

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Flower2 className="w-5 h-5 text-primary" />
        Pollen & Allergies
      </h3>

      <div className="space-y-6">
        {/* Pollen Level Display */}
        <div className="text-center space-y-2">
          <Icon className={`w-16 h-16 mx-auto ${info.color}`} />
          <h4 className={`font-heading text-2xl font-bold ${info.color}`}>{info.label}</h4>
          <p className="text-sm text-muted-foreground">{info.description}</p>
        </div>

        {/* Level Indicator */}
        <div className="flex justify-between items-center gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`flex-1 h-2 rounded-full transition-all ${
                level <= pollenLevel ? "bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" : "bg-border/20"
              }`}
            />
          ))}
        </div>

        {/* Pollen Types */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Active Pollen Types:</p>
          <div className="flex flex-wrap gap-2">
            {pollenTypes.map((type, index) => (
              <Badge key={index} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {info.recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Recommendations:</p>
            <div className="space-y-2">
              {info.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <span className="text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/20">
          *Estimated based on current weather conditions
        </div>
      </div>
    </Card>
  );
};

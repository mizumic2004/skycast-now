import { Sun } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UVIndexProps {
  uv: number;
}

const getUVLevel = (uv: number) => {
  if (uv <= 2) return { level: "Low", color: "text-green-500", advice: "No protection needed" };
  if (uv <= 5) return { level: "Moderate", color: "text-yellow-500", advice: "Protection recommended" };
  if (uv <= 7) return { level: "High", color: "text-orange-500", advice: "Protection required" };
  if (uv <= 10) return { level: "Very High", color: "text-red-500", advice: "Extra protection required" };
  return { level: "Extreme", color: "text-purple-500", advice: "Avoid sun exposure" };
};

export const UVIndex = ({ uv }: UVIndexProps) => {
  const uvInfo = getUVLevel(uv);
  
  return (
    <div className="glass-card p-6 rounded-3xl border border-border/20 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Sun className="w-6 h-6 text-primary" />
        <h3 className="font-heading text-xl font-bold">UV Index</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{uv.toFixed(1)}</span>
          <span className={`text-lg font-semibold ${uvInfo.color}`}>{uvInfo.level}</span>
        </div>
        
        <Progress value={(uv / 11) * 100} className="h-2" />
        
        <p className="text-sm text-muted-foreground">{uvInfo.advice}</p>
      </div>
    </div>
  );
};
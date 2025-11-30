import { Card } from "@/components/ui/card";
import { CloudRain } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyPrecipitation {
  time: string;
  probability: number;
  amount: number;
}

interface PrecipitationChartProps {
  data: HourlyPrecipitation[];
}

export const PrecipitationChart = ({ data }: PrecipitationChartProps) => {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/20 rounded-lg">
          <p className="font-semibold mb-1">{payload[0].payload.time}</p>
          <p className="text-sm text-primary">
            Chance: {payload[0].value}%
          </p>
          {payload[0].payload.amount > 0 && (
            <p className="text-sm text-muted-foreground">
              Amount: {payload[0].payload.amount.toFixed(1)}mm
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-2xl font-semibold mb-6 flex items-center gap-2">
        <CloudRain className="w-6 h-6 text-primary" />
        Precipitation Forecast
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/20" />
          <XAxis
            dataKey="time"
            className="text-muted-foreground"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            className="text-muted-foreground"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={{
              value: "Probability (%)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--muted-foreground))" },
            }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="probability"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#precipGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-muted-foreground text-center">
        Hourly precipitation probability for the next 24 hours
      </div>
    </Card>
  );
};

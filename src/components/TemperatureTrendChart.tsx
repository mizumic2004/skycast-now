import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DayTemp {
  day: string;
  high: number;
  low: number;
  date: string;
}

interface TemperatureTrendChartProps {
  data: DayTemp[];
  unit: "metric" | "imperial";
}

export const TemperatureTrendChart = ({ data, unit }: TemperatureTrendChartProps) => {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/20 rounded-lg">
          <p className="font-semibold mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-primary">
            High: {payload[0].value}°{unit === "metric" ? "C" : "F"}
          </p>
          <p className="text-sm text-secondary">
            Low: {payload[1].value}°{unit === "metric" ? "C" : "F"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-2xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        7-Day Temperature Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/20" />
          <XAxis
            dataKey="day"
            className="text-muted-foreground"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            className="text-muted-foreground"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={{
              value: `Temperature (°${unit === "metric" ? "C" : "F"})`,
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
            activeDot={{ r: 7 }}
            name="High Temperature"
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="hsl(var(--secondary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--secondary))", r: 5 }}
            activeDot={{ r: 7 }}
            name="Low Temperature"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary"></div>
          <span className="text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-secondary"></div>
          <span className="text-muted-foreground">Low</span>
        </div>
      </div>
    </Card>
  );
};

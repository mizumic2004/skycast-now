import { Button } from "@/components/ui/button";

interface UnitToggleProps {
  unit: "metric" | "imperial";
  onToggle: () => void;
}

export const UnitToggle = ({ unit, onToggle }: UnitToggleProps) => {
  return (
    <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-border/20">
      <Button
        variant={unit === "metric" ? "default" : "ghost"}
        size="sm"
        onClick={onToggle}
        className="rounded-full"
      >
        °C
      </Button>
      <Button
        variant={unit === "imperial" ? "default" : "ghost"}
        size="sm"
        onClick={onToggle}
        className="rounded-full"
      >
        °F
      </Button>
    </div>
  );
};
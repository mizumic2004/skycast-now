import { Card } from "@/components/ui/card";
import { Moon } from "lucide-react";

interface MoonPhaseProps {
  timestamp?: number;
}

export const MoonPhase = ({ timestamp = Date.now() }: MoonPhaseProps) => {
  // Calculate moon phase (0 = New Moon, 0.5 = Full Moon)
  const getMoonPhase = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0;
    let e = 0;
    let jd = 0;
    let b = 0;

    if (month < 3) {
      const yearMod = year - 1;
      const monthMod = month + 12;
      c = yearMod / 100;
      e = yearMod % 100;
      jd = Math.floor((146097 * c) / 4) + Math.floor((1461 * e) / 4) + Math.floor((153 * monthMod + 2) / 5) + day + 1721119;
    } else {
      c = year / 100;
      e = year % 100;
      jd = Math.floor((146097 * c) / 4) + Math.floor((1461 * e) / 4) + Math.floor((153 * month + 2) / 5) + day + 1721119;
    }

    b = jd - 2451550.1;
    const phase = (b / 29.530588853) % 1;
    
    return phase < 0 ? phase + 1 : phase;
  };

  const date = new Date(timestamp);
  const phase = getMoonPhase(date);

  const getPhaseName = (phase: number) => {
    if (phase < 0.0625) return "New Moon";
    if (phase < 0.1875) return "Waxing Crescent";
    if (phase < 0.3125) return "First Quarter";
    if (phase < 0.4375) return "Waxing Gibbous";
    if (phase < 0.5625) return "Full Moon";
    if (phase < 0.6875) return "Waning Gibbous";
    if (phase < 0.8125) return "Last Quarter";
    if (phase < 0.9375) return "Waning Crescent";
    return "New Moon";
  };

  const getPhaseEmoji = (phase: number) => {
    if (phase < 0.0625) return "🌑";
    if (phase < 0.1875) return "🌒";
    if (phase < 0.3125) return "🌓";
    if (phase < 0.4375) return "🌔";
    if (phase < 0.5625) return "🌕";
    if (phase < 0.6875) return "🌖";
    if (phase < 0.8125) return "🌗";
    if (phase < 0.9375) return "🌘";
    return "🌑";
  };

  const getIllumination = (phase: number) => {
    // Calculate illumination percentage
    return Math.round(50 * (1 - Math.cos(phase * 2 * Math.PI)));
  };

  const phaseName = getPhaseName(phase);
  const phaseEmoji = getPhaseEmoji(phase);
  const illumination = getIllumination(phase);

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Moon className="w-5 h-5 text-primary" />
        Moon Phase
      </h3>

      <div className="space-y-6">
        {/* Moon Visual */}
        <div className="flex flex-col items-center">
          <div className="text-8xl mb-4 animate-pulse">{phaseEmoji}</div>
          <h4 className="font-heading text-2xl font-semibold">{phaseName}</h4>
        </div>

        {/* Moon Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Illumination</span>
            <span className="font-semibold">{illumination}%</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Phase Progress</span>
            <span className="font-semibold">{Math.round(phase * 100)}%</span>
          </div>

          {/* Illumination Bar */}
          <div className="mt-4">
            <div className="w-full h-2 bg-border/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${illumination}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center pt-2">
          Current lunar cycle position
        </div>
      </div>
    </Card>
  );
};

import { useEffect, useState } from "react";

interface WeatherAnimationsProps {
  condition: string;
}

export const WeatherAnimations = ({ condition }: WeatherAnimationsProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
      const raindrops = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(raindrops);
    } else if (condition.toLowerCase().includes("snow")) {
      const snowflakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
      }));
      setParticles(snowflakes);
    } else {
      setParticles([]);
    }
  }, [condition]);

  if (particles.length === 0) return null;

  const isRain = condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle");
  const isSnow = condition.toLowerCase().includes("snow");

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animation: isRain
              ? "fall 1s linear infinite"
              : isSnow
              ? "snowfall 4s linear infinite"
              : "none",
          }}
        >
          {isRain && (
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400/60 to-transparent" />
          )}
          {isSnow && (
            <div className="w-2 h-2 bg-white/80 rounded-full shadow-sm" />
          )}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0.5;
          }
        }
        
        @keyframes snowfall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};
import { useState } from "react";
import { Share2, Download, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { toast } from "sonner";

interface WeatherShareProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherShare = ({ weather, unit }: WeatherShareProps) => {
  const [copied, setCopied] = useState(false);

  const tempSymbol = unit === "metric" ? "°C" : "°F";
  
  const displayName = weather.district 
    ? `${weather.district}, ${weather.city}` 
    : weather.city;

  const shareText = `🌤️ Weather in ${displayName}
🌡️ ${Math.round(weather.temperature)}${tempSymbol} (Feels like ${Math.round(weather.feelsLike)}${tempSymbol})
${getWeatherIcon(weather.condition)} ${weather.condition}
💧 Humidity: ${weather.humidity}%
💨 Wind: ${Math.round(weather.windSpeed)} ${unit === "metric" ? "km/h" : "mph"}

Check weather on SkyScope!`;

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      setCopied(true);
      toast.success("Đã sao chép vào clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Không thể sao chép");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${displayName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error("Trình duyệt không hỗ trợ chia sẻ");
    }
  };

  const handleDownloadCard = () => {
    // Create a canvas to generate image
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Add content
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(displayName, 40, 60);

    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(`${Math.round(weather.temperature)}${tempSymbol}`, 40, 160);

    ctx.font = '24px sans-serif';
    ctx.fillText(weather.condition, 40, 200);

    ctx.font = '20px sans-serif';
    ctx.fillText(`💧 ${weather.humidity}%`, 40, 250);
    ctx.fillText(`💨 ${Math.round(weather.windSpeed)} ${unit === "metric" ? "km/h" : "mph"}`, 40, 290);

    ctx.font = 'italic 18px sans-serif';
    ctx.fillText('SkyScope - Your Weather Companion', 40, 360);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `weather-${displayName.replace(/\s+/g, '-')}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Đã tải xuống weather card!");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Chia sẻ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ Thời tiết</DialogTitle>
          <DialogDescription>
            Chia sẻ thông tin thời tiết hiện tại của {displayName}
          </DialogDescription>
        </DialogHeader>

        <Card className="glass-card border border-border/20 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{displayName}</p>
                <p className="text-4xl font-bold font-heading">
                  {Math.round(weather.temperature)}{tempSymbol}
                </p>
              </div>
              <div className="text-5xl">{getWeatherIcon(weather.condition)}</div>
            </div>
            <p className="text-sm text-muted-foreground capitalize">{weather.condition}</p>
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <Button onClick={handleCopyLink} className="gap-2">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Đã sao chép!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Sao chép văn bản
              </>
            )}
          </Button>

          <Button onClick={handleDownloadCard} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Tải Weather Card
          </Button>

          {navigator.share && (
            <Button onClick={handleNativeShare} variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Chia sẻ...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

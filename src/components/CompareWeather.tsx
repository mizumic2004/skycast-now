import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Plus, MapPin, Thermometer, Droplets, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CityWeather {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface CompareWeatherProps {
  unit: "metric" | "imperial";
}

const API_KEY = "cab921a972f715d1b0cfc681d545981a";

export const CompareWeather = ({ unit }: CompareWeatherProps) => {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [newCity, setNewCity] = useState("");
  const [loading, setLoading] = useState(false);

  const addCity = async () => {
    if (!newCity.trim()) return;
    if (cities.length >= 4) {
      toast.error("Maximum 4 cities for comparison");
      return;
    }

    setLoading(true);
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${newCity}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = geoData[0];
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      );
      const weatherData = await weatherResponse.json();

      const cityWeather: CityWeather = {
        city: weatherData.name,
        country: weatherData.sys.country,
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: unit === "metric" ? weatherData.wind.speed * 3.6 : weatherData.wind.speed,
      };

      setCities((prev) => [...prev, cityWeather]);
      setNewCity("");
      toast.success(`Added ${cityWeather.city}`);
    } catch (error) {
      toast.error("Failed to add city");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (index: number) => {
    setCities((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="glass-card p-6 animate-fade-in border-border/20">
      <h3 className="font-heading text-2xl font-semibold mb-4 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-primary" />
        Compare Cities
      </h3>

      {/* Add City Input */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add city to compare..."
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCity()}
          className="glass-card border-border/30"
          disabled={loading}
        />
        <Button
          onClick={addCity}
          disabled={loading || !newCity.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Cities Grid */}
      {cities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((city, index) => (
            <div
              key={index}
              className="relative p-4 rounded-lg bg-background/50 border border-border/20 space-y-3"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCity(index)}
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>

              <div>
                <h4 className="font-heading text-lg font-semibold">{city.city}</h4>
                <p className="text-sm text-muted-foreground">{city.country}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-primary" />
                    <span className="text-sm">Temp</span>
                  </div>
                  <span className="font-semibold">
                    {Math.round(city.temperature)}°{unit === "metric" ? "C" : "F"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="font-semibold">{city.humidity}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Wind</span>
                  </div>
                  <span className="font-semibold">
                    {Math.round(city.windSpeed)} {unit === "metric" ? "km/h" : "mph"}
                  </span>
                </div>
              </div>

              <Badge className="w-full justify-center">{city.condition}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Add cities to compare their weather</p>
        </div>
      )}
    </Card>
  );
};

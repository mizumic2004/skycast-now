import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Plus, MapPin, Droplets, Wind, Loader2 } from "lucide-react";
import { fetchWeatherData } from "@/services/weatherService";
import { searchLocation } from "@/services/geocodingService";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { toast } from "sonner";

interface CityWeather {
  id: string;
  name: string;
  country: string;
  weather: WeatherData | null;
  loading: boolean;
}

interface MultiCityDashboardProps {
  unit: TemperatureUnit;
}

export const MultiCityDashboard = ({ unit }: MultiCityDashboardProps) => {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const tempSymbol = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "km/h" : "mph";

  const fetchCityWeather = async (cityName: string, country: string, lat: number, lon: number, id: string) => {
    try {
      const data = await fetchWeatherData(lat, lon, unit, { city: cityName, country });
      
      setCities(prev => 
        prev.map(city => 
          city.id === id 
            ? { ...city, weather: data.weather, loading: false }
            : city
        )
      );
    } catch (error) {
      console.error(error);
      setCities(prev => prev.filter(city => city.id !== id));
      toast.error(`Không thể tải dữ liệu cho ${cityName}`);
    }
  };

  const addCity = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchLocation(searchQuery);
      
      if (!result) {
        toast.error("Không tìm thấy thành phố");
        setIsSearching(false);
        return;
      }

      // Check if city already exists
      const exists = cities.some(
        city => city.name.toLowerCase() === result.location.city.toLowerCase()
      );

      if (exists) {
        toast.error("Thành phố đã có trong danh sách");
        setIsSearching(false);
        return;
      }

      const newId = `${result.location.city}-${Date.now()}`;
      const newCity: CityWeather = {
        id: newId,
        name: result.location.city,
        country: result.location.country,
        weather: null,
        loading: true,
      };

      setCities(prev => [...prev, newCity]);
      setSearchQuery("");
      setIsSearching(false);

      await fetchCityWeather(
        result.location.city,
        result.location.country,
        result.lat,
        result.lon,
        newId
      );
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm thành phố");
      setIsSearching(false);
    }
  };

  const removeCity = (id: string) => {
    setCities(prev => prev.filter(city => city.id !== id));
  };

  // Refetch when unit changes
  useEffect(() => {
    cities.forEach(city => {
      if (city.weather) {
        setCities(prev =>
          prev.map(c =>
            c.id === city.id ? { ...c, loading: true } : c
          )
        );
        fetchCityWeather(city.name, city.country, city.weather.lat, city.weather.lon, city.id);
      }
    });
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-4xl font-bold">Multi-City Dashboard</h2>
        <p className="text-muted-foreground">So sánh thời tiết của nhiều thành phố cùng lúc</p>
      </div>

      {/* Add City Search */}
      <Card className="glass-card border border-border/20 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nhập tên thành phố để thêm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCity()}
            className="flex-1"
            disabled={isSearching}
          />
          <Button
            onClick={addCity}
            disabled={isSearching || !searchQuery.trim()}
            className="gap-2"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Thêm
          </Button>
        </div>
      </Card>

      {/* Cities Grid */}
      {cities.length === 0 ? (
        <Card className="glass-card border border-border/20 p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Chưa có thành phố nào. Thêm thành phố để bắt đầu so sánh!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <Card
              key={city.id}
              className="glass-card border border-border/20 p-6 relative hover:border-primary/30 transition-colors"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCity(city.id)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>

              {city.loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Đang tải...</p>
                </div>
              ) : city.weather ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.country}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl font-bold font-heading">
                        {Math.round(city.weather.temperature)}{tempSymbol}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize mt-1">
                        {city.weather.condition}
                      </p>
                    </div>
                    <div className="text-6xl">
                      {getWeatherIcon(city.weather.condition)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-4 border-t border-border/20">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <span>{city.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="w-4 h-4 text-muted-foreground" />
                      <span>{Math.round(city.weather.windSpeed)} {windUnit}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="glass-card p-2 rounded border border-border/10">
                      <p className="text-muted-foreground">Cảm giác</p>
                      <p className="font-semibold">
                        {Math.round(city.weather.feelsLike)}{tempSymbol}
                      </p>
                    </div>
                    <div className="glass-card p-2 rounded border border-border/10">
                      <p className="text-muted-foreground">Áp suất</p>
                      <p className="font-semibold">{city.weather.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

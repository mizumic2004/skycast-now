import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  WeatherData, 
  ForecastData, 
  HourlyData, 
  DayTemp, 
  HourlyPrecipitation,
  AirQualityData,
  TemperatureUnit 
} from "@/types/weather";
import { fetchWeatherData } from "@/services/weatherService";
import { searchLocation } from "@/services/geocodingService";

interface UseWeatherReturn {
  weather: WeatherData | null;
  forecast: ForecastData[];
  hourlyForecast: HourlyData[];
  temperatureTrend: DayTemp[];
  precipitationData: HourlyPrecipitation[];
  uvIndex: number | null;
  airQuality: AirQualityData | null;
  weatherAlerts: any[];
  loading: boolean;
  unit: TemperatureUnit;
  toggleUnit: () => void;
  fetchWeather: (city: string) => Promise<void>;
  detectLocation: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyData[]>([]);
  const [temperatureTrend, setTemperatureTrend] = useState<DayTemp[]>([]);
  const [precipitationData, setPrecipitationData] = useState<HourlyPrecipitation[]>([]);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<TemperatureUnit>("metric");

  const fetchWeatherByCoords = useCallback(async (
    lat: number, 
    lon: number, 
    customLocation?: { city: string; district?: string; country: string }
  ) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(lat, lon, unit, customLocation);
      
      setWeather(data.weather);
      setForecast(data.forecast);
      setHourlyForecast(data.hourlyForecast);
      setTemperatureTrend(data.temperatureTrend);
      setPrecipitationData(data.precipitationData);
      setUvIndex(data.uvIndex);
      setAirQuality(data.airQuality);
      setWeatherAlerts(data.weatherAlerts);

      const displayName = data.weather.district 
        ? `${data.weather.district}, ${data.weather.city}` 
        : data.weather.city;
      toast.success(`Đã tải dữ liệu thời tiết cho ${displayName}`);
    } catch (error) {
      toast.error("Không thể tải dữ liệu thời tiết. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const fetchWeather = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const result = await searchLocation(searchQuery);
      
      if (!result) {
        toast.error("Không tìm thấy địa điểm. Vui lòng thử lại với tên khác.");
        setLoading(false);
        return;
      }

      await fetchWeatherByCoords(result.lat, result.lon, result.location);
    } catch (error) {
      toast.error("Không thể tải dữ liệu thời tiết. Vui lòng thử lại.");
      console.error(error);
      setLoading(false);
    }
  }, [fetchWeatherByCoords]);

  const detectLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          toast.error("Không thể phát hiện vị trí. Vui lòng tìm kiếm thủ công.");
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      toast.error("Trình duyệt không hỗ trợ định vị");
    }
  }, [fetchWeatherByCoords]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  }, []);

  // Refetch khi đổi đơn vị
  useEffect(() => {
    if (weather) {
      fetchWeatherByCoords(weather.lat, weather.lon);
    }
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto detect location on mount
  useEffect(() => {
    detectLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    weather,
    forecast,
    hourlyForecast,
    temperatureTrend,
    precipitationData,
    uvIndex,
    airQuality,
    weatherAlerts,
    loading,
    unit,
    toggleUnit,
    fetchWeather,
    detectLocation,
  };
};


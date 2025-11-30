import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { SearchBar } from "@/components/SearchBar";
import { HourlyForecast } from "@/components/HourlyForecast";
import { UVIndex } from "@/components/UVIndex";
import { AirQuality } from "@/components/AirQuality";
import { ExtendedDetails } from "@/components/ExtendedDetails";
import { WeatherAlerts } from "@/components/WeatherAlerts";
import { UnitToggle } from "@/components/UnitToggle";
import { FavoritesManager } from "@/components/FavoritesManager";
import { WeatherAnimations } from "@/components/WeatherAnimations";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SunriseSunset } from "@/components/SunriseSunset";
import { WeatherRecommendations } from "@/components/WeatherRecommendations";
import { CompareWeather } from "@/components/CompareWeather";
import { TemperatureTrendChart } from "@/components/TemperatureTrendChart";
import { WeatherMap } from "@/components/WeatherMap";
import { PrecipitationChart } from "@/components/PrecipitationChart";
import { MoonPhase } from "@/components/MoonPhase";
import { WindCompass } from "@/components/WindCompass";
import { PollenIndex } from "@/components/PollenIndex";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cloud, MapPin, LogOut } from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  city: string;
  district?: string;
  country: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  visibility: number;
  pressure: number;
  lat: number;
  lon: number;
  sunrise: number;
  sunset: number;
  windDeg: number;
  windGust?: number;
}

interface ForecastData {
  day: string;
  temperature: number;
  condition: string;
}

interface DayTemp {
  day: string;
  high: number;
  low: number;
  date: string;
}

interface HourlyData {
  time: string;
  temperature: number;
  condition: string;
}

interface HourlyPrecipitation {
  time: string;
  probability: number;
  amount: number;
}

interface AirQualityData {
  aqi: number;
  components: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
  };
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "cab921a972f715d1b0cfc681d545981a";

// Reverse geocoding để lấy địa chỉ chi tiết từ tọa độ
const reverseGeocode = async (lat: number, lon: number): Promise<{ city: string; district?: string; country: string }> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'vi',
          'User-Agent': 'SkyScope Weather App (https://skyscope.vercel.app)',
        }
      }
    );
    const data = await response.json();
    
    if (data && data.address) {
      const addr = data.address;
      // Lấy tên quận/huyện
      const district = addr.suburb || addr.city_district || addr.district || addr.quarter || addr.neighbourhood;
      // Lấy tên thành phố/tỉnh
      const city = addr.city || addr.town || addr.municipality || addr.county || addr.state;
      // Lấy tên quốc gia
      const country = addr.country_code?.toUpperCase() || addr.country;
      
      return { city: city || "Unknown", district, country: country || "VN" };
    }
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
  }
  return { city: "Unknown", country: "VN" };
};

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyData[]>([]);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [temperatureTrend, setTemperatureTrend] = useState<DayTemp[]>([]);
  const [precipitationData, setPrecipitationData] = useState<HourlyPrecipitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Auto-detect location on page load
    detectLocation();

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          toast.error("Unable to detect location. Please search manually.");
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const fetchWeatherByCoords = async (
    lat: number, 
    lon: number, 
    customLocation?: { city: string; district?: string; country: string }
  ) => {
    setLoading(true);
    try {
      // Fetch weather data (và reverse geocode nếu không có customLocation)
      const weatherPromises: Promise<any>[] = [
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}&units=${unit}`),
      ];
      
      // Chỉ reverse geocode nếu không có customLocation (khi dùng geolocation)
      if (!customLocation) {
        weatherPromises.push(reverseGeocode(lat, lon));
      }

      const results = await Promise.all(weatherPromises);
      const [weatherResponse, forecastResponse, airQualityResponse, oneCallResponse] = results;
      const locationData = customLocation || results[4];
      
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather");
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();
      const airQualityData = await airQualityResponse.json();
      const oneCallData = await oneCallResponse.json();

      setWeather({
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        city: locationData.city || weatherData.name,
        district: locationData.district,
        country: locationData.country || weatherData.sys.country,
        humidity: weatherData.main.humidity,
        windSpeed: unit === "metric" ? weatherData.wind.speed * 3.6 : weatherData.wind.speed,
        feelsLike: weatherData.main.feels_like,
        visibility: weatherData.visibility,
        pressure: weatherData.main.pressure,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        windDeg: weatherData.wind.deg,
        windGust: weatherData.wind.gust ? (unit === "metric" ? weatherData.wind.gust * 3.6 : weatherData.wind.gust) : undefined,
      });

      // Process daily forecast
      const dailyForecasts: ForecastData[] = [];
      const processedDays = new Set<string>();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        
        if (!processedDays.has(dayName) && dailyForecasts.length < 5) {
          processedDays.add(dayName);
          dailyForecasts.push({
            day: dayName,
            temperature: item.main.temp,
            condition: item.weather[0].main,
          });
        }
      });
      setForecast(dailyForecasts);

      // Process 7-day temperature trend
      const dailyTemps = new Map<string, { high: number; low: number; date: string; day: string }>();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        
        if (!dailyTemps.has(dateKey)) {
          dailyTemps.set(dateKey, {
            high: item.main.temp_max,
            low: item.main.temp_min,
            date: dateKey,
            day: dayName,
          });
        } else {
          const existing = dailyTemps.get(dateKey)!;
          existing.high = Math.max(existing.high, item.main.temp_max);
          existing.low = Math.min(existing.low, item.main.temp_min);
        }
      });

      const trendData = Array.from(dailyTemps.values())
        .slice(0, 7)
        .map((item) => ({
          day: item.day,
          high: Math.round(item.high),
          low: Math.round(item.low),
          date: item.date,
        }));
      
      setTemperatureTrend(trendData);

      // Process precipitation data
      const precipData: HourlyPrecipitation[] = forecastData.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        probability: Math.round((item.pop || 0) * 100),
        amount: item.rain?.["3h"] || item.snow?.["3h"] || 0,
      }));
      setPrecipitationData(precipData);

      // Process hourly forecast (first 24 hours)
      const hourlyData: HourlyData[] = forecastData.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: item.main.temp,
        condition: item.weather[0].main,
      }));
      setHourlyForecast(hourlyData);

      // Set UV index
      setUvIndex(oneCallData.current?.uvi || 0);

      // Set air quality
      if (airQualityData.list && airQualityData.list.length > 0) {
        const aqData = airQualityData.list[0];
        setAirQuality({
          aqi: aqData.main.aqi,
          components: aqData.components,
        });
      }

      // Set weather alerts
      setWeatherAlerts(oneCallData.alerts || []);

      // Hiển thị tên địa điểm chi tiết
      const displayName = locationData.district 
        ? `${locationData.district}, ${locationData.city}` 
        : locationData.city || weatherData.name;
      toast.success(`Đã tải dữ liệu thời tiết cho ${displayName}`);
    } catch (error) {
      toast.error("Failed to fetch weather data. Please check your API key.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Sử dụng OpenStreetMap Nominatim để tìm kiếm địa điểm (hỗ trợ tiếng Việt tốt hơn)
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'vi',
            'User-Agent': 'SkyScope Weather App (https://skyscope.vercel.app)',
          }
        }
      );
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        toast.error("Không tìm thấy địa điểm. Vui lòng thử lại với tên khác.");
        setLoading(false);
        return;
      }

      const result = geoData[0];
      const { lat, lon, address, name } = result;
      
      // Lấy tên địa điểm - ưu tiên sử dụng tên từ kết quả tìm kiếm
      const queryParts = searchQuery.split(',').map(p => p.trim());
      
      let district: string | undefined;
      let city: string;
      let country: string = "VN";

      if (address) {
        country = address.country_code?.toUpperCase() || "VN";
        
        // Lấy tên thành phố/tỉnh
        city = address.city || address.state || address.province || 
               address.municipality || address.county || queryParts[queryParts.length - 1] || "Việt Nam";
        
        // Sử dụng tên tìm kiếm hoặc name từ kết quả làm district
        // Ưu tiên: name của result > phần đầu query > address fields
        district = name || queryParts[0] || address.suburb || address.neighbourhood || 
                   address.quarter || address.city_district || address.district;
      } else {
        // Fallback: sử dụng query người dùng nhập
        district = queryParts[0];
        city = queryParts[1] || queryParts[0];
      }

      await fetchWeatherByCoords(parseFloat(lat), parseFloat(lon), { city, district, country });
    } catch (error) {
      toast.error("Không thể tải dữ liệu thời tiết. Vui lòng thử lại.");
      console.error(error);
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
    // Refetch weather data with new unit if weather is already loaded
    if (weather) {
      fetchWeatherByCoords(weather.lat, weather.lon);
    }
  };

  return (
    <div className="min-h-screen gradient-atmospheric relative overflow-hidden">
      {/* Weather Animations */}
      {weather && <WeatherAnimations condition={weather.condition} />}

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-primary" strokeWidth={1.5} />
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
              SkyScope
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {weather && <UnitToggle unit={unit} onToggle={toggleUnit} />}
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-border/20">
                <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline" 
                size="sm"
                className="rounded-full"
              >
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 md:pt-28 md:pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-12 h-12 text-primary" strokeWidth={1.5} />
            <h1 className="font-heading text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkyScope
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your atmospheric companion for real-time weather insights
          </p>
        </div>

        {/* Search Bar & Location Detection */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex gap-2">
            <SearchBar onSearch={fetchWeather} />
            <Button
              onClick={detectLocation}
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={loading}
            >
              <MapPin className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-8">
            {/* Weather Alerts */}
            {weatherAlerts.length > 0 && <WeatherAlerts alerts={weatherAlerts} />}

            {/* Main Weather Card */}
            <WeatherCard
              temperature={weather.temperature}
              condition={weather.condition}
              city={weather.city}
              district={weather.district}
              country={weather.country}
              humidity={weather.humidity}
              windSpeed={weather.windSpeed}
              unit={unit}
            />

            {/* Favorites Manager */}
            {user && (
              <FavoritesManager
                user={user}
                currentCity={{
                  name: weather.city,
                  country: weather.country,
                  lat: weather.lat,
                  lon: weather.lon,
                }}
                onSelectCity={fetchWeather}
              />
            )}

            {/* Hourly Forecast */}
            {hourlyForecast.length > 0 && (
              <HourlyForecast hourlyData={hourlyForecast} unit={unit} />
            )}

            {/* Extended Details and Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ExtendedDetails
                feelsLike={weather.feelsLike}
                visibility={weather.visibility}
                pressure={weather.pressure}
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                unit={unit}
              />
              {uvIndex !== null && <UVIndex uv={uvIndex} />}
              {airQuality && (
                <AirQuality aqi={airQuality.aqi} components={airQuality.components} />
              )}
            </div>

            {/* Wind, Sunrise/Sunset and Moon Phase */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WindCompass
                windSpeed={weather.windSpeed}
                windDeg={weather.windDeg}
                windGust={weather.windGust}
                unit={unit}
              />
              <SunriseSunset sunrise={weather.sunrise} sunset={weather.sunset} />
              <MoonPhase />
            </div>

            {/* Pollen and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PollenIndex
                temperature={weather.temperature}
                humidity={weather.humidity}
                windSpeed={weather.windSpeed}
                condition={weather.condition}
              />
              <WeatherRecommendations
                temperature={weather.temperature}
                condition={weather.condition}
                humidity={weather.humidity}
                windSpeed={weather.windSpeed}
                unit={unit}
              />
            </div>

            {/* Precipitation Chart */}
            {precipitationData.length > 0 && (
              <PrecipitationChart data={precipitationData} />
            )}

            {/* Weather Map */}
            <WeatherMap lat={weather.lat} lon={weather.lon} />

            {/* Temperature Trend Chart */}
            {temperatureTrend.length > 0 && (
              <TemperatureTrendChart data={temperatureTrend} unit={unit} />
            )}

            {/* Compare Weather */}
            <CompareWeather unit={unit} />

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-heading text-3xl font-bold text-center mb-6">
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <div key={index} style={{ animationDelay: `${0.1 * index}s` }}>
                      <ForecastCard
                        day={day.day}
                        temperature={day.temperature}
                        condition={day.condition}
                        unit={unit}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useWeather } from "@/hooks/useWeather";

// Components
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
import { MultiCityDashboard } from "@/components/MultiCityDashboard";
import { Footer } from "@/components/Footer";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cloud, MapPin, LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Custom hook cho weather data
  const {
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
  } = useWeather();

  // Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Đăng xuất thành công");
  };

  return (
    <div className="min-h-screen gradient-atmospheric relative overflow-hidden">
      {/* Weather Animations */}
      {weather && <WeatherAnimations condition={weather.condition} />}

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-primary" strokeWidth={1.5} />
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
              SkyScope
            </span>
          </div>

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
                  title="Đăng xuất"
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
                <span className="hidden sm:inline">Đăng nhập</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Background elements */}
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

        {/* Search Bar */}
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

        {/* Loading */}
        {loading && (
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-8">
            {weatherAlerts.length > 0 && <WeatherAlerts alerts={weatherAlerts} />}

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

            {hourlyForecast.length > 0 && (
              <HourlyForecast hourlyData={hourlyForecast} unit={unit} />
            )}

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

            {precipitationData.length > 0 && (
              <PrecipitationChart data={precipitationData} />
            )}

            <WeatherMap lat={weather.lat} lon={weather.lon} />

            {temperatureTrend.length > 0 && (
              <TemperatureTrendChart data={temperatureTrend} unit={unit} />
            )}

            <CompareWeather unit={unit} />

            <MultiCityDashboard unit={unit} />

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

        <Footer />
      </div>

      {/* Floating Weather Widget */}
      {weather && !loading && <WeatherWidget weather={weather} unit={unit} />}
    </div>
  );
};

export default Index;

import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from "@/config/constants";
import { 
  WeatherData, 
  ForecastData, 
  HourlyData, 
  DayTemp, 
  HourlyPrecipitation,
  AirQualityData,
  LocationData,
  TemperatureUnit 
} from "@/types/weather";
import { reverseGeocode } from "./geocodingService";

interface WeatherApiResponse {
  weather: WeatherData;
  forecast: ForecastData[];
  hourlyForecast: HourlyData[];
  temperatureTrend: DayTemp[];
  precipitationData: HourlyPrecipitation[];
  uvIndex: number;
  airQuality: AirQualityData | null;
  weatherAlerts: any[];
}

/**
 * Fetch tất cả dữ liệu thời tiết từ tọa độ
 */
export const fetchWeatherData = async (
  lat: number,
  lon: number,
  unit: TemperatureUnit,
  customLocation?: LocationData
): Promise<WeatherApiResponse> => {
  // Fetch tất cả API cùng lúc
  const weatherPromises: Promise<any>[] = [
    fetch(`${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${unit}`),
    fetch(`${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${unit}`),
    fetch(`${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`),
    fetch(`${OPENWEATHER_BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${OPENWEATHER_API_KEY}&units=${unit}`),
  ];
  
  if (!customLocation) {
    weatherPromises.push(reverseGeocode(lat, lon));
  }

  const results = await Promise.all(weatherPromises);
  const [weatherResponse, forecastResponse, airQualityResponse, oneCallResponse] = results;
  const locationData = customLocation || results[4];
  
  if (!weatherResponse.ok) throw new Error("Failed to fetch weather");
  
  const weatherApiData = await weatherResponse.json();
  const forecastApiData = await forecastResponse.json();
  const airQualityApiData = await airQualityResponse.json();
  const oneCallApiData = await oneCallResponse.json();

  // Process weather data
  const weather: WeatherData = {
    temperature: weatherApiData.main.temp,
    condition: weatherApiData.weather[0].main,
    city: locationData.city || weatherApiData.name,
    district: locationData.district,
    country: locationData.country || weatherApiData.sys.country,
    humidity: weatherApiData.main.humidity,
    windSpeed: unit === "metric" ? weatherApiData.wind.speed * 3.6 : weatherApiData.wind.speed,
    feelsLike: weatherApiData.main.feels_like,
    visibility: weatherApiData.visibility,
    pressure: weatherApiData.main.pressure,
    lat: weatherApiData.coord.lat,
    lon: weatherApiData.coord.lon,
    sunrise: weatherApiData.sys.sunrise,
    sunset: weatherApiData.sys.sunset,
    windDeg: weatherApiData.wind.deg,
    windGust: weatherApiData.wind.gust 
      ? (unit === "metric" ? weatherApiData.wind.gust * 3.6 : weatherApiData.wind.gust) 
      : undefined,
  };

  // Process daily forecast
  const forecast = processDailyForecast(forecastApiData.list);
  
  // Process hourly forecast
  const hourlyForecast = processHourlyForecast(forecastApiData.list);
  
  // Process temperature trend
  const temperatureTrend = processTemperatureTrend(forecastApiData.list);
  
  // Process precipitation data
  const precipitationData = processPrecipitationData(forecastApiData.list);

  // Process air quality
  let airQuality: AirQualityData | null = null;
  if (airQualityApiData.list && airQualityApiData.list.length > 0) {
    const aqData = airQualityApiData.list[0];
    airQuality = {
      aqi: aqData.main.aqi,
      components: aqData.components,
    };
  }

  return {
    weather,
    forecast,
    hourlyForecast,
    temperatureTrend,
    precipitationData,
    uvIndex: oneCallApiData.current?.uvi || 0,
    airQuality,
    weatherAlerts: oneCallApiData.alerts || [],
  };
};

// Helper functions
function processDailyForecast(list: any[]): ForecastData[] {
  const dailyForecasts: ForecastData[] = [];
  const processedDays = new Set<string>();
  
  list.forEach((item: any) => {
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
  
  return dailyForecasts;
}

function processHourlyForecast(list: any[]): HourlyData[] {
  return list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: item.main.temp,
    condition: item.weather[0].main,
  }));
}

function processTemperatureTrend(list: any[]): DayTemp[] {
  const dailyTemps = new Map<string, { high: number; low: number; date: string; day: string }>();
  
  list.forEach((item: any) => {
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

  return Array.from(dailyTemps.values())
    .slice(0, 7)
    .map((item) => ({
      day: item.day,
      high: Math.round(item.high),
      low: Math.round(item.low),
      date: item.date,
    }));
}

function processPrecipitationData(list: any[]): HourlyPrecipitation[] {
  return list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    probability: Math.round((item.pop || 0) * 100),
    amount: item.rain?.["3h"] || item.snow?.["3h"] || 0,
  }));
}


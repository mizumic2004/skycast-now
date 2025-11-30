export interface WeatherData {
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

export interface ForecastData {
  day: string;
  temperature: number;
  condition: string;
}

export interface DayTemp {
  day: string;
  high: number;
  low: number;
  date: string;
}

export interface HourlyData {
  time: string;
  temperature: number;
  condition: string;
}

export interface HourlyPrecipitation {
  time: string;
  probability: number;
  amount: number;
}

export interface AirQualityData {
  aqi: number;
  components: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
  };
}

export interface LocationData {
  city: string;
  district?: string;
  country: string;
}

export type TemperatureUnit = "metric" | "imperial";


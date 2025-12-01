export const getWeatherIcon = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return "☀️";
  } else if (conditionLower.includes("cloud")) {
    return "☁️";
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "🌧️";
  } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return "⛈️";
  } else if (conditionLower.includes("snow")) {
    return "❄️";
  } else if (conditionLower.includes("mist") || conditionLower.includes("fog") || conditionLower.includes("haze")) {
    return "🌫️";
  } else if (conditionLower.includes("wind")) {
    return "💨";
  }
  
  return "🌤️";
};

import { NOMINATIM_BASE_URL, APP_URL } from "@/config/constants";
import { LocationData } from "@/types/weather";

const headers = {
  'Accept-Language': 'vi',
  'User-Agent': `SkyScope Weather App (${APP_URL})`,
};

/**
 * Reverse geocoding - Lấy địa chỉ chi tiết từ tọa độ
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<LocationData> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      { headers }
    );
    const data = await response.json();
    
    if (data && data.address) {
      const addr = data.address;
      const district = addr.suburb || addr.city_district || addr.district || addr.quarter || addr.neighbourhood;
      const city = addr.city || addr.town || addr.municipality || addr.county || addr.state;
      const country = addr.country_code?.toUpperCase() || addr.country;
      
      return { city: city || "Unknown", district, country: country || "VN" };
    }
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
  }
  return { city: "Unknown", country: "VN" };
};

/**
 * Forward geocoding - Tìm kiếm địa điểm từ tên
 */
export const searchLocation = async (searchQuery: string): Promise<{
  lat: number;
  lon: number;
  location: LocationData;
} | null> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
      { headers }
    );
    const geoData = await response.json();
    
    if (!geoData || geoData.length === 0) {
      return null;
    }

    const result = geoData[0];
    const { lat, lon, address, name } = result;
    const queryParts = searchQuery.split(',').map(p => p.trim());
    
    let district: string | undefined;
    let city: string;
    let country: string = "VN";

    if (address) {
      country = address.country_code?.toUpperCase() || "VN";
      city = address.city || address.state || address.province || 
             address.municipality || address.county || queryParts[queryParts.length - 1] || "Việt Nam";
      district = name || queryParts[0] || address.suburb || address.neighbourhood || 
                 address.quarter || address.city_district || address.district;
    } else {
      district = queryParts[0];
      city = queryParts[1] || queryParts[0];
    }

    return {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      location: { city, district, country }
    };
  } catch (error) {
    console.error("Search location failed:", error);
    return null;
  }
};


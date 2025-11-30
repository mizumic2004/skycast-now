import { useState, useEffect } from "react";
import { Star, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface FavoriteCity {
  id: string;
  city_name: string;
  country: string;
  lat: number;
  lon: number;
}

interface FavoritesManagerProps {
  user: User | null;
  currentCity?: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  onSelectCity: (cityName: string) => void;
}

export const FavoritesManager = ({ user, currentCity, onSelectCity }: FavoritesManagerProps) => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("favorite_cities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error("Error loading favorites:", error);
    }
  };

  const addFavorite = async () => {
    if (!user || !currentCity) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from("favorite_cities").insert({
        user_id: user.id,
        city_name: currentCity.name,
        country: currentCity.country,
        lat: currentCity.lat,
        lon: currentCity.lon,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("City already in favorites");
        } else {
          throw error;
        }
      } else {
        toast.success(`${currentCity.name} added to favorites`);
        loadFavorites();
      }
    } catch (error: any) {
      toast.error("Failed to add favorite");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string, cityName: string) => {
    try {
      const { error } = await supabase
        .from("favorite_cities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success(`${cityName} removed from favorites`);
      loadFavorites();
    } catch (error: any) {
      toast.error("Failed to remove favorite");
      console.error(error);
    }
  };

  const isCityFavorite = currentCity && favorites.some(
    (fav) => fav.city_name === currentCity.name && fav.country === currentCity.country
  );

  if (!user) return null;

  return (
    <div className="glass-card p-6 rounded-3xl border border-border/20 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-xl font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Favorite Cities
        </h3>
        {currentCity && (
          <Button
            onClick={addFavorite}
            disabled={loading || isCityFavorite}
            size="sm"
            variant={isCityFavorite ? "secondary" : "default"}
          >
            {isCityFavorite ? "Saved" : "Add Current"}
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No favorite cities yet. Add your current city to get started!
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/10 hover:bg-background/60 transition-colors"
            >
              <button
                onClick={() => onSelectCity(city.city_name)}
                className="flex items-center gap-2 flex-1 text-left hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{city.city_name}</span>
                <span className="text-sm text-muted-foreground">{city.country}</span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFavorite(city.id, city.city_name)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
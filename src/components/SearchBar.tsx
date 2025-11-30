import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl animate-fade-in">
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="glass-card h-14 text-lg px-6 border-border/30 focus:border-primary transition-all duration-300"
        />
        <Button 
          type="submit" 
          size="lg"
          className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-lg shadow-glow transition-all duration-300"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

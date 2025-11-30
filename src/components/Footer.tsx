import { Cloud, Heart, Github, Mail, Globe } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-border/20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      
      <div className="relative glass-card backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Cloud className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <span className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SkyScope
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm">
                Ứng dụng thời tiết thông minh với dữ liệu real-time
              </p>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card border border-border/20 hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@skyscope.app" 
                className="p-2.5 rounded-full glass-card border border-border/20 hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2.5 rounded-full glass-card border border-border/20 hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-6" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {currentYear} SkyScope. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Hoàng Hưng
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded-full glass-card border border-border/20">
                Powered by OpenWeatherMap
              </span>
              <span className="px-2 py-1 rounded-full glass-card border border-border/20">
                Maps by OpenStreetMap
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


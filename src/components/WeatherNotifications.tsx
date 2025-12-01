import { useState, useEffect } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

export const WeatherNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState({
    dailyForecast: true,
    severeAlerts: true,
    temperatureChanges: false,
    rainAlerts: true,
  });

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      
      // Load saved settings
      const saved = localStorage.getItem("weather-notifications");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed.settings || settings);
        setNotificationsEnabled(parsed.enabled || false);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Trình duyệt không hỗ trợ thông báo");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        setNotificationsEnabled(true);
        saveSettings(true);
        
        // Send test notification
        new Notification("SkyScope - Thông báo đã bật!", {
          body: "Bạn sẽ nhận được cảnh báo thời tiết quan trọng",
          icon: "/favicon.svg",
          badge: "/favicon.svg",
        });
        
        toast.success("Đã bật thông báo!");
      } else {
        toast.error("Quyền thông báo bị từ chối");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể bật thông báo");
    }
  };

  const saveSettings = (enabled: boolean = notificationsEnabled) => {
    localStorage.setItem(
      "weather-notifications",
      JSON.stringify({ enabled, settings })
    );
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled && permission !== "granted") {
      requestPermission();
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      saveSettings(newState);
      toast.success(newState ? "Đã bật thông báo" : "Đã tắt thông báo");
    }
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(
      "weather-notifications",
      JSON.stringify({ enabled: notificationsEnabled, settings: newSettings })
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Cài đặt thông báo">
          {notificationsEnabled ? (
            <Bell className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cài đặt Thông báo</DialogTitle>
          <DialogDescription>
            Nhận thông báo về thời tiết và cảnh báo quan trọng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Toggle */}
          <Card className="glass-card border border-border/20 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Thông báo Thời tiết</Label>
                <p className="text-sm text-muted-foreground">
                  {permission === "granted" 
                    ? "Đã cấp quyền thông báo"
                    : "Cần cấp quyền thông báo"}
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={toggleNotifications}
              />
            </div>
          </Card>

          {/* Settings */}
          {notificationsEnabled && (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Loại thông báo</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily" className="text-sm cursor-pointer">
                    Dự báo hàng ngày (8:00 AM)
                  </Label>
                  <Switch
                    id="daily"
                    checked={settings.dailyForecast}
                    onCheckedChange={(checked) => updateSetting("dailyForecast", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="severe" className="text-sm cursor-pointer">
                    Cảnh báo thời tiết nguy hiểm
                  </Label>
                  <Switch
                    id="severe"
                    checked={settings.severeAlerts}
                    onCheckedChange={(checked) => updateSetting("severeAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="temp" className="text-sm cursor-pointer">
                    Thay đổi nhiệt độ lớn (&gt;10°)
                  </Label>
                  <Switch
                    id="temp"
                    checked={settings.temperatureChanges}
                    onCheckedChange={(checked) => updateSetting("temperatureChanges", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="rain" className="text-sm cursor-pointer">
                    Cảnh báo mưa
                  </Label>
                  <Switch
                    id="rain"
                    checked={settings.rainAlerts}
                    onCheckedChange={(checked) => updateSetting("rainAlerts", checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="glass-card border border-border/10 p-3 rounded text-xs text-muted-foreground">
            <p className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Thông báo sẽ được gửi dựa trên vị trí hiện tại hoặc địa điểm bạn đang theo dõi
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

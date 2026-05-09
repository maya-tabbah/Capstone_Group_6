import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell, Moon, Volume2, Shield, Trash2, Info } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";

interface Settings {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  autoConnect: boolean;
  showTypingIndicator: boolean;
  saveHistory: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  soundEffects: true,
  darkMode: false,
  autoConnect: false,
  showTypingIndicator: true,
  saveHistory: false,
};

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("persona-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("persona-settings", JSON.stringify(newSettings));
    toast.success("Settings updated");
  };

  const clearChatHistory = () => {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      localStorage.removeItem("persona-chat-history");
      toast.success("Chat history cleared");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] p-4 text-white sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      {/* Settings Content */}
      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <SettingRow
              label="Push Notifications"
              description="Get notified when you receive a new match or message"
              checked={settings.notifications}
              onChange={(value) => updateSetting("notifications", value)}
            />
            <SettingRow
              label="Sound Effects"
              description="Play sounds for new messages and notifications"
              checked={settings.soundEffects}
              onChange={(value) => updateSetting("soundEffects", value)}
            />
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>

          <SettingRow
            label="Dark Mode"
            description="Switch to dark theme (coming soon)"
            checked={settings.darkMode}
            onChange={(value) => updateSetting("darkMode", value)}
            disabled={true}
          />
        </motion.div>

        {/* Chat Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-lg font-semibold">Chat Preferences</h2>
          </div>

          <div className="space-y-4">
            <SettingRow
              label="Auto-Connect"
              description="Automatically find a new match when previous chat ends"
              checked={settings.autoConnect}
              onChange={(value) => updateSetting("autoConnect", value)}
            />
            <SettingRow
              label="Show Typing Indicator"
              description="Let others know when you're typing"
              checked={settings.showTypingIndicator}
              onChange={(value) => updateSetting("showTypingIndicator", value)}
            />
          </div>
        </motion.div>

        {/* Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Privacy & Data</h2>
          </div>

          <div className="space-y-4">
            <SettingRow
              label="Save Chat History"
              description="Store chat history locally on your device"
              checked={settings.saveHistory}
              onChange={(value) => updateSetting("saveHistory", value)}
            />

            <div className="pt-2">
              <Button
                onClick={clearChatHistory}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Clear Chat History
              </Button>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold">About</h2>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Persona</strong> v1.0.0</p>
            <p>Anonymous random chat messaging app</p>
            <p className="text-xs text-gray-400 mt-4">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Helper Component for Settings Rows
interface SettingRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function SettingRow({ label, description, checked, onChange, disabled = false }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

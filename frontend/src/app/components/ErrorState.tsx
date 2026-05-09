import { AlertCircle, RefreshCw, Wifi } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorStateProps {
  title: string;
  message: string;
  type?: "connection" | "session" | "general";
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title,
  message,
  type = "general",
  onRetry,
  retryLabel = "Try Again"
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case "connection":
        return Wifi;
      case "session":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-red-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-600 mb-6 max-w-md">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

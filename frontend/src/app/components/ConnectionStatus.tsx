import { Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error"
  | "reconnecting";

interface ConnectionStatusProps {
  status: ConnectionState;
  errorMessage?: string;
  showLabel?: boolean;
}

export function ConnectionStatus({
  status,
  errorMessage,
  showLabel = true
}: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Connected",
          animate: false
        };
      case "connecting":
        return {
          icon: Loader2,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          label: "Connecting...",
          animate: true
        };
      case "reconnecting":
        return {
          icon: Loader2,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          label: "Reconnecting...",
          animate: true
        };
      case "error":
        return {
          icon: AlertTriangle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          label: "Connection Error",
          animate: false
        };
      case "disconnected":
      default:
        return {
          icon: WifiOff,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          label: "Disconnected",
          animate: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-full ${config.bgColor}`}>
        <Icon
          className={`w-4 h-4 ${config.color} ${config.animate ? "animate-spin" : ""}`}
        />
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
          {errorMessage && status === "error" && (
            <span className="text-[10px] text-gray-500 max-w-[150px] truncate">
              {errorMessage}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

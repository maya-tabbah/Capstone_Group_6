import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface SessionTimerProps {
  duration: number; // in seconds (20 minutes = 1200 seconds)
  onExpire?: () => void;
  onWarning?: () => void;
  warningThreshold?: number; // seconds before expiry to show warning (default 60)
}

export function SessionTimer({
  duration,
  onExpire,
  onWarning,
  warningThreshold = 60
}: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
    // Reset status if a new duration is provided (e.g. on refresh)
    if (duration > 0) {
      setHasExpired(false);
      setIsWarning(duration <= warningThreshold);
    }
  }, [duration, warningThreshold]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setHasExpired(true);
          onExpire?.();
          clearInterval(timer);
          return 0;
        }

        // Check for warning threshold
        if (prev === warningThreshold && !isWarning) {
          setIsWarning(true);
          onWarning?.();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire, onWarning, warningThreshold, isWarning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return (timeLeft / duration) * 100;
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all ${
      hasExpired
        ? "bg-red-500/90"
        : isWarning
        ? "bg-yellow-500/90 animate-pulse"
        : "bg-white/20"
    }`}>
      {hasExpired ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="text-sm font-semibold">
        {hasExpired ? "Expired" : formatTime(timeLeft)}
      </span>

      {/* Visual progress bar */}
      {!hasExpired && (
        <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isWarning ? "bg-yellow-300" : "bg-white"
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}
    </div>
  );
}

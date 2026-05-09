import { Check, CheckCheck, Clock } from "lucide-react";
import { motion } from "motion/react";

export type MessageStatusType = "sending" | "sent" | "delivered" | "read";

interface MessageStatusProps {
  status: MessageStatusType;
  className?: string;
}

export function MessageStatus({ status, className = "" }: MessageStatusProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center ${className}`}
    >
      {status === "sending" && (
        <Clock className="w-3 h-3 text-gray-400 animate-pulse" />
      )}

      {status === "sent" && (
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <Check className="w-3 h-3 text-gray-400" />
        </motion.div>
      )}

      {status === "delivered" && (
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <CheckCheck className="w-3 h-3 text-gray-400" />
        </motion.div>
      )}

      {status === "read" && (
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <CheckCheck className="w-3 h-3 text-blue-500" />
        </motion.div>
      )}
    </motion.span>
  );
}

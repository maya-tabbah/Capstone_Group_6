import { motion } from "motion/react";
import { MessageStatus, type MessageStatusType } from "./MessageStatus";

interface MessageBubbleProps {
  text: string;
  sender: string;
  timestamp: Date;
  status?: MessageStatusType;
}

export function MessageBubble({ text, sender, timestamp, status }: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
              : "bg-white text-gray-800 border border-gray-200"
          }`}
        >
          <p className="break-words">{text}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-xs text-gray-400">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isUser && status && (
            <>
              <span className="text-gray-300">•</span>
              <MessageStatus status={status} />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Changed to framer-motion based on your install
import { Users, Sparkles, Loader2 } from "lucide-react";

interface WaitingRoomProps {
  isMatched: boolean;
}

export function WaitingRoom({ isMatched }: WaitingRoomProps) {
  const [elapsed, setElapsed] = useState(0);

  // Real elapsed timer
  useEffect(() => {
    if (isMatched) return; // Stop counting once matched
    
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isMatched]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#fbbf24] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {!isMatched ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Users className="w-16 h-16 text-white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </div>

          {/* Pulse effect */}
          {!isMatched && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-white/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-white/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </>
          )}
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-white">
            {!isMatched ? "Finding Someone..." : "Match Found!"}
          </h2>

          <p className="text-white/90 text-lg">
            {!isMatched
              ? "Searching for an anonymous stranger to chat with"
              : "Connecting you to your chat partner"}
          </p>
        </motion.div>

        {/* Waiting Stats - Clean Elapsed Timer */}
        {!isMatched && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/80">Time Elapsed</span>
              <span className="text-white font-semibold">{elapsed}s</span>
            </div>
          </motion.div>
        )}

        {/* Loading Dots */}
        {!isMatched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-white/60"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Success Animation */}
        {isMatched && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-4"
          >
            <div className="flex items-center justify-center gap-2 text-white font-semibold">
              <Loader2 className="w-5 h-5 animate-spin" />
              Routing to private room...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
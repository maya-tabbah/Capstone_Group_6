import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, MessageSquare, Trash2, Search } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

interface ChatHistoryItem {
  id: string;
  date: Date;
  duration: number; // in seconds
  messageCount: number;
  preview: string;
}

// Mock chat history data
const MOCK_HISTORY: ChatHistoryItem[] = [
  {
    id: "1",
    date: new Date(2026, 3, 20, 14, 30),
    duration: 1200,
    messageCount: 47,
    preview: "Hey! Nice to meet you! What brings you here?",
  },
  {
    id: "2",
    date: new Date(2026, 3, 19, 10, 15),
    duration: 890,
    messageCount: 32,
    preview: "I love discussing philosophy. What's your take on...",
  },
  {
    id: "3",
    date: new Date(2026, 3, 18, 16, 45),
    duration: 1200,
    messageCount: 56,
    preview: "That's so interesting! I've never thought about it...",
  },
  {
    id: "4",
    date: new Date(2026, 3, 17, 20, 20),
    duration: 654,
    messageCount: 28,
    preview: "Do you like traveling? I just got back from...",
  },
  {
    id: "5",
    date: new Date(2026, 3, 16, 13, 10),
    duration: 1200,
    messageCount: 63,
    preview: "What kind of music do you listen to?",
  },
];

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ChatHistoryItem[]>(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) =>
    item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const deleteChat = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
    toast.success("Chat deleted");
  };

  const clearAllHistory = () => {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      setHistory([]);
      toast.success("All chat history cleared");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] p-4 text-white sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Chat History</h1>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-3 max-w-2xl mx-auto">
        {filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchQuery ? "No results found" : "No chat history"}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {searchQuery
                ? "Try searching for something else"
                : "Your past conversations will appear here. Start chatting to build your history!"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate("/")}
                className="mt-6 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
              >
                Start Chatting
              </Button>
            )}
          </motion.div>
        )}

        {filteredHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Date and Stats */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="text-sm text-gray-400">•</div>
                  <div className="text-sm text-gray-500">
                    {formatDuration(item.duration)}
                  </div>
                  <div className="text-sm text-gray-400">•</div>
                  <div className="text-sm text-gray-500">
                    {item.messageCount} messages
                  </div>
                </div>

                {/* Preview */}
                <p className="text-gray-700 line-clamp-2 mb-2">{item.preview}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toast.info("Chat details coming soon!");
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteChat(item.id)}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Stats Footer */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{history.length}</div>
              <div className="text-xs text-gray-500">Total Chats</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {history.reduce((sum, item) => sum + item.messageCount, 0)}
              </div>
              <div className="text-xs text-gray-500">Messages Sent</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.floor(history.reduce((sum, item) => sum + item.duration, 0) / 60)}
              </div>
              <div className="text-xs text-gray-500">Minutes Chatted</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

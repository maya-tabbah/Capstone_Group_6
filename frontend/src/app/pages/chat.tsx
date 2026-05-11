import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Menu, Settings as SettingsIcon, History as HistoryIcon } from "lucide-react";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { SessionTimer } from "../components/SessionTimer";
import { ConnectionStatus, type ConnectionState } from "../components/ConnectionStatus";
import { ErrorState } from "../components/ErrorState";
import { TypingIndicator } from "../components/TypingIndicator";
import { type MessageStatusType } from "../components/MessageStatus";
import { websocketService } from "../services/websocket";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, userId } = location.state || { sessionId: "1", userId: "999" };
  
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("disconnected");
  const [connectionError, setConnectionError] = useState<string | undefined>();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [timeLeft, setTimeLeft] = useState(1200);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStrangerTyping]);

  useEffect(() => {
    websocketService.onMessageReceived((message) => {
      // Handle timer synchronization
      if (message.type === "system") {
        const remaining = parseInt(message.content);
        setTimeLeft(remaining);
        return;
      }

      if (message.type === "session_expired") {
        setSessionExpired(true);
        toast.error("Session has expired");
        return;
      }

      const newMessage = {
        id: Date.now().toString(),
        text: message.content,
        sender: message.sender || "stranger",
        timestamp: new Date(message.timestamp || new Date()),
        status: "delivered" as MessageStatusType,
      };
      setMessages(prev => [...prev, newMessage]);
    });

    websocketService.onConnectionStatusChange((status) => {
      setConnectionStatus(status === "connected" ? "connected" :
                         status === "connecting" ? "connecting" :
                         status === "error" ? "error" : "disconnected");
    });

    websocketService.onErrorOccurred((error) => {
      setConnectionError(error.message);
      toast.error("Connection error: " + error.message);
    });

    try {
      websocketService.connectChat(sessionId, userId);
    } catch (error) {
      setConnectionError("Failed to connect to server");
    }

    return () => {
      websocketService.disconnect();
    };
  }, [sessionId, userId]);

  const handleSendMessage = (text: string) => {
    const messageId = Date.now().toString();

    const newMessage = {
      id: messageId,
      text,
      sender: "user",
      timestamp: new Date(),
      status: "sending" as MessageStatusType,
    };

    setMessages(prev => [...prev, newMessage]);

    if (connectionStatus === "connected") {
      websocketService.sendMessage({
        type: "chat",
        content: text,
        sender: "user"
      });
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, status: "delivered" as MessageStatusType } : msg
        ));
      }, 500);
    } else {
      toast.warning("Offline mode - messages cannot be sent");
    }
  };

  const handleSessionExpire = () => {
    setSessionExpired(true);
    toast.error("Chat session has expired");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handleSessionWarning = () => {
    toast.warning("Session ending in 1 minute!");
  };

  const handleRetryConnection = () => {
    setConnectionError(undefined);
    setConnectionStatus("connecting");
    websocketService.connectChat(sessionId, userId);
  };

  if (sessionExpired) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <header className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] p-4 text-white">
          <h1 className="text-lg font-semibold">Persona</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <ErrorState
            type="session"
            title="Session Expired"
            message="Your chat session has ended. You'll be redirected to the home page shortly."
            onRetry={() => navigate("/")}
            retryLabel="Go Home"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="font-semibold">Stranger</div>
              <div className="text-xs text-white/80">
                {isStrangerTyping ? "typing..." : "Anonymous Chat"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SessionTimer
              duration={timeLeft}
              onExpire={handleSessionExpire}
              onWarning={handleSessionWarning}
              warningThreshold={60}
            />

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
              >
                <Menu className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-10"
                  >
                    <button
                      onClick={() => { navigate("/settings"); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => { navigate("/history"); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 border-t"
                    >
                      <HistoryIcon className="w-4 h-4" />
                      <span>Chat History</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <ConnectionStatus
            status={connectionStatus}
            errorMessage={connectionError}
            showLabel={true}
          />

          {connectionStatus === "error" && (
            <button
              onClick={handleRetryConnection}
              className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
            >
              Retry Connection
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <div className="text-center">
          <div className={`inline-block px-4 py-2 rounded-full text-xs transition-all ${
            connectionStatus === "connected"
              ? "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
            {connectionStatus === "connected"
              ? "Connected to a random stranger"
              : "Using offline mode - messages won't be sent"}
          </div>
        </div>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.text}
            sender={message.sender}
            timestamp={message.timestamp}
            status={message.status}
          />
        ))}

        <AnimatePresence>
          {isStrangerTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
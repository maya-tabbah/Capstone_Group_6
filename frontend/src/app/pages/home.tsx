import { useNavigate } from "react-router";
import { MessageSquare, Sparkles, Users, Zap, Settings, History } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#fbbf24] flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Persona</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/history")}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
          >
            <History className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-6">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
            <MessageSquare className="w-14 h-14 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Chat Anonymously with Strangers
          </h1>

          <p className="text-white/90 text-lg mb-8">
            Connect with random people for timed conversations. Be yourself, be anyone.
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-white text-[#8b5cf6] hover:bg-white/90 h-14 text-lg font-semibold"
          >
            Start Chatting
          </Button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Random Match</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Timed Chats</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Anonymous</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-white/60 text-sm">
          By using Persona, you agree to our Terms of Service
        </p>
      </footer>
    </div>
  );
}

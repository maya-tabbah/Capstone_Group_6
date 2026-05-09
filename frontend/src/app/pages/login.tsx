import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim()) {
      // Store username for later use
      sessionStorage.setItem("persona-username", username);
      // Navigate to waiting room for matchmaking
      navigate("/waiting");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#fbbf24] flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-bold text-xl">Persona</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Welcome to Persona</h1>
            <p className="text-white/80">Choose a username to get started</p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-12"
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={!username.trim()}
                className="w-full bg-white text-[#8b5cf6] hover:bg-white/90 h-12 font-semibold disabled:opacity-50"
              >
                Continue
              </Button>
            </div>

            <p className="text-white/60 text-xs text-center px-4">
              Your username is temporary and will be forgotten after your chat ends
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

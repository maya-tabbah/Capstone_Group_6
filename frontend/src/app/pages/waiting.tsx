import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { WaitingRoom } from "../components/WaitingRoom";
import { websocketService } from "../services/websocket";

export default function Waiting() {
  const navigate = useNavigate();
  const [userId] = useState(() => Math.floor(Math.random() * 10000).toString());
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    websocketService.onMessageReceived((msg) => {
      // When the backend sends the success event
      if (msg.type === "match_found") {
        setIsMatched(true);
        websocketService.disconnect();
        
        // Wait 1.5 seconds to show the success animation, then route to chat
        setTimeout(() => {
          navigate("/chat", { state: { sessionId: msg.content, userId: userId } });
        }, 1500);
      }
    });

    // Start the real connection
    websocketService.connectMatchmaking(userId);

    return () => {
      websocketService.disconnect();
    };
  }, [navigate, userId]);

  return <WaitingRoom isMatched={isMatched} />;
}
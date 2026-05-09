export type MessageData = {
  type: "chat" | "system" | "session_expired" | "match_found";
  content: string;
  timestamp?: string;
  sender?: "user" | "stranger";
  clientId?: string;
};

export type ConnectionCallback = (status: "connected" | "disconnected" | "error" | "connecting") => void;
export type MessageCallback = (message: MessageData) => void;
export type ErrorCallback = (error: Error) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private isIntentionalDisconnect = false;
  private currentUserId: string | null = null;
  private currentSessionId: string | null = null;

  private onConnectionChange: ConnectionCallback | null = null;
  private onMessage: MessageCallback | null = null;
  private onError: ErrorCallback | null = null;

  private getHost(): string {
    return import.meta.env.VITE_BACKEND_URL || "127.0.0.1:8000";
  }

  private getProtocol(): string {
    return window.location.protocol === "https:" ? "wss:" : "ws:";
  }

  connectMatchmaking(userId: string): void {
    try {
      this.disconnect();
      this.isIntentionalDisconnect = false;
      this.currentUserId = userId;
      this.onConnectionChange?.("connecting");

      const wsUrl = `${this.getProtocol()}//${this.getHost()}/ws/match/${userId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.onConnectionChange?.("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "matched") {
            this.onMessage?.({ type: "match_found", content: data.session_id.toString() });
          }
        } catch (error) {
          console.error("[WebSocket] Matchmaking parse error:", error);
        }
      };

      this.ws.onerror = (error) => {
        this.onConnectionChange?.("error");
        this.onError?.(new Error("Matchmaking connection failed."));
      };

      this.ws.onclose = () => {
        this.onConnectionChange?.("disconnected");
      };

    } catch (error) {
      this.onError?.(error as Error);
    }
  }

  connectChat(sessionId: string, userId: string): void {
    try {
      this.disconnect();
      this.isIntentionalDisconnect = false;
      this.currentUserId = userId;
      this.currentSessionId = sessionId;
      this.onConnectionChange?.("connecting");

      const wsUrl = `${this.getProtocol()}//${this.getHost()}/ws/${sessionId}/${userId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.onConnectionChange?.("connected");
      };

      this.ws.onmessage = (event) => {
        if (event.data === "SESSION_EXPIRED") {
          this.onMessage?.({ type: "session_expired", content: "Session has expired" });
          return;
        }

        try {
          const data = JSON.parse(event.data);
          
          if (data.clientId === this.currentUserId) {
            return;
          }
          
          data.sender = "stranger";
          this.onMessage?.(data as MessageData);
        } catch (error) {
          console.error("[WebSocket] Chat parse error:", error);
        }
      };

      this.ws.onerror = (error) => {
        this.onConnectionChange?.("error");
        this.onError?.(new Error("Chat connection failed."));
      };

      this.ws.onclose = () => {
        this.onConnectionChange?.("disconnected");
        if (!this.isIntentionalDisconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      };

    } catch (error) {
      this.onError?.(error as Error);
    }
  }

  private attemptReconnect(): void {
    if (!this.currentSessionId || !this.currentUserId) return;
    this.reconnectAttempts++;
    setTimeout(() => {
      this.connectChat(this.currentSessionId!, this.currentUserId!);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  sendMessage(message: Omit<MessageData, "timestamp" | "clientId">): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = {
        ...message,
        timestamp: new Date().toISOString(),
        clientId: this.currentUserId
      };
      this.ws.send(JSON.stringify(payload));
    } else {
      this.onError?.(new Error("Cannot send message: WebSocket not connected"));
    }
  }

  disconnect(): void {
    this.isIntentionalDisconnect = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onConnectionStatusChange(callback: ConnectionCallback): void {
    this.onConnectionChange = callback;
  }

  onMessageReceived(callback: MessageCallback): void {
    this.onMessage = callback;
  }

  onErrorOccurred(callback: ErrorCallback): void {
    this.onError = callback;
  }
}

export const websocketService = new WebSocketService();
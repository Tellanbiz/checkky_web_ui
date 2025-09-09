"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { getClientAccessToken } from "../services/auth/client-auth";

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

// Secure message validation
const isValidMessage = (message: any): message is WebSocketMessage => {
  return (
    message &&
    typeof message.type === "string" &&
    message.type.length > 0 &&
    message.type.length <= 100
  ); // Prevent oversized type names
};

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: WebSocketMessage) => void;
  reconnect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  isConnecting: false,
  lastMessage: null,
  sendMessage: () => {},
  reconnect: () => {},
  disconnect: () => {},
});

const getAccessToken = async (): Promise<string | null> => {
  try {
    return await getClientAccessToken();
  } catch (error) {
    // Don't expose auth errors to client
    return null;
  }
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const config = {
    maxReconnectAttempts: parseInt("5"),
    reconnectDelay: parseInt("3000"),
    pingInterval: parseInt("30000"),
    connectionTimeout: parseInt("10000"),
  };

  const getWebSocketUrl = useCallback(async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("No access token found");

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) throw new Error("WebSocket URL not configured");

    if (!wsUrl.startsWith("ws://") && !wsUrl.startsWith("wss://")) {
      throw new Error("Invalid WebSocket URL format");
    }

    return `${wsUrl}/ws?token=${accessToken}`;
  }, []);

  const startPing = useCallback(() => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

    pingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "ping", timestamp: Date.now() })
        );
      }
    }, config.pingInterval);
  }, [config.pingInterval]);

  const connect = useCallback(async () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      setIsConnecting(true);
      const wsUrl = await getWebSocketUrl();
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      let connectionTimeout: NodeJS.Timeout | null = null;

      connectionTimeout = setTimeout(() => {
        if (socket.readyState === WebSocket.CONNECTING) {
          socket.close(1006, "Connection timeout");
        }
      }, config.connectionTimeout);

      socket.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;

        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }

        startPing();
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          // Validate message structure
          if (!isValidMessage(parsed)) {
            return; // Silently reject invalid messages
          }

          if (parsed.type === "pong") return;
          setLastMessage(parsed);
        } catch (error) {
          // Don't expose message parsing errors to client
        }
      };

      socket.onclose = (event) => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }

        setIsConnected(false);
        setIsConnecting(false);

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        const permanentErrors = [1002, 1003, 1007, 1008, 1009, 1010, 1015];
        const shouldReconnect =
          event.code !== 1000 &&
          !permanentErrors.includes(event.code) &&
          reconnectAttempts.current < config.maxReconnectAttempts;

        if (shouldReconnect) {
          reconnectAttempts.current++;
          const delay = config.reconnectDelay * reconnectAttempts.current;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      socket.onerror = (error) => {
        // Don't expose internal error details to client
        console.error("Connection failed");
        setIsConnecting(false);
      };
    } catch (error) {
      // Don't expose internal error details to client
      console.error("Connection failed");
      setIsConnecting(false);
    }
  }, [getWebSocketUrl, config.connectionTimeout, startPing]);

  const disconnect = useCallback(() => {
    [reconnectTimeoutRef, pingIntervalRef].forEach((ref) => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    });

    if (socketRef.current) {
      socketRef.current.close(1000, "Manual disconnect");
      socketRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttempts.current = 0;
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 1000);
  }, [disconnect, connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    // Validate message before sending
    if (!isValidMessage(message)) {
      return; // Silently reject invalid messages
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        const sanitizedMessage = {
          type: message.type,
          data: message.data,
          timestamp: Date.now(),
        };
        socketRef.current.send(JSON.stringify(sanitizedMessage));
      } catch (error) {
        // Don't expose send errors to client
      }
    }
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Sanitize context to prevent exposure of sensitive data
  const contextValue: WebSocketContextType = {
    socket: null, // Don't expose raw socket to client
    isConnected,
    isConnecting,
    lastMessage: lastMessage
      ? {
          type: lastMessage.type,
          data: lastMessage.data,
          timestamp: lastMessage.timestamp,
        }
      : null,
    sendMessage,
    reconnect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export { WebSocketContext };

import { useState, useEffect, useCallback, useRef } from "react";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000; // 3 seconds

  // Clean up function to clear timeouts and close socket
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socket) {
      socket.close();
    }
  }, [socket]);

  // Connect to WebSocket
  const connect = useCallback(
    (url: string) => {
      // Clean up existing connection if any
      cleanup();

      try {
        setConnectionStatus("connecting");
        const newSocket = new WebSocket(url);

        newSocket.onopen = () => {
          setConnectionStatus("connected");
          reconnectAttemptsRef.current = 0;
          console.log("WebSocket connection established");
        };

        newSocket.onmessage = (event) => {
          setLastMessage(event);
        };

        newSocket.onclose = (event) => {
          if (event.wasClean) {
            console.log(
              `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
            );
            setConnectionStatus("disconnected");
          } else {
            console.error("WebSocket connection died");
            setConnectionStatus("error");

            // Attempt to reconnect if not at max attempts
            if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
              reconnectTimeoutRef.current = setTimeout(() => {
                reconnectAttemptsRef.current += 1;
                console.log(
                  `Attempting to reconnect (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`
                );
                connect(url);
              }, RECONNECT_INTERVAL);
            }
          }
        };

        newSocket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("error");
        };

        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to establish WebSocket connection:", error);
        setConnectionStatus("error");
      }
    },
    [cleanup]
  );

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus("disconnected");
    setSocket(null);
  }, [cleanup]);

  // Send message through WebSocket
  const sendMessage = useCallback(
    (message: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        return true;
      }
      return false;
    },
    [socket]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    socket,
    lastMessage,
    connectionStatus,
    connected: connectionStatus === "connected",
    connect,
    disconnect,
    sendMessage,
  };
};

export default useWebSocket;

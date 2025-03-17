"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import ChatSidebar from "@/components/ChatSidebar";
import ChatPanel from "@/components/ChatPanel";
import ResponseVisualization from "@/components/ResponseVisualization";
import useWebSocket from "@/hooks/useWebSocket";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content:
    | string
    | Array<{
        type: string;
        text?: string;
        image_url?: { url: string; detail?: string };
      }>;
  timestamp: Date;
  metadata?: {
    response_time?: number;
    length?: number;
    sentiment?: "positive" | "negative" | "neutral";
    contains_image_analysis?: boolean;
  };
  feedback?: "positive" | "negative" | null;
};

export type ChatSession = {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

const ChatPage = () => {
  // State for chat sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isStreamingResponse, setIsStreamingResponse] =
    useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const initialSessionCreated = useRef(false);

  // Reference to the active session
  const activeSession = sessions.find(
    (session) => session.id === activeSessionId
  );

  // WebSocket connection
  const {
    connected,
    sendMessage,
    lastMessage,
    connectionStatus,
    connect,
    disconnect,
  } = useWebSocket();

  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage || !activeSessionId) return;

    try {
      const data = JSON.parse(lastMessage.data);

      // Handle different message types
      if (data.type === "message") {
        setIsLoading(false);

        const newMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
          metadata: data.metadata,
        };

        // Update the session with the new message
        updateSessionWithMessage(activeSessionId, newMessage);
      } else if (data.type === "stream") {
        setIsStreamingResponse(true);

        // Find if there's already a streaming message
        const existingStreamingMsg = sessions
          .find((s) => s.id === activeSessionId)
          ?.messages.find(
            (m) => m.role === "assistant" && m.id === "streaming"
          );

        if (existingStreamingMsg) {
          // Update existing streaming message
          updateStreamingMessage(
            activeSessionId,
            existingStreamingMsg.id,
            data.content
          );
        } else {
          // Create new streaming message
          const streamingMsg: Message = {
            id: "streaming",
            role: "assistant",
            content: data.content,
            timestamp: new Date(),
          };
          updateSessionWithMessage(activeSessionId, streamingMsg);
        }
      } else if (data.type === "stream_complete") {
        setIsStreamingResponse(false);
        setIsLoading(false);

        // Convert streaming message to a permanent one
        finalizeStreamingMessage(activeSessionId, data.metadata);
      } else if (data.type === "error") {
        setIsLoading(false);
        setIsStreamingResponse(false);

        // Add error message
        const errorMsg: Message = {
          id: uuidv4(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };
        updateSessionWithMessage(activeSessionId, errorMsg);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }, [lastMessage, activeSessionId]);

  // Initialize a new session when component mounts, but only once
  useEffect(() => {
    if (sessions.length === 0 && !initialSessionCreated.current) {
      initialSessionCreated.current = true;
      createNewSession();
    }
  }, [sessions.length]);

  // Connect to WebSocket when active session changes
  useEffect(() => {
    if (!activeSessionId) return;

    disconnect();
    connect(`ws://localhost:8081/ws/${activeSessionId}`);

    return () => {
      disconnect();
    };
  }, [activeSessionId]);

  // Reset selected message when active session changes or is deleted
  useEffect(() => {
    // Check if the selected message still exists in the active session
    if (selectedMessage && activeSession) {
      const messageExists = activeSession.messages.some(
        (msg) => msg.id === selectedMessage.id
      );
      if (!messageExists) {
        setSelectedMessage(null);
      }
    } else if (!activeSession) {
      // No active session, clear selected message
      setSelectedMessage(null);
    }
  }, [activeSession, selectedMessage]);

  // Create a new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      name: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions((prevSessions) => [...prevSessions, newSession]);
    setActiveSessionId(newSession.id);

    // Ensure sidebar is expanded when creating a new chat
    setIsSidebarExpanded(true);
  };

  // Send a message from the user
  const sendUserMessage = (content: string, imageData?: string) => {
    if ((!content.trim() && !imageData) || !activeSessionId || !connected)
      return;

    // Create message content based on whether an image is included
    let messageContent:
      | string
      | Array<{
          type: string;
          text?: string;
          image_url?: { url: string; detail?: string };
        }>;
    let messageToSend: any = {
      type: "message",
      content,
      stream: true,
    };

    if (imageData) {
      // For UI display, we'll format the content as an array
      messageContent = [
        { type: "text", text: content },
        { type: "image_url", image_url: { url: imageData } },
      ];

      // Add image data to the message we send to the server
      messageToSend.image = imageData;
    } else {
      messageContent = content;
    }

    // Create new user message
    const newMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    // Add to session
    updateSessionWithMessage(activeSessionId, newMessage);

    // Send to WebSocket
    setIsLoading(true);
    sendMessage(JSON.stringify(messageToSend));
  };

  // Update session with a new message
  const updateSessionWithMessage = (sessionId: string, message: Message) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, message],
            updatedAt: new Date(),
          };
        }
        return session;
      })
    );
  };

  // Update content of a streaming message
  const updateStreamingMessage = (
    sessionId: string,
    messageId: string,
    additionalContent: string
  ) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: session.messages.map((msg) => {
              if (msg.id === messageId) {
                // Handle both string and array content cases
                if (typeof msg.content === "string") {
                  return {
                    ...msg,
                    content: msg.content + additionalContent,
                  };
                } else if (Array.isArray(msg.content)) {
                  // For complex content structure, find text item and update it
                  const updatedContent = [...msg.content];
                  const textItem = updatedContent.find(
                    (item) => item.type === "text"
                  );
                  if (textItem && textItem.text) {
                    textItem.text += additionalContent;
                  } else {
                    updatedContent.push({
                      type: "text",
                      text: additionalContent,
                    });
                  }
                  return { ...msg, content: updatedContent };
                }
                return msg;
              }
              return msg;
            }),
            updatedAt: new Date(),
          };
        }
        return session;
      })
    );
  };

  // Convert a streaming message to a permanent one
  const finalizeStreamingMessage = (sessionId: string, metadata?: any) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          const streamingMsg = session.messages.find(
            (m) => m.id === "streaming"
          );

          if (streamingMsg) {
            const permanentMsg: Message = {
              ...streamingMsg,
              id: uuidv4(),
              metadata,
            };

            return {
              ...session,
              messages: session.messages
                .filter((m) => m.id !== "streaming")
                .concat(permanentMsg),
              updatedAt: new Date(),
            };
          }
        }
        return session;
      })
    );
  };

  // Handle message selection for visualization
  const handleMessageSelect = (message: Message | null) => {
    setSelectedMessage(message);
  };

  // Close visualization panel
  const closeVisualization = () => {
    setSelectedMessage(null);
  };

  // Toggle sidebar expanded state
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Submit feedback for a message
  const submitFeedback = (
    messageId: string,
    feedback: "positive" | "negative"
  ) => {
    if (!activeSessionId || !connected) return;

    // Update local state
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: session.messages.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  feedback,
                };
              }
              return msg;
            }),
          };
        }
        return session;
      })
    );

    // Send feedback to server
    sendMessage(
      JSON.stringify({
        type: "feedback",
        message_id: messageId,
        rating: feedback,
      })
    );
  };

  // Rename a session
  const renameSession = (sessionId: string, newName: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            name: newName,
          };
        }
        return session;
      })
    );
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    // If deleted session contains the selected message, clear it
    if (selectedMessage) {
      const session = sessions.find((s) => s.id === sessionId);
      if (
        session &&
        session.messages.some((m) => m.id === selectedMessage.id)
      ) {
        setSelectedMessage(null);
      }
    }

    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );

    if (activeSessionId === sessionId) {
      // Find next session to select
      const remainingSessions = sessions.filter((s) => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        setActiveSessionId(remainingSessions[0].id);
      } else {
        setActiveSessionId(null);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main sidebar (when expanded) */}
      {isSidebarExpanded && (
        <div className="h-full transition-all duration-300 ease-in-out">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onCreateSession={createNewSession}
            onRenameSession={renameSession}
            onDeleteSession={deleteSession}
            connectionStatus={connectionStatus}
            onToggleSidebar={toggleSidebar}
          />
        </div>
      )}

      {/* Collapsed sidebar toggle button */}
      {!isSidebarExpanded && (
        <div
          className="flex items-center bg-gray-800 px-3 cursor-pointer h-12 hover:bg-gray-700 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          <div className="flex items-center text-gray-300 hover:text-white">
            <IconChevronRight size={20} stroke={2} />
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-grow">
        <div className="flex flex-grow overflow-hidden">
          {/* Main chat messages */}
          <div className="flex-grow overflow-hidden">
            <ChatPanel
              session={activeSession}
              onSendMessage={sendUserMessage}
              isLoading={isLoading}
              isStreamingResponse={isStreamingResponse}
              onMessageSelect={handleMessageSelect}
              onSubmitFeedback={submitFeedback}
            />
          </div>

          {/* Visualization panel (only visible when a message is selected) */}
          {selectedMessage && selectedMessage.role === "assistant" && (
            <div className="w-80 border-l border-gray-200 bg-white">
              <ResponseVisualization
                message={selectedMessage}
                onClose={closeVisualization}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

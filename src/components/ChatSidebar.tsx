import React, { useState } from "react";
import { ChatSession } from "../app/chat/page";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onDeleteSession: (sessionId: string) => void;
  connectionStatus: ConnectionStatus;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  connectionStatus,
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const handleEditClick = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingName(session.name);
  };

  const handleSaveEdit = () => {
    if (editingSessionId && editingName.trim()) {
      onRenameSession(editingSessionId, editingName);
      setEditingSessionId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditingSessionId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const getConnectionStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-64 h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">Chat Sessions</h2>
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${getConnectionStatusColor(
                connectionStatus
              )}`}
            ></div>
            <span className="text-xs text-gray-300">
              {connectionStatus === "connected"
                ? "Connected"
                : connectionStatus === "connecting"
                ? "Connecting..."
                : connectionStatus === "error"
                ? "Connection Error"
                : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Session list */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="text-center p-4 text-gray-400">
              No chats yet. Create a new one!
            </div>
          ) : (
            <ul className="space-y-1">
              {sessions.map((session) => (
                <li key={session.id}>
                  {editingSessionId === session.id ? (
                    <div className="p-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveEdit}
                        autoFocus
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div
                      className={`
                        flex items-center justify-between p-2 rounded cursor-pointer
                        ${
                          activeSessionId === session.id
                            ? "bg-gray-700"
                            : "hover:bg-gray-700"
                        }
                      `}
                      onClick={() => onSelectSession(session.id)}
                    >
                      <div className="flex-grow overflow-hidden">
                        <div className="font-medium truncate">
                          {session.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {formatDate(session.updatedAt)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(session);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-200"
                          title="Rename"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this chat?"
                              )
                            ) {
                              onDeleteSession(session.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-400"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Create new chat button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onCreateSession}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;

import React, { useState } from "react";
import { ChatSession } from "../app/chat/page";
import { ActionIcon, Text, Tooltip, Button } from "@mantine/core";
import { IconEdit, IconTrash, IconChevronLeft } from "@tabler/icons-react";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onDeleteSession: (sessionId: string) => void;
  connectionStatus: ConnectionStatus;
  onToggleSidebar: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  connectionStatus,
  onToggleSidebar,
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
    if (e.key === "Enter") handleSaveEdit();
    if (e.key === "Escape") setEditingSessionId(null);
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

  const connectionColors: Record<ConnectionStatus, string> = {
    connected: "bg-green-500",
    connecting: "bg-yellow-500",
    disconnected: "bg-gray-500",
    error: "bg-red-500",
  };

  return (
    <div className="w-72 h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="pr-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <Tooltip label="Collapse sidebar" position="right" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={onToggleSidebar}
              className="mr-2 px-3 h-12 hover:bg-gray-700"
              aria-label="Toggle sidebar"
            >
              <IconChevronLeft size={20} stroke={2} />
            </ActionIcon>
          </Tooltip>
          <h2 className="font-semibold">Chat Sessions</h2>
        </div>
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${connectionColors[connectionStatus]}`}
          ></div>
          <span className="text-xs text-gray-300 capitalize">
            {connectionStatus.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Session list */}
      <div className="flex-grow overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center p-4 text-gray-400">
            <Text size="sm">No chats yet. Create a new one!</Text>
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
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      activeSessionId === session.id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <div className="flex-grow overflow-hidden">
                      <div className="font-medium truncate">{session.name}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {formatDate(session.updatedAt)}
                      </div>
                    </div>
                    <div className="flex items-center ml-2">
                      <Tooltip label="Rename" withArrow position="top">
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(session);
                          }}
                          className="text-gray-400 hover:text-gray-200"
                        >
                          <IconEdit size={16} stroke={1.5} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Delete" withArrow position="top">
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="red"
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
                          className="text-gray-400 hover:text-red-400 ml-1"
                        >
                          <IconTrash size={16} stroke={1.5} />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create new chat button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          color="blue"
          onClick={onCreateSession}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition cursor-pointer"
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;

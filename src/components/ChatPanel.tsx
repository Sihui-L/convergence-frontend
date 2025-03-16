import React, { useState, useRef, useEffect } from "react";
import { ChatSession, Message } from "../app/chat/page";
import { MessageBubble, EmptyChat } from "./ChatPanel/MessageComponents";
import { InputArea } from "./ChatPanel/InputComponents";

export interface ChatPanelProps {
  session: ChatSession | undefined;
  onSendMessage: (
    content: string,
    enableStreaming: boolean,
    imageData?: string
  ) => void;
  isLoading: boolean;
  isStreamingResponse: boolean;
  onMessageSelect: (message: Message | null) => void;
  onSubmitFeedback: (
    messageId: string,
    feedback: "positive" | "negative"
  ) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  session,
  onSendMessage,
  isLoading,
  isStreamingResponse,
  onMessageSelect,
  onSubmitFeedback,
}) => {
  // State
  const [message, setMessage] = useState<string>("");
  const [enableStreaming, setEnableStreaming] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  // Functions
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!message.trim() && !imagePreview) || isLoading) return;

    try {
      if (imagePreview) {
        onSendMessage(message, enableStreaming, imagePreview);
        resetImageSelection();
      } else {
        onSendMessage(message, enableStreaming);
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setSelectedFile(file);
      processImagePreview(file);
    }
  };

  const processImagePreview = (file: File) => {
    const reader = new FileReader();
    setIsProcessingImage(true);

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsProcessingImage(false);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      setIsProcessingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetImageSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // If no session is available
  if (!session) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-gray-500">
          No chat selected. Create a new chat or select one from the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{session.name}</h2>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={enableStreaming}
              onChange={() => setEnableStreaming(!enableStreaming)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Enable streaming</span>
          </label>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {session.messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <div className="space-y-4">
            {session.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onMessageSelect={onMessageSelect}
                onSubmitFeedback={onSubmitFeedback}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <InputArea
        message={message}
        setMessage={setMessage}
        imagePreview={imagePreview}
        isProcessingImage={isProcessingImage}
        isLoading={isLoading}
        isStreamingResponse={isStreamingResponse}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        handleFileUpload={handleFileUpload}
        resetImageSelection={resetImageSelection}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />
    </div>
  );
};

export default ChatPanel;

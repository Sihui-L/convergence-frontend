// components/ChatPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChatSession, Message } from "../app/chat/page";
import IconUser from "./icons/IconUser";
import IconAI from "./icons/IconAI";
import IconSend from "./icons/IconSend";
import TypingIndicator from "./TypingIndicator";
import MessageFeedback from "./MessageFeedback";
import ImagePreview from "./ImagePreview";

interface ChatPanelProps {
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
  const [message, setMessage] = useState<string>("");
  const [enableStreaming, setEnableStreaming] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!message.trim() && !imagePreview) || isLoading) return;

    try {
      // If there's an image, send it along with the message
      if (imagePreview) {
        onSendMessage(message, enableStreaming, imagePreview);
        // Clear the image preview and selected file after sending
        setImagePreview(null);
        setSelectedFile(null);
      } else {
        // Just send the text message
        onSendMessage(message, enableStreaming);
      }

      // Clear the message input
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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

      // Create a preview of the image
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
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Function to check if a message contains an image (for display purposes)
  const hasImageContent = (msg: Message): boolean => {
    if (typeof msg.content === "object" && Array.isArray(msg.content)) {
      return msg.content.some((item) => item.type === "image_url");
    }
    return false;
  };

  // Function to extract image URL from message content
  const getImageUrl = (msg: Message): string | null => {
    if (typeof msg.content === "object" && Array.isArray(msg.content)) {
      const imageItem = msg.content.find((item) => item.type === "image_url");
      if (imageItem && imageItem.image_url && imageItem.image_url.url) {
        return imageItem.image_url.url;
      }
    }
    return null;
  };

  // Function to extract text content from message
  const getTextContent = (msg: Message): string => {
    if (typeof msg.content === "string") {
      return msg.content;
    } else if (typeof msg.content === "object" && Array.isArray(msg.content)) {
      const textItem = msg.content.find((item) => item.type === "text");
      if (textItem && textItem.text) {
        return textItem.text;
      }
    }
    return "";
  };

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
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 max-w-md">
              <h3 className="text-lg font-medium text-gray-900">
                Start a conversation
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Send a message or upload an image to start chatting with the AI
                assistant.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {session.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                onClick={() =>
                  msg.role === "assistant" ? onMessageSelect(msg) : null
                }
              >
                <div
                  className={`
                    flex max-w-3xl rounded-lg p-4 
                    ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }
                    ${
                      msg.role === "assistant"
                        ? "hover:border-blue-300 cursor-pointer"
                        : ""
                    }
                  `}
                >
                  <div className="flex-shrink-0 mr-3">
                    {msg.role === "user" ? (
                      <IconUser className="h-6 w-6 text-white" />
                    ) : (
                      <IconAI className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {msg.role === "user" ? "You" : "AI Assistant"}
                      </div>
                      <div className="text-xs text-gray-400 ml-2">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>

                    {/* Display user uploaded image */}
                    {msg.role === "user" && hasImageContent(msg) && (
                      <div className="mt-2 mb-2">
                        <img
                          src={getImageUrl(msg) || ""}
                          alt="User uploaded image"
                          className="max-h-64 rounded-lg"
                        />
                      </div>
                    )}

                    {/* Message text content */}
                    <div className="mt-1 whitespace-pre-wrap">
                      {getTextContent(msg)}
                    </div>

                    {msg.role === "assistant" && (
                      <div className="mt-2">
                        <MessageFeedback
                          messageId={msg.id}
                          feedback={msg.feedback}
                          onSubmitFeedback={onSubmitFeedback}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {isLoading && !isStreamingResponse && (
          <div className="mb-2">
            <TypingIndicator />
          </div>
        )}

        {/* Image preview area */}
        {imagePreview && (
          <div className="mb-4">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Selected"
                className="max-h-40 rounded-lg border border-gray-300"
              />
              <button
                onClick={removeSelectedFile}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {isProcessingImage && (
          <div className="mb-2 p-2 bg-blue-50 rounded-md text-blue-600 flex items-center">
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing image...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-grow">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                imagePreview
                  ? "Ask about this image..."
                  : "Type your message..."
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={handleFileUpload}
              className={`p-2 rounded-full ${
                imagePreview
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="Upload image"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            <button
              type="submit"
              className={`p-2 rounded-full ${
                (!message.trim() && !imagePreview) || isLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={(!message.trim() && !imagePreview) || isLoading}
            >
              <IconSend className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;

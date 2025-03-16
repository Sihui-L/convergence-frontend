import React from "react";
import { IconSend, IconX, IconPhoto, IconLoader2 } from "@tabler/icons-react";
import TypingIndicator from "../TypingIndicator";
import { Button } from "@mantine/core";

export interface InputAreaProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  imagePreview: string | null;
  isProcessingImage: boolean;
  isLoading: boolean;
  isStreamingResponse: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleFileUpload: () => void;
  resetImageSelection: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  message,
  setMessage,
  imagePreview,
  isProcessingImage,
  isLoading,
  isStreamingResponse,
  handleSubmit,
  handleKeyDown,
  handleFileUpload,
  resetImageSelection,
  fileInputRef,
  handleFileChange,
}) => (
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
          <Button
            unstyled
            onClick={resetImageSelection}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <IconX className="h-5 w-5" stroke={2} />
          </Button>
        </div>
      </div>
    )}

    {isProcessingImage && (
      <div className="mb-2 p-2 bg-blue-50 rounded-md text-blue-600 flex items-center">
        <IconLoader2 className="animate-spin h-4 w-4 mr-2" stroke={2} />
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
            imagePreview ? "Ask about this image..." : "Type your message..."
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

        <Button
          unstyled
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
          <IconPhoto className="h-6 w-6" stroke={1.5} />
        </Button>

        <Button
          unstyled
          type="submit"
          className={`p-2 rounded-full ${
            (!message.trim() && !imagePreview) || isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={(!message.trim() && !imagePreview) || isLoading}
        >
          <IconSend className="h-6 w-6" stroke={1.5} />
        </Button>
      </div>
    </form>
  </div>
);

export default InputArea;

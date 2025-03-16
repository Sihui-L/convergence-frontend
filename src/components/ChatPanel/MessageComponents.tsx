import React from "react";
import { Message } from "../../app/chat/page";
import { IconUser, IconRobot } from "@tabler/icons-react";
import MessageFeedback from "../MessageFeedback";
import {
  formatTimestamp,
  hasImageContent,
  getImageUrl,
  getTextContent,
} from "./ChatHelpers";
import { Paper, Title, Text, Center } from "@mantine/core";

export interface MessageBubbleProps {
  message: Message;
  onMessageSelect: (message: Message | null) => void;
  onSubmitFeedback: (
    messageId: string,
    feedback: "positive" | "negative"
  ) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onMessageSelect,
  onSubmitFeedback,
}) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Paper
        className={`
          flex max-w-3xl rounded-lg p-4 
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }
          ${!isUser ? "hover:border-blue-300 cursor-pointer" : ""}
        `}
        onClick={() => (!isUser ? onMessageSelect(message) : undefined)}
        shadow="none"
        withBorder={false}
      >
        <div className="flex-shrink-0 mr-3">
          {isUser ? (
            <IconUser className="h-6 w-6 text-white" stroke={1.5} />
          ) : (
            <IconRobot className="h-6 w-6 text-blue-600" stroke={1.5} />
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <div className="font-medium">{isUser ? "You" : "AI Assistant"}</div>
            <div className="text-xs text-gray-400 ml-2">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>

          {isUser && hasImageContent(message) && (
            <div className="mt-2 mb-2">
              <img
                src={getImageUrl(message) || ""}
                alt="User uploaded image"
                className="max-h-64 rounded-lg"
              />
            </div>
          )}

          <div className="mt-1 whitespace-pre-wrap">
            {getTextContent(message)}
          </div>

          {!isUser && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <MessageFeedback
                messageId={message.id}
                feedback={message.feedback}
                onSubmitFeedback={onSubmitFeedback}
              />
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export const EmptyChat: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center p-6 max-w-md">
      <Title order={3} className="text-lg font-medium text-gray-900">
        Start a conversation
      </Title>
      <Text className="mt-2 text-sm text-gray-500">
        Send a message or upload an image to start chatting with the AI
        assistant.
      </Text>
    </div>
  </div>
);

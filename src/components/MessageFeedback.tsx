import React from "react";
import { IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import { Button } from "@mantine/core";

interface MessageFeedbackProps {
  messageId: string;
  feedback: "positive" | "negative" | null | undefined;
  onSubmitFeedback: (
    messageId: string,
    feedback: "positive" | "negative"
  ) => void;
}

const MessageFeedback: React.FC<MessageFeedbackProps> = ({
  messageId,
  feedback,
  onSubmitFeedback,
}) => {
  // If feedback has already been submitted, show the selected option
  if (feedback) {
    return (
      <div className="flex items-center text-xs text-gray-500">
        <IconThumbUp
          className={`h-4 w-4 mr-1 ${
            feedback === "positive" ? "text-green-600" : "text-gray-400"
          }`}
          stroke={2}
        />
        <div className="mx-2">|</div>
        <IconThumbDown
          className={`h-4 w-4 mr-1 ${
            feedback === "negative" ? "text-red-600" : "text-gray-400"
          }`}
          stroke={2}
        />
        <span className="ml-2">Feedback submitted</span>
      </div>
    );
  }

  // Otherwise, show the feedback options
  return (
    <div className="flex items-center text-xs text-gray-500">
      <span className="mr-2">Was this response helpful?</span>
      <Button
        unstyled
        onClick={() => onSubmitFeedback(messageId, "positive")}
        className="p-1 text-gray-500 hover:text-green-600 transition-colors"
        title="Helpful"
        aria-label="Mark as helpful"
      >
        <IconThumbUp className="h-4 w-4" stroke={2} />
      </Button>
      <Button
        unstyled
        onClick={() => onSubmitFeedback(messageId, "negative")}
        className="p-1 text-gray-500 hover:text-red-600 transition-colors ml-2"
        title="Not helpful"
        aria-label="Mark as not helpful"
      >
        <IconThumbDown className="h-4 w-4" stroke={2} />
      </Button>
    </div>
  );
};

export default MessageFeedback;

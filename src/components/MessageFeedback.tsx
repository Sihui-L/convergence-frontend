import React from "react";

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
        <div
          className={`flex items-center ${
            feedback === "positive" ? "text-green-600" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        </div>
        <div className="mx-2">|</div>
        <div
          className={`flex items-center ${
            feedback === "negative" ? "text-red-600" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
          </svg>
        </div>
        <span className="ml-2">Feedback submitted</span>
      </div>
    );
  }

  // Otherwise, show the feedback options
  return (
    <div className="flex items-center text-xs text-gray-500">
      <span className="mr-2">Was this response helpful?</span>
      <button
        onClick={() => onSubmitFeedback(messageId, "positive")}
        className="p-1 text-gray-500 hover:text-green-600 transition-colors"
        title="Helpful"
        aria-label="Mark as helpful"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      </button>
      <button
        onClick={() => onSubmitFeedback(messageId, "negative")}
        className="p-1 text-gray-500 hover:text-red-600 transition-colors ml-2"
        title="Not helpful"
        aria-label="Mark as not helpful"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      </button>
    </div>
  );
};

export default MessageFeedback;

import React from "react";
import { Message } from "../app/chat/page";

interface ResponseVisualizationProps {
  message: Message;
}

const ResponseVisualization: React.FC<ResponseVisualizationProps> = ({
  message,
}) => {
  if (message.role !== "assistant") {
    return null;
  }

  const { metadata } = message;

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      case "neutral":
      default:
        return "bg-blue-500";
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "negative":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-3 6a3 3 0 01-3-3h1a2 2 0 002 2 2 2 0 002-2h1a3 3 0 01-3 3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "neutral":
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5a1 1 0 010-2h2a1 1 0 010 2zm8 0h-2a1 1 0 010-2h2a1 1 0 010 2z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getSentimentLabel = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "Positive";
      case "negative":
        return "Negative";
      case "neutral":
      default:
        return "Neutral";
    }
  };

  // Function to calculate word count
  const getWordCount = (content: string | any[]): number => {
    if (typeof content === "string") {
      return content.split(/\s+/).filter((word) => word.length > 0).length;
    } else if (Array.isArray(content)) {
      // For complex content structure, combine all text entries
      const textItems = content.filter((item) => item.type === "text");
      const combinedText = textItems.map((item) => item.text).join(" ");
      return combinedText.split(/\s+/).filter((word) => word.length > 0).length;
    }
    return 0;
  };

  // Function to get text content length
  const getContentLength = (content: string | any[]): number => {
    if (typeof content === "string") {
      return content.length;
    } else if (Array.isArray(content)) {
      // For complex content structure, combine all text entries
      const textItems = content.filter((item) => item.type === "text");
      const combinedText = textItems.map((item) => item.text).join("");
      return combinedText.length;
    }
    return 0;
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Response Analysis
      </h3>

      {/* Response Type Badge - For image analysis */}
      {metadata?.contains_image_analysis && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            Image Analysis
          </span>
        </div>
      )}

      {/* Response Time */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Response Time
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold text-gray-900">
            {metadata?.response_time
              ? metadata.response_time.toFixed(2)
              : "N/A"}
            <span className="text-sm font-normal text-gray-500 ml-1">
              seconds
            </span>
          </div>
        </div>
      </div>

      {/* Length Metrics */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-1">Length</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Characters</div>
            <div className="text-xl font-semibold text-gray-900">
              {metadata?.length?.toLocaleString() ||
                getContentLength(message.content).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Words</div>
            <div className="text-xl font-semibold text-gray-900">
              {getWordCount(message.content).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Estimated Sentiment
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 rounded-full text-white ${getSentimentColor(
              metadata?.sentiment
            )}`}
          >
            {getSentimentIcon(metadata?.sentiment)}
          </div>
          <div className="text-lg font-medium text-gray-900">
            {getSentimentLabel(metadata?.sentiment)}
          </div>
        </div>
      </div>

      {/* Visualization - Simple word count bar */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Density Visualization
        </div>
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (getWordCount(message.content) / 200) * 100
              )}%`,
            }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500 flex justify-between">
          <span>0</span>
          <span>100</span>
          <span>200+ words</span>
        </div>
      </div>

      {/* Model Used - For image analysis */}
      {metadata?.contains_image_analysis && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-1">
            Model Used
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <div className="text-md font-medium text-gray-900">GPT-4o</div>
            <div className="text-xs text-gray-500 mt-1">
              Used for analyzing visual content
            </div>
          </div>
        </div>
      )}

      {/* Feedback status if available */}
      {message.feedback && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-1">
            Your Feedback
          </div>
          <div
            className={`
            flex items-center space-x-2 p-2 rounded-md
            ${
              message.feedback === "positive"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {message.feedback === "positive" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
            )}
            <span>
              {message.feedback === "positive" ? "Helpful" : "Not helpful"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseVisualization;

import React from "react";
import { Message } from "../app/chat/page";
import {
  IconMoodSmile,
  IconMoodSad,
  IconMoodNeutral,
  IconPhoto,
  IconThumbUp,
  IconThumbDown,
  IconX,
} from "@tabler/icons-react";

interface ResponseVisualizationProps {
  message: Message;
  onClose?: () => void;
}

const ResponseVisualization: React.FC<ResponseVisualizationProps> = ({
  message,
  onClose,
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
        return <IconMoodSmile className="h-5 w-5" stroke={2} />;
      case "negative":
        return <IconMoodSad className="h-5 w-5" stroke={2} />;
      case "neutral":
      default:
        return <IconMoodNeutral className="h-5 w-5" stroke={2} />;
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
    <div className="h-full p-4 overflow-y-auto relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          title="Close panel"
          aria-label="Close analysis panel"
        >
          <IconX size={18} stroke={2} />
        </button>
      )}

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Response Analysis
      </h3>

      {/* Response Type Badge - For image analysis */}
      {metadata?.contains_image_analysis && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <IconPhoto className="h-4 w-4 mr-1" stroke={2} />
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
              <IconThumbUp className="h-5 w-5" stroke={2} />
            ) : (
              <IconThumbDown className="h-5 w-5" stroke={2} />
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

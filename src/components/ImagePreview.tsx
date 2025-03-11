// components/ImagePreview.tsx
import React from "react";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "Preview",
  onRemove,
}) => {
  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className="max-h-40 rounded-lg border border-gray-300"
      />
      <button
        onClick={onRemove}
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
  );
};

export default ImagePreview;

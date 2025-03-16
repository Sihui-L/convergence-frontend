import { Message } from "../../app/chat/page";

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export const hasImageContent = (msg: Message): boolean => {
  if (typeof msg.content === "object" && Array.isArray(msg.content)) {
    return msg.content.some((item) => item.type === "image_url");
  }
  return false;
};

export const getImageUrl = (msg: Message): string | null => {
  if (typeof msg.content === "object" && Array.isArray(msg.content)) {
    const imageItem = msg.content.find((item) => item.type === "image_url");
    if (imageItem && imageItem.image_url && imageItem.image_url.url) {
      return imageItem.image_url.url;
    }
  }
  return null;
};

export const getTextContent = (msg: Message): string => {
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

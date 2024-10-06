import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { Tables } from "@/types/database.types";
import React from "react";

const MessageList = React.memo(
  ({ messages }: { messages: Tables<"message">[] }) => (
    <div className="flex flex-col">
      {messages
        .filter(
          (message) =>
            message.role === "user" ||
            message.type === "task" ||
            (message.type === null && message.role === "assistant")
        )
        .map((message) => (
          <div
            key={message.id}
            className={` mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`break-words max-w-full inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-brand text-brand-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.role === "user" ? (
                message.content
              ) : (
                <MarkdownRenderer content={message.content} />
              )}
            </span>
          </div>
        ))}
    </div>
  )
);

export default MessageList;

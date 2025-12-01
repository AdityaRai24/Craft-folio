import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "./constants";

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isProcessing: boolean;
  loadingMessage: string;
  themeColors: any;
  onSendMessage?: (message: string) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
}

const ChatInterface = ({
  messages,
  inputValue,
  setInputValue,
  isProcessing,
  loadingMessage,
  themeColors,
  onSendMessage,
  onKeyPress,
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
    if (onKeyPress) {
      onKeyPress(event);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              message.isUser ? "flex justify-end" : "flex justify-start"
            } ${
              message.isSystemNotification ? "justify-center" : ""
            }`}
          >
            {message.isSystemNotification ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xs py-1 px-3 rounded-full max-w-[80%]"
                style={{
                  backgroundColor: themeColors.primary,
                  color: themeColors.textPrimary,
                }}
              >
                {message.text}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser ? "rounded-br-none" : "rounded-bl-none"
                }`}
                style={{
                  backgroundColor: message.isUser
                    ? themeColors.primary
                    : themeColors.bgCard,
                  color: themeColors.textPrimary,
                }}
              >
                <p
                  className="text-sm whitespace-pre-line break-all"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {message.text}
                </p>
                <span
                  className="text-xs opacity-70 mt-1 block"
                  style={{ color: themeColors.textSecondary }}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
        {isProcessing && (
          <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-start"
          >
            <div
              className="rounded-lg rounded-bl-none p-3 max-w-[80%] flex items-center gap-3"
              style={{ backgroundColor: themeColors.bgCard }}
            >
              <span className="text-2xl animate-bounce">🪄</span>
              <div>
                <div className="text-sm font-medium">{loadingMessage}</div>
                <div className="flex space-x-1 mt-1">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: themeColors.primary,
                      animationDelay: "0ms",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: themeColors.primary,
                      animationDelay: "150ms",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: themeColors.primary,
                      animationDelay: "300ms",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 rounded-lg border outline-none"
          style={{
            backgroundColor: themeColors.bgCardHover,
            borderColor: themeColors.borderLight,
            color: themeColors.textPrimary,
          }}
          disabled={isProcessing}
        />
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isProcessing}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: inputValue.trim() && !isProcessing 
              ? themeColors.primary 
              : themeColors.bgCardHover,
            color: inputValue.trim() && !isProcessing 
              ? "#ffffff" 
              : themeColors.textSecondary,
            boxShadow: inputValue.trim() && !isProcessing 
              ? `0 4px 14px ${themeColors.primaryGlow}` 
              : "none",
          }}
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInterface; 

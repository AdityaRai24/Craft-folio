"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useUser } from '@clerk/nextjs';
import { shouldShowEditButtons } from './EditButton';

interface MagicWriteProps {
  onMagicWrite?: (prompt: string, context?: string) => Promise<string>;
  placeholder?: string;
  className?: string;
  buttonText?: string;
  context?: string;
}

const MagicWrite: React.FC<MagicWriteProps> = ({
  onMagicWrite,
  placeholder = "Ask AI to enhance this content...",
  className = "",
  buttonText = "Magic Write",
  context = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Authentication check
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();
  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleButtonClick = () => {
    setIsExpanded(true);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || !onMagicWrite) return;
    
    setIsLoading(true);
    try {
      await onMagicWrite(inputValue, context);
      setInputValue("");
      setIsExpanded(false);
    } catch (error) {
      console.error('Magic Write error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setInputValue("");
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setInputValue("");
  };

  // Don't render if user shouldn't see the button
  if (!shouldShowButton) {
    return null;
  }

  if (isExpanded) {
    // Use a simpler, more reliable positioning approach
    const positionStyle: React.CSSProperties = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'max-content',
      minWidth: '500px',
      maxWidth: '90vw',
      zIndex: 9999
    };

    return (
      <div className="hidden md:block">
        {/* Backdrop to close on click outside */}
        <div 
          className="fixed inset-0 bg-black/20 z-[9998]"
          onClick={() => setIsExpanded(false)}
        />
        
        {/* Input container */}
        <div className={`transition-all duration-300 ease-in-out ${className}`} style={positionStyle}>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 shadow-xl border border-gray-600">
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center justify-center w-8 h-8 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 shadow-sm flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, #10b981, #059669)`,
              }}
            >
              <Send className="h-3 w-3" />
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center justify-center w-8 h-8 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 rounded-md transition-colors duration-200 shadow-sm flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleButtonClick}
      className={`flex items-center cursor-pointer justify-center text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      style={{
        background: `linear-gradient(135deg, #10b981, #059669)`,
        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
      }}
    >
      <Sparkles className="h-4 w-4" />
      {buttonText && <span className="text-sm font-medium ml-2">{buttonText}</span>}
    </button>
  );
};

export default MagicWrite; 

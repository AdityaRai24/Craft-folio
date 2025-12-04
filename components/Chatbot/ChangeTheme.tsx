import { motion } from 'framer-motion';
import React from 'react'
import { CHATBOT_THEMES } from './constants';

const ChangeTheme = ({ handleThemeSelect, themeOptions, currentPortTheme, selectedTheme }: { handleThemeSelect: (theme: string) => void, themeOptions: any, currentPortTheme: string, selectedTheme: string }) => {



  const themeOptionsArray = themeOptions ? Object.keys(themeOptions) : [];
  const themeColors = CHATBOT_THEMES['dark'];



  return (
    <div className="grid grid-cols-2 gap-3">
      {themeOptionsArray.length === 0 ? (
        <div className="col-span-2 p-4 rounded-lg text-center" style={{ backgroundColor: themeColors.bgCard }}>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            No themes available for this template.
          </p>
        </div>
      ) : (
        themeOptionsArray.map((theme, index) => {
          const themeDetails = themeOptions[theme];
          const bgColor =
            themeDetails?.colors?.primary || "#f0f0f0";
          const textColor =
            themeDetails?.colors?.text?.primary || "#333333";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleThemeSelect(theme)}
              className={`p-4 rounded-lg border cursor-pointer transition-all text-center relative ${currentPortTheme === theme
                  ? "ring ring-opacity-50"
                  : ""
                }`}
              style={{
                backgroundColor: themeColors.bgCard,
                borderColor:
                  currentPortTheme === theme
                    ? themeColors.primary
                    : themeColors.borderLight,
                boxShadow:
                  currentPortTheme === theme
                    ? `0 0 20px ${themeColors.primaryGlow}`
                    : "none",
              }}
            >
              {(selectedTheme === theme ||
                currentPortTheme === theme) && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: themeColors.primary,
                    }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              <div
                className="w-full h-16 rounded-md mb-3 flex flex-col items-center justify-center p-1 shadow-inner"
                style={{ backgroundColor: bgColor }}
              >
                <span
                  style={{ color: textColor }}
                  className="text-lg font-semibold"
                >
                  Aa
                </span>
                <div
                  className="w-10 h-3 mt-1 rounded-sm"
                  style={{ backgroundColor: bgColor }}
                ></div>
              </div>
              <p
                className="font-medium capitalize"
                style={{ color: themeColors.textPrimary }}
              >
                {theme}
              </p>
            </motion.div>
          );
        })
      )}
    </div>)
}

export default ChangeTheme

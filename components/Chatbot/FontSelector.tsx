import { useState } from "react";
import { motion } from "framer-motion";
import { Type, X } from "lucide-react";
import { updateFont } from "@/app/actions/portfolio";
import { useDispatch } from "react-redux";
import { newPortfolioData } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import { fontClassMap, fontOptions } from "@/lib/font";
import { ColorTheme } from "@/lib/colorThemes";

interface FontSelectorProps {
  portfolioId: string;
  currentFont: string;
  setCurrentFont: (font: string) => void;
  onClose: () => void;
  themeColors: any;
  handleFontSelect: (font: string) => void;
  selectedFont: string;
}

const FontSelector = ({
  portfolioId,
  currentFont,
  setCurrentFont,
  onClose,
  themeColors,
  handleFontSelect,
  selectedFont,
}: FontSelectorProps) => {
  const dispatch = useDispatch();

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const handleFontClick = (font: string) => {
    handleFontSelect(font);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fontOptions.map((font, index) => {
          const fontClass = fontClassMap[font as keyof typeof fontClassMap];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleFontClick(font)}
              className={`p-4 rounded-lg border cursor-pointer transition-all text-center relative ${
                selectedFont === font || currentFont === font
                  ? "ring ring-opacity-50"
                  : ""
              }`}
              style={{
                backgroundColor: themeColors.bgCard,
                borderColor:
                  selectedFont === font || currentFont === font
                    ? themeColors.primary
                    : themeColors.borderLight,
                boxShadow:
                  selectedFont === font || currentFont === font
                    ? `0 0 20px ${themeColors.primaryGlow}`
                    : "none",
              }}
            >
              {(selectedFont === font || currentFont === font) && (
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
              <div className="w-full h-20 flex items-center justify-center mb-3">
                <span
                  className={`text-4xl font-bold ${fontClass}`}
                  style={{ color: themeColors.textPrimary }}
                >
                  Hello
                </span>
              </div>
              <p
                className="font-medium capitalize text-sm"
                style={{ color: themeColors.textPrimary }}
              >
                {font}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FontSelector; 

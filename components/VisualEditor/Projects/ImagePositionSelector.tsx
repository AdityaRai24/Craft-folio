import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface ImagePositionSelectorProps {
  value: "left" | "right";
  onChange: (value: "left" | "right") => void;
}

const ImagePositionSelector: React.FC<ImagePositionSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        Image Position
      </label>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "left", label: "Left Side" },
          { value: "right", label: "Right Side" },
        ].map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value as "left" | "right")}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
              value === option.value
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                option.value === "right" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="w-6 h-4 rounded"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              ></div>
              <div className="flex-1 space-y-1">
                <div className="h-1 bg-gray-400 rounded"></div>
                <div className="h-1 bg-gray-500 rounded w-3/4"></div>
              </div>
            </div>
            <div className="text-center text-xs text-white mt-2">
              {option.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePositionSelector;

import React from "react";
import { ColorTheme } from "@/lib/colorThemes";
import { Square, RectangleHorizontal, RectangleVertical } from "lucide-react";

interface AspectRatioSelectorProps {
  value: "auto" | "square" | "wide" | "tall";
  onChange: (value: "auto" | "square" | "wide" | "tall") => void;
  imageHeight: number;
  onImageHeightChange: (height: number) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange, imageHeight, onImageHeightChange }) => {
  const ratios = [
    { value: "auto", icon: RectangleHorizontal, label: "Auto", aspect: "auto" },
    { value: "square", icon: Square, label: "Square", aspect: "1:1" },
    { value: "wide", icon: RectangleHorizontal, label: "Wide", aspect: "16:9" },
    { value: "tall", icon: RectangleVertical, label: "Tall", aspect: "3:4" },
  ];

  return (
    <div>
      <label className="block text-white font-medium mb-3">
        Image Aspect Ratio
      </label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ratios.map(({ value: ratio, icon: Icon, label, aspect }) => (
          <div
            key={ratio}
            onClick={() => onChange(ratio as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === ratio
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <Icon
              className={`text-white ${
                ratio === "square"
                  ? "h-6 w-6"
                  : ratio === "tall"
                  ? "h-8 w-4"
                  : "h-4 w-8"
              }`}
            />
            <div className="text-center">
              <div className="text-xs text-white font-medium">{label}</div>
              <div className="text-xs text-gray-400">{aspect}</div>
            </div>
          </div>
        ))}
      </div>

      {value === "auto" && (
        <div>
          <label className="block text-left text-sm font-medium text-gray-300 mb-2">
            Custom Height: {imageHeight}px
          </label>
          <input
            type="range"
            min={150}
            max={300}
            step={25}
            value={imageHeight}
            onChange={(e) => onImageHeightChange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${Math.max(0, Math.min(100, ((imageHeight - 150) / 150) * 100))}%, #3f3f46 ${Math.max(0, Math.min(100, ((imageHeight - 150) / 150) * 100))}%, #3f3f46 100%)`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AspectRatioSelector;

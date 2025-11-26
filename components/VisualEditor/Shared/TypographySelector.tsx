import React from "react";

interface TypographyOption {
  value: string;
  label: string;
  preview?: string; // For size (e.g., "1rem") or weight class (e.g., "font-bold")
}

interface TypographySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: TypographyOption[];
  type: "size" | "weight";
}

const TypographySelector: React.FC<TypographySelectorProps> = ({
  label,
  value,
  onChange,
  options,
  type,
}) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === option.value
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className={`text-white text-center ${
                  type === "weight" ? option.preview : "font-bold"
                }`}
                style={
                  type === "size"
                    ? { fontSize: option.preview }
                    : { fontSize: "14px" }
                }
              >
                Aa
              </div>
            </div>
            <div className="text-center text-xs text-white">{option.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypographySelector;

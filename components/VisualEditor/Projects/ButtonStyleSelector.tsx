import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface ButtonStyleSelectorProps {
  value: "default" | "filled" | "ghost" | "minimal";
  onChange: (value: "default" | "filled" | "ghost" | "minimal") => void;
  label: string;
}

const ButtonStyleSelector: React.FC<ButtonStyleSelectorProps> = ({ value, onChange, label }) => {
  const styles = [
    { value: "default", label: "Default" },
    { value: "filled", label: "Filled" },
    { value: "ghost", label: "Ghost" },
    { value: "minimal", label: "Minimal" },
  ];

  return (
    <div>
      <label className="block text-white font-medium mb-3">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(({ value: style, label: styleLabel }) => (
          <div
            key={style}
            onClick={() => onChange(style as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === style
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className={`px-3 py-1 text-xs rounded transition-all ${
                  style === "filled"
                    ? "text-white"
                    : style === "ghost"
                    ? "bg-transparent border border-gray-500 text-gray-300"
                    : style === "minimal"
                    ? "bg-transparent text-gray-300 !underline"
                    : "bg-transparent border border-gray-500 text-gray-300"
                }`}
                style={
                  style === "filled"
                    ? { backgroundColor: ColorTheme.primary }
                    : style === "minimal" ? { textDecoration: "underline" } : {}
                }
              >
                {styleLabel}
              </div>
            </div>
            <div className="text-center text-xs text-white">{styleLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonStyleSelector;

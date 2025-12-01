import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface TechStackStyleSelectorProps {
  value: "pills" | "badges" | "minimal" | "colorful";
  onChange: (value: "pills" | "badges" | "minimal" | "colorful") => void;
}

const TechStackStyleSelector: React.FC<TechStackStyleSelectorProps> = ({ value, onChange }) => {
  const styles = [
    { value: "pills", label: "Pills" },
    { value: "badges", label: "Badges" },
    { value: "minimal", label: "Minimal" },
    { value: "colorful", label: "Colorful" },
  ];

  return (
    <div>
      <label className="block text-white font-medium mb-3">
        Tech Stack Style
      </label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(({ value: style, label }) => (
          <div
            key={style}
            onClick={() => onChange(style as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === style
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex flex-wrap gap-1 justify-center mb-2">
              {["React", "TS"].map((tech, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 ${
                    style === "pills"
                      ? "rounded-full border border-gray-500 text-white"
                      : style === "badges"
                      ? "rounded bg-gray-600 text-white"
                      : style === "minimal"
                      ? "text-gray-300"
                      : "rounded-full border-2 text-white"
                  }`}
                  style={
                    style === "colorful"
                      ? {
                          borderColor: ColorTheme.primary,
                          backgroundColor: `${ColorTheme.primary}20`,
                        }
                      : {}
                  }
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="text-center text-xs text-white">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackStyleSelector;

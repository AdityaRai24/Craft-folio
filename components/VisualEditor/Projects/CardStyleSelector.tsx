import React from "react";
import { ProjectsCustomizationState } from "@/types/projects/portfolio";

interface CardStyleSelectorProps {
    value: ProjectsCustomizationState["cardStyle"];
    onChange: (value: ProjectsCustomizationState["cardStyle"]) => void;
}

const CardStyleSelector: React.FC<CardStyleSelectorProps> = ({ value, onChange }) => {
    const styles = [
        { value: "default", label: "Default", preview: "bg-zinc-800 border-zinc-700" },
        { value: "minimal", label: "Minimal", preview: "bg-transparent border-transparent" },
        { value: "glassmorphism", label: "Glass", preview: "bg-white/10 backdrop-blur border-white/20" },
        { value: "neon", label: "Neon", preview: "bg-black border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" },
        { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30" },
        { value: "elevated", label: "Elevated", preview: "bg-zinc-800 shadow-lg border-zinc-700" },
        { value: "outlined", label: "Outlined", preview: "bg-transparent border-zinc-500 border-2" },
        { value: "filled", label: "Filled", preview: "bg-zinc-700 border-transparent" },
    ];

    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">Card Style</label>
            <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                    <button
                        key={style.value}
                        onClick={() => onChange(style.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all text-left group ${value === style.value
                            ? "border-white bg-zinc-700"
                            : "border-zinc-700 hover:border-zinc-600 bg-zinc-800"
                            }`}
                    >
                        <div className={`h-12 w-full rounded mb-2 border ${style.preview}`} />
                        <span className={`text-xs ${value === style.value ? "text-white" : "text-gray-400"
                            }`}>
                            {style.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CardStyleSelector;

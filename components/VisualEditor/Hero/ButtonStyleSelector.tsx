import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

export interface ButtonStyleSelectorProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: { value: string; label: string; style: string }[];
}

export const ButtonStyleSelector: React.FC<ButtonStyleSelectorProps> = ({
    value,
    onChange,
    label,
    options,
}) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                {label}
            </label>
            <div className="grid grid-cols-2 gap-2">
                {options.map(({ value: optionValue, label: optionLabel, style }) => (
                    <div
                        key={optionValue}
                        onClick={() => onChange(optionValue)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === optionValue
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div className="flex justify-center mb-2">
                            <div
                                className={`px-3 py-1 text-xs rounded transition-all ${style}`}
                                style={
                                    optionValue === "default" || optionValue === "rounded"
                                        ? { backgroundColor: ColorTheme.primary, color: "white" }
                                        : {}
                                }
                            >
                                Button
                            </div>
                        </div>
                        <div className="text-center text-xs text-white">{optionLabel}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

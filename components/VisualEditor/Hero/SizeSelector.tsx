import React from "react";

export interface SizeSelectorProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: { value: string; label: string; size: string }[];
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ value, onChange, label, options }) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                {label}
            </label>
            <div className="grid grid-cols-2 gap-2">
                {options.map(({ value: optionValue, label: optionLabel, size }) => (
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
                                className="bg-gradient-to-r rounded text-white text-center font-bold"
                                style={{ fontSize: size }}
                            >
                                Aa
                            </div>
                        </div>
                        <div className="text-center text-xs text-white">{optionLabel}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

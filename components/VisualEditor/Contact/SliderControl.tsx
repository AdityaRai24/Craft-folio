import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface SliderControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

const SliderControl: React.FC<SliderControlProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = "px",
}) => {
    return (
        <div className="mb-4">
            <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
          z-index: 10;
          position: relative;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
          z-index: 10;
          position: relative;
        }
      `}</style>
            <label className="block text-white font-medium mb-2">
                {label}: {value}{unit}
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary
                        } ${((value - min) / (max - min)) * 100}%, #3f3f46 ${((value - min) / (max - min)) * 100}%, #3f3f46 100%)`,
                }}
            />
        </div>
    );
};

export default SliderControl;

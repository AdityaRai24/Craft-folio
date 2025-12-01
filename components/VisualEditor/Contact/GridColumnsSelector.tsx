import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface GridColumnsSelectorProps {
    value: number;
    onChange: (value: number) => void;
}

const GridColumnsSelector: React.FC<GridColumnsSelectorProps> = ({ value, onChange }) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-2">
                Grid Columns
            </label>
            <div className="flex gap-2">
                {[2, 3, 4].map((cols) => (
                    <div
                        key={cols}
                        onClick={() => onChange(cols)}
                        className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${value === cols
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div className={`grid gap-1 ${cols === 2 ? "grid-cols-2" :
                                cols === 3 ? "grid-cols-3" :
                                    "grid-cols-4"
                            }`}>
                            {Array.from({ length: cols }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 rounded"
                                    style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                                ></div>
                            ))}
                        </div>
                        <div className="text-center text-xs text-white mt-2">
                            {cols} Cols
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridColumnsSelector;

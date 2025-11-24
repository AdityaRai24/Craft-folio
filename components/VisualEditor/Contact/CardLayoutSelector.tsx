import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface CardLayoutSelectorProps {
    value: "flex" | "stacked";
    onChange: (value: "flex" | "stacked") => void;
}

const CardLayoutSelector: React.FC<CardLayoutSelectorProps> = ({ value, onChange }) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">Card Layout</label>
            <div className="grid grid-cols-2 gap-3">
                <div
                    onClick={() => onChange("stacked")}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${value === "stacked"
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                >
                    <div className="space-y-2">
                        <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                        <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                        <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                    </div>
                    <div className="text-center text-sm text-white mt-2">
                        Stacked
                    </div>
                </div>

                <div
                    onClick={() => onChange("flex")}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${value === "flex"
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                            <div className="flex-1 h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                            <div className="flex-1 h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                        </div>
                    </div>
                    <div className="text-center text-sm text-white mt-2">
                        Flex
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardLayoutSelector;

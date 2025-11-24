import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface LayoutSelectorProps {
  value?: "single" | "grid";
  onChange?: (value: "single" | "grid") => void;
  gridColumns: number;
  onGridColumnsChange: (cols: number) => void;
  showLayoutTypeSelector?: boolean;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ 
  value = "grid", 
  onChange = () => {}, 
  gridColumns, 
  onGridColumnsChange,
  showLayoutTypeSelector = true 
}) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">Layout Style</label>
      <div className="space-y-4">
        {/* Layout Type Selection */}
        {showLayoutTypeSelector && (
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => onChange("single")}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                value === "single"
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
                Single Column
              </div>
            </div>

            <div
              onClick={() => onChange("grid")}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                value === "grid"
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              </div>
              <div className="text-center text-sm text-white mt-2">
                Grid Layout
              </div>
            </div>
          </div>
        )}

        {/* Grid Columns Selection - Only show when grid is selected */}
        {value === "grid" && (
          <div>
            <label className="block text-white text-left font-medium mb-2">
              Grid Columns
            </label>
            <div className="flex gap-2">
              {[2, 3].map((cols) => (
                <div
                  key={cols}
                  onClick={() => onGridColumnsChange(cols)}
                  className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                    gridColumns === cols
                      ? "border-white bg-zinc-700"
                      : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                  }`}
                >
                  <div className={`grid grid-cols-${cols} gap-1`}>
                    {Array.from({ length: cols }).map((_, i) => (
                      <div
                        key={i}
                        className="h-4 rounded"
                        style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-center text-sm text-white mt-2">
                    {cols} Cols
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutSelector;

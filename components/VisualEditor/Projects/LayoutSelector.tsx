import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface LayoutSelectorProps {
  value?: "single" | "grid" | "split";
  onChange?: (value: "single" | "grid" | "split") => void;
  gridColumns: number;
  onGridColumnsChange: (cols: number) => void;
  showLayoutTypeSelector?: boolean;
  showSingleOption?: boolean;
  bentoInnerLayout?: "single" | "two-cols";
  onBentoInnerLayoutChange?: (value: "single" | "two-cols") => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  value = "grid",
  onChange = () => { },
  gridColumns,
  onGridColumnsChange,
  showLayoutTypeSelector = true,
  showSingleOption = true,
  bentoInnerLayout = "single",
  onBentoInnerLayoutChange = () => { }
}) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">Layout Style</label>
      <div className="space-y-4">
        {/* Layout Type Selection */}
        {showLayoutTypeSelector && (
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => onChange("grid")}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === "grid"
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                }`}
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              </div>
              <div className="text-center text-xs text-white mt-2">
                Grid
              </div>
            </div>

            <div
              onClick={() => onChange("split")}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === "split"
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                }`}
            >
              <div className="flex gap-1 h-full items-center">
                <div className="w-1/3 h-full flex flex-col justify-center gap-1">
                  <div className="h-1 w-full bg-gray-500 rounded"></div>
                  <div className="h-1 w-3/4 bg-gray-500 rounded"></div>
                </div>
                <div className="w-2/3 flex flex-col gap-1">
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                </div>
              </div>
              <div className="text-center text-xs text-white mt-2">
                Bento
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
                  className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${gridColumns === cols
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

        {/* Bento Inner Layout Selection - Only show when Bento (split) is selected */}
        {value === "split" && (
          <div>
            <label className="block text-white text-left font-medium mb-2">
              Bento Layout
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => onBentoInnerLayoutChange("single")}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${bentoInnerLayout === "single"
                    ? "border-white bg-zinc-700"
                    : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                  }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                </div>
                <div className="text-center text-xs text-white mt-2">
                  One below other
                </div>
              </div>

              <div
                onClick={() => onBentoInnerLayoutChange("two-cols")}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${bentoInnerLayout === "two-cols"
                    ? "border-white bg-zinc-700"
                    : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                  }`}
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                  <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                </div>
                <div className="text-center text-xs text-white mt-2">
                  2 Cols Fixed
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutSelector;

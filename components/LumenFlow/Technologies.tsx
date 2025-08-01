import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton from "@/components/EditButton";
import {
  Code2,
  Settings,
  Palette,
  Move,
  Grid3X3,
  RotateCcw,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LayoutGrid,
  LayoutList,
  Sparkles,
  Zap,
} from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  getComponentCustomization,
  saveComponentCustomization,
  deleteComponentCustomization,
} from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";

interface TechnologiesProps {
  currentTheme: string;
}

interface Technology {
  name: string;
  category: string;
  description: string;
  logo?: string;
}

interface CustomizationState {
  gridColumns: number;
  cardLayout: "grid" | "list" | "masonry";
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon" | "gradient";
  cardBorderRadius: number;
  cardPadding: number;
  cardSpacing: number;
  iconSize: number;
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  textAlignment: "left" | "center" | "right";
  hoverEffects: boolean;
  glowEffect: boolean;
  borderGlow: boolean;
  backgroundOpacity: number;
  borderWidth: number;
  animationStyle: "fade" | "slide" | "scale" | "bounce";
  animationSpeed: number;
  staggerDelay: number;
  showCategory: boolean;
  categoryStyle: "badge" | "pill" | "minimal" | "colorful";
  categorySize: "sm" | "md" | "lg";
  showDescription: boolean;
  descriptionStyle: "overlay" | "tooltip" | "expand";
  accentLine: boolean;
  accentLineStyle: "gradient" | "solid" | "dashed" | "glow";
  accentLineWidth: number;
  accentLineColor: string;
  cardShadow: boolean;
  shadowIntensity: number;
  backgroundBlur: boolean;
  blurIntensity: number;
}

const Technologies: React.FC<TechnologiesProps> = ({ currentTheme }) => {
  const [technologiesData, setTechnologiesData] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  // Visual Editor States
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "effects"
  >("layout");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Default styles matching current LumenFlow Technologies appearance
  const defaultTechnologiesStyles: CustomizationState = {
    gridColumns: 5,
    cardLayout: "grid",
    cardStyle: "default",
    cardBorderRadius: 16,
    cardPadding: 32,
    cardSpacing: 24,
    iconSize: 80,
    titleSize: "md",
    titleWeight: "bold",
    textAlignment: "center",
    hoverEffects: true,
    glowEffect: true,
    borderGlow: false,
    backgroundOpacity: 0,
    borderWidth: 1,
    animationStyle: "fade",
    animationSpeed: 300,
    staggerDelay: 50,
    showCategory: false,
    categoryStyle: "minimal",
    categorySize: "sm",
    showDescription: false,
    descriptionStyle: "overlay",
    accentLine: true,
    accentLineStyle: "gradient",
    accentLineWidth: 4,
    accentLineColor: "#f97316",
    cardShadow: false,
    shadowIntensity: 1,
    backgroundBlur: false,
    blurIntensity: 10,
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>(
    defaultTechnologiesStyles
  );
  const [draftCustomization, setDraftCustomization] =
    useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization =
    visualEditorOpen && draftCustomization ? draftCustomization : customization;
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { theme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const techSection = portfolioData?.find(
    (item: any) => item.type === "technologies"
  );
  const sectionTitle = techSection?.sectionTitle || "Technologies";
  const sectionDescription =
    techSection?.sectionDescription ||
    "A comprehensive collection of technologies, frameworks, and tools I've mastered throughout my development journey, enabling me to build robust and scalable applications.";

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "technologies",
        });
        if (result.success && result.data) {
          setCustomization(result.data as any);
        } else {
          setCustomization(defaultTechnologiesStyles);
        }
      } catch (error) {
        setCustomization(defaultTechnologiesStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (
    key: keyof CustomizationState,
    value: any
  ) => {
    if (!draftCustomization) return;
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  // When 'Done' is clicked, save draft to DB and update main state
  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "technologies",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  // On reset, delete from DB, set both states to default, and close editor
  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "technologies",
      });
      setCustomization(defaultTechnologiesStyles);
      setDraftCustomization(defaultTechnologiesStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (portfolioData) {
      const techData = portfolioData.find(
        (section: any) => section.type === "technologies"
      )?.data;
      if (techData) {
        setTechnologiesData(techData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-tech-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("technologies update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status technologies: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  // Visual Editor Components
  const GridColumnsSelector: React.FC<{
    value: number;
    onChange: (value: number) => void;
  }> = ({ value, onChange }) => {
    return (
      <div>
        <label className="block text-white text-left font-medium mb-2">
          Grid Columns
        </label>
        <div className="flex gap-2">
          {[4, 5].map((cols) => (
            <div
              key={cols}
              onClick={() => onChange(cols)}
              className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                value === cols
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className={`grid grid-cols-${cols} gap-1`}>
                {Array.from({ length: cols }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    }}
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
    );
  };

  const CardLayoutSelector: React.FC<{
    value: "grid" | "list" | "masonry";
    onChange: (value: "grid" | "list" | "masonry") => void;
  }> = ({ value, onChange }) => {
    const layouts = [
      { value: "grid", label: "Grid", icon: LayoutGrid },
      { value: "list", label: "List", icon: LayoutList },
      { value: "masonry", label: "Masonry", icon: Sparkles },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Card Layout
        </label>
        <div className="grid grid-cols-3 gap-3">
          {layouts.map(({ value: layout, label, icon: Icon }) => (
            <div
              key={layout}
              onClick={() => onChange(layout as any)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                value === layout
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2 text-white" />
              <div className="text-center text-sm text-white">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CardStyleSelector: React.FC<{
    value: "default" | "minimal" | "glassmorphism" | "neon" | "gradient";
    onChange: (
      value: "default" | "minimal" | "glassmorphism" | "neon" | "gradient"
    ) => void;
  }> = ({ value, onChange }) => {
    const styles = [
      { value: "default", label: "Default" },
      { value: "minimal", label: "Minimal" },
      { value: "glassmorphism", label: "Glass" },
      { value: "neon", label: "Neon" },
      { value: "gradient", label: "Gradient" },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Card Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {styles.map((style) => (
            <div
              key={style.value}
              onClick={() => onChange(style.value as any)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                value === style.value
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className="space-y-2">
                <div
                  className="h-3 rounded"
                  style={{
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  }}
                ></div>
                <div
                  className="h-3 rounded"
                  style={{
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  }}
                ></div>
                <div
                  className="h-3 rounded"
                  style={{
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  }}
                ></div>
              </div>
              <div className="text-center text-sm text-white mt-2">
                {style.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AlignmentSelector: React.FC<{
    value: "left" | "center" | "right";
    onChange: (value: "left" | "center" | "right") => void;
  }> = ({ value, onChange }) => {
    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Text Alignment
        </label>
        <div className="flex gap-2">
          {[
            { value: "left", icon: AlignLeft },
            { value: "center", icon: AlignCenter },
            { value: "right", icon: AlignRight },
          ].map(({ value: align, icon: Icon }) => (
            <div
              key={align}
              onClick={() => onChange(align as any)}
              className={`cursor-pointer flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                value === align
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <Icon className="h-6 w-6 mx-auto text-white" />
              <div className="text-center text-xs text-white mt-2 capitalize">
                {align}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SpacingSelector: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
    min: number;
    max: number;
    step: number;
  }> = ({ value, onChange, label, min, max, step }) => {
    return (
      <div>
        <label className="block text-left text-sm font-medium text-gray-300 mb-2">
          {label}: {value}px
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
            background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${
              ColorTheme.primary
            } ${(value / max) * 100}%, #3f3f46 ${
              (value / max) * 100
            }%, #3f3f46 100%)`,
          }}
        />
      </div>
    );
  };

  // Typography Selectors
  const TitleSizeSelector: React.FC<{
    value: "sm" | "md" | "lg" | "xl";
    onChange: (value: "sm" | "md" | "lg" | "xl") => void;
  }> = ({ value, onChange }) => {
    const sizes = [
      { value: "sm", label: "Small", size: "text-lg" },
      { value: "md", label: "Medium", size: "text-xl" },
      { value: "lg", label: "Large", size: "text-2xl" },
      { value: "xl", label: "Extra Large", size: "text-3xl" },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Title Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map(({ value: size, label, size: sizeClass }) => (
            <div
              key={size}
              onClick={() => onChange(size as any)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                value === size
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className={`${sizeClass} font-bold text-white text-center`}>
                Aa
              </div>
              <div className="text-center text-xs text-white mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TitleWeightSelector: React.FC<{
    value: "normal" | "medium" | "semibold" | "bold";
    onChange: (value: "normal" | "medium" | "semibold" | "bold") => void;
  }> = ({ value, onChange }) => {
    const weights = [
      { value: "normal", label: "Normal", weight: "font-normal" },
      { value: "medium", label: "Medium", weight: "font-medium" },
      { value: "semibold", label: "Semi Bold", weight: "font-semibold" },
      { value: "bold", label: "Bold", weight: "font-bold" },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Title Weight
        </label>
        <div className="grid grid-cols-2 gap-2">
          {weights.map(({ value: weight, label, weight: weightClass }) => (
            <div
              key={weight}
              onClick={() => onChange(weight as any)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                value === weight
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className={`text-xl ${weightClass} text-white text-center`}>
                Aa
              </div>
              <div className="text-center text-xs text-white mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-300 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  const titleColor = theme === "light" ? "#f97316" : "#f97316";

  return (
    <div className="space-y-4 md:space-y-12 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto md:px-4 relative">
      {/* Visual Editor Button */}
      <button
        onClick={openVisualEditor}
        className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
        style={{
          background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
        }}
      >
        <Settings className="h-4 w-4" />
        Visual Editor
      </button>

      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="technologies"
      />

      <div
        className={`grid gap-${effectiveCustomization.cardSpacing / 4} sm:gap-${
          effectiveCustomization.cardSpacing / 4
        } md:gap-${effectiveCustomization.cardSpacing / 4}`}
        style={{
          gridTemplateColumns: `repeat(${effectiveCustomization.gridColumns}, minmax(0, 1fr))`,
          gap: `${effectiveCustomization.cardSpacing}px`,
        }}
      >
        {technologiesData.map((tech: Technology, index: number) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredTech(index)}
            onMouseLeave={() => setHoveredTech(null)}
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                    : themeClasses.gradientPrimary,
              }}
            ></div>

            <div
              className={`relative overflow-hidden border transition-all duration-${
                effectiveCustomization.animationSpeed / 100
              } transform group-hover:translate-y-[-2px] group-hover:scale-105`}
              style={{
                borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                padding: `${effectiveCustomization.cardPadding}px`,
                borderWidth: `${effectiveCustomization.borderWidth}px`,
                transform:
                  effectiveCustomization.hoverEffects && hoveredTech === index
                    ? "translateY(-4px)"
                    : "none",
                filter: effectiveCustomization.glowEffect
                  ? `drop-shadow(0 0 20px ${titleColor}30)`
                  : "none",
                ...(effectiveCustomization.cardStyle === "minimal" && {
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }),
                ...(effectiveCustomization.cardStyle === "glassmorphism" && {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }),
                ...(effectiveCustomization.cardStyle === "neon" && {
                  border: `2px solid ${titleColor}`,
                  boxShadow: `0 0 20px ${titleColor}50`,
                }),
                ...(effectiveCustomization.cardStyle === "gradient" && {
                  background: `linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1))`,
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                }),
                ...(effectiveCustomization.cardStyle === "default" && {
                  backgroundColor: "transparent",
                  border:
                    theme === "light"
                      ? "1px solid rgba(229, 231, 235, 0.5)"
                      : "1px solid rgba(55, 65, 81, 0.5)",
                }),
              }}
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 md:space-y-4 md:h-48">
                <div className="flex-shrink-0">
                  {tech.logo ? (
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden ${
                        theme === "light"
                          ? "bg-gray-100/50 group-hover:bg-orange-50/50"
                          : "bg-gray-700/30 group-hover:bg-gray-600/30"
                      } flex items-center justify-center transition-colors duration-300`}
                    >
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        style={{
                          width: `${effectiveCustomization.iconSize}px`,
                          height: `${effectiveCustomization.iconSize}px`,
                        }}
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                          }
                        }}
                      />
                      <div className="hidden w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 items-center justify-center">
                        <Code2
                          size={24}
                          className={`${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          } sm:text-2xl md:text-3xl`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl ${
                        theme === "light"
                          ? "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-orange-50 group-hover:to-orange-100"
                          : "bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700"
                      } flex items-center justify-center border ${
                        theme === "light"
                          ? "border-gray-200/30"
                          : "border-gray-600/30"
                      } transition-colors duration-300`}
                    >
                      <Code2
                        size={24}
                        className={`${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        } sm:text-2xl md:text-3xl`}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <h3
                    className={`transition-colors duration-300 ${
                      theme === "light"
                        ? "text-gray-900"
                        : themeClasses.textPrimary
                    } ${
                      effectiveCustomization.textAlignment === "center"
                        ? "text-center"
                        : effectiveCustomization.textAlignment === "right"
                        ? "text-right"
                        : "text-left"
                    } ${
                      effectiveCustomization.titleSize === "sm"
                        ? "text-sm sm:text-base"
                        : effectiveCustomization.titleSize === "md"
                        ? "text-base md:text-lg"
                        : effectiveCustomization.titleSize === "lg"
                        ? "text-lg md:text-xl"
                        : "text-xl md:text-2xl"
                    } ${
                      effectiveCustomization.titleWeight === "normal"
                        ? "font-normal"
                        : effectiveCustomization.titleWeight === "medium"
                        ? "font-medium"
                        : effectiveCustomization.titleWeight === "semibold"
                        ? "font-semibold"
                        : "font-bold"
                    }`}
                  >
                    {tech.name}
                  </h3>
                </div>

                <div
                  className={`absolute inset-0 ${
                    theme === "light" ? "bg-white/95" : "bg-gray-900/95"
                  } backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col justify-center text-center transition-all duration-300 ${
                    hoveredTech === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-2 sm:space-y-3">
                    <h4
                      className={`text-sm sm:text-base md:text-lg font-bold ${
                        theme === "light"
                          ? "text-gray-900"
                          : themeClasses.textPrimary
                      }`}
                    >
                      {tech.name}
                    </h4>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        theme === "light"
                          ? "text-gray-600"
                          : themeClasses.textSecondary
                      }`}
                    >
                      {tech.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    theme === "light"
                      ? "linear-gradient(to right, rgba(249,115,22,0.5), rgba(234,88,12,0.5))"
                      : themeClasses.gradientPrimary,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {technologiesData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              style={{ background: themeClasses.bgSecondary }}
            >
              <Code2 size={32} style={{ color: themeClasses.textSecondary }} />
            </div>
            <h3
              className="text-xl font-semibold"
              style={{ color: themeClasses.textSecondary }}
            >
              No technologies yet
            </h3>
            <p
              className="max-w-md mx-auto"
              style={{ color: themeClasses.textSecondary }}
            >
              Start adding your technical skills and technologies to showcase
              your expertise and capabilities.
            </p>
          </div>
        </div>
      )}

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <div
          ref={dragRef}
          className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-96 max-h-[80vh] overflow-hidden"
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-bold text-white">
              Technologies Settings
            </h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "typography", "styling", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-2 text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
                style={
                  activeTab === tab
                    ? {
                        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      }
                    : {}
                }
              >
                {tab === "layout" && (
                  <Grid3X3 className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab === "typography" && (
                  <span className="text-lg mx-auto mb-1">T</span>
                )}
                {tab === "styling" && (
                  <Palette className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab === "effects" && <Zap className="h-3 w-3 mx-auto mb-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {activeTab === "layout" && (
              <>
                <GridColumnsSelector
                  value={
                    draftCustomization?.gridColumns ?? customization.gridColumns
                  }
                  onChange={(value) =>
                    updateDraftCustomization("gridColumns", value)
                  }
                />

                <CardLayoutSelector
                  value={
                    draftCustomization?.cardLayout ?? customization.cardLayout
                  }
                  onChange={(value) =>
                    updateDraftCustomization("cardLayout", value)
                  }
                />

                <AlignmentSelector
                  value={
                    draftCustomization?.textAlignment ??
                    customization.textAlignment
                  }
                  onChange={(value) =>
                    updateDraftCustomization("textAlignment", value)
                  }
                />

                <SpacingSelector
                  value={
                    draftCustomization?.cardSpacing ?? customization.cardSpacing
                  }
                  onChange={(value) =>
                    updateDraftCustomization("cardSpacing", value)
                  }
                  label="Card Spacing"
                  min={8}
                  max={48}
                  step={4}
                />

                <SpacingSelector
                  value={
                    draftCustomization?.cardPadding ?? customization.cardPadding
                  }
                  onChange={(value) =>
                    updateDraftCustomization("cardPadding", value)
                  }
                  label="Card Padding"
                  min={8}
                  max={48}
                  step={4}
                />
              </>
            )}

            {activeTab === "typography" && (
              <>
                <TitleSizeSelector
                  value={
                    draftCustomization?.titleSize ?? customization.titleSize
                  }
                  onChange={(value) =>
                    updateDraftCustomization("titleSize", value)
                  }
                />

                <TitleWeightSelector
                  value={
                    draftCustomization?.titleWeight ?? customization.titleWeight
                  }
                  onChange={(value) =>
                    updateDraftCustomization("titleWeight", value)
                  }
                />

                <div>
                  <label className="block text-white font-medium mb-2">
                    Icon Size:{" "}
                    {draftCustomization?.iconSize ?? customization.iconSize}px
                  </label>
                  <input
                    type="range"
                    min={32}
                    max={120}
                    value={
                      draftCustomization?.iconSize ?? customization.iconSize
                    }
                    onChange={(e) =>
                      updateDraftCustomization(
                        "iconSize",
                        Number(e.target.value)
                      )
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </>
            )}

            {activeTab === "styling" && (
              <>
                <CardStyleSelector
                  value={
                    draftCustomization?.cardStyle ?? customization.cardStyle
                  }
                  onChange={(value) =>
                    updateDraftCustomization("cardStyle", value)
                  }
                />

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Radius:{" "}
                    {draftCustomization?.cardBorderRadius ??
                      customization.cardBorderRadius}
                    px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={
                      draftCustomization?.cardBorderRadius ??
                      customization.cardBorderRadius
                    }
                    onChange={(e) =>
                      updateDraftCustomization(
                        "cardBorderRadius",
                        Number(e.target.value)
                      )
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Width:{" "}
                    {draftCustomization?.borderWidth ??
                      customization.borderWidth}
                    px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={
                      draftCustomization?.borderWidth ??
                      customization.borderWidth
                    }
                    onChange={(e) =>
                      updateDraftCustomization(
                        "borderWidth",
                        Number(e.target.value)
                      )
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </>
            )}

            {activeTab === "effects" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Animation Speed:{" "}
                    {draftCustomization?.animationSpeed ??
                      customization.animationSpeed}
                    ms
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={800}
                    step={50}
                    value={
                      draftCustomization?.animationSpeed ??
                      customization.animationSpeed
                    }
                    onChange={(e) =>
                      updateDraftCustomization(
                        "animationSpeed",
                        Number(e.target.value)
                      )
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Hover Effects</span>
                  <Switch
                    checked={
                      draftCustomization?.hoverEffects ??
                      customization.hoverEffects
                    }
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("hoverEffects", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Glow Effect</span>
                  <Switch
                    checked={
                      draftCustomization?.glowEffect ?? customization.glowEffect
                    }
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("glowEffect", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Accent Line</span>
                  <Switch
                    checked={
                      draftCustomization?.accentLine ?? customization.accentLine
                    }
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("accentLine", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Card Shadow</span>
                  <Switch
                    checked={
                      draftCustomization?.cardShadow ?? customization.cardShadow
                    }
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("cardShadow", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    Background Blur
                  </span>
                  <Switch
                    checked={
                      draftCustomization?.backgroundBlur ??
                      customization.backgroundBlur
                    }
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("backgroundBlur", checked)
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-700 p-4 bg-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={resetCustomization}
                className="flex items-center gap-1 flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={saveDraftCustomization}
                className="flex-1 py-2 px-3 text-sm text-white rounded transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for floating window */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default Technologies;

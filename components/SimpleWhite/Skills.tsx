import { motion } from "framer-motion";
import { Settings, Grid3X3, RotateCcw, Type, Zap, Eye, X, Layout, Palette, Star } from "lucide-react";
import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from '@/components/EditButton';
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { defaultSimpleWhiteSkillsStyles } from "./defaultStyles/skills";
import { SimpleWhiteSkillsCustomizationState } from "./defaultStyles/types";
import { ColorTheme } from "@/lib/colorThemes";

interface TechnologyType {
  name: string;
  logo: string;
}

// Visual Alignment Selector Component
const AlignmentSelector: React.FC<{
  value: "center" | "left" | "right";
  onChange: (value: "center" | "left" | "right") => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const alignments = [
    { value: "left", icon: "←", label: "Left" },
    { value: "center", icon: "↔", label: "Center" },
    { value: "right", icon: "→", label: "Right" },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {alignments.map(({ value: align, icon, label: alignLabel }) => (
          <div
            key={align}
            onClick={() => onChange(align as any)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === align
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="text-2xl text-white">{icon}</div>
            <div className="space-y-1 w-full">
              <div
                className={`h-1 bg-gradient-to-r rounded ${
                  align === "left"
                    ? "mr-auto w-3/4"
                    : align === "center"
                    ? "mx-auto w-1/2"
                    : "ml-auto w-3/4"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              ></div>
              <div
                className={`h-1 bg-gray-400 rounded ${
                  align === "left"
                    ? "mr-auto w-full"
                    : align === "center"
                    ? "mx-auto w-3/4"
                    : "ml-auto w-full"
                }`}
              ></div>
            </div>
            <div className="text-xs text-white">{alignLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Size Selector Component
const SizeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string; size: string }[];
}> = ({ value, onChange, label, options }) => {
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
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === optionValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className="rounded text-white text-center font-bold"
                style={{ 
                  fontSize: size,
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
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

const Skills: NextPage = ({ customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  
  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<TechnologyType[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "cards" | "effects"
  >("layout");

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Main customization state (from DB or default)
  const [customization, setCustomization] = useState<SimpleWhiteSkillsCustomizationState>(defaultSimpleWhiteSkillsStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<SimpleWhiteSkillsCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "skills",
        });
        if (result.success && result.data) {
          setCustomization(result.data as unknown as SimpleWhiteSkillsCustomizationState);
        } else {
          setCustomization(defaultSimpleWhiteSkillsStyles);
        }
      } catch (error) {
        setCustomization(defaultSimpleWhiteSkillsStyles);
      }
    };
    if (portfolioId) loadCustomizations();
  }, [portfolioId]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof SimpleWhiteSkillsCustomizationState, value: any) => {
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
        componentType: "skills",
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
        componentType: "skills",
      });
      setCustomization(defaultSimpleWhiteSkillsStyles);
      setDraftCustomization(defaultSimpleWhiteSkillsStyles);
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

  // Helper functions for styling based on customization
  const getSectionClasses = () => {
    const bgMap = {
      white: "bg-white",
      "gray-50": "bg-gray-50",
      "gray-100": "bg-gray-100",
      "gray-900": "bg-gray-900 dark:bg-gray-900",
    };
    
    return `py-20 ${bgMap[effectiveCustomization.backgroundColor]}`;
  };

  const getHeaderClasses = () => {
    const alignmentMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    const titleSizeMap = {
      sm: "text-2xl md:text-3xl",
      md: "text-3xl md:text-4xl",
      lg: "text-3xl md:text-4xl",
      xl: "text-3xl md:text-4xl",
      "2xl": "text-4xl md:text-5xl",
      "3xl": "text-5xl md:text-6xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    const titleColorMap = {
      "gray-800": "text-gray-800 dark:text-white",
      "gray-900": "text-gray-900 dark:text-white",
      black: "text-black dark:text-white",
      white: "text-white",
    };

    return {
      container: `${alignmentMap[effectiveCustomization.titleAlignment]} mb-16 relative`,
      title: `section-title ${titleSizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} ${titleColorMap[effectiveCustomization.titleColor]} mb-4`,
      description: `section-description text-lg text-${effectiveCustomization.descriptionColor} ${effectiveCustomization.backgroundColor === "gray-900" ? "dark:text-gray-400" : ""} max-w-2xl ${effectiveCustomization.titleAlignment === "center" ? "mx-auto" : ""}`,
    };
  };

  const getGridClasses = () => {
    const columnsMap = {
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      8: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
    };

    const spacingMap = {
      compact: "gap-4",
      normal: "gap-6",
      spacious: "gap-8",
    };

    const maxWidthMap = {
      sm: "max-w-3xl",
      md: "max-w-4xl",
      lg: "max-w-5xl",
      xl: "max-w-5xl",
      "2xl": "max-w-6xl",
      full: "w-full",
    };

    return `grid ${columnsMap[effectiveCustomization.gridColumns]} ${spacingMap[effectiveCustomization.spacing]} ${maxWidthMap[effectiveCustomization.maxWidth]} mx-auto`;
  };

  const getCardClasses = () => {
    const styleMap = {
      minimal: "bg-transparent",
      elevated: `bg-white ${effectiveCustomization.backgroundColor === "gray-900" ? "dark:bg-gray-800" : ""}`,
      outlined: `border-2 border-gray-300 bg-transparent ${effectiveCustomization.backgroundColor === "gray-900" ? "dark:border-gray-600" : ""}`,
      filled: `bg-gray-100 ${effectiveCustomization.backgroundColor === "gray-900" ? "dark:bg-gray-700" : ""}`,
    };

    const shadowMap = {
      none: "",
      light: "shadow-sm",
      medium: "shadow-md",
      heavy: "shadow-lg",
    };

    const radiusMap = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    };

    const hoverMap = {
      lift: "hover:shadow-lg hover:-translate-y-1",
      glow: `hover:shadow-lg hover:shadow-[${ColorTheme.primary}]/20`,
      scale: "hover:scale-105",
      rotate: "hover:rotate-3",
      none: "",
    };

    return `flex flex-col cursor-pointer items-center p-4 ${styleMap[effectiveCustomization.cardStyle]} ${radiusMap[effectiveCustomization.cardBorderRadius]} ${shadowMap[effectiveCustomization.cardShadow]} ${effectiveCustomization.hoverEffects ? hoverMap[effectiveCustomization.cardHoverEffect] : ""} transition-all duration-300`;
  };

  const getIconClasses = () => {
    const sizeMap = {
      sm: "w-12 h-12",
      md: "w-14 h-14",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    };

    const styleMap = {
      square: "rounded-none",
      rounded: "rounded-lg",
      circular: "rounded-full",
    };

    return `${sizeMap[effectiveCustomization.iconSize]} mb-3 flex items-center justify-center ${styleMap[effectiveCustomization.iconStyle]}`;
  };

  const getLabelClasses = () => {
    const sizeMap = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    const colorMap = {
      "gray-600": "text-gray-600",
      "gray-700": "text-gray-700",
      "gray-800": "text-gray-800",
      "gray-200": "text-gray-200",
    };

    return `${colorMap[effectiveCustomization.labelColor]} ${effectiveCustomization.backgroundColor === "gray-900" ? "dark:text-gray-200" : ""} ${weightMap[effectiveCustomization.labelWeight]} ${sizeMap[effectiveCustomization.labelSize]} text-center`;
  };

  useEffect(() => {
    if (portfolioData) {
      const technologiesSectionData = portfolioData?.find((section: any) => section.type === "technologies")?.data;
      const technologiesSection = portfolioData?.find((section: any) => section.type === "technologies");

      if (technologiesSectionData) {
        setTechnologiesData(technologiesSectionData);
      } else {
        setTechnologiesData([]);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);
  
  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-${portfolioId}-technologies`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          // console.log('Technologies update detected!', payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status for technologies: ${status}`);
      });
      
    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const skillVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother animation
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const headerClasses = getHeaderClasses();

  return (
    <section id="skills" className={getSectionClasses()}>
      <style>{customCSS}</style>
      
      {/* Visual Editor Toggle Button */}
      <div className=" flex items-center gap-2">
        <EditButton sectionName="technologies" />
        <button
          onClick={openVisualEditor}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{
            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
          }}
        >
          <Settings className="h-4 w-4" />
          Visual Editor
        </button>
      </div>
      
      <div className="container mx-auto px-4">
        {effectiveCustomization.headerVisible && (
          <div className={headerClasses.container}>
            <h2 className={headerClasses.title}>
              {portfolioData?.find((section: any) => section.type === "technologies")?.sectionTitle || "Technical Skills"}
            </h2>
            {effectiveCustomization.descriptionVisible && (
              <p className={headerClasses.description}>
                {portfolioData?.find((section: any) => section.type === "technologies")?.sectionDescription || "A comprehensive list of technologies and tools I work with"}
              </p>
            )}
          </div>
        )}

        <motion.div 
          className={getGridClasses()}
          variants={effectiveCustomization.staggerAnimation ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
        >
          {technologiesData.map((technology, index) => (
            <motion.div 
              key={index}
              className={getCardClasses()}
              variants={effectiveCustomization.staggerAnimation ? skillVariants : undefined}
            >
              {effectiveCustomization.showIcons && (
                <div className={getIconClasses()}>
                  <img 
                    src={technology.logo} 
                    alt={technology.name} 
                    className="max-w-full max-h-full"
                  />
                </div>
              )}
              {effectiveCustomization.showLabels && (
                <h3 className={getLabelClasses()}>
                  {technology.name}
                </h3>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

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
            <h3 className="text-lg font-bold text-white">Skills Visual Editor</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "typography", "cards", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-3 text-sm capitalize transition-colors`}
                style={{
                  background: activeTab === tab ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                  color: activeTab === tab ? "white" : "#9CA3AF",
                }}
              >
                {tab === "layout" && <Layout className="h-4 w-4 mx-auto mb-1" />}
                {tab === "typography" && <Type className="h-4 w-4 mx-auto mb-1" />}
                {tab === "cards" && <Palette className="h-4 w-4 mx-auto mb-1" />}
                {tab === "effects" && <Eye className="h-4 w-4 mx-auto mb-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {activeTab === "layout" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Grid Columns: {draftCustomization?.gridColumns ?? customization.gridColumns}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={1}
                    value={draftCustomization?.gridColumns ?? customization.gridColumns}
                    onChange={(e) => updateDraftCustomization("gridColumns", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(((draftCustomization?.gridColumns ?? customization.gridColumns) - 2) / 6) * 100}%, #3f3f46 ${(((draftCustomization?.gridColumns ?? customization.gridColumns) - 2) / 6) * 100}%, #3f3f46 100%)`,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "compact", label: "Compact", spacing: "4px" },
                      { value: "normal", label: "Normal", spacing: "6px" },
                      { value: "spacious", label: "Spacious", spacing: "8px" },
                    ].map(({ value, label, spacing }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("spacing", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.spacing ?? customization.spacing) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className="grid grid-cols-2 gap-1" style={{ gap: spacing }}>
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="w-3 h-3 rounded"
                                style={{
                                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Background Color
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "white", label: "White", color: "bg-white" },
                      { value: "gray-50", label: "Light Gray", color: "bg-gray-50" },
                      { value: "gray-100", label: "Gray", color: "bg-gray-100" },
                      { value: "gray-900", label: "Dark", color: "bg-gray-900" },
                    ].map(({ value, label, color }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("backgroundColor", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.backgroundColor ?? customization.backgroundColor) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className={`w-full h-8 rounded mb-2 ${color}`}></div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Header Settings
                  </h5>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Show Header</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.headerVisible ?? customization.headerVisible}
                        onChange={(e) => updateDraftCustomization("headerVisible", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.headerVisible ?? customization.headerVisible) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Show Description</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.descriptionVisible ?? customization.descriptionVisible}
                        onChange={(e) => updateDraftCustomization("descriptionVisible", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.descriptionVisible ?? customization.descriptionVisible) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
                <AlignmentSelector
                  value={draftCustomization?.titleAlignment ?? customization.titleAlignment}
                  onChange={(value) => updateDraftCustomization("titleAlignment", value)}
                  label="Title Alignment"
                />

                <SizeSelector
                  value={draftCustomization?.titleSize ?? customization.titleSize}
                  onChange={(value) => updateDraftCustomization("titleSize", value)}
                  label="Title Size"
                  options={[
                    { value: "sm", label: "Small", size: "24px" },
                    { value: "md", label: "Medium", size: "32px" },
                    { value: "lg", label: "Large", size: "40px" },
                    { value: "xl", label: "Extra Large", size: "52px" },
                    { value: "2xl", label: "2XL", size: "64px" },
                    { value: "3xl", label: "3XL", size: "76px" },
                  ]}
                />

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Title Weight
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "normal", label: "Normal", weight: "font-normal" },
                      { value: "medium", label: "Medium", weight: "font-medium" },
                      { value: "semibold", label: "Semibold", weight: "font-semibold" },
                      { value: "bold", label: "Bold", weight: "font-bold" },
                      { value: "extrabold", label: "Extrabold", weight: "font-extrabold" },
                    ].map(({ value, label, weight }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("titleWeight", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.titleWeight ?? customization.titleWeight) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className={`text-white text-center px-3 py-1 ${weight}`} style={{ fontSize: "14px" }}>
                            Aa
                          </div>
                        </div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Label Settings
                  </h5>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Show Labels</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.showLabels ?? customization.showLabels}
                        onChange={(e) => updateDraftCustomization("showLabels", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.showLabels ?? customization.showLabels) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>

                  <SizeSelector
                    value={draftCustomization?.labelSize ?? customization.labelSize}
                    onChange={(value) => updateDraftCustomization("labelSize", value)}
                    label="Label Size"
                    options={[
                      { value: "xs", label: "Extra Small", size: "12px" },
                      { value: "sm", label: "Small", size: "14px" },
                      { value: "md", label: "Medium", size: "16px" },
                      { value: "lg", label: "Large", size: "18px" },
                    ]}
                  />

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Label Weight
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "normal", label: "Normal", weight: "font-normal" },
                        { value: "medium", label: "Medium", weight: "font-medium" },
                        { value: "semibold", label: "Semibold", weight: "font-semibold" },
                        { value: "bold", label: "Bold", weight: "font-bold" },
                      ].map(({ value, label, weight }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("labelWeight", value)}
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.labelWeight ?? customization.labelWeight) === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                          <div className="flex justify-center mb-2">
                            <div className={`text-white text-center px-3 py-1 ${weight}`} style={{ fontSize: "12px" }}>
                              Aa
                            </div>
                          </div>
                          <div className="text-center text-xs text-white">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cards" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Show Icons</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftCustomization?.showIcons ?? customization.showIcons}
                      onChange={(e) => updateDraftCustomization("showIcons", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                      style={{
                        backgroundColor: (draftCustomization?.showIcons ?? customization.showIcons) ? ColorTheme.primary : "",
                      }}
                    ></div>
                  </label>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Icon Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "sm", label: "Small", size: "48px" },
                      { value: "md", label: "Medium", size: "56px" },
                      { value: "lg", label: "Large", size: "64px" },
                      { value: "xl", label: "Extra Large", size: "80px" },
                    ].map(({ value, label, size }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("iconSize", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.iconSize ?? customization.iconSize) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div
                            className="rounded bg-gradient-to-r flex items-center justify-center text-white text-xs font-bold"
                            style={{
                              width: Math.min(parseInt(size), 32) + "px",
                              height: Math.min(parseInt(size), 32) + "px",
                              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                            }}
                          >
                            ⚛
                          </div>
                        </div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Icon Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "square", label: "Square", style: "rounded-none" },
                      { value: "rounded", label: "Rounded", style: "rounded-lg" },
                      { value: "circular", label: "Circular", style: "rounded-full" },
                    ].map(({ value, label, style }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("iconStyle", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.iconStyle ?? customization.iconStyle) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div
                            className={`w-6 h-6 bg-gradient-to-r ${style}`}
                            style={{
                              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                            }}
                          ></div>
                        </div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Card Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "minimal", label: "Minimal", desc: "Transparent" },
                      { value: "elevated", label: "Elevated", desc: "With shadow" },
                      { value: "outlined", label: "Outlined", desc: "With border" },
                      { value: "filled", label: "Filled", desc: "Background" },
                    ].map(({ value, label, desc }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardStyle", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardStyle ?? customization.cardStyle) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="text-center text-xs text-white mb-1">{label}</div>
                        <div className="text-center text-xs text-gray-400">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Card Shadow
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "none", label: "None", shadow: "" },
                      { value: "light", label: "Light", shadow: "shadow-sm" },
                      { value: "medium", label: "Medium", shadow: "shadow-md" },
                      { value: "heavy", label: "Heavy", shadow: "shadow-lg" },
                    ].map(({ value, label, shadow }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardShadow", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardShadow ?? customization.cardShadow) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className={`w-6 h-6 bg-white rounded ${shadow}`}></div>
                        </div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "effects" && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Animation Settings
                  </h5>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Hover Effects</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.hoverEffects ?? customization.hoverEffects}
                        onChange={(e) => updateDraftCustomization("hoverEffects", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.hoverEffects ?? customization.hoverEffects) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Stagger Animation</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.staggerAnimation ?? customization.staggerAnimation}
                        onChange={(e) => updateDraftCustomization("staggerAnimation", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.staggerAnimation ?? customization.staggerAnimation) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Card Hover Effect
                  </h5>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "lift", label: "Lift", icon: "⬆️" },
                      { value: "glow", label: "Glow", icon: "✨" },
                      { value: "scale", label: "Scale", icon: "🔍" },
                      { value: "rotate", label: "Rotate", icon: "🔄" },
                      { value: "none", label: "None", icon: "❌" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardHoverEffect", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardHoverEffect ?? customization.cardHoverEffect) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="text-center text-lg text-white mb-1">
                          {icon}
                        </div>
                        <div className="text-center text-xs text-white">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Entrance Animation
                  </h5>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "fadeUp", label: "Fade Up", icon: "↗️" },
                      { value: "slideIn", label: "Slide In", icon: "➡️" },
                      { value: "scaleUp", label: "Scale Up", icon: "📈" },
                      { value: "flipIn", label: "Flip In", icon: "🔄" },
                      { value: "none", label: "None", icon: "❌" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("entranceAnimation", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.entranceAnimation ?? customization.entranceAnimation) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="text-center text-lg text-white mb-1">
                          {icon}
                        </div>
                        <div className="text-center text-xs text-white">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-700 bg-zinc-800">
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

      {/* Custom CSS for sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
        }
      `}</style>
    </section>
  );
};

export default Skills;
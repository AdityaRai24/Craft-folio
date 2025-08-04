import { motion } from "framer-motion";
import { RotateCcw, Type, Eye, X, Layout, Palette } from "lucide-react";
import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import SectionHeader from './SectionHeader';
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { defaultSimpleWhiteSkillsStyles } from "./defaultStyles/skills";
import { SimpleWhiteSkillsCustomizationState } from "./defaultStyles/types";
import { ColorTheme } from "@/lib/colorThemes";

interface TechnologyType {
  name: string;
  logo: string;
}

const Skills: NextPage = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const dispatch = useDispatch();
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = currentPortTheme ? inTheme?.data?.[currentPortTheme] : undefined;

  // Theme colors
  const primaryColor = theme?.colors?.primary || ColorTheme.primary;
  const primaryHoverColor = theme?.colors?.primaryHover || ColorTheme.primaryHover;
  const textPrimaryColor = theme?.colors?.text?.primary || ColorTheme.textPrimary;
  const textSecondaryColor = theme?.colors?.text?.secondary || ColorTheme.textSecondary;
  const backgroundPrimaryColor = theme?.colors?.background?.primary || ColorTheme.bgMain;
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || ColorTheme.bgCard;
  
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
      elevated: `bg-[${backgroundPrimaryColor}]`,
      outlined: `border-2 border-[${textSecondaryColor}]/30 bg-transparent`,
      filled: `bg-[${backgroundSecondaryColor}]`,
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
      glow: `hover:shadow-lg hover:shadow-[${primaryColor}]/20`,
      scale: "hover:scale-105",
      rotate: "hover:rotate-3",
      none: "",
    };

    return `flex flex-col cursor-pointer items-center p-4 ${styleMap[effectiveCustomization.cardStyle]} ${radiusMap[effectiveCustomization.cardBorderRadius]} ${shadowMap[effectiveCustomization.cardShadow]} ${effectiveCustomization.hoverEffects && !effectiveCustomization.staggerAnimation ? hoverMap[effectiveCustomization.cardHoverEffect] : ""} transition-all duration-300`;
  };

  const getIconClasses = () => {
    const sizeMap = {
      sm: "w-12 h-12",
      md: "w-14 h-14",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    };

    return `${sizeMap[effectiveCustomization.iconSize]} mb-3 flex items-center justify-center rounded-lg`;
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

    return `${weightMap[effectiveCustomization.labelWeight]} ${sizeMap[effectiveCustomization.labelSize]} text-center`;
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
      
      <div className="container mx-auto px-4">
        <SectionHeader
          sectionName="technologies"
          headerVisible={effectiveCustomization.headerVisible}
          titleSize={effectiveCustomization.titleSize}
          titleWeight={effectiveCustomization.titleWeight}
          titleColor={effectiveCustomization.titleColor}
          titleAlignment={effectiveCustomization.titleAlignment}
          descriptionSize={effectiveCustomization.descriptionSize}
          descriptionColor={effectiveCustomization.descriptionColor}
          descriptionVisible={effectiveCustomization.descriptionVisible}
          title={portfolioData?.find((section: any) => section.type === "technologies")?.sectionTitle || "Technical Skills"}
          description={portfolioData?.find((section: any) => section.type === "technologies")?.sectionDescription || "A comprehensive list of technologies and tools I work with"}
          onVisualEditorClick={openVisualEditor}
          headerClasses={headerClasses}
          currentPortTheme={currentPortTheme}
        />

        <motion.div 
          className={getGridClasses()}
          variants={effectiveCustomization.staggerAnimation ? containerVariants : undefined}
          initial={effectiveCustomization.staggerAnimation ? "hidden" : false}
          animate={effectiveCustomization.staggerAnimation ? "visible" : false}
        >
          {technologiesData.map((technology, index) => (
            <motion.div 
              key={index}
              className={getCardClasses()}
              variants={effectiveCustomization.staggerAnimation ? skillVariants : undefined}
              whileHover={effectiveCustomization.hoverEffects ? {
                scale: effectiveCustomization.hoverScale ? 1.05 : 1,
                y: effectiveCustomization.cardHoverEffect === "lift" ? -5 : 0,
                boxShadow: effectiveCustomization.cardHoverEffect === "glow" ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
                rotate: effectiveCustomization.cardHoverEffect === "rotate" ? 5 : 0,
              } : {}}
              transition={{ duration: 0.2 }}
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
                <h3 className={getLabelClasses()} style={{ color: textSecondaryColor }}>
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
          className="fixed bg-zinc-900 shadow-2xl rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
                      style={{
              left: `${windowPosition.x}px`,
              top: `${windowPosition.y}px`,
              cursor: isDragging ? "grabbing" : "grab",
              zIndex: 99999999,
            }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-base sm:text-lg font-bold text-white">Skills Visual Editor</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "typography", "cards", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors`}
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
          <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {activeTab === "layout" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Grid Columns: {draftCustomization?.gridColumns ?? customization.gridColumns}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={6}
                    step={1}
                    value={draftCustomization?.gridColumns ?? customization.gridColumns}
                    onChange={(e) => updateDraftCustomization("gridColumns", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${Math.max(0, Math.min(100, (((draftCustomization?.gridColumns ?? customization.gridColumns) - 2) / 4) * 100))}%, #3f3f46 ${Math.max(0, Math.min(100, (((draftCustomization?.gridColumns ?? customization.gridColumns) - 2) / 4) * 100))}%, #3f3f46 100%)`,
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


              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
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
                        backgroundColor: (draftCustomization?.showLabels ?? customization.showLabels) ? "#10b981" : "",
                      }}
                    ></div>
                  </label>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Label Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "xs", label: "Extra Small", size: "12px" },
                      { value: "sm", label: "Small", size: "14px" },
                      { value: "md", label: "Medium", size: "16px" },
                      { value: "lg", label: "Large", size: "18px" },
                    ].map(({ value, label, size }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("labelSize", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.labelSize ?? customization.labelSize) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className="text-white text-center px-3 py-1" style={{ fontSize: size }}>
                            Aa
                          </div>
                        </div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

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
                    Icon Size: {draftCustomization?.iconSize ?? customization.iconSize}
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="80"
                    value={
                      (draftCustomization?.iconSize ?? customization.iconSize) === "sm" ? 16 :
                      (draftCustomization?.iconSize ?? customization.iconSize) === "md" ? 24 :
                      (draftCustomization?.iconSize ?? customization.iconSize) === "lg" ? 32 :
                      (draftCustomization?.iconSize ?? customization.iconSize) === "xl" ? 48 : 24
                    }
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      let iconSize = "md";
                      if (value <= 20) iconSize = "sm";
                      else if (value <= 28) iconSize = "md";
                      else if (value <= 40) iconSize = "lg";
                      else iconSize = "xl";
                      updateDraftCustomization("iconSize", iconSize);
                    }}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${
                        Math.max(0, Math.min(100, ((draftCustomization?.iconSize ?? customization.iconSize) === "sm" ? 16 :
                         (draftCustomization?.iconSize ?? customization.iconSize) === "md" ? 24 :
                         (draftCustomization?.iconSize ?? customization.iconSize) === "lg" ? 32 :
                         (draftCustomization?.iconSize ?? customization.iconSize) === "xl" ? 48 : 24) - 16) / 64 * 100)
                      }%, #3f3f46 ${
                        Math.max(0, Math.min(100, ((draftCustomization?.iconSize ?? customization.iconSize) === "sm" ? 16 :
                         (draftCustomization?.iconSize ?? customization.iconSize) === "md" ? 24 :
                         (draftCustomization?.iconSize ?? customization.iconSize) === "lg" ? 32 :
                         (draftCustomization?.iconSize ?? customization.iconSize) === "xl" ? 48 : 24) - 16) / 64 * 100)
                      }%, #3f3f46 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>



                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Card Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "minimal", label: "Minimal", desc: "Transparent", preview: "bg-transparent" },
                      { value: "elevated", label: "Elevated", desc: "With shadow", preview: "bg-white shadow-md" },
                      { value: "outlined", label: "Outlined", desc: "With border", preview: "bg-transparent border border-gray-300" },
                      { value: "filled", label: "Filled", desc: "Background", preview: "bg-gray-100" },
                    ].map(({ value, label, desc, preview }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardStyle", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardStyle ?? customization.cardStyle) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className={`w-8 h-6 rounded ${preview}`}></div>
                        </div>
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
                          <div className={`w-8 h-6 rounded bg-white ${shadow}`} style={{ backgroundColor: '#ffffff' }}></div>
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


              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-zinc-700 bg-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={resetCustomization}
                className="flex items-center gap-1 flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={saveDraftCustomization}
                className="flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm text-white rounded transition-colors"
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
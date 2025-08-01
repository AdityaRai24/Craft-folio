import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton from '@/components/EditButton';
import {
  Briefcase,
  MapPin,
  Calendar,
  Code2,
  Star,
  ArrowUpRight,
  Settings,
  Palette,
  Move,
  Grid3X3,
  RotateCcw,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";

interface Technology {
  name: string;
  logo: string;
}

interface Experience {
  role: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack: Technology[];
}

interface CustomizationState {
  // Layout & Structure
  cardLayout: "default" | "minimal" | "glassmorphism" | "neon";
  cardBorderRadius: number;
  cardPadding: number;
  cardSpacing: number;
  containerWidth: "full" | "narrow" | "wide";
  
  // Typography
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionSize: "xs" | "sm" | "md" | "lg";
  textAlignment: "left" | "center" | "right";
  
  // Visual Effects
  hoverEffects: boolean;
  glowEffect: boolean;
  borderGlow: boolean;
  backgroundOpacity: number;
  borderWidth: number;
  
  // Animations
  animationStyle: "scale" | "slide" | "rotate" | "bounce" | "none";
  animationSpeed: number;
  staggerDelay: number;
  
  // Tech Stack Display
  techStackVisible: boolean;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  techStackSize: "sm" | "md" | "lg";
  
  // Timeline Elements
  timelineStyle: "line" | "dots" | "gradient" | "minimal";
  timelinePosition: "left" | "center" | "alternating";
  timelineWidth: number;
  timelineColor: string;
  dotSize: "sm" | "md" | "lg";
  dotStyle: "circle" | "square" | "diamond" | "hexagon";
  
  // Badges & Tags
  locationBadge: boolean;
  dateBadge: boolean;
  badgeStyle: "default" | "minimal" | "outlined" | "glow";
  
  // Side Accent
  sideAccent: boolean;
  sideAccentWidth: number;
  sideAccentColor: string;
}

const Experience = ({ currentTheme }: any) => {
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(
    null
  );
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "styling">("layout");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);
  
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const experienceSection = portfolioData?.find(
    (item: any) => item.type === "experience"
  );
  const sectionTitle = experienceSection?.sectionTitle || "Experience";
  const sectionDescription =
    experienceSection?.sectionDescription ||
    "My professional journey through various roles and technologies, showcasing growth, expertise, and the impact I've made in different organizations and projects.";
  const { theme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);
  
  // Get theme colors for LumenFlow
  const titleColor = theme === "light" ? "#f97316" : "#f97316"; // Orange color for LumenFlow

  // Default styles for Experience (current LumenFlow style)
  const defaultExperienceStyles: CustomizationState = {
    cardLayout: "default",
    cardBorderRadius: 16,
    cardPadding: 24,
    cardSpacing: 32,
    containerWidth: "full",
    titleSize: "lg",
    titleWeight: "bold",
    descriptionSize: "sm",
    textAlignment: "left",
    hoverEffects: true,
    glowEffect: true,
    borderGlow: false,
    backgroundOpacity: 0,
    borderWidth: 1,
    animationStyle: "scale",
    animationSpeed: 500,
    staggerDelay: 200,
    techStackVisible: true,
    techStackStyle: "pills",
    techStackSize: "sm",
    timelineStyle: "line",
    timelinePosition: "left",
    timelineWidth: 2,
    timelineColor: "#f97316",
    dotSize: "md",
    dotStyle: "circle",
    locationBadge: true,
    dateBadge: true,
    badgeStyle: "default",
    sideAccent: true,
    sideAccentWidth: 4,
    sideAccentColor: "#f97316",
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>(defaultExperienceStyles);
  const [draftCustomization, setDraftCustomization] = useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "experience",
        });
        if (result.success && result.data) {
          setCustomization(result.data as any);
        } else {
          setCustomization(defaultExperienceStyles);
        }
      } catch (error) {
        setCustomization(defaultExperienceStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId]);

  useEffect(() => {
    if (portfolioData) {
      const expData = portfolioData.find(
        (section: any) => section.type === "experience"
      )?.data;
      if (expData) {
        setExperienceData(expData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  // Visual Editor Functions
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  const updateDraftCustomization = (key: keyof CustomizationState, value: any) => {
    if (!draftCustomization) return;
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "experience",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "experience",
      });
      setCustomization(defaultExperienceStyles);
      setDraftCustomization(defaultExperienceStyles);
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
    const subscription = supabase
      .channel(`portfolio-exp-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("experience update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status experience: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  // Visual Editor Components
  const CardLayoutSelector: React.FC<{
    value: "default" | "minimal" | "glassmorphism" | "neon";
    onChange: (value: "default" | "minimal" | "glassmorphism" | "neon") => void;
  }> = ({ value, onChange }) => {
    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">Card Layout</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "default", label: "Default" },
            { value: "minimal", label: "Minimal" },
            { value: "glassmorphism", label: "Glass" },
            { value: "neon", label: "Neon" },
          ].map((style) => (
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
                <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
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
    const alignments = [
      { value: "left", icon: "←", label: "Left" },
      { value: "center", icon: "↔", label: "Center" },
      { value: "right", icon: "→", label: "Right" },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Title Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          {alignments.map(({ value: align, icon, label }) => (
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
                  className={`h-1 rounded ${
                    align === "left"
                      ? "mr-auto w-3/4"
                      : align === "center"
                      ? "mx-auto w-1/2"
                      : "ml-auto w-3/4"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
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
              <div className="text-xs text-white">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TechStackStyleSelector: React.FC<{
    value: "pills" | "badges" | "minimal" | "colorful";
    onChange: (value: "pills" | "badges" | "minimal" | "colorful") => void;
  }> = ({ value, onChange }) => {
    const styles = [
      { value: "pills", label: "Pills" },
      { value: "badges", label: "Badges" },
      { value: "minimal", label: "Minimal" },
      { value: "colorful", label: "Colorful" },
    ];

    return (
      <div>
        <label className="block text-white font-medium mb-3">
          Tech Stack Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map(({ value: style, label }) => (
            <div
              key={style}
              onClick={() => onChange(style as any)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                value === style
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className="flex flex-wrap gap-1 justify-center mb-2">
                {["React", "TS"].map((tech, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2 py-1 ${
                      style === "pills"
                        ? "rounded-full border border-gray-500 text-white"
                        : style === "badges"
                        ? "rounded bg-gray-600 text-white"
                        : style === "minimal"
                        ? "text-gray-300"
                        : "rounded-full border-2 text-white"
                    }`}
                    style={
                      style === "colorful"
                        ? {
                            borderColor: ColorTheme.primary,
                            backgroundColor: `${ColorTheme.primary}20`,
                          }
                        : {}
                    }
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-center text-xs text-white">{label}</div>
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
            background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(value / max) * 100}%, #3f3f46 ${(value / max) * 100}%, #3f3f46 100%)`
          }}
        />
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

  return (
    <div className="space-y-4 md:space-y-12 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto md:px-4">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="experience"
      />

      {/* Visual Editor Button */}
      <div className="absolute top-4 right-4 z-20">
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

      {/* Experience Timeline */}
      <div 
        className="space-y-8"
        style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
      >
        {experienceData.map((exp, index) => (
          <div
            key={index}
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredExperience(index)}
            onMouseLeave={() => setHoveredExperience(null)}
          >
            {/* Background Glow Effect */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ 
              background: theme === "light"
                ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                : themeClasses.gradientHover 
            }}></div>

            {/* Main Card */}
            <div 
              className={`relative bg-transparent overflow-hidden border transition-all duration-${effectiveCustomization.animationSpeed / 100} transform h-full flex flex-col ${
                theme === "light"
                  ? "border-gray-200/50 group-hover:border-orange-400/30"
                  : "border-gray-700/50 group-hover:border-orange-400/30"
              }`}
              style={{
                borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                padding: `${effectiveCustomization.cardPadding}px`,
                borderWidth: `${effectiveCustomization.borderWidth}px`,
                transform: effectiveCustomization.hoverEffects && hoveredExperience === index ? "translateY(-4px)" : "none",
                filter: effectiveCustomization.glowEffect ? `drop-shadow(0 0 20px ${titleColor}30)` : "none",
              }}
            >
                              {/* Experience Content */}
                <div className="space-y-4 flex-grow">
                  {/* Header Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ 
                        background: theme === "light"
                          ? "linear-gradient(to right, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                          : themeClasses.gradientPrimary 
                      }}></div>
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${
                        theme === "light" ? "text-gray-900" : themeClasses.textPrimary
                      } ${
                        effectiveCustomization.textAlignment === "center" 
                          ? "text-center" 
                          : effectiveCustomization.textAlignment === "right" 
                          ? "text-right" 
                          : "text-left"
                      }`}>
                        {exp.role}
                      </h3>
                    </div>
                  </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className={`text-sm leading-relaxed ${
                    theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                  }`}>
                    {exp.description}
                  </p>
                </div>

                {/* Tech Stack */}
                {effectiveCustomization.techStackVisible && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star size={14} className="text-orange-400" />
                      <span className={`text-xs font-medium uppercase tracking-wide ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>
                        Tech Stack
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-2 py-1 text-xs font-medium transition-all duration-300 ${
                            effectiveCustomization.techStackStyle === "pills"
                              ? "rounded-full border"
                              : effectiveCustomization.techStackStyle === "badges"
                              ? "rounded bg-gray-600 text-white"
                              : effectiveCustomization.techStackStyle === "minimal"
                              ? "text-gray-300"
                              : "rounded-full border-2"
                          } ${
                            theme === "light"
                              ? "border-gray-200 hover:border-orange-400/50 text-gray-600"
                              : "border-gray-700 hover:border-orange-400/50 text-gray-400"
                          }`}
                          style={
                            effectiveCustomization.techStackStyle === "colorful"
                              ? {
                                  borderColor: titleColor,
                                  backgroundColor: `${titleColor}20`,
                                }
                              : {}
                          }
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Section */}
                <div className={`flex items-center justify-between pt-4 mt-auto border-t ${
                  theme === "light" ? "border-gray-200/50" : "border-gray-700/50"
                }`}>
                  <div className="flex items-center space-x-3">
                    {effectiveCustomization.locationBadge && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-orange-400" />
                        <span className={`text-sm ${
                          theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                        }`}>
                          {exp.location}
                        </span>
                      </div>
                    )}
                    {effectiveCustomization.dateBadge && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className="text-orange-400" />
                        <span className={`text-sm ${
                          theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                        }`}>
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View More Arrow */}
                  <div
                    className={`transition-all duration-300 ${
                      hoveredExperience === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <ArrowUpRight size={18} className="text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Side Accent Line */}
              {effectiveCustomization.sideAccent && (
                <div 
                  className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ 
                    width: `${effectiveCustomization.sideAccentWidth}px`,
                    background: theme === "light"
                      ? "linear-gradient(to bottom, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                      : themeClasses.gradientPrimary 
                  }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {experienceData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400">
              No experience yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start adding your professional experience to showcase your career
              journey and expertise.
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
            <h3 className="text-lg font-bold text-white">Experience Settings</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "styling"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-2 text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
                style={activeTab === tab ? {
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                } : {}}
              >
                {tab === "layout" && (
                  <Grid3X3 className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab === "styling" && (
                  <Palette className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {activeTab === "layout" && (
              <>
                <CardLayoutSelector
                  value={draftCustomization?.cardLayout ?? customization.cardLayout}
                  onChange={(value) =>
                    updateDraftCustomization("cardLayout", value)
                  }
                />

                <AlignmentSelector
                  value={draftCustomization?.textAlignment ?? customization.textAlignment}
                  onChange={(value) =>
                    updateDraftCustomization("textAlignment", value)
                  }
                />

                <SpacingSelector
                  value={draftCustomization?.cardSpacing ?? customization.cardSpacing}
                  onChange={(value) =>
                    updateDraftCustomization("cardSpacing", value)
                  }
                  label="Card Spacing"
                  min={8}
                  max={48}
                  step={4}
                />

                <SpacingSelector
                  value={draftCustomization?.cardPadding ?? customization.cardPadding}
                  onChange={(value) =>
                    updateDraftCustomization("cardPadding", value)
                  }
                  label="Card Padding"
                  min={8}
                  max={32}
                  step={2}
                />
              </>
            )}

            {activeTab === "styling" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Radius: {draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                    onChange={(e) =>
                      updateDraftCustomization("cardBorderRadius", Number(e.target.value))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Width: {draftCustomization?.borderWidth ?? customization.borderWidth}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={draftCustomization?.borderWidth ?? customization.borderWidth}
                    onChange={(e) =>
                      updateDraftCustomization("borderWidth", Number(e.target.value))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <TechStackStyleSelector
                  value={draftCustomization?.techStackStyle ?? customization.techStackStyle}
                  onChange={(value) =>
                    updateDraftCustomization("techStackStyle", value)
                  }
                />

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Hover Effects</span>
                  <Switch
                    checked={draftCustomization?.hoverEffects ?? customization.hoverEffects}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("hoverEffects", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Glow Effect</span>
                  <Switch
                    checked={draftCustomization?.glowEffect ?? customization.glowEffect}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("glowEffect", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Tech Stack</span>
                  <Switch
                    checked={draftCustomization?.techStackVisible ?? customization.techStackVisible}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("techStackVisible", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Location</span>
                  <Switch
                    checked={draftCustomization?.locationBadge ?? customization.locationBadge}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("locationBadge", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Date Range</span>
                  <Switch
                    checked={draftCustomization?.dateBadge ?? customization.dateBadge}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("dateBadge", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Side Accent</span>
                  <Switch
                    checked={draftCustomization?.sideAccent ?? customization.sideAccent}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("sideAccent", checked)
                    }
                  />
                </div>

                {(draftCustomization?.sideAccent ?? customization.sideAccent) && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Side Accent Width: {draftCustomization?.sideAccentWidth ?? customization.sideAccentWidth}px
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={draftCustomization?.sideAccentWidth ?? customization.sideAccentWidth}
                      onChange={(e) =>
                        updateDraftCustomization("sideAccentWidth", Number(e.target.value))
                      }
                      style={{ accentColor: ColorTheme.primary }}
                      className="w-full"
                    />
                  </div>
                )}
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

export default Experience;

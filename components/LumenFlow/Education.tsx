"use client"
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { supabase } from "@/lib/supabase-client";
import {
  GraduationCap,
  MapPin,
  Calendar, ArrowUpRight, Palette, Grid3X3,
  RotateCcw,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight, Zap
} from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import { Switch } from "@/components/ui/switch";
import {
  getComponentCustomization,
  saveComponentCustomization,
  deleteComponentCustomization,
  updateSection
} from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import MagicWrite from "@/components/Shared/MagicWrite";


interface Technology {
  name: string;
  logo: string;
}

interface Education {
  degree: string;
  endDate: string;
  location: string;
  startDate: string;
  description: string | null;
  institution: string;
}

interface CustomizationState {
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon" | "gradient";
  cardBorderRadius: number;
  cardPadding: number;
  cardSpacing: number;
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
  showInstitution: boolean;
  showDates: boolean;
  showLocation: boolean;
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
  showArrow: boolean;
  arrowStyle: "simple" | "animated" | "glow";
  dateFormat: "short" | "long" | "relative";
  institutionStyle: "badge" | "pill" | "minimal" | "colorful";
  institutionSize: "sm" | "md" | "lg";
}

interface EducationProps {
  currentTheme: string;
  portfolioId: string;
}

const Education: React.FC<EducationProps> = ({ currentTheme, portfolioId }) => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredEducation, setHoveredEducation] = useState<number | null>(null);

  // Visual Editor States
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "design" | "effects" | "timeline"
  >("layout");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Default styles matching current LumenFlow Education appearance
  const defaultEducationStyles: CustomizationState = {
    cardStyle: "default",
    cardBorderRadius: 16,
    cardPadding: 24,
    cardSpacing: 32,
    titleSize: "lg",
    titleWeight: "bold",
    textAlignment: "left",
    hoverEffects: true,
    glowEffect: true,
    borderGlow: false,
    backgroundOpacity: 0,
    borderWidth: 1,
    animationStyle: "fade",
    animationSpeed: 500,
    staggerDelay: 100,
    showInstitution: true,
    showDates: true,
    showLocation: true,
    showDescription: true,
    descriptionStyle: "expand",
    accentLine: true,
    accentLineStyle: "gradient",
    accentLineWidth: 4,
    accentLineColor: "#f97316",
    cardShadow: false,
    shadowIntensity: 1,
    backgroundBlur: false,
    blurIntensity: 10,
    showArrow: true,
    arrowStyle: "animated",
    dateFormat: "short",
    institutionStyle: "minimal",
    institutionSize: "sm",
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>(
    defaultEducationStyles
  );
  const [draftCustomization, setDraftCustomization] =
    useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization =
    visualEditorOpen && draftCustomization ? draftCustomization : customization;

  const dispatch = useDispatch();
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const educationSection = portfolioData?.find(
    (item: any) => item.type === "education"
  );
  const sectionTitle = educationSection?.sectionTitle || "Education";
  const sectionDescription =
    educationSection?.sectionDescription ||
    "My educational journey through various institutions and courses, building the foundation of knowledge and skills that drive my professional growth and expertise.";

  // Magic Write functionality
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this education description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
          context: context || "",
          section: "education-description"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance description');
      }

      const data = await response.json();
      const enhancedDescription = data.response || data.content || data.result;

      return enhancedDescription;
    } catch (error) {
      console.error('Magic Write API error:', error);
      throw error;
    }
  };

  const handleDescriptionUpdate = async (educationIndex: number, newDescription: string) => {
    const updatedEducation = [...educationData];
    updatedEducation[educationIndex] = {
      ...updatedEducation[educationIndex],
      description: newDescription
    };
    setEducationData(updatedEducation);
    toast.success("Education description enhanced successfully!");
    try {
      const result = await updateSection({
        sectionName: "education",
        portfolioId,
        sectionContent: updatedEducation,
        sectionTitle: "Education",
        sectionDescription: "Education section"
      });
      if (result.success) {
        toast.success("Education description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving education description:", error);
      toast.error("Failed to save changes to database");
    }
  };

  const themeClasses = getThemeClasses(currentTheme);
  const { theme } = useLumenFlowTheme();

  // Load customizations from Redux state or database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        // First check if customizations exist in Redux state
        if (componentCustomizations && componentCustomizations["education"]) {
          setCustomization(componentCustomizations["education"] as CustomizationState);
        } else {
          // Fallback to database
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "education",
          });
          if (result.success && result.data) {
            setCustomization(result.data as any);
            // Update Redux state
            dispatch(setComponentCustomizations({
              ...componentCustomizations,
              education: result.data
            }));
          } else {
            setCustomization(defaultEducationStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultEducationStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId, componentCustomizations, dispatch]);

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
        componentType: "education",
        settings: draftCustomization,
      });
      if (result.success) {
        // Update Redux state
        dispatch(setComponentCustomizations({
          ...componentCustomizations,
          education: draftCustomization
        }));
        toast.success("Customization saved successfully");
      } else {
        toast.error("Failed to save customization");
      }
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  // On reset, delete from DB, set both states to default, and close editor
  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "education",
      });
      setCustomization(defaultEducationStyles);
      setDraftCustomization(defaultEducationStyles);
      setVisualEditorOpen(false);
      // Update Redux state
      const updatedCustomizations = { ...componentCustomizations };
      delete updatedCustomizations["education"];
      dispatch(setComponentCustomizations(updatedCustomizations));
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
      const eduData = portfolioData.find(
        (section: any) => section.type === "education"
      )?.data;
      if (eduData) {
        setEducationData(eduData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-edu-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
        }
      )
      .subscribe((status) => {
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);



  // Add creative selectors for LumenFlow
  const AnimationStyleSelector: React.FC<{
    value: "fade" | "slide" | "scale" | "bounce";
    onChange: (value: "fade" | "slide" | "scale" | "bounce") => void;
  }> = ({ value, onChange }) => {
    const styles = [
      { value: "fade", label: "Fade In", desc: "Smooth fade animation" },
      { value: "slide", label: "Slide Up", desc: "Slide from bottom" },
      { value: "scale", label: "Scale", desc: "Scale up animation" },
      { value: "bounce", label: "Bounce", desc: "Bouncy entrance" },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Animation Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map(({ value: style, label, desc }) => (
            <div
              key={style}
              onClick={() => onChange(style as any)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === style
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                }`}
            >
              <div className="text-sm font-medium text-white text-center">
                {label}
              </div>
              <div className="text-xs text-gray-400 text-center mt-1">
                {desc}
              </div>
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
      { value: "default", label: "Default", preview: "bg-zinc-800 border border-zinc-700" },
      { value: "minimal", label: "Minimal", preview: "bg-transparent border-0" },
      { value: "glassmorphism", label: "Glass", preview: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" },
      { value: "neon", label: "Neon", preview: "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20" },
      { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700" },
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
              className={`cursor-pointer p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${value === style.value
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                }`}
            >
              <div className="space-y-2">
                <div className={`h-16 rounded-lg ${style.preview} flex flex-col justify-center items-center`}>
                  <div className="w-8 h-2 bg-zinc-600 rounded mb-1"></div>
                  <div className="w-6 h-2 bg-zinc-500 rounded"></div>
                </div>
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
              className={`cursor-pointer flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${value === align
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

  // Custom Slider Component with proper styling
  const CustomSlider: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }> = ({ value, onChange, label, min, max, step = 1, unit = "px" }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div>
        <label className="block text-white font-medium mb-2">
          {label}: {value}
          {unit}
        </label>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`,
              WebkitAppearance: "none",
              outline: "none",
            }}
          />
        </div>
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            transition: all 0.15s ease-in-out;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            transition: all 0.15s ease-in-out;
          }

          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          }
        `}</style>
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
      <CustomSlider
        value={value}
        onChange={onChange}
        label={label}
        min={min}
        max={max}
        step={step}
        unit="px"
      />
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
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === size
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
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === weight
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
      <div className="space-y-4 md:space-y-6 lg:space-y-8 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-300 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  const titleColor = theme === "light" ? "#f97316" : "#f97316";

  return (
    <div className="space-y-8 relative">


      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="education"
        openVisualEditor={openVisualEditor}
        visualEditorOpen={visualEditorOpen}
      />

      {/* Education Content */}
      <div
        className="space-y-6"
        style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
      >
        {educationData.map((edu, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredEducation(index)}
            onMouseLeave={() => setHoveredEducation(null)}
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                    : themeClasses.gradientHover,
              }}
            ></div>

            {/* Main Card */}
            <div
              className={`relative transition-all duration-${effectiveCustomization.animationSpeed / 100
                } transform group-hover:translate-y-[-4px] h-full flex flex-col ${effectiveCustomization.cardStyle === "default"
                  ? theme === "light"
                    ? "bg-white border border-gray-200 shadow-sm"
                    : "bg-zinc-800 border border-zinc-700"
                  : effectiveCustomization.cardStyle === "minimal"
                    ? "bg-transparent border-0"
                    : effectiveCustomization.cardStyle === "glassmorphism"
                      ? theme === "light"
                        ? "bg-white/50 backdrop-blur-sm border border-white/20"
                        : "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50"
                      : effectiveCustomization.cardStyle === "neon"
                        ? theme === "light"
                          ? "bg-orange-50/30 border border-orange-300/50 shadow-lg shadow-orange-500/20"
                          : "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : effectiveCustomization.cardStyle === "gradient"
                          ? theme === "light"
                            ? "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
                            : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700"
                          : theme === "light"
                            ? "bg-white border border-gray-200 shadow-sm"
                            : "bg-zinc-800 border border-zinc-700"
                }`}
              style={{
                borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                padding: `${effectiveCustomization.cardPadding}px`,
                borderWidth: effectiveCustomization.cardStyle === "minimal" ? 0 : `${effectiveCustomization.borderWidth}px`,
                transform:
                  effectiveCustomization.hoverEffects &&
                    hoveredEducation === index
                    ? "translateY(-4px) scale(1.02)"
                    : "none",
                filter: effectiveCustomization.glowEffect
                  ? `drop-shadow(0 0 20px ${titleColor}30)`
                  : "none",
                ...(effectiveCustomization.cardShadow && {
                  boxShadow: `0 ${effectiveCustomization.shadowIntensity * 4
                    }px ${effectiveCustomization.shadowIntensity * 8
                    }px rgba(0,0,0,0.1), 0 0 ${effectiveCustomization.shadowIntensity * 20
                    }px ${titleColor}20`,
                }),
              }}
            >
              {/* Education Content */}
              <div className="space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background:
                          theme === "light"
                            ? "linear-gradient(to right, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                            : themeClasses.gradientPrimary,
                      }}
                    ></div>
                    <h3
                      className={`transition-colors duration-300 ${theme === "light"
                        ? "text-gray-900"
                        : themeClasses.textPrimary
                        } ${effectiveCustomization.textAlignment === "center"
                          ? "text-center"
                          : effectiveCustomization.textAlignment === "right"
                            ? "text-right"
                            : "text-left"
                        } ${effectiveCustomization.titleSize === "sm"
                          ? "text-lg"
                          : effectiveCustomization.titleSize === "md"
                            ? "text-xl"
                            : effectiveCustomization.titleSize === "lg"
                              ? "text-2xl"
                              : "text-3xl"
                        } ${effectiveCustomization.titleWeight === "normal"
                          ? "font-normal"
                          : effectiveCustomization.titleWeight === "medium"
                            ? "font-medium"
                            : effectiveCustomization.titleWeight === "semibold"
                              ? "font-semibold"
                              : "font-bold"
                        }`}
                    >
                      {edu.degree}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                {effectiveCustomization.showDescription && edu.description && (
                  <div className="space-y-2 relative">
                    <p
                      className={`text-sm leading-relaxed ${theme === "light"
                        ? "text-gray-600"
                        : themeClasses.textSecondary
                        }`}
                    >
                      {edu.description}
                    </p>
                    {/* Magic Write Button */}
                    <div className="absolute -top-2 -right-2 z-10 hidden md:block">
                      <MagicWrite
                        onMagicWrite={async (prompt: string, context?: string) => {
                          const enhancedDescription = await handleMagicWrite(prompt, edu.description || "");
                          handleDescriptionUpdate(index, enhancedDescription);
                          return enhancedDescription;
                        }}
                        placeholder="Enhance this education description..."
                        buttonText=""
                        context={edu.description || ""}
                        className="w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Section */}
                <div
                  className={`flex items-center justify-between pt-4 mt-auto border-t ${theme === "light"
                    ? "border-gray-200/50"
                    : "border-gray-700/50"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    {effectiveCustomization.showInstitution && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-orange-400" />
                        <span
                          className={`text-sm ${theme === "light"
                            ? "text-gray-600"
                            : themeClasses.textSecondary
                            }`}
                        >
                          {edu.institution}
                        </span>
                      </div>
                    )}
                    {effectiveCustomization.showDates && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className="text-orange-400" />
                        <span
                          className={`text-sm ${theme === "light"
                            ? "text-gray-600"
                            : themeClasses.textSecondary
                            }`}
                        >
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View More Arrow */}
                  {effectiveCustomization.showArrow && (
                    <div
                      className={`transition-all duration-300 ${hoveredEducation === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                        }`}
                    >
                      <ArrowUpRight size={18} className="text-orange-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Side Accent Line */}
              {effectiveCustomization.accentLine && (
                <div
                  className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    width: `${effectiveCustomization.accentLineWidth}px`,
                    background:
                      effectiveCustomization.accentLineStyle === "gradient"
                        ? theme === "light"
                          ? "linear-gradient(to bottom, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                          : themeClasses.gradientPrimary
                        : effectiveCustomization.accentLineColor,
                    ...(effectiveCustomization.accentLineStyle === "dashed" && {
                      background:
                        "repeating-linear-gradient(to bottom, transparent, transparent 4px, currentColor 4px, currentColor 8px)",
                    }),
                    ...(effectiveCustomization.accentLineStyle === "glow" && {
                      boxShadow: `0 0 10px ${effectiveCustomization.accentLineColor}`,
                    }),
                  }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {educationData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${theme === "light" ? "bg-gray-50" : themeClasses.bgSecondary
                }`}
            >
              <GraduationCap
                size={32}
                className={
                  theme === "light"
                    ? "text-gray-400"
                    : themeClasses.textSecondary
                }
              />
            </div>
            <h3
              className={`text-xl font-semibold ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                }`}
            >
              No education yet
            </h3>
            <p
              className={`max-w-md mx-auto ${theme === "light" ? "text-gray-500" : themeClasses.textSecondary
                }`}
            >
              Start adding your educational background to showcase your academic
              journey and qualifications.
            </p>
          </div>
        </div>
      )}

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <div
          ref={dragRef}
          className="fixed bg-zinc-900 shadow-2xl z-[70] rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-base sm:text-lg font-bold text-white">Education Settings</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "design", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-zinc-800"
                  }`}
                style={
                  activeTab === tab
                    ? {
                      background: `linear-gradient(135deg, #10b981, #059669)`,
                    }
                    : {}
                }
              >
                {tab === "layout" && (
                  <Grid3X3 className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab === "design" && (
                  <Palette className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab === "effects" && <Zap className="h-3 w-3 mx-auto mb-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-96">
            {activeTab === "layout" && (
              <>
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
                  max={64}
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

            {activeTab === "design" && (
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

                <CardStyleSelector
                  value={
                    draftCustomization?.cardStyle ?? customization.cardStyle
                  }
                  onChange={(value) =>
                    updateDraftCustomization("cardStyle", value)
                  }
                />

                <CustomSlider
                  value={
                    draftCustomization?.cardBorderRadius ??
                    customization.cardBorderRadius
                  }
                  onChange={(value) =>
                    updateDraftCustomization("cardBorderRadius", value)
                  }
                  label="Border Radius"
                  min={0}
                  max={32}
                  step={1}
                  unit="px"
                />

                <CustomSlider
                  value={
                    draftCustomization?.borderWidth ?? customization.borderWidth
                  }
                  onChange={(value) =>
                    updateDraftCustomization("borderWidth", value)
                  }
                  label="Border Width"
                  min={0}
                  max={4}
                  step={1}
                  unit="px"
                />

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

                {(draftCustomization?.cardShadow ??
                  customization.cardShadow) && (
                    <CustomSlider
                      value={
                        draftCustomization?.shadowIntensity ??
                        customization.shadowIntensity
                      }
                      onChange={(value) =>
                        updateDraftCustomization("shadowIntensity", value)
                      }
                      label="Shadow Intensity"
                      min={1}
                      max={5}
                      step={1}
                      unit=""
                    />
                  )}
              </>
            )}

            {activeTab === "effects" && (
              <>
                <AnimationStyleSelector
                  value={
                    draftCustomization?.animationStyle ??
                    customization.animationStyle
                  }
                  onChange={(value) =>
                    updateDraftCustomization("animationStyle", value)
                  }
                />

                <CustomSlider
                  value={
                    draftCustomization?.animationSpeed ??
                    customization.animationSpeed
                  }
                  onChange={(value) =>
                    updateDraftCustomization("animationSpeed", value)
                  }
                  label="Animation Speed"
                  min={100}
                  max={1000}
                  step={50}
                  unit="ms"
                />

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

                {(draftCustomization?.backgroundBlur ??
                  customization.backgroundBlur) && (
                    <CustomSlider
                      value={
                        draftCustomization?.blurIntensity ??
                        customization.blurIntensity
                      }
                      onChange={(value) =>
                        updateDraftCustomization("blurIntensity", value)
                      }
                      label="Blur Intensity"
                      min={5}
                      max={20}
                      step={1}
                      unit="px"
                    />
                  )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-700 p-3 sm:p-4 bg-zinc-800">
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
                  background: `linear-gradient(135deg, #10b981, #059669)`,
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

export default Education;

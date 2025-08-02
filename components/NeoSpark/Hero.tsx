"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight, Settings, Grid3X3,
  RotateCcw,
  Type,
  Zap,
  Eye,
  X
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import EditButton from "@/components/EditButton";
import { ColorTheme } from "@/lib/colorThemes";
import Navbar from "./Navbar";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { defaultHeroStyles } from "./defaultStyles/hero";
import { CustomizationState } from "./defaultStyles/types";

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
                className={`h-1 bg-gradient-to-r  rounded ${
                  align === "left"
                    ? "mr-auto w-3/4"
                    : align === "center"
                    ? "mx-auto w-1/2"
                    : "ml-auto w-3/4"
                }`}
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
                className="bg-gradient-to-r  rounded text-white text-center font-bold"
                style={{ fontSize: size }}
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

// Visual Button Style Selector Component
const ButtonStyleSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string; style: string }[];
}> = ({ value, onChange, label, options }) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value: optionValue, label: optionLabel, style }) => (
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
                className={`px-3 py-1 text-xs rounded transition-all ${style}`}
                style={
                  optionValue === "default" || optionValue === "rounded"
                    ? { backgroundColor: ColorTheme.primary, color: "white" }
                    : {}
                }
              >
                Button
              </div>
            </div>
            <div className="text-center text-xs text-white">{optionLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Background Theme Selector Component
const BackgroundThemeSelector: React.FC<{
  value: "pearl-mist" | "aurora-midnight" | "crimson-shadow" | "ocean-abyss" | "noise-pattern" | "diagonal-lines";
  onChange: (
    value: "pearl-mist" | "aurora-midnight" | "crimson-shadow" | "ocean-abyss" | "noise-pattern" | "diagonal-lines"
  ) => void;
}> = ({ value, onChange }) => {
  const themes: Array<{
    value: "pearl-mist" | "aurora-midnight" | "crimson-shadow" | "ocean-abyss" | "noise-pattern" | "diagonal-lines";
    label: string;
    background: string;
  }> = [
    {
      value: "noise-pattern",
      label: "Noise Pattern",
      background: "#000000",
    },
    {
      value: "diagonal-lines",
      label: "Diagonal Lines",
      background: "#000000",
    },
    {
      value: "pearl-mist",
      label: "Pearl Mist",
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 90%), #000000",
    },
    {
      value: "aurora-midnight",
      label: "Aurora Midnight",
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 90%), #000000",
    },
    {
      value: "crimson-shadow",
      label: "Crimson Shadow",
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 80, 120, 0.25), transparent 90%), #000000",
    },
    {
      value: "ocean-abyss",
      label: "Ocean Abyss",
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 90%), #000000",
    },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        Background Theme
      </label>
      <div className="grid grid-cols-2 gap-2">
        {themes.map(({ value: themeValue, label, background }) => (
          <div
            key={themeValue}
            onClick={() => onChange(themeValue)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === themeValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div
              className="w-full h-16 rounded mb-2"
              style={{ background }}
            ></div>
            <div className="text-center text-xs text-white">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};



const Hero = ({ currentPortTheme, customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];

  const [badgeScope, animateBadge] = useAnimate();
  const [titleScope, animateTitle] = useAnimate();

  const [badgeIndex, setBadgeIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "buttons" | "effects"
  >("layout");

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Main customization state (from DB or default)
  const [customization, setCustomization] = useState<CustomizationState>(defaultHeroStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Debug logging for effectiveCustomization calculation
  useEffect(() => {
    console.log("effectiveCustomization calculation:", {
      visualEditorOpen,
      hasDraftCustomization: !!draftCustomization,
      draftScrollIndicatorStyle: draftCustomization?.scrollIndicatorStyle,
      customizationScrollIndicatorStyle: customization.scrollIndicatorStyle,
      effectiveScrollIndicatorStyle: effectiveCustomization.scrollIndicatorStyle,
      usingDraft: visualEditorOpen && draftCustomization
    });
  }, [visualEditorOpen, draftCustomization?.scrollIndicatorStyle, customization.scrollIndicatorStyle, effectiveCustomization.scrollIndicatorStyle]);

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "hero",
        });
        if (result.success && result.data) {
          setCustomization(result.data as unknown as CustomizationState);
        } else {
          setCustomization(defaultHeroStyles);
        }
      } catch (error) {
        setCustomization(defaultHeroStyles);
      }
    };
    if (portfolioId) loadCustomizations();
  }, [portfolioId]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    console.log("openVisualEditor called:", {
      currentCustomization: customization,
      scrollIndicatorStyle: customization.scrollIndicatorStyle
    });
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof CustomizationState, value: any) => {
    if (!draftCustomization) return;
    console.log("updateDraftCustomization called:", { key, value });
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  // When 'Done' is clicked, save draft to DB and update main state
  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    console.log("saveDraftCustomization called:", { 
      scrollIndicatorStyle: draftCustomization.scrollIndicatorStyle,
      scrollIndicator: draftCustomization.scrollIndicator 
    });
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "hero",
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
        componentType: "hero",
      });
      setCustomization(defaultHeroStyles);
      setDraftCustomization(defaultHeroStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  const getThemeButtonStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
        color: "white",
      };
    }
    return {};
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

  // Helper functions for styling
  const getContainerClasses = () => {
    const alignmentMap = {
      center: "items-center justify-center text-center",
      left: "items-start justify-start text-left",
      right: "items-end justify-end text-right",
    };

    const verticalMap = {
      center: "justify-center",
      top: "justify-start pt-12",
      bottom: "justify-end pb-12",
    };

    const maxWidthMap = {
      sm: "max-w-sm",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "w-full",
    };

    let classes = `relative flex-1 flex pt-8 flex-col ${
      alignmentMap[effectiveCustomization.contentAlignment]
    } ${verticalMap[effectiveCustomization.verticalAlignment]} ${
      maxWidthMap[effectiveCustomization.maxWidth]
    } mx-auto space-y-6`;

    return classes;
  };

  const getTitleClasses = () => {
    const sizeMap = {
      sm: "text-2xl md:text-4xl lg:text-5xl",
      md: "text-3xl md:text-5xl lg:text-6xl",
      lg: "text-4xl md:text-6xl lg:text-7xl",
      xl: "text-5xl md:text-7xl lg:text-8xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    const lineHeightMap = {
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    };

    const letterSpacingMap = {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
    };

    return `section-title ${sizeMap[effectiveCustomization.titleSize]} ${
      weightMap[effectiveCustomization.titleWeight]
    } ${lineHeightMap[effectiveCustomization.titleLineHeight]} ${
      letterSpacingMap[effectiveCustomization.titleLetterSpacing]
    }`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    const maxWidthMap = {
      sm: "max-w-sm",
      md: "max-w-xl",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-full",
    };

    return `section-description ${
      sizeMap[effectiveCustomization.descriptionSize]
    } ${weightMap[effectiveCustomization.descriptionWeight]} ${maxWidthMap[effectiveCustomization.descriptionMaxWidth]} ${
      effectiveCustomization.contentAlignment === "center" ? "mx-auto" : ""
    }`;
  };

  const getBadgeClasses = () => {
    return `inline-flex items-center text-sm px-4 py-2 rounded-full`;
  };

  const getButtonClasses = () => {
    const sizeMap = {
      sm: "px-4 py-2 text-sm",
      md: "px-7 py-5 text-sm",
      lg: "px-8 py-6 text-base",
    };

    const styleMap = {
      default: "rounded",
      rounded: "rounded-lg",
      square: "rounded-none",
      pill: "rounded-full",
    };

    const layoutMap = {
      horizontal: "flex items-center justify-center gap-6",
      vertical: "flex flex-col items-center gap-4",
      stacked: "flex flex-col sm:flex-row items-center gap-4",
    };

    return {
      container: `${layoutMap[effectiveCustomization.buttonLayout]} mt-8`,
      button: `flex btn-primary items-center gap-2 ${
        sizeMap[effectiveCustomization.buttonSize]
      } ${
        styleMap[effectiveCustomization.buttonStyle]
      } cursor-pointer transition-all duration-300`,
    };
  };

  const getAnimationVariants = () => {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  };

  const getTitleStyle = () => {
    let style: any = {};

    if (effectiveCustomization.glowEffect) {
      style.textShadow = `0 0 20px ${theme.colors.primary}50`;
    }

    if (effectiveCustomization.textShadow) {
      style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
    }

    return style;
  };

  // Update customization helper
  const updateCustomization = async (key: keyof CustomizationState, value: any) => {
    const newCustomization = { ...customization, [key]: value };
    setCustomization(newCustomization);
    
    // Save to database
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "hero",
        settings: newCustomization,
      });
      
      if (!result.success) {
        toast.error("Failed to save customization");
      }
    } catch (error) {
      console.error("Error saving customization:", error);
      toast.error("Failed to save customization");
    }
  };

  const renderToggle = (
    label: string,
    value: boolean,
    onChange: (value: boolean) => void
  ) => (
    <div className="mb-4 flex items-center justify-between">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
          style={{
            backgroundColor: value ? ColorTheme.primary : "",
          }}
        ></div>
      </label>
    </div>
  );

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData.find(
        (section: any) => section.type === "hero"
      )?.data;
      if (heroSectionData) {
        setHeroData(heroSectionData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || !heroData || isLoading) return;

    const badgeTexts = heroData?.badge?.texts || [];
    const intervalId = setInterval(() => {
      if (badgeScope.current && badgeTexts.length > 1) {
        animateBadge(
          badgeScope.current,
          { opacity: 0, y: 20 },
          { duration: 0.3 }
        );

        setTimeout(() => {
          setBadgeIndex((prev) => (prev + 1) % badgeTexts.length);
          if (badgeScope.current) {
            animateBadge(
              badgeScope.current,
              { opacity: 1, y: 0 },
              { duration: 0.3 }
            );
          }
        }, 300);
      }
    }, 3000);

    const titleTexts = heroData?.titleSuffixOptions || [];
    const titleIntervalId = setInterval(() => {
      if (titleScope.current && titleTexts.length > 1) {
        animateTitle(
          titleScope.current,
          { opacity: 0, y: 20 },
          { duration: 0.3 }
        );

        setTimeout(() => {
          setTitleIndex((prev) => (prev + 1) % titleTexts.length);
          if (titleScope.current) {
            animateTitle(
              titleScope.current,
              { opacity: 1, y: 0 },
              { duration: 0.3 }
            );
          }
        }, 300);
      }
    }, 2000);

    const subscription = supabase
      .channel(`portfolio-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status: ${status}`);
      });

    return () => {
      clearInterval(intervalId);
      clearInterval(titleIntervalId);
      subscription.unsubscribe();
    };
  }, [
    portfolioId,
    heroData,
    isLoading,
    badgeScope,
    titleScope,
    animateBadge,
    animateTitle,
  ]);

  if (isLoading || !heroData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const badgeTexts = heroData.badge?.texts || [];
  const titleTexts = heroData.titleSuffixOptions || [];

  const badgeColor = theme.colors.primary;
  const badgeTextColor = theme.colors.text.primary;
  const accentColor = theme.colors.accent;
  const titleColor = theme.colors.primary;
  const buttonBgColor = theme.colors.primary;
  const buttonHoverBgColor = theme.colors.primaryHover;
  const buttonTextColor = theme.colors.text.primary;
  const buttonHoverTextColor = theme.colors.text.secondary;
  const mutedColor = theme.colors.states.muted;
  const scrollLineColor = theme.colors.background.secondary;

  const animationVariants = getAnimationVariants();
  const buttonClasses = getButtonClasses();

  const getBackgroundStyle = () => {
    switch (effectiveCustomization.backgroundTheme) {
      case "pearl-mist":
        return {
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 90%)",
        };
      case "aurora-midnight":
        return {
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 90%)",
        };
      case "crimson-shadow":
        return {
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 80, 120, 0.25), transparent 90%)",
        };
      case "ocean-abyss":
        return {
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 90%)",
        };
      case "noise-pattern":
        return {
          backgroundColor: "#000000",
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
          `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
          backgroundPosition: "0 0, 10px 10px, 15px 5px",
        };
      case "diagonal-lines":
        return {
          backgroundColor: "#000000",
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
          `,
          backgroundSize: "24px 24px, 24px 24px, 8px 8px",
        };
      default:
        return {
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 90%)",
        };
    }
  };

  return (
    <div className="w-full relative bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0" style={getBackgroundStyle()} />
      <Navbar currentPortTheme={currentPortTheme} customCSS={customCSS} />
              <div
          className={getContainerClasses()}
          style={{
            paddingLeft: `${effectiveCustomization.containerPadding}px`,
            paddingRight: `${effectiveCustomization.containerPadding}px`,
          }}
        >
        <style>{customCSS}</style>

        {/* Badge */}
        {effectiveCustomization.badgeVisible && heroData?.badge?.isVisible && (
          <motion.div
            initial={animationVariants.hidden}
            animate={animationVariants.visible}
            transition={{ duration: 0.7 }}
            style={{
              background: badgeColor,
              color: badgeTextColor,
            }}
            className={getBadgeClasses()}
          >
            <span
              style={{
                height: "0.5rem",
                width: "0.5rem",
                backgroundColor: accentColor,
                borderRadius: "9999px",
                marginRight: "0.5rem",
              }}
            ></span>
            <span ref={badgeScope} className="text-inherit">
              {badgeTexts[badgeIndex]}
            </span>
          </motion.div>
        )}
        
        {/* Consistent Button Layout */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <EditButton sectionName="hero" />
          <button
            onClick={openVisualEditor}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={getThemeButtonStyle(true)}
          >
            <Settings className="h-4 w-4" />
            Visual Editor
          </button>
        </div>
        
        {/* Title */}
        <motion.h1
          initial={animationVariants.hidden}
          animate={animationVariants.visible}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className={getTitleClasses()}
          style={getTitleStyle()}
        >
          Hi, I'm {heroData?.name} <br />
          <span style={{ color: titleColor }}>
            {heroData.titlePrefix}
            <span ref={titleScope}> {titleTexts[titleIndex]}</span>.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={animationVariants.hidden}
          animate={animationVariants.visible}
          transition={{
            duration: 0.7,
            delay: 0.4,
          }}
          className={getDescriptionClasses()}
          dangerouslySetInnerHTML={{ __html: heroData.summary }}
        ></motion.p>

        {/* Buttons */}
        <motion.div
          initial={animationVariants.hidden}
          animate={animationVariants.visible}
          transition={{
            duration: 0.7,
            delay: 0.6,
          }}
          className={buttonClasses.container}
        >
          {heroData?.actions?.map((item: any) => {
            return (
              <motion.div key={item.label}>
                <Button
                  style={{
                    backgroundColor:
                      item.style === "primary" ? buttonBgColor : "transparent",
                    color: item.style === "primary" ? buttonTextColor : "white",
                    border:
                      item.style === "outline"
                        ? `1px solid ${buttonBgColor}`
                        : "",
                  }}
                  className={buttonClasses.button}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = buttonHoverBgColor;
                    e.currentTarget.style.color = buttonHoverTextColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      item.style === "primary" ? buttonBgColor : "transparent";
                    e.currentTarget.style.color =
                      item.style === "primary" ? buttonTextColor : "white";
                    e.currentTarget.style.border =
                      item.style === "outline"
                        ? `1px solid ${buttonBgColor}`
                        : "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  onClick={() => {
                    const labelToIdMap: Record<string, string> = {
                      "View Projects": "projects",
                      "Contact Me": "contact",
                      About: "about",
                      "Tech Stack": "tech-stack",
                    };
                    const sectionId =
                      labelToIdMap[item.label] ||
                      item.label.toLowerCase().replace(/ /g, "-");
                    const section = document.getElementById(sectionId);
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    } else if (item.href) {
                      window.location.href = item.href;
                    }
                  }}
                >
                  {item.label} <ArrowRight size={18} />
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Scroll Indicator */}
        {effectiveCustomization.scrollIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ color: mutedColor }}
            className="mt-16 text-center"
          >
            <p>Scroll to explore</p>
            {(() => {
              const style = effectiveCustomization.scrollIndicatorStyle?.toLowerCase();
              console.log("Rendering scroll indicator:", {
                style: style,
                originalStyle: effectiveCustomization.scrollIndicatorStyle,
                scrollIndicator: effectiveCustomization.scrollIndicator
              });
              return null;
            })()}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "line") && (
              <motion.div
                initial={{ height: 32 }}
                animate={{ height: 32 }}
                style={{
                  width: "0.125rem",
                  backgroundColor: scrollLineColor,
                  margin: "0.5rem auto 0 auto",
                }}
              ></motion.div>
            )}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "arrow") && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-2"
              >
                ↓
              </motion.div>
            )}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "dot") && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-current rounded-full mx-auto mt-2"
              ></motion.div>
            )}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "animated") && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-2"
              >
                <div className="w-6 h-10 border-2 border-current rounded-full mx-auto">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-3 bg-current rounded-full mx-auto mt-1"
                  ></motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
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
              <h3 className="text-lg font-bold text-white">Visual Editor</h3>
              <button
                onClick={() => setVisualEditorOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-zinc-700">
              {["layout", "typography", "buttons", "effects"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 px-3 text-sm capitalize transition-colors`}
                  style={getThemeButtonStyle(activeTab === tab)}
                >
                  {tab === "layout" && (
                    <Grid3X3 className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab === "typography" && (
                    <Type className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab === "buttons" && (
                    <Zap className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab === "effects" && (
                    <Eye className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {activeTab === "layout" && (
                <div className="space-y-4">
                  <BackgroundThemeSelector
                    value={draftCustomization?.backgroundTheme ?? customization.backgroundTheme}
                    onChange={value => updateDraftCustomization("backgroundTheme", value)}
                  />

                  <AlignmentSelector
                    value={draftCustomization?.contentAlignment ?? customization.contentAlignment}
                    onChange={value => updateDraftCustomization("contentAlignment", value)}
                    label="Content Alignment"
                  />

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Vertical Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "top", label: "Top", icon: "⬆" },
                        { value: "center", label: "Center", icon: "↕" },
                        { value: "bottom", label: "Bottom", icon: "⬇" },
                      ].map(({ value, label, icon }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("verticalAlignment", value)}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                            (draftCustomization?.verticalAlignment ?? customization.verticalAlignment) === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                          <div className="text-2xl text-white">{icon}</div>
                          <div className="space-y-1 w-full">
                            <div className="h-1 bg-gradient-to-r  rounded mx-auto w-1/2"></div>
                            <div className="h-1 bg-gray-400 rounded mx-auto w-3/4"></div>
                          </div>
                          <div className="text-xs text-white">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Max Width
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "sm", label: "Small", width: "25%" },
                        { value: "md", label: "Medium", width: "50%" },
                        { value: "lg", label: "Large", width: "75%" },
                        { value: "full", label: "Full Width", width: "100%" },
                      ].map(({ value, label, width }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("maxWidth", value)}
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.maxWidth ?? customization.maxWidth) === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-full  block mx-auto">
                              <div
                                className="h-4 rounded"
                                style={{
                                  width: width,
                                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-white font-medium text-center">
                              {label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                      Container Padding: {customization.containerPadding}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={64}
                      step={4}
                      value={draftCustomization?.containerPadding ?? customization.containerPadding}
                      onChange={e => updateDraftCustomization("containerPadding", Number(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${((draftCustomization?.containerPadding ?? customization.containerPadding) / 64) * 100}%, #3f3f46 ${((draftCustomization?.containerPadding ?? customization.containerPadding) / 64) * 100}%, #3f3f46 100%)`,
                      }}
                    />
                  </div>

                  <div className="border-t border-zinc-700 pt-4 mt-4">
                    <h5 className="text-sm text-left font-medium text-white mb-3">
                      Badge Settings
                    </h5>

                    {renderToggle(
                      "Show Badge",
                      draftCustomization?.badgeVisible ?? customization.badgeVisible,
                      value => updateDraftCustomization("badgeVisible", value)
                    )}
                  </div>
                </div>
              )}

              {activeTab === "typography" && (
                <div>
                  <div className="mb-6 space-y-4">
                    <SizeSelector
                      value={draftCustomization?.titleSize ?? customization.titleSize}
                      onChange={value => updateDraftCustomization("titleSize", value)}
                      label="Title Size"
                      options={[
                        { value: "sm", label: "Small", size: "24px" },
                        { value: "md", label: "Medium", size: "32px" },
                        { value: "lg", label: "Large", size: "40px" },
                        { value: "xl", label: "Extra Large", size: "52px" },
                      ]}
                    />

                    <div>
                      <label className="block text-left text-white font-medium mb-3">
                        Title Weight
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            value: "normal",
                            label: "Normal",
                            weight: "font-normal",
                          },
                          {
                            value: "medium",
                            label: "Medium",
                            weight: "font-medium",
                          },
                          {
                            value: "semibold",
                            label: "Semibold",
                            weight: "font-semibold",
                          },
                          { value: "bold", label: "Bold", weight: "font-bold" },
                          {
                            value: "extrabold",
                            label: "Extrabold",
                            weight: "font-extrabold",
                          },
                        ].map(({ value, label, weight }) => (
                          <div
                            key={value}
                            onClick={() =>
                              updateDraftCustomization("titleWeight", value)
                            }
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              (draftCustomization?.titleWeight ?? customization.titleWeight) === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="flex justify-center mb-2">
                              <div
                                className={`text-white text-center px-3 py-1 ${weight}`}
                                style={{ fontSize: "14px" }}
                              >
                                Aa
                              </div>
                            </div>
                            <div className="text-center text-xs text-white">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-left text-white font-medium mb-3">
                        Line Height
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "tight", label: "Tight", height: "1.25" },
                          { value: "snug", label: "Snug", height: "1.375" },
                          { value: "normal", label: "Normal", height: "1.5" },
                          {
                            value: "relaxed",
                            label: "Relaxed",
                            height: "1.625",
                          },
                        ].map(({ value, label, height }) => (
                          <div
                            key={value}
                            onClick={() =>
                              updateDraftCustomization("titleLineHeight", value)
                            }
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              (draftCustomization?.titleLineHeight ?? customization.titleLineHeight) === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="flex justify-center mb-2">
                              <div
                                className="text-white text-center px-3 py-1"
                                style={{ fontSize: "12px", lineHeight: height }}
                              >
                                Aa
                                <br />
                                Bb
                              </div>
                            </div>
                            <div className="text-center text-xs text-white">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-left text-white font-medium mb-3">
                        Letter Spacing
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            value: "tighter",
                            label: "Tighter",
                            spacing: "-0.05em",
                          },
                          {
                            value: "tight",
                            label: "Tight",
                            spacing: "-0.025em",
                          },
                          { value: "normal", label: "Normal", spacing: "0em" },
                          { value: "wide", label: "Wide", spacing: "0.025em" },
                        ].map(({ value, label, spacing }) => (
                          <div
                            key={value}
                            onClick={() =>
                              updateDraftCustomization("titleLetterSpacing", value)
                            }
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              (draftCustomization?.titleLetterSpacing ?? customization.titleLetterSpacing) === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="flex justify-center mb-2">
                              <div
                                className="text-white text-center px-3 py-1"
                                style={{
                                  fontSize: "12px",
                                  letterSpacing: spacing,
                                }}
                              >
                                A B C
                              </div>
                            </div>
                            <div className="text-center text-xs text-white">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t text-left space-y-4 border-zinc-700 ">
                    <SizeSelector
                      value={draftCustomization?.descriptionSize ?? customization.descriptionSize}
                      onChange={value => updateDraftCustomization("descriptionSize", value)}
                      label="Description Size"
                      options={[
                        { value: "sm", label: "Small", size: "18px" },
                        { value: "md", label: "Medium", size: "20px" },
                        { value: "lg", label: "Large", size: "24px" },
                      ]}
                    />

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Description Weight
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
                            onClick={() =>
                              updateDraftCustomization("descriptionWeight", value)
                            }
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              (draftCustomization?.descriptionWeight ?? customization.descriptionWeight) === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="flex justify-center mb-2">
                              <div
                                className={`text-white text-center px-3 py-1 ${weight}`}
                                style={{ fontSize: "14px" }}
                              >
                                Aa
                              </div>
                            </div>
                            <div className="text-center text-xs text-white">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Description Max Width
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "sm", label: "Small", width: "25%" },
                          { value: "md", label: "Medium", width: "50%" },
                          { value: "lg", label: "Large", width: "75%" },
                          { value: "xl", label: "Extra Large", width: "90%" },
                          { value: "full", label: "Full Width", width: "100%" },
                        ].map(({ value, label, width }) => (
                          <div
                            key={value}
                            onClick={() =>
                              updateDraftCustomization("descriptionMaxWidth", value)
                            }
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              (draftCustomization?.descriptionMaxWidth ?? customization.descriptionMaxWidth) === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-full block mx-auto">
                                <div
                                  className="h-3 rounded"
                                  style={{
                                    width: width,
                                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-white font-medium text-center">
                                {label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "buttons" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Button Layout
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "horizontal", label: "Horizontal", icon: "↔" },
                        { value: "vertical", label: "Vertical", icon: "↕" },
                      ].map(({ value, label, icon }) => (
                        <div
                          key={value}
                          onClick={() =>
                            updateDraftCustomization("buttonLayout", value)
                          }
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.buttonLayout ?? customization.buttonLayout) === value
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

                  <SizeSelector
                    value={draftCustomization?.buttonSize ?? customization.buttonSize}
                    onChange={value => updateDraftCustomization("buttonSize", value)}
                    label="Button Size"
                    options={[
                      { value: "sm", label: "Small", size: "12px" },
                      { value: "md", label: "Medium", size: "14px" },
                      { value: "lg", label: "Large", size: "16px" },
                    ]}
                  />

                  <ButtonStyleSelector
                    value={draftCustomization?.buttonStyle ?? customization.buttonStyle}
                    onChange={value => updateDraftCustomization("buttonStyle", value)}
                    label="Button Style"
                    options={[
                      { value: "default", label: "Default", style: "rounded" },
                      {
                        value: "rounded",
                        label: "Rounded",
                        style: "rounded-lg",
                      },
                      {
                        value: "square",
                        label: "Square",
                        style: "rounded-none",
                      },
                      { value: "pill", label: "Pill", style: "rounded-full" },
                    ]}
                  />
                </div>
              )}

              {activeTab === "effects" && (
                <div>
                  <div className="mb-6">
                    <h5 className="text-sm text-left font-medium text-white mb-3">
                      Text Effects
                    </h5>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "glowEffect", label: "Glow Effect", icon: "✨" },
                        { key: "textShadow", label: "Text Shadow", icon: "🌫" },
                      ].map(({ key, label, icon }) => (
                        <div
                          key={key}
                          onClick={() =>
                            updateDraftCustomization(
                              key as any,
                              !(draftCustomization?.[key as keyof CustomizationState] ?? customization[key as keyof CustomizationState])
                            )
                          }
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.[key as keyof CustomizationState] ?? customization[key as keyof CustomizationState])
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

                  <div className="border-t text-left border-zinc-700 pt-4">
                    {renderToggle(
                      "Show Scroll Indicator",
                      draftCustomization?.scrollIndicator ?? customization.scrollIndicator,
                      (value) => updateDraftCustomization("scrollIndicator", value)
                    )}

                    {(draftCustomization?.scrollIndicator ?? customization.scrollIndicator) && (
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Indicator Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "line", label: "Line", icon: "|" },
                            { value: "arrow", label: "Arrow", icon: "↓" },
                            { value: "dot", label: "Dot", icon: "●" },
                            { value: "animated", label: "Animated", icon: "⟳" },
                          ].map(({ value, label, icon }) => (
                            <div
                              key={value}
                              onClick={() =>
                                updateDraftCustomization(
                                  "scrollIndicatorStyle",
                                  value
                                )
                              }
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                (draftCustomization?.scrollIndicatorStyle ?? customization.scrollIndicatorStyle) === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              {(() => {
                                console.log("Visual editor option:", { 
                                  value, 
                                  label, 
                                  isSelected: (draftCustomization?.scrollIndicatorStyle ?? customization.scrollIndicatorStyle) === value,
                                  draftValue: draftCustomization?.scrollIndicatorStyle,
                                  customizationValue: customization.scrollIndicatorStyle
                                });
                                return null;
                              })()}
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
                    )}
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
                  style={getThemeButtonStyle(true)}
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

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes blink {
            0%,
            50% {
              opacity: 1;
            }
            51%,
            100% {
              opacity: 0.3;
            }
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
          }

          @keyframes bounce {
            0%,
            20%,
            53%,
            80%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            40%,
            43% {
              transform: translate3d(0, -8px, 0);
            }
            70% {
              transform: translate3d(0, -4px, 0);
            }
            90% {
              transform: translate3d(0, -2px, 0);
            }
          }

          @keyframes slide {
            0% {
              transform: translateX(-10px);
              opacity: 0.5;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

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
      </div>
    </div>
  );
};

export default Hero;



"use client";

import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Settings, Grid3X3, RotateCcw, Type, Zap, Eye, X } from "lucide-react";
import type { NextPage } from "next";
import Navbar from "./Navbar";
import AnimatedButton from "./AnimatedButton";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import SectionHeader from "./SectionHeader";
import MagicWrite from "@/components/Shared/MagicWrite";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { motion, useAnimate } from "framer-motion";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization, updateSection } from "@/app/actions/portfolio";
import { defaultSimpleWhiteHeroStyles } from "./defaultStyles/hero";
import { SimpleWhiteHeroCustomizationState } from "./defaultStyles/types";
import { ColorTheme } from "@/lib/colorThemes";
import { useUser } from '@clerk/nextjs';

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
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${value === align
              ? "border-white bg-zinc-700"
              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
          >
            <div className="text-2xl text-white">{icon}</div>
            <div className="space-y-1 w-full">
              <div
                className={`h-1 bg-gradient-to-r rounded ${align === "left"
                  ? "mr-auto w-3/4"
                  : align === "center"
                    ? "mx-auto w-1/2"
                    : "ml-auto w-3/4"
                  }`}
              ></div>
              <div
                className={`h-1 bg-gray-400 rounded ${align === "left"
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
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === optionValue
              ? "border-white bg-zinc-700"
              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className="bg-gradient-to-r rounded text-white text-center font-bold"
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

// Visual Style Selector Component
const StyleSelector: React.FC<{
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
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === optionValue
              ? "border-white bg-zinc-700"
              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
          >
            <div className="flex justify-center mb-2">
              <div className={`px-3 py-1 text-xs rounded transition-all ${style}`}>
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
  value: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning";
  onChange: (value: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning") => void;
}> = ({ value, onChange }) => {
  const getThemeStyle = (theme: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning") => {
    switch (theme) {
      case "diagonal-grid":
        return {
          backgroundColor: "#fafafa",
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px)
          `,
          backgroundSize: "16px 16px",
        };
      case "crosshatch":
        return {
          backgroundColor: "#ffffff",
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 1px, rgba(75, 85, 99, 0.2) 1px, rgba(75, 85, 99, 0.2) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(67.5deg, transparent, transparent 1px, rgba(107, 114, 128, 0.15) 1px, rgba(107, 114, 128, 0.15) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(112.5deg, transparent, transparent 1px, rgba(55, 65, 81, 0.1) 1px, rgba(55, 65, 81, 0.1) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(157.5deg, transparent, transparent 1px, rgba(31, 41, 55, 0.08) 1px, rgba(31, 41, 55, 0.08) 2px, transparent 2px, transparent 4px)
          `,
        };
      case "circuit-board":
        return {
          backgroundColor: "#ffffff",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(75, 85, 99, 0.25) 8px, rgba(75, 85, 99, 0.25) 9px, transparent 9px, transparent 16px, rgba(75, 85, 99, 0.25) 16px, rgba(75, 85, 99, 0.25) 17px),
            repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(75, 85, 99, 0.25) 8px, rgba(75, 85, 99, 0.25) 9px, transparent 9px, transparent 16px, rgba(75, 85, 99, 0.25) 16px, rgba(75, 85, 99, 0.25) 17px),
            radial-gradient(circle at 8px 8px, rgba(55, 65, 81, 0.4) 1px, transparent 1px),
            radial-gradient(circle at 16px 16px, rgba(55, 65, 81, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px, 16px 16px, 16px 16px, 16px 16px",
        };
      case "zigzag-lightning":
        return {
          backgroundColor: "#ffffff",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(75, 85, 99, 0.25) 8px, rgba(75, 85, 99, 0.25) 9px),
            repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(107, 114, 128, 0.2) 12px, rgba(107, 114, 128, 0.2) 13px),
            repeating-linear-gradient(60deg, transparent, transparent 16px, rgba(55, 65, 81, 0.15) 16px, rgba(55, 65, 81, 0.15) 17px),
            repeating-linear-gradient(150deg, transparent, transparent 14px, rgba(31, 41, 55, 0.12) 14px, rgba(31, 41, 55, 0.12) 15px)
          `,
        };
      default:
        return {
          backgroundColor: "#fafafa",
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px)
          `,
          backgroundSize: "16px 16px",
        };
    }
  };

  const themes: Array<{
    value: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning";
    label: string;
  }> = [
      {
        value: "diagonal-grid",
        label: "Diagonal Grid",
      },
      {
        value: "crosshatch",
        label: "Crosshatch",
      },
      {
        value: "circuit-board",
        label: "Circuit Board",
      },
      {
        value: "zigzag-lightning",
        label: "Zigzag Lightning",
      },
    ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        Background Theme
      </label>
      <div className="grid grid-cols-2 gap-2">
        {themes.map(({ value: themeValue, label }) => (
          <div
            key={themeValue}
            onClick={() => onChange(themeValue)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === themeValue
              ? "border-white bg-zinc-700"
              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
          >
            <div
              className="w-full h-20 rounded mb-2"
              style={getThemeStyle(themeValue)}
            ></div>
            <div className="text-center text-xs text-white">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero: NextPage = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const dispatch = useDispatch();

  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = currentPortTheme ? inTheme?.data?.[currentPortTheme] : undefined;

  // Authentication check
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();
  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  // Theme colors
  const primaryColor = theme?.colors?.primary || ColorTheme.primary;
  const primaryHoverColor = theme?.colors?.primaryHover || ColorTheme.primaryHover;
  const textPrimaryColor = theme?.colors?.text?.primary || ColorTheme.textPrimary;
  const textSecondaryColor = theme?.colors?.text?.secondary || ColorTheme.textSecondary;
  const backgroundPrimaryColor = theme?.colors?.background?.primary || ColorTheme.bgMain;
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || ColorTheme.bgCard;

  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
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
  const [customization, setCustomization] = useState<SimpleWhiteHeroCustomizationState>(defaultSimpleWhiteHeroStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<SimpleWhiteHeroCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Helper functions for styling based on customization
  const getContainerClasses = () => {
    const alignmentMap = {
      center: "text-center",
      left: "text-left",
      right: "text-right",
    };

    const maxWidthMap = {
      sm: "max-w-sm",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      "2xl": "max-w-7xl",
      full: "w-full",
    };

    return `max-w-[95%] !mt-12 md:mt-0 sm:max-w-[90%] lg:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto px-4 pb-4 sm:pb-8 lg:pb-0 sm:px-6 lg:px-8 ${alignmentMap[effectiveCustomization.contentAlignment]
      } ${maxWidthMap[effectiveCustomization.maxWidth]}`;
  };

  const getTitleClasses = () => {
    const sizeMap = {
      sm: "text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl",
      md: "text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl",
      lg: "text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl",
      xl: "text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl",
      "2xl": "text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl",
      "3xl": "text-7xl sm:text-8xl md:text-9xl lg:text-9xl xl:text-10xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    return `section-title text-left ${sizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]
      } text-${effectiveCustomization.titleColor} mb-2 sm:mb-3 leading-tight`;
  };

  const getSubtitleClasses = () => {
    const sizeMap = {
      sm: "text-sm sm:text-base md:text-lg lg:text-lg",
      md: "text-base sm:text-lg md:text-xl lg:text-xl",
      lg: "text-lg sm:text-xl md:text-2xl lg:text-2xl",
      xl: "text-xl sm:text-2xl md:text-3xl lg:text-3xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return `section-sub-title text-left ${sizeMap[effectiveCustomization.subtitleSize]} ${weightMap[effectiveCustomization.subtitleWeight]
      } text-${effectiveCustomization.subtitleColor} mb-3 sm:mb-4`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
      sm: "text-sm sm:text-base lg:text-base",
      md: "text-base sm:text-lg lg:text-lg",
      lg: "text-lg sm:text-xl lg:text-xl",
    };

    return `section-description text-left ${sizeMap[effectiveCustomization.descriptionSize]} font-medium text-${effectiveCustomization.descriptionColor} mb-6 sm:mb-8 lg:mb-10`;
  };

  const getBackgroundStyle = () => {
    const bgMap = {
      white: "bg-white",
      "gray-50": "bg-gray-50",
      "gray-100": "bg-gray-100",
    };
    return bgMap[effectiveCustomization.backgroundColor] || "bg-white";
  };

  const getBackgroundThemeStyle = () => {
    switch (effectiveCustomization.backgroundTheme) {
      case "diagonal-grid":
        return {
          backgroundColor: "#fafafa",
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        };
      case "crosshatch":
        return {
          backgroundColor: "#ffffff",
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
          `,
        };
      case "circuit-board":
        return {
          backgroundColor: "#ffffff",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
            radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
            radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
          `,
          backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
        };
      case "zigzag-lightning":
        return {
          backgroundColor: "#ffffff",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75, 85, 99, 0.08) 20px, rgba(75, 85, 99, 0.08) 21px),
            repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107, 114, 128, 0.06) 30px, rgba(107, 114, 128, 0.06) 31px),
            repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(55, 65, 81, 0.05) 40px, rgba(55, 65, 81, 0.05) 41px),
            repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(31, 41, 55, 0.04) 35px, rgba(31, 41, 55, 0.04) 36px)
          `,
        };
      default:
        return {
          backgroundColor: "#fafafa",
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        };
    }
  };

  const getCardStyle = () => {
    const styleMap = {
      solid: `bg-[${backgroundPrimaryColor}]`,
      gradient: `bg-gradient-to-br from-[${backgroundPrimaryColor}] to-[${backgroundSecondaryColor}]`,
      transparent: "bg-transparent",
    };

    const borderMap = {
      none: "border-transparent",
      subtle: `border-2 border-[${primaryColor}]/20 hover:border-[${primaryColor}]/40`,
      bold: `border-4 border-[${primaryColor}]/40 hover:border-[${primaryColor}]/60`,
    };

    const shadowMap = {
      none: "",
      light: "shadow-sm",
      medium: "shadow-lg",
      heavy: "shadow-2xl",
    };

    return `relative ${styleMap[effectiveCustomization.cardBackground]} p-4 sm:p-5 lg:p-6 rounded-lg ${shadowMap[effectiveCustomization.cardShadow]} ${borderMap[effectiveCustomization.cardBorderStyle]} transition-all duration-300`;
  };

  const getSocialLinksClasses = () => {
    if (!effectiveCustomization.socialLinksVisible) return "hidden";

    const sizeMap = {
      sm: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14",
      md: "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16",
      lg: "w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18",
    };

    const styleMap = {
      circular: "rounded-full",
      square: "rounded-lg",
      minimal: "rounded-none",
    };

    const hoverMap = {
      border: `hover:border-8 hover:border-[${primaryColor}]/30`,
      scale: "hover:scale-110",
      glow: `hover:shadow-lg hover:shadow-[${primaryColor}]/20`,
      none: "",
    };

    return `duration-200 ease-in border-4 border-transparent ${hoverMap[effectiveCustomization.socialLinksHoverEffect]} ${styleMap[effectiveCustomization.socialLinksStyle]} bg-[${backgroundPrimaryColor}] flex items-center justify-center transition-all ${sizeMap[effectiveCustomization.socialLinksSize]}`;
  };

  const getResumeButtonStyle = () => {
    if (!effectiveCustomization.resumeButtonVisible) return "hidden";

    const sizeMap = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return `${sizeMap[effectiveCustomization.resumeButtonSize]} rounded transition-all duration-300`;
  };

  const getResumeButtonInlineStyle = () => {
    const styleMap = {
      default: {
        backgroundColor: primaryColor,
        color: 'white',
        border: 'none',
      },
      animated: {
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryHoverColor})`,
        color: 'white',
        border: 'none',
      },
      minimal: {
        backgroundColor: 'transparent',
        color: textPrimaryColor,
        border: `1px solid ${textSecondaryColor}`,
      },
      outline: {
        backgroundColor: 'transparent',
        color: primaryColor,
        border: `2px solid ${primaryColor}`,
      },
    };

    return styleMap[effectiveCustomization.resumeButtonStyle];
  };

  // Load customizations from Redux state or database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        // First check if customizations exist in Redux state
        if (componentCustomizations && componentCustomizations["hero"]) {
          setCustomization(componentCustomizations["hero"] as SimpleWhiteHeroCustomizationState);
        } else {
          // Fallback to database
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "hero",
          });
          if (result.success && result.data) {
            setCustomization(result.data as any);
            // Update Redux state
            dispatch(setComponentCustomizations({
              ...componentCustomizations,
              hero: result.data
            }));
          } else {
            setCustomization(defaultSimpleWhiteHeroStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultSimpleWhiteHeroStyles);
      }
    };
    if (portfolioId) loadCustomizations();
  }, [portfolioId, componentCustomizations, dispatch]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof SimpleWhiteHeroCustomizationState, value: any) => {
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
        componentType: "hero",
        settings: draftCustomization,
      });
      if (result.success) {
        // Update Redux state
        dispatch(setComponentCustomizations({
          ...componentCustomizations,
          hero: draftCustomization
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
        componentType: "hero",
      });
      setCustomization(defaultSimpleWhiteHeroStyles);
      setDraftCustomization(defaultSimpleWhiteHeroStyles);
      setVisualEditorOpen(false);
      // Update Redux state
      const updatedCustomizations = { ...componentCustomizations };
      delete updatedCustomizations["hero"];
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

  const handleResumeDownload = () => {
    if (userInfo?.resumeLink) {
      window.open(userInfo.resumeLink, "_blank");
      return;
    }

    const isHosted = portfolioData?.find(
      (section: any) => section.type === "themes"
    )?.data?.PortfolioLink?.slug || portfolioData?.find(
      (section: any) => section.type === "themes"
    )?.data?.PortfolioLink?.subdomain;

    if (isHosted) {
      toast.error("No resume available.");
    } else {
      toast.error("No resume available. Please upload a resume in the contact section.");
    }
  };

  // Magic Write functionality
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: context || ""
        }),
      });

      if (!response.ok) {
        throw new Error('Magic Write API error');
      }

      const data = await response.json();
      return data.result || context || "";
    } catch (error) {
      console.error('Magic Write API error:', error);
      toast.error('Failed to enhance text');
      return context || "";
    }
  };

  const handleDescriptionUpdate = async (newDescription: string) => {
    try {
      // Update the hero data with the new description
      const updatedHeroData = {
        ...heroData,
        summary: newDescription
      };
      setHeroData(updatedHeroData);

      // Save to database
      const result = await updateSection({
        sectionName: "hero",
        portfolioId,
        sectionContent: updatedHeroData,
        sectionTitle: "Hero",
        sectionDescription: "Hero section"
      });

      if (result.success) {
        toast.success("Hero description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving hero description:", error);
      toast.error("Failed to save changes to database");
    }
  };

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData?.find(
        (section: any) => section.type === "hero"
      )?.data;
      const userInfoData = portfolioData?.find(
        (section: any) => section.type === "userInfo"
      )?.data;

      if (userInfoData) {
        setUserInfo(userInfoData);
      }

      if (heroSectionData) {
        setHeroData(heroSectionData);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-hero-${portfolioId}`)
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
  }, [portfolioId, isLoading]);

  if (isLoading || !heroData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }



  return (
    <>
      <div id="about" className={`relative simple-white pt-8 sm:pt-12 md:pt-16 lg:pt-20`} style={getBackgroundThemeStyle()}>
        <style>{customCSS}</style>



        <div className="flex h-full pt-16 sm:pt-20 md:pt-24 justify-center items-end mb-16 sm:mb-20 md:mb-24">
          <div className={getContainerClasses()}>
            <div className="flex absolute gap-4 right-2 sm:right-24 top-2 sm:top-24 z-20">
              <EditButton
                sectionName={"hero"}
                styles="text-xs px-2 sm:px-3 py-1"
              />
              {shouldShowButton && (
                <button
                  onClick={openVisualEditor}
                  className="md:flex hidden cursor-pointer items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  }}
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Visual Editor</span>

                </button>
              )}
            </div>


            <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4 xl:gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 relative">
                <motion.h1
                  className={getTitleClasses()}
                  style={{ color: textPrimaryColor }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: 0.1,
                  }}
                >
                  {heroData?.name || "John Doe"}
                </motion.h1>

                <motion.h2
                  className={getSubtitleClasses()}
                  style={{ color: textSecondaryColor }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: 0.2,
                  }}
                >
                  {heroData?.title || "Full Stack Developer"}
                </motion.h2>

                <div className="relative">
                  <motion.p
                    className={getDescriptionClasses()}
                    style={{ color: textSecondaryColor }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                      delay: 0.3,
                    }}
                  >
                    {heroData?.summary ||
                      "I build exceptional and accessible digital experiences for the web."}
                  </motion.p>
                  <div className="absolute -top-1 -right-1 z-10 hidden md:block">
                    <MagicWrite
                      onMagicWrite={async (prompt: string, context?: string) => {
                        const enhancedDescription = await handleMagicWrite(prompt, heroData?.summary || "I build exceptional and accessible digital experiences for the web.");
                        handleDescriptionUpdate(enhancedDescription);
                        return enhancedDescription;
                      }}
                      placeholder="Enhance this description..."
                      buttonText=""
                      context={heroData?.summary || "I build exceptional and accessible digital experiences for the web."}
                      className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className={`flex space-x-2 sm:space-x-3 md:space-x-4 mb-6 sm:mb-8 md:mb-12 lg:mb-16 ${effectiveCustomization.socialLinksVisible ? "" : "hidden"}`}>
                  <motion.a
                    href={userInfo?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getSocialLinksClasses()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                  >
                    <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" style={{ color: textPrimaryColor }} />
                  </motion.a>

                  <motion.a
                    href={userInfo?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getSocialLinksClasses()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                  >
                    <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" style={{ color: textPrimaryColor }} />
                  </motion.a>
                </div>
              </div>

              {/* Right Column - About */}
              <div className="lg:col-span-2 relative">
                {effectiveCustomization.aboutCardVisible && (
                  <motion.div
                    className={`${getCardStyle()} cursor-pointer`}
                    initial={{ x: 0, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                        delay: 0.4,
                      },
                    }}
                    style={{
                      scale: effectiveCustomization.hoverEffects ? 1.02 : 1,
                      boxShadow: effectiveCustomization.hoverEffects
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.01)"
                        : "",
                    }}
                  >
                    <motion.h2
                      className="text-2xl sm:text-3xl text-left lg:text-4xl font-bold section-sub-title mb-4 sm:mb-5 lg:mb-6"
                      style={{ color: textPrimaryColor }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.5, duration: 0.5 },
                      }}
                    >
                      About Me
                    </motion.h2>

                    <motion.div
                      className="flex items-center mb-3 sm:mb-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.6, duration: 0.5 },
                      }}
                    >
                      <MdEmail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: textSecondaryColor }} />
                      <a
                        href={`mailto:${userInfo?.email}`}
                        className="text-base sm:text-lg lg:text-xl font-medium break-all"
                        style={{ color: textSecondaryColor }}
                      >
                        {userInfo?.email}
                      </a>
                    </motion.div>

                    <motion.div
                      className="flex items-center mb-6 sm:mb-7 lg:mb-8"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.7, duration: 0.5 },
                      }}
                    >
                      <MdLocationOn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: textSecondaryColor }} />
                      <span className="text-base sm:text-lg font-medium" style={{ color: textSecondaryColor }}>
                        {userInfo?.location}
                      </span>
                    </motion.div>

                    <div className="relative">
                      <motion.p
                        className="section-sub-description text-sm sm:text-base lg:text-md leading-relaxed"
                        style={{ color: textSecondaryColor }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: { delay: 0.8, duration: 0.5 },
                        }}
                      >
                        {userInfo?.shortSummary ||
                          "I build exceptional and accessible digital experiences for the web."}
                      </motion.p>
                      <div className="absolute -top-1 -right-1 z-10 hidden md:block">
                        <MagicWrite
                          onMagicWrite={async (prompt: string, context?: string) => {
                            const enhancedSummary = await handleMagicWrite(prompt, userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web.");
                            // Update userInfo with enhanced summary
                            const updatedUserInfo = {
                              ...userInfo,
                              shortSummary: enhancedSummary
                            };
                            setUserInfo(updatedUserInfo);

                            // Save to database
                            try {
                              const result = await updateSection({
                                sectionName: "userInfo",
                                portfolioId,
                                sectionContent: updatedUserInfo,
                                sectionTitle: "User Info",
                                sectionDescription: "User information section"
                              });

                              if (result.success) {
                                toast.success("Summary enhanced and saved successfully!");
                              } else {
                                toast.error("Failed to save changes to database");
                              }
                            } catch (error) {
                              console.error("Error saving user info:", error);
                              toast.error("Failed to save changes to database");
                            }

                            return enhancedSummary;
                          }}
                          placeholder="Enhance this summary..."
                          buttonText=""
                          context={userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web."}
                          className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="mt-4 sm:mt-6 lg:mt-8 cursor-pointer lg:ml-32 flex justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {effectiveCustomization.resumeButtonVisible ? (
                    <motion.button
                      onClick={handleResumeDownload}
                      className={`${getResumeButtonStyle()} cursor-pointer flex items-center gap-2`}
                      style={getResumeButtonInlineStyle()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaFile size={20} />
                      Download Resume
                    </motion.button>
                  ) : (
                    <AnimatedButton
                      text="Download Resume"
                      icon={<FaFile size={20} />}
                      onClick={handleResumeDownload}
                    />
                  )}
                </motion.div>
              </div>
            </main>


            {/* Scroll Down Indicator */}
            {effectiveCustomization.scrollIndicatorVisible && (
              <motion.div
                className="flex justify-center mt-8 sm:mt-10 lg:mt-12"
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 1.2, duration: 0.5 },
                }}
                whileHover={{
                  y: [0, -8, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                    },
                  },
                }}
              >
                <motion.button
                  className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border transition-colors`}
                  style={{
                    borderColor: textSecondaryColor,
                    color: textSecondaryColor
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>



        {/* Bottom gradient edge to soften transition to next component */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>

      {/* Floating Visual Editor Window - Outside main container to avoid stacking context issues */}
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
            <h3 className="text-base sm:text-lg font-bold text-white">Visual Editor</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "typography", "buttons", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                style={{
                  background: activeTab === tab ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                }}
              >
                {tab === "layout" && (
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                {tab === "typography" && (
                  <Type className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                {tab === "buttons" && (
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                {tab === "effects" && (
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                <span className="hidden sm:inline">{tab}</span>
                <span className="sm:hidden">{tab.charAt(0)}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {activeTab === "layout" && (
              <div className="space-y-4">
                <BackgroundThemeSelector
                  value={draftCustomization?.backgroundTheme ?? customization.backgroundTheme}
                  onChange={value => updateDraftCustomization("backgroundTheme", value)}
                />
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
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
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${(draftCustomization?.titleWeight ?? customization.titleWeight) === value
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
                  <SizeSelector
                    value={draftCustomization?.subtitleSize ?? customization.subtitleSize}
                    onChange={value => updateDraftCustomization("subtitleSize", value)}
                    label="Subtitle Size"
                    options={[
                      { value: "sm", label: "Small", size: "16px" },
                      { value: "md", label: "Medium", size: "18px" },
                      { value: "lg", label: "Large", size: "20px" },
                      { value: "xl", label: "Extra Large", size: "24px" },
                    ]}
                  />
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <SizeSelector
                    value={draftCustomization?.descriptionSize ?? customization.descriptionSize}
                    onChange={value => updateDraftCustomization("descriptionSize", value)}
                    label="Description Size"
                    options={[
                      { value: "sm", label: "Small", size: "14px" },
                      { value: "md", label: "Medium", size: "16px" },
                      { value: "lg", label: "Large", size: "18px" },
                    ]}
                  />
                </div>
              </div>
            )}

            {activeTab === "buttons" && (
              <div className="space-y-4">
                <StyleSelector
                  value={draftCustomization?.resumeButtonStyle ?? customization.resumeButtonStyle}
                  onChange={value => updateDraftCustomization("resumeButtonStyle", value)}
                  label="Button Style"
                  options={[
                    { value: "default", label: "Default", style: "bg-gray-900 text-white rounded" },
                    { value: "animated", label: "Animated", style: "bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded" },
                    { value: "minimal", label: "Minimal", style: "border border-gray-300 text-gray-700 rounded" },
                    { value: "outline", label: "Outline", style: "border-2 border-gray-900 text-gray-900 rounded" },
                  ]}
                />

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Button Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "sm", label: "Small", size: "px-4 py-2 text-sm" },
                      { value: "md", label: "Medium", size: "px-6 py-3 text-base" },
                      { value: "lg", label: "Large", size: "px-8 py-4 text-lg" },
                    ].map(({ value, label, size }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("resumeButtonSize", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${(draftCustomization?.resumeButtonSize ?? customization.resumeButtonSize) === value
                          ? "border-white bg-zinc-700"
                          : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className={`px-3 py-1 text-xs rounded bg-gray-900 text-white ${size}`}>
                            Button
                          </div>
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

                  <div className="flex items-center justify-between">
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

      {/* Overlay for floating window - Outside main container */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}
    </>
  );
};

export default Hero; 
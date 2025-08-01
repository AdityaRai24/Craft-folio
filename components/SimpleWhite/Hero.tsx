"use client";

import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Settings, Grid3X3, RotateCcw, Type, Zap, Eye, X } from "lucide-react";
import type { NextPage } from "next";
import Navbar from "./Navbar";
import AnimatedButton from "./AnimatedButton";
import EditButton from "@/components/EditButton";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { motion, useAnimate } from "framer-motion";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { defaultSimpleWhiteHeroStyles } from "./defaultStyles/hero";
import { SimpleWhiteHeroCustomizationState } from "./defaultStyles/types";
import { ColorTheme } from "@/lib/colorThemes";

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
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === optionValue
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

const Hero: NextPage = ({ customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);

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

    return `max-w-[95%] !mt-12 md:mt-0 sm:max-w-[90%] lg:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto px-4 pb-4 sm:pb-8 lg:pb-0 sm:px-6 lg:px-8 ${
      alignmentMap[effectiveCustomization.contentAlignment]
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

    return `section-title ${sizeMap[effectiveCustomization.titleSize]} ${
      weightMap[effectiveCustomization.titleWeight]
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

    return `section-sub-title ${sizeMap[effectiveCustomization.subtitleSize]} ${
      weightMap[effectiveCustomization.subtitleWeight]
    } text-${effectiveCustomization.subtitleColor} mb-3 sm:mb-4`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
      sm: "text-sm sm:text-base lg:text-base",
      md: "text-base sm:text-lg lg:text-lg",
      lg: "text-lg sm:text-xl lg:text-xl",
    };

    return `section-description ${sizeMap[effectiveCustomization.descriptionSize]} font-medium text-${effectiveCustomization.descriptionColor} mb-6 sm:mb-8 lg:mb-10`;
  };

  const getBackgroundStyle = () => {
    const bgMap = {
      white: "bg-white",
      "gray-50": "bg-gray-50",
      "gray-100": "bg-gray-100",
    };
    return bgMap[effectiveCustomization.backgroundColor] || "bg-white";
  };

  const getCardStyle = () => {
    const styleMap = {
      solid: "bg-white",
      gradient: "bg-gradient-to-br from-white to-primary-100",
      transparent: "bg-transparent",
    };

    const borderMap = {
      none: "border-transparent",
      subtle: "border-2 border-primary-100 hover:border-black/20",
      bold: "border-4 border-primary-200 hover:border-primary-300",
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
      border: "hover:border-8 hover:border-black/30",
      scale: "hover:scale-110",
      glow: "hover:shadow-lg hover:shadow-primary-200",
      none: "",
    };

    return `duration-200 ease-in border-4 border-transparent ${hoverMap[effectiveCustomization.socialLinksHoverEffect]} ${styleMap[effectiveCustomization.socialLinksStyle]} bg-white flex items-center justify-center transition-all ${sizeMap[effectiveCustomization.socialLinksSize]}`;
  };

  const getResumeButtonStyle = () => {
    if (!effectiveCustomization.resumeButtonVisible) return "hidden";

    const sizeMap = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const styleMap = {
      default: "bg-blue-500 hover:bg-blue-600 text-white",
      animated: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white",
      minimal: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    };

    return `${sizeMap[effectiveCustomization.resumeButtonSize]} ${styleMap[effectiveCustomization.resumeButtonStyle]} rounded transition-all duration-300`;
  };

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "hero",
        });
        if (result.success && result.data) {
          setCustomization(result.data as unknown as SimpleWhiteHeroCustomizationState);
        } else {
          setCustomization(defaultSimpleWhiteHeroStyles);
        }
      } catch (error) {
        setCustomization(defaultSimpleWhiteHeroStyles);
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
      setCustomization(defaultSimpleWhiteHeroStyles);
      setDraftCustomization(defaultSimpleWhiteHeroStyles);
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
          // console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status: ${status}`);
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
    <div id="about" className={`relative simple-white pt-12 sm:pt-16 md:pt-20 ${getBackgroundStyle()}`}>
      <style>{customCSS}</style>
      
      {/* Visual Editor Toggle Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <EditButton sectionName="hero" />
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

      <div className="flex h-full pt-24 justify-center items-end mb-24">
        <div className={getContainerClasses()}>
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 xl:gap-8">
            {/* Left Column - Main Info */}
            <div className={`lg:col-span-2 relative ${effectiveCustomization.layoutStyle === "split" ? "order-1 lg:order-1" : "order-2 lg:order-2"}`}>
              <motion.h1
                className={getTitleClasses()}
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

              <motion.p
                className={getDescriptionClasses()}
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

              {/* Social Links */}
              <div className={`flex space-x-3 sm:space-x-4 mb-8 sm:mb-12 lg:mb-16 ${effectiveCustomization.socialLinksVisible ? "" : "hidden"}`}>
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
                  <FaGithub className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
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
                  <FaLinkedin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
                </motion.a>
              </div>
            </div>

            {/* Right Column - About */}
            <div className={`lg:col-span-2 relative ${effectiveCustomization.layoutStyle === "split" ? "order-2 lg:order-2" : "order-1 lg:order-1"}`}>
              {effectiveCustomization.aboutCardVisible && (
                <motion.div
                  className={getCardStyle()}
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
                  whileHover={{
                    scale: effectiveCustomization.hoverEffects ? 1.02 : 1,
                    boxShadow: effectiveCustomization.hoverEffects
                      ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.01)"
                      : "",
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <motion.h2
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold section-sub-title text-gray-900 mb-4 sm:mb-5 lg:mb-6"
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
                    <MdEmail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <a
                      href={`mailto:${userInfo?.email}`}
                      className="text-gray-700 text-base sm:text-lg lg:text-xl font-medium hover:text-gray-900 break-all"
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
                    <MdLocationOn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-base sm:text-lg font-medium">
                      {userInfo?.location}
                    </span>
                  </motion.div>

                  <motion.p
                    className="text-gray-700 section-sub-description text-sm sm:text-base lg:text-md leading-relaxed"
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
                </motion.div>
              )}

              <motion.div
                className="mt-4 sm:mt-6 lg:mt-0 lg:ml-32 flex justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                {effectiveCustomization.resumeButtonVisible ? (
                  <motion.button
                    onClick={handleResumeDownload}
                    className={`${getResumeButtonStyle()} flex items-center gap-2`}
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
                className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-gray-200 text-${effectiveCustomization.scrollIndicatorColor} hover:text-gray-600 hover:border-gray-300 transition-colors`}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
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
                className={`flex-1 py-3 px-3 text-sm capitalize transition-colors ${
                  activeTab === tab ? "bg-zinc-700 text-white" : "text-gray-400 hover:text-white"
                }`}
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
                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Layout Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "split", label: "Split", icon: "⊞" },
                      { value: "stacked", label: "Stacked", icon: "⊟" },
                      { value: "centered", label: "Centered", icon: "○" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("layoutStyle", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.layoutStyle ?? customization.layoutStyle) === value
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

                <AlignmentSelector
                  value={draftCustomization?.contentAlignment ?? customization.contentAlignment}
                  onChange={value => updateDraftCustomization("contentAlignment", value)}
                  label="Content Alignment"
                />

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Background Color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "white", label: "White", color: "bg-white" },
                      { value: "gray-50", label: "Light Gray", color: "bg-gray-50" },
                      { value: "gray-100", label: "Gray", color: "bg-gray-100" },
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

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Card Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "solid", label: "Solid", style: "bg-white" },
                      { value: "gradient", label: "Gradient", style: "bg-gradient-to-br from-white to-blue-100" },
                      { value: "transparent", label: "Transparent", style: "bg-transparent" },
                    ].map(({ value, label, style }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardBackground", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardBackground ?? customization.cardBackground) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className={`w-full h-8 rounded mb-2 ${style}`}></div>
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Visibility Settings
                  </h5>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Show About Card</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.aboutCardVisible ?? customization.aboutCardVisible}
                        onChange={(e) => updateDraftCustomization("aboutCardVisible", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Show Social Links</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.socialLinksVisible ?? customization.socialLinksVisible}
                        onChange={(e) => updateDraftCustomization("socialLinksVisible", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
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

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Title Color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "gray-900", label: "Dark", color: "bg-gray-900" },
                      { value: "gray-800", label: "Medium", color: "bg-gray-800" },
                      { value: "black", label: "Black", color: "bg-black" },
                    ].map(({ value, label, color }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("titleColor", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.titleColor ?? customization.titleColor) === value
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
                    Subtitle Settings
                  </h5>

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

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Subtitle Color
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "gray-600", label: "Light", color: "bg-gray-600" },
                        { value: "gray-700", label: "Medium", color: "bg-gray-700" },
                        { value: "gray-800", label: "Dark", color: "bg-gray-800" },
                      ].map(({ value, label, color }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("subtitleColor", value)}
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.subtitleColor ?? customization.subtitleColor) === value
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
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Description Settings
                  </h5>

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

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Description Color
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "gray-600", label: "Light", color: "bg-gray-600" },
                        { value: "gray-700", label: "Medium", color: "bg-gray-700" },
                        { value: "gray-800", label: "Dark", color: "bg-gray-800" },
                      ].map(({ value, label, color }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("descriptionColor", value)}
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.descriptionColor ?? customization.descriptionColor) === value
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
                </div>
              </div>
            )}

            {activeTab === "buttons" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Show Resume Button</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftCustomization?.resumeButtonVisible ?? customization.resumeButtonVisible}
                      onChange={(e) => updateDraftCustomization("resumeButtonVisible", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <StyleSelector
                  value={draftCustomization?.resumeButtonStyle ?? customization.resumeButtonStyle}
                  onChange={value => updateDraftCustomization("resumeButtonStyle", value)}
                  label="Button Style"
                  options={[
                    { value: "default", label: "Default", style: "bg-blue-500 text-white rounded" },
                    { value: "animated", label: "Animated", style: "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded" },
                    { value: "minimal", label: "Minimal", style: "border border-gray-300 text-gray-700 rounded" },
                    { value: "outline", label: "Outline", style: "border-2 border-blue-500 text-blue-500 rounded" },
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
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.resumeButtonSize ?? customization.resumeButtonSize) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          <div className={`px-3 py-1 text-xs rounded bg-blue-500 text-white ${size}`}>
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Scroll Indicator
                  </h5>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Show Scroll Indicator</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.scrollIndicatorVisible ?? customization.scrollIndicatorVisible}
                        onChange={(e) => updateDraftCustomization("scrollIndicatorVisible", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  {(draftCustomization?.scrollIndicatorVisible ?? customization.scrollIndicatorVisible) && (
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Indicator Color
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "gray-400", label: "Light", color: "bg-gray-400" },
                          { value: "gray-500", label: "Medium", color: "bg-gray-500" },
                          { value: "gray-600", label: "Dark", color: "bg-gray-600" },
                        ].map(({ value, label, color }) => (
                          <div
                            key={value}
                            onClick={() => updateDraftCustomization("scrollIndicatorColor", value)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              (draftCustomization?.scrollIndicatorColor ?? customization.scrollIndicatorColor) === value
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
                className="flex-1 py-2 px-3 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
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

export default Hero; 
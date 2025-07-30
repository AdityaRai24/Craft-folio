import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { supabase } from "@/lib/supabase-client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import EditButton from "@/components/EditButton";
import SectionHeader from "./SectionHeader";
import { Switch } from "@/components/ui/switch";
import { ColorTheme } from "@/lib/colorThemes";
import {
  Settings,
  RotateCcw,
  Grid3X3,
  Type,
  Move,
  Zap,
  Eye,
  Clock,
  MapPin,
  Building,
  Calendar,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

// Visual Layout Selector Component
const LayoutSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string; icon: string }[];
}> = ({ value, onChange, label, options }) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value: optionValue, label: optionLabel, icon }) => (
          <div
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
              value === optionValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="text-center text-lg text-white mb-1">{icon}</div>
            <div className="text-center text-xs text-white">{optionLabel}</div>
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
      <label className="block text-white text-left font-medium mb-3">{label}</label>
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
                  color: ColorTheme.primary
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



// Visual Tech Stack Style Selector Component
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

// Visual Spacing Selector Component
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

interface CustomizationState {
  // Layout & Structure
  maxWidth: "sm" | "md" | "lg" | "xl" | "full";

  // Timeline Customization
  timelineStyle: "line" | "dots" | "gradient" | "minimal";
  timelinePosition: "left" | "center" | "alternating";
  timelineWidth: number;
  timelineColor: string;
  dotSize: "sm" | "md" | "lg";
  dotStyle: "circle" | "square" | "diamond" | "hexagon";

  // Card Customization
  cardStyle: "default" | "elevated" | "minimal" | "bordered" | "glass";
  cardRadius: number;
  cardPadding: number;

  // Typography
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  companySize: "xs" | "sm" | "md" | "lg";
  descriptionSize: "xs" | "sm" | "md" | "lg";

  // Animations
  entranceAnimation: "fade" | "slide" | "scale" | "bounce" | "stagger" | "none";
  animationDuration: number;
  staggerDelay: number;
  hoverEffects: boolean;

  // Tech Stack Display
  techStackVisible: boolean;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  techStackSize: "sm" | "md" | "lg";

  // Badges & Tags
  badgeStyle: "default" | "minimal" | "outlined" | "glow";
  badgeRadius: number;
  locationBadge: boolean;
  dateBadge: boolean;
  statusBadge: boolean;

  // Visual Effects
  gradientOverlay: boolean;
  glowEffect: boolean;
  borderGlow: boolean;
  backgroundPattern: "none" | "dots" | "grid" | "waves";
}

const ProfessionalJourney = ({ currentPortTheme, customCSS }: any) => {
  interface Technology {
    name: string;
    logo: string;
  }

  interface Experience {
    role?: string;
    companyName?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    techStack?: Technology[];
  }

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

  const experienceSection = portfolioData?.find(
    (item: any) => item.type === "experience"
  );
  const sectionTitle =
    experienceSection?.sectionTitle || "Professional Journey";
  const sectionDescription =
    experienceSection?.sectionDescription ||
    "Building real-world experience through innovative projects";

  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "timeline" | "cards" | "typography"
  >("layout");

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const dispatch = useDispatch();
  const portfolioId = params.portfolioId as string;

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

  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>({
    // Layout & Structure
    maxWidth: "lg",

    // Timeline Customization
    timelineStyle: "line",
    timelinePosition: "left",
    timelineWidth: 2,
    timelineColor: titleColor || "#3b82f6",
    dotSize: "md",
    dotStyle: "circle",

    // Card Customization
    cardStyle: "default",
    cardRadius: 8,
    cardPadding: 6,

    // Typography
    titleSize: "lg",
    titleWeight: "bold",
    companySize: "md",
    descriptionSize: "sm",

    // Animations
    entranceAnimation: "stagger",
    animationDuration: 700,
    staggerDelay: 200,
    hoverEffects: true,

    // Tech Stack Display
    techStackVisible: true,
    techStackStyle: "pills",
    techStackSize: "sm",

    // Badges & Tags
    badgeStyle: "default",
    badgeRadius: 20,
    locationBadge: true,
    dateBadge: true,
    statusBadge: false,

    // Visual Effects
    gradientOverlay: false,
    glowEffect: false,
    borderGlow: false,
    backgroundPattern: "none",
  });

  // Reset customization
  const resetCustomization = () => {
    setCustomization({
      maxWidth: "lg",
      timelineStyle: "line",
      timelinePosition: "left",
      timelineWidth: 2,
      timelineColor: titleColor || "#3b82f6",
      dotSize: "md",
      dotStyle: "circle",
      cardStyle: "default",
      cardRadius: 8,
      cardPadding: 6,
      titleSize: "lg",
      titleWeight: "bold",
      companySize: "md",
      descriptionSize: "sm",
      entranceAnimation: "stagger",
      animationDuration: 700,
      staggerDelay: 200,
      hoverEffects: true,
          techStackVisible: true,
    techStackStyle: "pills",
    techStackSize: "sm",
      badgeStyle: "default",
      badgeRadius: 20,
      locationBadge: true,
      dateBadge: true,
      statusBadge: false,
      gradientOverlay: false,
      glowEffect: false,
      borderGlow: false,
      backgroundPattern: "none",
    });
  };

  // Update customization helper
  const updateCustomization = (key: keyof CustomizationState, value: any) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  // Styling helpers
  const getContainerClasses = () => {
    const maxWidthMap = {
      sm: "max-w-sm",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "w-full",
    };

    return `${maxWidthMap[customization.maxWidth]} mx-auto space-y-10`;
  };



  const getCardClasses = () => {
    const styleMap = {
      default: "bg-stone-900/60 border border-gray-700",
      elevated: "bg-stone-900/80 border border-gray-600",
      minimal: "bg-transparent border-l-4",
      bordered: "bg-stone-900/40 border-2 border-gray-600",
      glass: "bg-white/5 backdrop-blur-sm border border-white/10",
    };

    // const paddingClass = `p-${customization.cardPadding}`;

    return `${styleMap[customization.cardStyle]}`;
  };

  const getCardStyle = () => ({
    borderRadius: `${customization.cardRadius}px`,
    padding : `${customization.cardPadding * 4}px`,
  });

  const getTitleClasses = () => {
    const sizeMap = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return `${sizeMap[customization.titleSize]} ${
      weightMap[customization.titleWeight]
    } section-sub-title mb-2`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return `${
      sizeMap[customization.descriptionSize]
    } text-gray-300 section-sub-description mb-4`;
  };

  const getTechStackClasses = () => {
    const sizeMap = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-3 py-1",
      lg: "text-base px-4 py-2",
    };

    let classes = `${sizeMap[customization.techStackSize]} inline-flex items-center gap-1`;

    switch (customization.techStackStyle) {
      case "badges":
        classes += " bg-gray-800 text-white rounded";
        break;
      case "minimal":
        classes += " text-gray-300 hover:text-white";
        break;
      case "colorful":
        classes += " text-white rounded-full border-2";
        break;
      default:
        classes += " text-white rounded-full border border-gray-700";
    }

    return classes;
  };

  const getTimelineStyles = () => {
    const dotSizeMap = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    const dotStyleMap = {
      circle: "rounded-full",
      square: "rounded-none",
      diamond: "rotate-45",
      hexagon: "rounded-none",
    };

    return {
      dot: `${dotSizeMap[customization.dotSize]} ${
        dotStyleMap[customization.dotStyle]
      }`,
      line: `bg-opacity-30`,
      lineStyle: {
        backgroundColor: ColorTheme.primary,
        width: `${customization.timelineWidth}px`,
        opacity: 0.3,
      },
      dotStyle: {
        backgroundColor: ColorTheme.primary,
        zIndex: 10,
        ...(customization.dotStyle === "hexagon" && {
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }),
      },
    };
  };

  const getAnimationVariants = () => {
    const variants = {
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      slide: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
      },
      scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      },
      bounce: {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", bounce: 0.4 },
        },
      },
      stagger: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      },
      none: {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      },
    };

    return variants[customization.entranceAnimation];
  };

  // Render control components
  const renderSelect = (
    label: string,
    value: string,
    options: string[],
    onChange: (value: string) => void
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number = 1,
    onChange: (value: number) => void
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const renderToggle = (
    label: string,
    value: boolean,
    onChange: (value: boolean) => void
  ) => (
    <div className="mb-4 flex items-center justify-between">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  const renderColorPicker = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-zinc-600 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadingVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const experienceSectionData = portfolioData.find(
        (section: any) => section.type === "experience"
      )?.data;
      if (experienceSectionData) {
        setExperienceData(experienceSectionData || []);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    if (experienceData.length > 0) {
      setVisibleItems(Array(experienceData.length).fill(false));

      experienceData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 500 + index * customization.staggerDelay);
      });
    }
  }, [experienceData, customization.staggerDelay]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-experience-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("project experience detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status experience: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  const handleSectionEdit = () => {
    dispatch(setCurrentEdit("experience"));
  };

  if (isLoading) {
    return (
      <section className="py-24 w-full overflow-hidden min-h-screen text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center h-64">
            Loading...
          </div>
        </div>
      </section>
    );
  }

  const animationVariants = getAnimationVariants();
  const timelineStyles = getTimelineStyles();

  return (
    <div className="text-white bg-black p-2 sm:p-4 md:p-8 relative">
      <style>{customCSS}</style>

      {/* Visual Editor Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setVisualEditorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{
            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
          }}
        >
          <Settings className="h-4 w-4" />
          Visual Editor
        </button>
      </div>

      <SectionHeader
        sectionName="experience"
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        titleColor={titleColor}
      />

      <div className={getContainerClasses()}>
        {experienceData.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-400">
            No professional experience added yet.
          </div>
        ) : (
          <div className="relative">
            {experienceData.map((experience, index) => (
              <motion.div
                key={index}
                initial={animationVariants.hidden}
                animate={
                  visibleItems[index]
                    ? animationVariants.visible
                    : animationVariants.hidden
                }
                transition={{
                  duration: customization.animationDuration / 1000,
                  delay:
                    customization.entranceAnimation === "stagger"
                      ? index * (customization.staggerDelay / 1000)
                      : 0,
                }}
                className={`relative section-card max-w-[95%] mx-auto md:max-w-[90%] ${
                  index !== experienceData.length - 1 ? "mb-10 sm:mb-16" : ""
                }`}
                style={{
                  filter: customization.glowEffect
                    ? `drop-shadow(0 0 20px ${titleColor}30)`
                    : "none",
                }}
              >
                {/* Timeline Elements */}
                <div
                  className={`absolute left-2 sm:left-6 transform -translate-x-1/2 ${timelineStyles.dot}`}
                  style={{
                    ...timelineStyles.dotStyle,
                    boxShadow: customization.borderGlow
                      ? `0 0 10px ${ColorTheme.primary}50`
                      : "none",
                    top: "1.5rem",
                  }}
                ></div>
                {index !== experienceData.length - 1 && (
                  <div
                    className={`absolute left-2 sm:left-6 top-0 bottom-0 ${timelineStyles.line}`}
                    style={{
                      ...timelineStyles.lineStyle,
                      transform: "translateX(-50%)",
                      top: "3rem",
                      height: "calc(100% + 2rem)",
                    }}
                  ></div>
                )}

                <div
                  className={`ml-8 sm:ml-20 ${getCardClasses()}`}
                  style={{
                    ...getCardStyle(),
                    borderColor:
                      customization.cardStyle === "minimal"
                        ? titleColor
                        : `${titleColor}30`,
                    background: customization.gradientOverlay
                      ? `linear-gradient(135deg, ${titleColor}10, transparent)`
                      : undefined,
                  }}
                >
                  <h2 className={getTitleClasses()}>{experience.role}</h2>

                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4 text-gray-400">
                    <span
                      className={`truncate max-w-[60vw] sm:max-w-none ${
                        customization.companySize === "lg"
                          ? "text-lg"
                          : customization.companySize === "md"
                          ? "text-base"
                          : "text-sm"
                      }`}
                    >
                      <Building className="inline h-4 w-4 mr-1" />
                      {experience.companyName}
                    </span>

                    {customization.locationBadge && experience.location && (
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                          customization.badgeStyle === "outlined"
                            ? "border"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            customization.badgeStyle === "outlined"
                              ? "transparent"
                              : `${titleColor}20`,
                          color: titleColor,
                          borderRadius: `${customization.badgeRadius}px`,
                          border:
                            customization.badgeStyle === "outlined"
                              ? `1px solid ${titleColor}`
                              : "none",
                          boxShadow:
                            customization.badgeStyle === "glow"
                              ? `0 0 10px ${titleColor}30`
                              : "none",
                        }}
                      >
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {experience.location}
                      </span>
                    )}

                    {customization.dateBadge && (
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                          customization.badgeStyle === "outlined"
                            ? "border"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            customization.badgeStyle === "outlined"
                              ? "transparent"
                              : `${titleColor}20`,
                          color: titleColor,
                          borderRadius: `${customization.badgeRadius}px`,
                          border:
                            customization.badgeStyle === "outlined"
                              ? `1px solid ${titleColor}`
                              : "none",
                          boxShadow:
                            customization.badgeStyle === "glow"
                              ? `0 0 10px ${titleColor}30`
                              : "none",
                        }}
                      >
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {`${experience.startDate} - ${experience.endDate}`}
                      </span>
                    )}
                  </div>

                  <p className={getDescriptionClasses()}>
                    {experience.description}
                  </p>

                  {customization.techStackVisible &&
                    experience.techStack &&
                    experience.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {experience.techStack.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className={getTechStackClasses()}
                            style={{
                              backgroundColor: `${titleColor}20`,
                              color: titleColor,
                              border:
                                customization.techStackStyle === "badges"
                                  ? `1px solid ${titleColor}30`
                                  : "none",
                            }}
                          >
                            {customization.techStackStyle !== "minimal" && (
                              <img
                                src={
                                  tech.logo ||
                                  `https://placehold.co/100x100?text=${tech.name}&font=montserrat&fontsize=18`
                                }
                                alt={tech.name}
                                className={`${
                                  customization.techStackSize === "lg"
                                    ? "h-5 w-5"
                                    : "h-4 w-4"
                                } inline-block mr-1`}
                              />
                            )}
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
            <h3 className="text-lg font-bold text-white">
              Experience Settings
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
            {["layout", "timeline", "cards", "typography"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-3 text-sm capitalize transition-colors ${
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
                  <Grid3X3 className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab === "timeline" && (
                  <Clock className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab === "cards" && (
                  <Building className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab === "typography" && (
                  <Type className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-6">
            {activeTab === "layout" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Max Width
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "md", label: "Medium", width: "50%" },
                      { value: "lg", label: "Large", width: "75%" },
                      { value: "xl", label: "Extra Large", width: "90%" },
                      { value: "full", label: "Full Width", width: "100%" },
                    ].map(({ value, label, width }) => (
                      <div
                        key={value}
                        onClick={() => updateCustomization("maxWidth", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          customization.maxWidth === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full block mx-auto">
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
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6">
                <h4 className="text-md font-semibold text-white mb-4">
                  Timeline Settings
                </h4>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Timeline Width: {customization.timelineWidth}px
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={1}
                    value={customization.timelineWidth}
                    onChange={(e) => updateCustomization("timelineWidth", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(100 * (customization.timelineWidth - 1) / 7)}%, #3f3f46 ${(100 * (customization.timelineWidth - 1) / 7)}%, #3f3f46 100%)`
                    }}
                    
                  />
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h5 className="text-sm font-medium text-white mb-3">
                    Dot Settings
                  </h5>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-left font-medium mb-3">Dot Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "sm", label: "Small", icon: "●" },
                          { value: "md", label: "Medium", icon: "●" },
                          { value: "lg", label: "Large", icon: "●" },
                        ].map(({ value, label, icon }) => (
                          <div
                            key={value}
                            onClick={() => updateCustomization("dotSize", value)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              customization.dotSize === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="text-center text-lg text-white mb-1">{icon}</div>
                            <div className="text-center text-xs text-white">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-left font-medium mb-3">Dot Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "circle", label: "Circle", icon: "●" },
                          { value: "square", label: "Square", icon: "■" },
                          { value: "diamond", label: "Diamond", icon: "◆" },
                          { value: "hexagon", label: "Hexagon", icon: "⬡" },
                        ].map(({ value, label, icon }) => (
                          <div
                            key={value}
                            onClick={() => updateCustomization("dotStyle", value)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              customization.dotStyle === value
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                          >
                            <div className="text-center text-lg text-white mb-1">{icon}</div>
                            <div className="text-center text-xs text-white">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cards" && (
              <div className="space-y-6">
                <h4 className="text-md font-semibold text-white mb-4">
                  Card Customization
                </h4>

                <div>
                  <label className="block text-white text-left font-medium mb-3">Card Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "default", label: "Default" },
                      { value: "elevated", label: "Elevated" },
                      { value: "minimal", label: "Minimal" },
                      { value: "bordered", label: "Bordered" },
                      { value: "glass", label: "Glass" },
                    ].map(({ value, label }) => (
                      <button
                      key={value}
                      onClick={() =>
                        setCustomization((prev) => ({
                          ...prev,
                          cardStyle: value as any,
                        }))
                      }
                      className={`py-2 px-3 text-sm rounded transition-colors ${
                        customization.cardStyle === value
                          ? "text-white"
                          : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                      }`}
                      style={customization.cardStyle === value ? {
                        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      } : {}}
                    >
                      {label}
                    </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Card Border Radius: {customization.cardRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={2}
                    value={customization.cardRadius}
                    onChange={(e) => updateCustomization("cardRadius", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(customization.cardRadius / 24) * 100}%, #3f3f46 ${(customization.cardRadius / 24) * 100}%, #3f3f46 100%)`
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Card Padding: {customization.cardPadding}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={16}
                    step={2}
                    value={customization.cardPadding}
                    onChange={(e) => updateCustomization("cardPadding", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(customization.cardPadding / 16) * 100}%, #3f3f46 ${(customization.cardPadding / 16) * 100}%, #3f3f46 100%)`
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-6">

                <div className="space-y-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-left font-medium mb-3">Title Size</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "sm", label: "Small", size: "0.875rem" },
                            { value: "md", label: "Medium", size: "1rem" },
                            { value: "lg", label: "Large", size: "1.125rem" },
                            { value: "xl", label: "Extra Large", size: "1.25rem" },
                          ].map(({ value, label, size }) => (
                            <div
                              key={value}
                              onClick={() => updateCustomization("titleSize", value)}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                customization.titleSize === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              <div className="flex justify-center mb-2">
                                <div
                                  className="rounded text-white text-center font-bold"
                                  style={{ 
                                    fontSize: size,
                                    color: ColorTheme.primary
                                  }}
                                >
                                  Aa
                                </div>
                              </div>
                              <div className="text-center text-xs text-white">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white text-left font-medium mb-3">Title Weight</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "normal", label: "Normal", icon: "A" },
                            { value: "medium", label: "Medium", icon: "A" },
                            { value: "semibold", label: "Semibold", icon: "A" },
                            { value: "bold", label: "Bold", icon: "A" },
                          ].map(({ value, label, icon }) => (
                            <div
                              key={value}
                              onClick={() => updateCustomization("titleWeight", value)}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                customization.titleWeight === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              <div className="flex justify-center mb-2">
                                <div
                                  className="text-white text-center font-bold"
                                  style={{ fontSize: "14px" }}
                                >
                                  {icon}
                                </div>
                              </div>
                              <div className="text-center text-xs text-white">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-700 pt-4">
                     <div className="space-y-4">
                      <div>
                        <label className="block text-white text-left font-medium mb-3">Company Size</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "xs", label: "Extra Small", size: "0.75rem" },
                            { value: "sm", label: "Small", size: "0.875rem" },
                            { value: "md", label: "Medium", size: "1rem" },
                            { value: "lg", label: "Large", size: "1.125rem" },
                          ].map(({ value, label, size }) => (
                            <div
                              key={value}
                              onClick={() => updateCustomization("companySize", value)}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                customization.companySize === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              <div className="flex justify-center mb-2">
                                <div
                                  className="rounded text-white text-center font-bold"
                                  style={{ 
                                    fontSize: size,
                                    color: ColorTheme.primary
                                  }}
                                >
                                  Aa
                                </div>
                              </div>
                              <div className="text-center text-xs text-white">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white text-left font-medium mb-3">Description Size</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "xs", label: "Extra Small", size: "0.75rem" },
                            { value: "sm", label: "Small", size: "0.875rem" },
                            { value: "md", label: "Medium", size: "1rem" },
                            { value: "lg", label: "Large", size: "1.125rem" },
                          ].map(({ value, label, size }) => (
                            <div
                              key={value}
                              onClick={() => updateCustomization("descriptionSize", value)}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                customization.descriptionSize === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              <div className="flex justify-center mb-2">
                                <div
                                  className="rounded text-white text-center font-bold"
                                  style={{ 
                                    fontSize: size,
                                    color: ColorTheme.primary
                                  }}
                                >
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

                  <div className="border-t border-zinc-700 pt-4">
                    <h5 className="text-sm font-medium text-white mb-3">
                      Tech Stack Typography
                    </h5>

                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input
                          type="checkbox"
                          checked={customization.techStackVisible}
                          onChange={(e) => updateCustomization("techStackVisible", e.target.checked)}
                          className="rounded border-gray-600 bg-zinc-700 text-primary focus:ring-primary"
                        />
                        Show Tech Stack
                      </label>
                    </div>

                    {customization.techStackVisible && (
                      <div className="space-y-4">
                        <TechStackStyleSelector
                          value={customization.techStackStyle}
                          onChange={(value) => updateCustomization("techStackStyle", value)}
                        />

                        <div>
                          <label className="block text-white text-left font-medium mb-3">Tech Stack Size</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "sm", label: "Small", size: "0.75rem" },
                              { value: "md", label: "Medium", size: "0.875rem" },
                              { value: "lg", label: "Large", size: "1rem" },
                            ].map(({ value, label, size }) => (
                              <div
                                key={value}
                                onClick={() => updateCustomization("techStackSize", value)}
                                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                  customization.techStackSize === value
                                    ? "border-white bg-zinc-700"
                                    : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                }`}
                              >
                                <div className="flex justify-center mb-2">
                                  <div
                                    className="rounded text-white text-center font-bold"
                                    style={{ 
                                      fontSize: size,
                                      color: ColorTheme.primary
                                    }}
                                  >
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
                  </div>
                </div>
              </div>
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
                onClick={() => setVisualEditorOpen(false)}
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

      {/* Custom CSS for animations and effects */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 10;
          position: relative;
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .slider::-webkit-slider-track {
          background: #3f3f46;
          border-radius: 8px;
          height: 6px;
          border: none;
        }

        .slider::-moz-range-track {
          background: #3f3f46;
          border-radius: 8px;
          height: 6px;
          border: none;
        }

        /* Background patterns */
        .bg-pattern-dots {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }

        .bg-pattern-grid {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }

        .bg-pattern-waves {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        /* Timeline animations */
        @keyframes timelinePulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .timeline-dot-animated {
          animation: timelinePulse 2s infinite;
        }

        /* Hover effects for cards */
        .experience-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .experience-card:hover .timeline-dot {
          transform: scale(1.2);
        }

        /* Tech stack hover effects */
        .tech-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .experience-card {
            margin-left: 2rem !important;
          }

          .timeline-dot {
            left: 0.5rem !important;
          }

          .timeline-line {
            left: 0.5rem !important;
          }
        }

        /* Glass effect for cards */
        .card-glass {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        /* Gradient text effects */
        .gradient-text {
          background: linear-gradient(
            45deg,
            var(--primary-color),
            var(--accent-color)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalJourney;

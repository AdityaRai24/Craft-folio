"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Github,
  ExternalLink,
  Code2,
  Calendar,
  Settings,
  Palette,
  Layout,
  Move,
  RotateCcw,
  X,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import EditButton from "@/components/EditButton";
import SectionHeader from "./SectionHeader";
import { ColorTheme } from "@/lib/colorThemes";

interface Technology {
  name: string;
  logo: string;
}

interface Project {
  projectTitle?: string;
  projectName?: string;
  projectDescription?: string;
  projectImage?: string;
  techStack?: Technology[];
  githubLink?: string;
  liveLink?: string;
  year?: string;
}

interface CustomizationState {
  layout: "single" | "grid";
  gridColumns: number;
  cardSpacing: number;
  cardBorderRadius: number;
  imageBorderRadius: number;
  cardBackground: string;
  cardBorder: string;
  imageAspectRatio: "auto" | "square" | "wide" | "tall";
  imageHeight: number;
  githubButtonStyle: "default" | "filled" | "ghost" | "minimal";
  liveButtonStyle: "default" | "filled" | "ghost" | "minimal";
  buttonBorderRadius: number;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  animationSpeed: number;
  titleAlignment: "left" | "center" | "right";
  cardPadding: number;
  imageOverlay: boolean;
  imagePosition: "left" | "right";
}

// Visual Border Radius Selector Component
const BorderRadiusSelector: React.FC<{
  value: number;
  onChange: (value: number) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const borderOptions = [0, 4, 8, 12, 16, 20, 24];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {borderOptions.map((radius) => (
          <div
            key={radius}
            onClick={() => onChange(radius)}
            className={`relative cursor-pointer p-3 border-2 transition-all duration-200 ${
              value === radius
                ? "border-white"
                : "border-gray-600 hover:border-gray-400"
            }`}
            style={{ borderRadius: `${radius}px` }}
          >
            <div
              className="w-full h-8 rounded"
              style={{ 
                borderRadius: `${Math.max(0, radius - 4)}px`,
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`
              }}
            />
            <div className="text-center text-xs text-gray-300 mt-1">
              {radius}px
            </div>
            {value === radius && (
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: ColorTheme.primary }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Layout Selector Component
const LayoutSelector: React.FC<{
  value: "single" | "grid";
  onChange: (value: "single" | "grid") => void;
  gridColumns: number;
  onGridColumnsChange: (cols: number) => void;
}> = ({ value, onChange, gridColumns, onGridColumnsChange }) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">Layout Style</label>
      <div className="space-y-4">
        {/* Layout Type Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => onChange("single")}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
              value === "single"
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
              Single Column
            </div>
          </div>

          <div
            onClick={() => onChange("grid")}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
              value === "grid"
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              <div className="h-6 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
            </div>
            <div className="text-center text-sm text-white mt-2">
              Grid Layout
            </div>
          </div>
        </div>

        {/* Grid Columns Selection - Only show when grid is selected */}
        {value === "grid" && (
          <div>
            <label className="block text-white text-left font-medium mb-2">
              Grid Columns
            </label>
            <div className="flex gap-2">
              {[2, 3, 4].map((cols) => (
                <div
                  key={cols}
                  onClick={() => onGridColumnsChange(cols)}
                  className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                    gridColumns === cols
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
      </div>
    </div>
  );
};

// Visual Alignment Selector Component
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

// Visual Button Style Selector Component
const ButtonStyleSelector: React.FC<{
  value: "default" | "filled" | "ghost" | "minimal";
  onChange: (value: "default" | "filled" | "ghost" | "minimal") => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const styles = [
    { value: "default", label: "Default" },
    { value: "filled", label: "Filled" },
    { value: "ghost", label: "Ghost" },
    { value: "minimal", label: "Minimal" },
  ];

  return (
    <div>
      <label className="block text-white font-medium mb-3">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(({ value: style, label: styleLabel }) => (
          <div
            key={style}
            onClick={() => onChange(style as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === style
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className={`px-3 py-1 text-xs rounded transition-all ${
                  style === "filled"
                    ? "text-white"
                    : style === "ghost"
                    ? "bg-transparent border border-gray-500 text-gray-300"
                    : style === "minimal"
                    ? "bg-transparent text-gray-300 !underline"
                    : "bg-transparent border border-gray-500 text-gray-300"
                }`}
                style={
                  style === "filled"
                    ? { backgroundColor: ColorTheme.primary }
                    : style === "minimal" ? { textDecoration: "underline" } : {}
                }
              >
                {styleLabel}
              </div>
            </div>
            <div className="text-center text-xs text-white">{styleLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Aspect Ratio Selector Component
const AspectRatioSelector: React.FC<{
  value: "auto" | "square" | "wide" | "tall";
  onChange: (value: "auto" | "square" | "wide" | "tall") => void;
  imageHeight: number;
  onImageHeightChange: (height: number) => void;
}> = ({ value, onChange, imageHeight, onImageHeightChange }) => {
  const ratios = [
    { value: "auto", icon: RectangleHorizontal, label: "Auto", aspect: "auto" },
    { value: "square", icon: Square, label: "Square", aspect: "1:1" },
    { value: "wide", icon: RectangleHorizontal, label: "Wide", aspect: "16:9" },
    { value: "tall", icon: RectangleVertical, label: "Tall", aspect: "3:4" },
  ];

  const heightOptions = [150, 200, 250, 300, 350, 400];

  return (
    <div>
      <label className="block text-white font-medium mb-3">
        Image Aspect Ratio
      </label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ratios.map(({ value: ratio, icon: Icon, label, aspect }) => (
          <div
            key={ratio}
            onClick={() => onChange(ratio as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === ratio
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <Icon
              className={`text-white ${
                ratio === "square"
                  ? "h-6 w-6"
                  : ratio === "tall"
                  ? "h-8 w-4"
                  : "h-4 w-8"
              }`}
            />
            <div className="text-center">
              <div className="text-xs text-white font-medium">{label}</div>
              <div className="text-xs text-gray-400">{aspect}</div>
            </div>
          </div>
        ))}
      </div>

            {value === "auto" && (
        <div>
          <label className="block text-left text-sm font-medium text-gray-300 mb-2">
            Custom Height: {imageHeight}px
          </label>
          <input
            type="range"
            min={150}
            max={300}
            step={25}
            value={imageHeight}
            onChange={(e) => onImageHeightChange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${
                ColorTheme.primary
              } 0%, ${ColorTheme.primary} ${
                ((imageHeight - 150) / 150) * 100
              }%, #3f3f46 ${
                ((imageHeight - 150) / 150) * 100
              }%, #3f3f46 100%)`,
            }}
          />
        </div>
      )}
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
  type: "gap" | "padding";
}> = ({ value, onChange, label, type }) => {
  return (
    <div>
      <label className="block text-left text-sm font-medium text-gray-300 mb-2">
        {label}: {value}px
      </label>
      <input
        type="range"
        min={type === "gap" ? 2 : 1}
        max={type === "gap" ? 16 : 12}
        step={type === "gap" ? 2 : 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(value / (type === "gap" ? 16 : 12)) * 100}%, #3f3f46 ${(value / (type === "gap" ? 16 : 12)) * 100}%, #3f3f46 100%)`
        }}
      />
    </div>
  );
};

const Projects: React.FC = ({ currentPortTheme, customCSS }: any) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();

  // Helper function to get theme-based button style
  const getThemeButtonStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
        color: "white",
      };
    }
    return {};
  };

  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "styling" | "timing"
  >("layout");

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>({
    layout: "single",
    gridColumns: 3,
    cardSpacing: 8,
    cardBorderRadius: 8,
    imageBorderRadius: 8,
    cardBackground: "bg-stone-800/30",
    cardBorder: "border-gray-700",
    imageAspectRatio: "auto",
    imageHeight: 208,
    githubButtonStyle: "default",
    liveButtonStyle: "default",
    buttonBorderRadius: 6,
    techStackStyle: "pills",
    animationSpeed: 0.3,
    titleAlignment: "left",
    cardPadding: 4,
    imageOverlay: true,
    imagePosition: "left",
  });

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;
  const buttonBgColor = theme.colors.primary;
  const buttonHoverBgColor = theme.colors.primaryHover;
  const buttonTextColor = theme.colors.text.primary;
  const buttonHoverTextColor = theme.colors.text.secondary;
  const mutedColor = theme.colors.states.muted;
  const scrollLineColor = theme.colors.background.secondary;

  const projectsSection = portfolioData?.find(
    (item: any) => item.type === "projects"
  );
  const sectionTitle = projectsSection?.sectionTitle || "My Projects";
  const sectionDescription =
    projectsSection?.sectionDescription ||
    "A showcase of my full-stack projects, built using modern web technologies and frameworks.";

  // Reset customization
  const resetCustomization = () => {
    setCustomization({
      layout: "single",
      gridColumns: 3,
      cardSpacing: 8,
      cardBorderRadius: 8,
      imageBorderRadius: 8,
      cardBackground: "bg-stone-800/30",
      cardBorder: "border-gray-700",
      imageAspectRatio: "auto",
      imageHeight: 208,
      githubButtonStyle: "default",
      liveButtonStyle: "default",
      buttonBorderRadius: 6,
      techStackStyle: "pills",
      animationSpeed: 0.3,
      titleAlignment: "left",
      cardPadding: 4,
      imageOverlay: true,
      imagePosition: "left",
    });
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
  const getLayoutClasses = () => {
    switch (customization.layout) {
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${customization.gridColumns}`;
      default:
        return `flex flex-col`;
    }
  };

  const getLayoutStyle = () => {
    switch (customization.layout) {
      case "grid":
        return { gap: `${customization.cardSpacing}px` };
      default:
        return { gap: `${customization.cardSpacing}px` };
    }
  };

  const getCardClasses = () => {
    let classes = `${customization.cardBackground} section-card border ${
      customization.cardBorder
    } overflow-hidden transition-all duration-${Math.round(
      customization.animationSpeed * 1000
    )} cursor-pointer hover:bg-zinc-900/80`;

    return classes;
  };

  const getCardStyle = () => ({
    borderRadius: `${customization.cardBorderRadius}px`,
    padding: `${customization.cardPadding * 4}px`,
  });

  const getImageStyle = () => {
    let aspectRatio = "auto";

    switch (customization.imageAspectRatio) {
      case "square":
        aspectRatio = "1 / 1";
        break;
      case "wide":
        aspectRatio = "16 / 9";
        break;
      case "tall":
        aspectRatio = "3 / 4";
        break;
    }

    return {
      borderRadius: `${customization.imageBorderRadius}px`,
      height:
        customization.imageAspectRatio === "auto"
          ? `${customization.imageHeight}px`
          : "auto",
      aspectRatio:
        customization.imageAspectRatio !== "auto" ? aspectRatio : undefined,
    };
  };

  const getButtonClasses = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? customization.githubButtonStyle
        : customization.liveButtonStyle;
    let classes =
      "flex items-center gap-2 px-3 py-1.5 transition-all duration-300 text-sm";

    switch (style) {
      case "filled":
        classes += " text-white";
        break;
      case "ghost":
        classes += " bg-transparent hover:bg-gray-800/50";
        break;
      case "minimal":
        classes += " bg-transparent border-0 underline hover:underline";
        break;
      default:
        classes += " bg-transparent border rounded-md hover:text-white";
    }

    return classes;
  };

  const getButtonStyle = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? customization.githubButtonStyle
        : customization.liveButtonStyle;

    return {
      borderRadius: `${customization.buttonBorderRadius}px`,
      borderColor: style !== "minimal" ? `${titleColor}30` : "transparent",
      color: style === "filled" ? "white" : titleColor,
      backgroundColor: style === "filled" ? titleColor : "transparent",
    };
  };

  const getTechStackClasses = () => {
    let classes =
      "px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300";

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

  const getTitleAlignment = () => {
    switch (customization.titleAlignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  useEffect(() => {
    if (portfolioData) {
      const portfolioSectionData = portfolioData.find(
        (section: any) => section.type === "projects"
      )?.data;
      if (portfolioSectionData) {
        setProjectsData(portfolioSectionData || []);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-project-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("project update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status project: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }
  }, [isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: customization.animationSpeed,
      },
    },
  };

  const projectVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        duration: customization.animationSpeed,
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: customization.animationSpeed,
      },
    },
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

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 w-full bg-black overflow-hidden min-h-screen text-white"
    >
      <style>{customCSS}</style>
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
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
      <div className="container relative mx-auto max-w-6xl px-4">
        <SectionHeader
          sectionName="projects"
          sectionTitle={sectionTitle}
          sectionDescription={sectionDescription}
          titleColor={titleColor}
        />

        {/* Visual Editor Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setVisualEditorOpen(true)}
            style={{
              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
            }}
            className={`flex items-center gap-2 px-4 py-2  text-white rounded-lg transition-colors`}
          >
            <Settings className="h-4 w-4" />
            Visual Editor
          </button>
        </div>

        {/* Projects Grid */}
        {Array.isArray(projectsData) && projectsData.length > 0 ? (
          <motion.div
            className={getLayoutClasses()}
            style={getLayoutStyle()}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {projectsData.map((project, index) => (
              <motion.div
                key={index}
                variants={projectVariants}
                className={getCardClasses()}
                style={getCardStyle()}
              >
                <div
                  className={
                    customization.layout === "grid"
                      ? "flex flex-col items-center"
                      : customization.imagePosition === "right"
                      ? "flex flex-col md:flex-row-reverse items-center"
                      : "flex flex-col md:flex-row items-center"
                  }
                >
                  {/* Project Image */}
                  <div
                    className={
                      customization.layout === "grid"
                        ? "w-full"
                        : "w-full md:w-2/5 relative"
                    }
                  >
                    <div className="relative overflow-hidden m-4">
                      <motion.img
                        src={project?.projectImage}
                        alt={`${project?.projectTitle} project screenshot`}
                        className="w-full section-image object-cover"
                        style={getImageStyle()}
                        initial="rest"
                        whileHover="hover"
                        variants={imageVariants}
                      />
                      {customization.imageOverlay && (
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-lg z-0"
                          style={{ backgroundColor: `${titleColor}35` }}
                          initial={{ opacity: 0.5, scale: 1 }}
                          whileHover={{ opacity: 0.8, scale: 1.3 }}
                          transition={{
                            duration: customization.animationSpeed,
                          }}
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-3 flex justify-center gap-3">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          href={project?.githubLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={getButtonClasses("github")}
                          style={getButtonStyle("github")}
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          href={project?.liveLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={getButtonClasses("live")}
                          style={getButtonStyle("live")}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div
                    className={
                      customization.layout === "grid"
                        ? "w-full"
                        : "w-full md:w-3/5 p-5 md:p-6"
                    }
                  >
                    <div
                      className={`flex flex-wrap items-center ${
                        customization.titleAlignment === "center"
                          ? "justify-center"
                          : customization.titleAlignment === "right"
                          ? "justify-end"
                          : "justify-between"
                      } mb-3`}
                    >
                      <h3
                        className={`text-xl section-sub-title md:text-2xl font-bold text-white transition-colors duration-300 ${getTitleAlignment()}`}
                        style={{ color: titleColor }}
                      >
                        {project?.projectName}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1 md:mt-0">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project?.year}
                      </div>
                    </div>

                    <p
                      className={`section-sub-description text-gray-300 mb-4 ${getTitleAlignment()}`}
                    >
                      {project?.projectDescription}
                    </p>

                    <div className={getTitleAlignment()}>
                      <h4 className="flex items-center gap-2 font-semibold mb-2">
                        <Code2 className="h-4 w-4" />
                        Tech Stack
                      </h4>
                      <div
                        className={`flex flex-wrap gap-2 ${
                          customization.titleAlignment === "center"
                            ? "justify-center"
                            : customization.titleAlignment === "right"
                            ? "justify-end"
                            : ""
                        }`}
                      >
                        {project?.techStack?.map(
                          (tech: Technology, idx: number) => (
                            <motion.span
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              className={getTechStackClasses()}
                              style={{
                                borderColor:
                                  customization.techStackStyle === "colorful"
                                    ? titleColor
                                    : `${titleColor}30`,
                                backgroundColor:
                                  customization.techStackStyle === "colorful"
                                    ? `${titleColor}20`
                                    : undefined,
                              }}
                            >
                              <img
                                src={
                                  tech.logo ||
                                  `https://placehold.co/100x100?text=${tech.name}&font=montserrat&fontsize=18`
                                }
                                alt={tech.name}
                                className="h-4 w-4 inline-block mr-1"
                              />
                              {tech.name}
                            </motion.span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            No projects found. Add some projects to see them here.
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
              {["layout", "styling", "timing"].map((tab) => (
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
                    <Layout className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab === "styling" && (
                    <Palette className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab === "timing" && (
                    <Move className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-6">
              {activeTab === "layout" && (
                <>
                  <LayoutSelector
                    value={customization.layout}
                    onChange={(value) =>
                      setCustomization((prev) => ({ ...prev, layout: value }))
                    }
                    gridColumns={customization.gridColumns}
                    onGridColumnsChange={(cols) =>
                      setCustomization((prev) => ({
                        ...prev,
                        gridColumns: cols,
                      }))
                    }
                  />

                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                      Card Spacing: {customization.cardSpacing}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={64}
                      step={4}
                      value={customization.cardSpacing}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          cardSpacing: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${
                          ColorTheme.primary
                        } 0%, ${ColorTheme.primary} ${
                          (customization.cardSpacing / 64) * 100
                        }%, #3f3f46 ${
                          (customization.cardSpacing / 64) * 100
                        }%, #3f3f46 100%)`,
                      }}
                    />
                  </div>

                  <AlignmentSelector
                    value={customization.titleAlignment}
                    onChange={(value) =>
                      setCustomization((prev) => ({
                        ...prev,
                        titleAlignment: value,
                      }))
                    }
                  />

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Image Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "left", label: "Left Side" },
                        { value: "right", label: "Right Side" },
                      ].map(({ value, label }) => (
                        <div
                          key={value}
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              imagePosition: value as any,
                            }))
                          }
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                            customization.imagePosition === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                          <div
                            className={`flex items-center gap-2 ${
                              value === "right" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="w-6 h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-1 bg-gray-400 rounded"></div>
                              <div className="h-1 bg-gray-500 rounded w-3/4"></div>
                            </div>
                          </div>
                          <div className="text-center text-xs text-white mt-2">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "styling" && (
                <>
                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                      Card Border Radius: {customization.cardBorderRadius}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={2}
                      value={customization.cardBorderRadius}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          cardBorderRadius: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${
                          ColorTheme.primary
                        } 0%, ${ColorTheme.primary} ${
                          (customization.cardBorderRadius / 24) * 100
                        }%, #3f3f46 ${
                          (customization.cardBorderRadius / 24) * 100
                        }%, #3f3f46 100%)`,
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                      Image Border Radius: {customization.imageBorderRadius}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={2}
                      value={customization.imageBorderRadius}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          imageBorderRadius: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${
                          ColorTheme.primary
                        } 0%, ${ColorTheme.primary} ${
                          (customization.imageBorderRadius / 24) * 100
                        }%, #3f3f46 ${
                          (customization.imageBorderRadius / 24) * 100
                        }%, #3f3f46 100%)`,
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
                      max={12}
                      step={2}
                      value={customization.cardPadding}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          cardPadding: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${
                          ColorTheme.primary
                        } 0%, ${ColorTheme.primary} ${
                          (customization.cardPadding / 12) * 100
                        }%, #3f3f46 ${
                          (customization.cardPadding / 12) * 100
                        }%, #3f3f46 100%)`,
                      }}
                    />
                  </div>

                  <ButtonStyleSelector
                    value={customization.githubButtonStyle}
                    onChange={(value) =>
                      setCustomization((prev) => ({
                        ...prev,
                        githubButtonStyle: value,
                      }))
                    }
                    label="GitHub Button Style"
                  />

                  <ButtonStyleSelector
                    value={customization.liveButtonStyle}
                    onChange={(value) =>
                      setCustomization((prev) => ({
                        ...prev,
                        liveButtonStyle: value,
                      }))
                    }
                    label="Live Demo Button Style"
                  />

                  {(customization.githubButtonStyle === "default" || customization.githubButtonStyle === "filled" || 
                    customization.liveButtonStyle === "default" || customization.liveButtonStyle === "filled") && (
                    <div className="mb-4">
                      <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                        Button Border Radius: {customization.buttonBorderRadius}px
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={24}
                        step={2}
                        value={customization.buttonBorderRadius}
                        onChange={(e) =>
                          setCustomization((prev) => ({
                            ...prev,
                            buttonBorderRadius: Number(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, ${
                            ColorTheme.primary
                          } 0%, ${ColorTheme.primary} ${
                            (customization.buttonBorderRadius / 24) * 100
                          }%, #3f3f46 ${
                            (customization.buttonBorderRadius / 24) * 100
                          }%, #3f3f46 100%)`,
                        }}
                      />
                    </div>
                  )}

                  <TechStackStyleSelector
                    value={customization.techStackStyle}
                    onChange={(value) =>
                      setCustomization((prev) => ({
                        ...prev,
                        techStackStyle: value,
                      }))
                    }
                  />
                </>
              )}

              {activeTab === "timing" && (
                <>

                  <AspectRatioSelector
                    value={customization.imageAspectRatio}
                    onChange={(value) =>
                      setCustomization((prev) => ({
                        ...prev,
                        imageAspectRatio: value,
                      }))
                    }
                    imageHeight={customization.imageHeight}
                    onImageHeightChange={(height) =>
                      setCustomization((prev) => ({
                        ...prev,
                        imageHeight: height,
                      }))
                    }
                  />


                </>
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
      </div>
    </section>
  );
};

export default Projects;

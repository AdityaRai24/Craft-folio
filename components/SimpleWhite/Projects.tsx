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
  Type,
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
import MagicWrite from "@/components/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";
import toast from "react-hot-toast";
import { defaultSimpleWhiteProjectsStyles } from "./defaultStyles/projects";
import { SimpleWhiteProjectsCustomizationState } from "./defaultStyles/types";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization, updateSection } from "@/app/actions/portfolio";

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

        {/* Grid Columns Selection */}
        {value === "grid" && (
          <div>
            <label className="block text-white text-left font-medium mb-3">
              Grid Columns
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[2, 3].map((cols) => (
                <div
                  key={cols}
                  onClick={() => onGridColumnsChange(cols)}
                  className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                    gridColumns === cols
                      ? "border-white bg-zinc-700"
                      : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                  }`}
                >
                  <div className={`grid gap-1 mb-2 ${
                    cols === 2 ? "grid-cols-2" : "grid-cols-3"
                  }`}>
                    {Array.from({ length: cols }, (_, i) => (
                      <div
                        key={i}
                        className="h-4 rounded"
                        style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-center text-xs text-white">{cols} Columns</div>
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

// Visual Button Style Selector Component
const ButtonStyleSelector: React.FC<{
  value: "default" | "filled" | "ghost" | "minimal";
  onChange: (value: "default" | "filled" | "ghost" | "minimal") => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const styles = [
    { value: "default", label: "Default", style: "border border-gray-300 text-gray-700" },
    { value: "filled", label: "Filled", style: "bg-gray-900 text-white" },
    { value: "ghost", label: "Ghost", style: "text-gray-700 hover:bg-gray-100" },
    { value: "minimal", label: "Minimal", style: "text-gray-600 underline" },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(({ value: styleValue, label: styleLabel, style }) => (
          <div
            key={styleValue}
            onClick={() => onChange(styleValue as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === styleValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div className={`px-3 py-1 text-xs rounded transition-all ${style}`}>
                Button
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
    { value: "auto", label: "Auto", icon: <RectangleHorizontal className="h-4 w-4" /> },
    { value: "square", label: "Square", icon: <Square className="h-4 w-4" /> },
    { value: "wide", label: "Wide", icon: <RectangleHorizontal className="h-4 w-4" /> },
    { value: "tall", label: "Tall", icon: <RectangleVertical className="h-4 w-4" /> },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        Image Aspect Ratio
      </label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ratios.map(({ value: ratioValue, label, icon }) => (
          <div
            key={ratioValue}
            onClick={() => onChange(ratioValue as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === ratioValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2 text-white">{icon}</div>
            <div className="text-center text-xs text-white">{label}</div>
          </div>
        ))}
      </div>

      {value === "auto" && (
        <div>
          <label className="block text-white text-left font-medium mb-3">
            Custom Height: {imageHeight}px
          </label>
          <input
            type="range"
            min="150"
            max="400"
            value={imageHeight}
            onChange={(e) => onImageHeightChange(Number(e.target.value))}
            className="w-full slider"
              style={{ accentColor: ColorTheme.primary }}
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
    { value: "pills", label: "Pills", style: "rounded-full border border-gray-300 text-gray-700" },
    { value: "badges", label: "Badges", style: "rounded bg-gray-200 text-gray-800" },
    { value: "minimal", label: "Minimal", style: "text-gray-600" },
    { value: "colorful", label: "Colorful", style: "rounded-full border-2 text-white" },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        Tech Stack Style
      </label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(({ value: styleValue, label, style }) => (
          <div
            key={styleValue}
            onClick={() => onChange(styleValue as any)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === styleValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div className={`px-2 py-1 text-xs ${style}`}>
                React
              </div>
            </div>
            <div className="text-center text-xs text-white">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Projects: React.FC = ({ currentPortTheme }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];



  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "effects"
  >("layout");

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Main customization state (from DB or default)
  const [customization, setCustomization] = useState<SimpleWhiteProjectsCustomizationState>(defaultSimpleWhiteProjectsStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<SimpleWhiteProjectsCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load projects data from portfolio
  useEffect(() => {
    if (portfolioData) {
      const portfolioSectionData = portfolioData.find(
        (section: any) => section.type === "projects"
      )?.data;
      if (portfolioSectionData) {
        setProjects(portfolioSectionData || []);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "projects",
        });
        if (result.success && result.data) {
          setCustomization(result.data as unknown as SimpleWhiteProjectsCustomizationState);
        } else {
          setCustomization(defaultSimpleWhiteProjectsStyles);
        }
      } catch (error) {
        setCustomization(defaultSimpleWhiteProjectsStyles);
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
  const updateDraftCustomization = (key: keyof SimpleWhiteProjectsCustomizationState, value: any) => {
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
        componentType: "projects",
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
        componentType: "projects",
      });
      setCustomization(defaultSimpleWhiteProjectsStyles);
      setDraftCustomization(defaultSimpleWhiteProjectsStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
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

  const handleProjectDescriptionUpdate = async (projectIndex: number, newDescription: string) => {
    try {
      // Update the projects data with the new description
      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        projectDescription: newDescription
      };
      setProjects(updatedProjects);
      
      // Save to database
      const result = await updateSection({
        sectionName: "projects",
        portfolioId,
        sectionContent: updatedProjects,
        sectionTitle: "Projects",
        sectionDescription: "Projects section"
      });
      
      if (result.success) {
        toast.success("Project description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving project description:", error);
      toast.error("Failed to save changes to database");
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
  const getLayoutClasses = () => {
    if (effectiveCustomization.layout === "grid") {
      return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${effectiveCustomization.gridColumns} gap-${effectiveCustomization.cardSpacing}`;
    }
    return "space-y-8";
  };

  const getLayoutStyle = () => {
    return {
      gap: `${effectiveCustomization.cardSpacing * 4}px`,
    };
  };

  const getCardClasses = () => {
    let classes = `${effectiveCustomization.cardBackground} section-card border ${
      effectiveCustomization.cardBorder
    } overflow-hidden transition-all duration-${Math.round(
      effectiveCustomization.animationSpeed * 1000
    )} cursor-pointer z-0 hover:bg-gray-50`;

    return classes;
  };

  const getCardStyle = () => ({
    borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
    padding: `${effectiveCustomization.cardPadding * 4}px`,
  });

  const getImageStyle = () => {
    let aspectRatio = "auto";

    switch (effectiveCustomization.imageAspectRatio) {
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
      borderRadius: `${effectiveCustomization.imageBorderRadius}px`,
      height:
        effectiveCustomization.imageAspectRatio === "auto"
          ? `${effectiveCustomization.imageHeight}px`
          : "auto",
      aspectRatio:
        effectiveCustomization.imageAspectRatio !== "auto" ? aspectRatio : undefined,
    };
  };

  const getButtonClasses = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? effectiveCustomization.githubButtonStyle
        : effectiveCustomization.liveButtonStyle;
    let classes =
      "flex items-center gap-2 px-3 py-1.5 transition-all duration-300 text-sm";

    switch (style) {
      case "filled":
        classes += " text-white";
        break;
      case "ghost":
        classes += " bg-transparent hover:bg-gray-100";
        break;
      case "minimal":
        classes += " bg-transparent border-0 underline hover:underline";
        break;
      default:
        classes += " bg-transparent border rounded-md hover:text-gray-700";
    }

    return classes;
  };

  const getButtonStyle = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? effectiveCustomization.githubButtonStyle
        : effectiveCustomization.liveButtonStyle;

    return {
      borderRadius: `${effectiveCustomization.buttonBorderRadius}px`,
      borderColor: style !== "minimal" ? textSecondaryColor : "transparent",
      color: style === "filled" ? "white" : textPrimaryColor,
      backgroundColor: style === "filled" ? primaryColor : "transparent",
    };
  };

  const getTechStackClasses = () => {
    let classes =
      "px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300";

    switch (effectiveCustomization.techStackStyle) {
      case "badges":
        classes += " rounded";
        break;
      case "minimal":
        classes += "";
        break;
      case "colorful":
        classes += " text-white rounded-full border-2";
        break;
      default:
        classes += " rounded-full border";
    }

    return classes;
  };

  const getTechStackStyle = () => {
    switch (effectiveCustomization.techStackStyle) {
      case "badges":
        return {
          backgroundColor: backgroundSecondaryColor,
          color: textPrimaryColor,
        };
      case "minimal":
        return {
          color: textSecondaryColor,
        };
      case "colorful":
        return {
          backgroundColor: primaryColor,
          color: "white",
          borderColor: primaryColor,
        };
      default:
        return {
          color: textSecondaryColor,
          borderColor: `${textSecondaryColor}30`,
        };
    }
  };

  const getTitleAlignment = () => {
    switch (effectiveCustomization.titleAlignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const getTitleClasses = () => {
    const sizeMap = {
      sm: "text-lg md:text-xl",
      md: "text-xl md:text-2xl",
      lg: "text-2xl md:text-3xl",
      xl: "text-3xl md:text-4xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return `section-sub-title ${sizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} transition-colors duration-300`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
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

    return `section-sub-description ${sizeMap[effectiveCustomization.descriptionSize]} ${weightMap[effectiveCustomization.descriptionWeight]}`;
  };

  useEffect(() => {
    if (portfolioData) {
      const portfolioSectionData = portfolioData.find(
        (section: any) => section.type === "projects"
      )?.data;
      if (portfolioSectionData) {
        setProjects(portfolioSectionData || []);
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
          // console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const projectVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: effectiveCustomization.animationSpeed,
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: effectiveCustomization.animationSpeed,
      },
    },
  };

  if (isLoading) {
    return (
      <section className="py-24 w-full overflow-hidden min-h-screen text-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center h-64">Loading...</div>
        </div>
      </section>
    );
  }

  // Theme color variables
  const primaryColor = theme?.colors?.primary || "#2563EB";
  const primaryHoverColor = theme?.colors?.primaryHover || "#1D4ED8";
  const accentColor = theme?.colors?.accent || "#3B82F6";
  const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
  const textSecondaryColor = theme?.colors?.text?.secondary || "#6B7280";
  const backgroundPrimaryColor = theme?.colors?.background?.primary || "#FFFFFF";
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || "#F8FAFC";
  const mutedColor = theme?.colors?.states?.muted || "rgba(59, 130, 246, 0.1)";

  return (
    <section
      id="projects"
      className="py-12 sm:py-16 md:py-20 lg:py-24 w-full bg-white overflow-hidden min-h-screen text-gray-900"
    >
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
          z-index: 10;
          position: relative;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
          z-index: 10;
          position: relative;
        }
      `}</style>
      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <SectionHeader
          sectionName="projects"
          headerVisible={effectiveCustomization.headerVisible}
          titleSize={effectiveCustomization.titleSize}
          titleWeight={effectiveCustomization.titleWeight}
          titleColor={effectiveCustomization.titleColor}
          titleAlignment={effectiveCustomization.titleAlignment}
          descriptionSize={effectiveCustomization.descriptionSize}
          descriptionColor={effectiveCustomization.descriptionColor}
          descriptionVisible={effectiveCustomization.descriptionVisible}
          title={portfolioData?.find((section: any) => section.type === "projects")?.sectionTitle || "My Projects"}
          description={portfolioData?.find((section: any) => section.type === "projects")?.sectionDescription || "Some cool things that I have worked on."}
          onVisualEditorClick={openVisualEditor}
          headerClasses={{
            container: "text-center mb-12 sm:mb-16 md:mb-20",
            title: "font-display section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4 transition-all duration-700",
            description: "font-sans text-base sm:text-lg section-description md:text-xl font-normal text-gray-600 tracking-normal leading-relaxed max-w-2xl mx-auto transition-all duration-700"
          }}
          currentPortTheme={currentPortTheme}
        />

        {/* Projects Grid */}
        {Array.isArray(projects) && projects.length > 0 ? (
          <motion.div
            className={getLayoutClasses()}
            style={getLayoutStyle()}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project: Project, index: number) => (
              <motion.div
                key={index}
                variants={projectVariants}
                className={getCardClasses()}
                style={getCardStyle()}
              >
                <div
                  className={
                    effectiveCustomization.layout === "grid"
                      ? "flex flex-col items-center"
                      : effectiveCustomization.imagePosition === "right"
                      ? "flex flex-col md:flex-row-reverse items-center"
                      : "flex flex-col md:flex-row items-center"
                  }
                >
                  {/* Project Image */}
                  {effectiveCustomization.showImages && (
                    <div
                      className={
                        effectiveCustomization.layout === "grid"
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
                        {effectiveCustomization.imageOverlay && (
                          <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-lg z-0"
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                            initial={{ opacity: 0.5, scale: 1 }}
                            whileHover={{ opacity: 0.8, scale: 1.3 }}
                            transition={{
                              duration: effectiveCustomization.animationSpeed,
                            }}
                          />
                        )}
                      </div>

                      {/* Action Buttons */}
                      {effectiveCustomization.linksVisible && (
                        <div className="p-3 flex justify-center gap-3">
                          {effectiveCustomization.githubLinkVisible && (
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
                          )}
                          {effectiveCustomization.liveLinkVisible && (
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
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Project Details */}
                  <div
                    className={
                      effectiveCustomization.layout === "grid"
                        ? "w-full"
                        : "w-full md:w-3/5 p-5 md:p-6"
                    }
                  >
                    <div
                      className={`flex flex-wrap items-center ${
                        effectiveCustomization.titleAlignment === "center"
                          ? "justify-center"
                          : effectiveCustomization.titleAlignment === "right"
                          ? "justify-end"
                          : "justify-between"
                      } mb-3`}
                    >
                      <h3
                        className={`${getTitleClasses()} ${getTitleAlignment()}`}
                        style={{ color: textPrimaryColor }}
                      >
                        {project?.projectName}
                      </h3>
                      <div className="flex items-center text-sm mt-1 md:mt-0" style={{ color: textSecondaryColor }}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {project?.year}
                      </div>
                    </div>

                    <div className={`relative ${getTitleAlignment()}`}>
                      <p
                        className={`${getDescriptionClasses()} mb-4`}
                        style={{ color: textSecondaryColor }}
                      >
                        {project?.projectDescription}
                      </p>
                      <div className="absolute -top-1 -right-1 z-10">
                        <MagicWrite
                          onMagicWrite={async (prompt: string, context?: string) => {
                            const enhancedDescription = await handleMagicWrite(prompt, project?.projectDescription || "");
                            handleProjectDescriptionUpdate(index, enhancedDescription);
                            return enhancedDescription;
                          }}
                          placeholder="Enhance this project description..."
                          buttonText=""
                          context={project?.projectDescription || ""}
                          className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110"
                        />
                      </div>
                    </div>

                    {effectiveCustomization.techStackVisible && project?.techStack && (
                      <div className={getTitleAlignment()}>
                        <h4 className="flex items-center gap-2 font-semibold mb-2">
                          <Code2 className="h-4 w-4" />
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, tagIndex) => (
                            <motion.span
                              key={tagIndex}
                              className={getTechStackClasses()}
                              style={getTechStackStyle()}
                              whileHover={effectiveCustomization.hoverEffects ? { scale: 1.05 } : {}}
                              whileTap={effectiveCustomization.hoverEffects ? { scale: 0.95 } : {}}
                            >
                              {tech.name}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found.</p>
          </div>
        )}
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
              {["layout", "typography", "styling", "effects"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${
                    activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                  style={{
                    background: activeTab === tab ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                  }}
              >
                {tab === "layout" && <Layout className="h-4 w-4 mx-auto mb-1" />}
                {tab === "typography" && <Type className="h-4 w-4 mx-auto mb-1" />}
                {tab === "styling" && <Palette className="h-4 w-4 mx-auto mb-1" />}
                {tab === "effects" && <Move className="h-4 w-4 mx-auto mb-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {activeTab === "layout" && (
              <div className="space-y-4">
                <LayoutSelector
                  value={draftCustomization?.layout ?? customization.layout}
                  onChange={value => updateDraftCustomization("layout", value)}
                  gridColumns={draftCustomization?.gridColumns ?? customization.gridColumns}
                  onGridColumnsChange={value => updateDraftCustomization("gridColumns", value)}
                />

                {(draftCustomization?.layout ?? customization.layout) === "single" && (
                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Image Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "left", label: "Left", icon: "←" },
                        { value: "right", label: "Right", icon: "→" },
                      ].map(({ value, label, icon }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("imagePosition", value)}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                            (draftCustomization?.imagePosition ?? customization.imagePosition) === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                          <div className="text-2xl text-white">{icon}</div>
                          <div className="space-y-1 w-full">
                            <div
                              className={`h-1 bg-gradient-to-r rounded ${
                                value === "left"
                                  ? "mr-auto w-3/4"
                                  : "ml-auto w-3/4"
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryHoverColor})`,
                              }}
                            ></div>
                            <div
                              className={`h-1 bg-gray-400 rounded ${
                                value === "left"
                                  ? "mr-auto w-full"
                                  : "ml-auto w-full"
                              }`}
                            ></div>
                          </div>
                          <div className="text-xs text-white">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <AlignmentSelector
                  value={draftCustomization?.titleAlignment ?? customization.titleAlignment}
                  onChange={value => updateDraftCustomization("titleAlignment", value)}
                />
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Title Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "sm", label: "Small", size: "24px" },
                      { value: "md", label: "Medium", size: "32px" },
                      { value: "lg", label: "Large", size: "40px" },
                      { value: "xl", label: "Extra Large", size: "52px" },
                    ].map(({ value, label, size }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("titleSize", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.titleSize ?? customization.titleSize) === value
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
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

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
                
                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Description Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "sm", label: "Small", size: "14px" },
                        { value: "md", label: "Medium", size: "16px" },
                        { value: "lg", label: "Large", size: "18px" },
                      ].map(({ value, label, size }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("descriptionSize", value)}
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.descriptionSize ?? customization.descriptionSize) === value
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
                          <div className="text-center text-xs text-white">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "styling" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Card Border Radius: {draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={2}
                    value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                    onChange={e => updateDraftCustomization("cardBorderRadius", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                                          style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${((draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius) / 24) * 100}%, #3f3f46 ${((draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius) / 24) * 100}%, #3f3f46 100%)`,
                      }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Image Border Radius: {draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={2}
                    value={draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius}
                    onChange={e => updateDraftCustomization("imageBorderRadius", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                                          style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${((draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius) / 24) * 100}%, #3f3f46 ${((draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius) / 24) * 100}%, #3f3f46 100%)`,
                      }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Card Padding: {draftCustomization?.cardPadding ?? customization.cardPadding}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={2}
                    value={draftCustomization?.cardPadding ?? customization.cardPadding}
                    onChange={e => updateDraftCustomization("cardPadding", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                                          style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${((draftCustomization?.cardPadding ?? customization.cardPadding) / 12) * 100}%, #3f3f46 ${((draftCustomization?.cardPadding ?? customization.cardPadding) / 12) * 100}%, #3f3f46 100%)`,
                      }}
                  />
                </div>

                <AspectRatioSelector
                  value={draftCustomization?.imageAspectRatio ?? customization.imageAspectRatio}
                  onChange={value => updateDraftCustomization("imageAspectRatio", value)}
                  imageHeight={draftCustomization?.imageHeight ?? customization.imageHeight}
                  onImageHeightChange={value => updateDraftCustomization("imageHeight", value)}
                />

                <TechStackStyleSelector
                  value={draftCustomization?.techStackStyle ?? customization.techStackStyle}
                  onChange={value => updateDraftCustomization("techStackStyle", value)}
                />

                <ButtonStyleSelector
                  value={draftCustomization?.githubButtonStyle ?? customization.githubButtonStyle}
                  onChange={value => updateDraftCustomization("githubButtonStyle", value)}
                  label="GitHub Button Style"
                />

                <ButtonStyleSelector
                  value={draftCustomization?.liveButtonStyle ?? customization.liveButtonStyle}
                  onChange={value => updateDraftCustomization("liveButtonStyle", value)}
                  label="Live Demo Button Style"
                />

                {(draftCustomization?.githubButtonStyle === "default" || draftCustomization?.githubButtonStyle === "filled" || 
                  draftCustomization?.liveButtonStyle === "default" || draftCustomization?.liveButtonStyle === "filled") && (
                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                      Button Border Radius: {draftCustomization?.buttonBorderRadius ?? customization.buttonBorderRadius}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={2}
                      value={draftCustomization?.buttonBorderRadius ?? customization.buttonBorderRadius}
                      onChange={e => updateDraftCustomization("buttonBorderRadius", Number(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${((draftCustomization?.buttonBorderRadius ?? customization.buttonBorderRadius) / 24) * 100}%, #3f3f46 ${((draftCustomization?.buttonBorderRadius ?? customization.buttonBorderRadius) / 24) * 100}%, #3f3f46 100%)`,
                      }}
                    />
                  </div>
                )}
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

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Image Overlay</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.imageOverlay ?? customization.imageOverlay}
                        onChange={(e) => updateDraftCustomization("imageOverlay", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.imageOverlay ?? customization.imageOverlay) ? ColorTheme.primary : "",
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

      {/* Overlay for floating window */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}
    </section>
  );
};

export default Projects;
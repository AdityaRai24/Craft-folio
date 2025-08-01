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
import toast from "react-hot-toast";
import { defaultProjectsStyles } from "./defaultStyles/projects";
import { ProjectsCustomizationState } from "./defaultStyles/types";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization } from "@/app/actions/portfolio";

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



const Projects: React.FC = ({ currentPortTheme, customCSS }: any) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();



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

  // Use defaultProjectsStyles for initial state
  const [customization, setCustomization] = useState<ProjectsCustomizationState>(defaultProjectsStyles);
  const [draftCustomization, setDraftCustomization] = useState<ProjectsCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;


  
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

  

  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "project",
        });
        if (result.success && result.data) {
          setCustomization(result.data as any);
        } else {
          setCustomization(defaultProjectsStyles);
        }
      } catch (error) {
        setCustomization(defaultProjectsStyles);
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
  const updateDraftCustomization = (key: keyof ProjectsCustomizationState, value: any) => {
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
        componentType: "project",
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
        componentType: "project",
      });
      setCustomization(defaultProjectsStyles);
      setDraftCustomization(defaultProjectsStyles);
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

  // Helper functions for styling - update all to use effectiveCustomization
  const getLayoutClasses = () => {
    switch (effectiveCustomization.layout) {
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${effectiveCustomization.gridColumns}`;
      default:
        return `flex flex-col`;
    }
  };

  const getLayoutStyle = () => {
    switch (effectiveCustomization.layout) {
      case "grid":
        return { gap: `${effectiveCustomization.cardSpacing}px` };
      default:
        return { gap: `${effectiveCustomization.cardSpacing}px` };
    }
  };

  const getCardClasses = () => {
    let classes = `${effectiveCustomization.cardBackground} section-card border ${
      effectiveCustomization.cardBorder
    } overflow-hidden transition-all duration-${Math.round(
      effectiveCustomization.animationSpeed * 1000
    )} cursor-pointer hover:bg-zinc-900/80`;

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
        ? effectiveCustomization.githubButtonStyle
        : effectiveCustomization.liveButtonStyle;

    return {
      borderRadius: `${effectiveCustomization.buttonBorderRadius}px`,
      borderColor: style !== "minimal" ? `${titleColor}30` : "transparent",
      color: style === "filled" ? "white" : titleColor,
      backgroundColor: style === "filled" ? titleColor : "transparent",
    };
  };

  const getTechStackClasses = () => {
    let classes =
      "px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300";

    switch (effectiveCustomization.techStackStyle) {
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
    switch (effectiveCustomization.titleAlignment) {
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
        staggerChildren: effectiveCustomization.animationSpeed,
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
          onVisualEditorOpen={openVisualEditor}
        />

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
                    effectiveCustomization.layout === "grid"
                      ? "flex flex-col items-center"
                      : effectiveCustomization.imagePosition === "right"
                      ? "flex flex-col md:flex-row-reverse items-center"
                      : "flex flex-col md:flex-row items-center"
                  }
                >
                  {/* Project Image */}
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
                          style={{ backgroundColor: `${titleColor}35` }}
                          initial={{ opacity: 0.5, scale: 1 }}
                          whileHover={{ opacity: 0.8, scale: 1.3 }}
                          transition={{
                            duration: effectiveCustomization.animationSpeed,
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
                          effectiveCustomization.titleAlignment === "center"
                            ? "justify-center"
                            : effectiveCustomization.titleAlignment === "right"
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
                                  effectiveCustomization.techStackStyle === "colorful"
                                    ? titleColor
                                    : `${titleColor}30`,
                                backgroundColor:
                                  effectiveCustomization.techStackStyle === "colorful"
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
                  {tab === "layout" && <Layout className="h-4 w-4 mx-auto mb-1" />}
                  {tab === "styling" && <Palette className="h-4 w-4 mx-auto mb-1" />}
                  {tab === "timing" && <Move className="h-4 w-4 mx-auto mb-1" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-6">
              {activeTab === "layout" && (
                <>
                  <LayoutSelector
                    value={draftCustomization?.layout ?? customization.layout}
                    onChange={value => updateDraftCustomization("layout", value)}
                    gridColumns={draftCustomization?.gridColumns ?? customization.gridColumns}
                    onGridColumnsChange={cols => updateDraftCustomization("gridColumns", cols)}
                  />

                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                      Card Spacing: {draftCustomization?.cardSpacing ?? customization.cardSpacing}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={64}
                      step={4}
                      value={draftCustomization?.cardSpacing ?? customization.cardSpacing}
                      onChange={e => updateDraftCustomization("cardSpacing", Number(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${((draftCustomization?.cardSpacing ?? customization.cardSpacing) / 64) * 100}%, #3f3f46 ${((draftCustomization?.cardSpacing ?? customization.cardSpacing) / 64) * 100}%, #3f3f46 100%)`,
                      }}
                    />
                  </div>

                  <AlignmentSelector
                    value={draftCustomization?.titleAlignment ?? customization.titleAlignment}
                    onChange={value => updateDraftCustomization("titleAlignment", value)}
                  />

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                      Image Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ value: "left", label: "Left Side" }, { value: "right", label: "Right Side" }].map(({ value, label }) => (
                        <div
                          key={value}
                          onClick={() => updateDraftCustomization("imagePosition", value)}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                            (draftCustomization?.imagePosition ?? customization.imagePosition) === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                          <div className={`flex items-center gap-2 ${value === "right" ? "flex-row-reverse" : ""}`}>
                            <div className="w-6 h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-1 bg-gray-400 rounded"></div>
                              <div className="h-1 bg-gray-500 rounded w-3/4"></div>
                            </div>
                          </div>
                          <div className="text-center text-xs text-white mt-2">{label}</div>
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

                  <TechStackStyleSelector
                    value={draftCustomization?.techStackStyle ?? customization.techStackStyle}
                    onChange={value => updateDraftCustomization("techStackStyle", value)}
                  />
                </>
              )}

              {activeTab === "timing" && (
                <>
                  <AspectRatioSelector
                    value={draftCustomization?.imageAspectRatio ?? customization.imageAspectRatio}
                    onChange={value => updateDraftCustomization("imageAspectRatio", value)}
                    imageHeight={draftCustomization?.imageHeight ?? customization.imageHeight}
                    onImageHeightChange={height => updateDraftCustomization("imageHeight", height)}
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
    </section>
  );
};

export default Projects;

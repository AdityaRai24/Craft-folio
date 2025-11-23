"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Github,
  ExternalLink, Settings,
  Palette,
  Layout, RotateCcw,
  X, Square,
  RectangleHorizontal,
  RectangleVertical, Type
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { motion, AnimatePresence } from "framer-motion";
import EditButton from "@/components/EditButton";
import { ColorTheme } from "@/lib/colorThemes";
import toast from "react-hot-toast";
import { defaultProjectsStyles } from "../NeoSpark/defaultStyles/projects";
import { ProjectsCustomizationState } from "../NeoSpark/defaultStyles/types";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization, updateSection } from "@/app/actions/portfolio";
import MagicWrite from "@/components/MagicWrite";

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
              {[2, 3].map((cols) => (
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
              background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${Math.max(0, Math.min(100, ((imageHeight - 150) / 150) * 100))}%, #3f3f46 ${Math.max(0, Math.min(100, ((imageHeight - 150) / 150) * 100))}%, #3f3f46 100%)`
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

const ProjectsGrid = ({
  currentPortTheme,
  customCSS,
  portfolioId,
  theme = "light",
}: {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId?: string;
  theme?: "light" | "dark";
}) => {
  const dispatch = useDispatch();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const { componentCustomizations } = useSelector((state: RootState) => state.data);
  
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [editingDescriptions, setEditingDescriptions] = useState<{ [key: number]: string }>({});

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

  const isDark = theme === "dark";

  useEffect(() => {
    if (portfolioData) {
      const data = portfolioData.find((item: any) => item.type === "projects")?.data || [];
      setProjectsData(data);
    }
  }, [portfolioData]);

  useEffect(() => {
    const loadCustomizations = async () => {
      if (!portfolioId) return;
      try {
        // First check if customizations exist in Redux state
        if (componentCustomizations && componentCustomizations["project"]) {
          setCustomization(componentCustomizations["project"] as ProjectsCustomizationState);
        } else {
          // Fallback to database
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "project",
          });
          if (result.success && result.data) {
            setCustomization(result.data as any);
            // Update Redux state
            dispatch(setComponentCustomizations({
              ...componentCustomizations,
              project: result.data
            }));
          } else {
            setCustomization(defaultProjectsStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultProjectsStyles);
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
  const updateDraftCustomization = (key: keyof ProjectsCustomizationState, value: any) => {
    if (!draftCustomization) return;
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  // When 'Done' is clicked, save draft to DB and update main state
  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    if(!portfolioId) return;
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "project",
        settings: draftCustomization,
      });
      if (result.success) {
        // Update Redux state
        dispatch(setComponentCustomizations({
          ...componentCustomizations,
          project: draftCustomization
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
    if(!portfolioId) return;    
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "project",
      });
      setCustomization(defaultProjectsStyles);
      setDraftCustomization(defaultProjectsStyles);
      setVisualEditorOpen(false);
      // Update Redux state
      const updatedCustomizations = { ...componentCustomizations };
      delete updatedCustomizations["project"];
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

  // Helper functions for styling
  const getLayoutClasses = () => {
    switch (effectiveCustomization.layout) {
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${effectiveCustomization.gridColumns}`;
      default:
        return `flex flex-col`;
    }
  };

  const getLayoutStyle = () => {
    return { gap: `${effectiveCustomization.cardSpacing}px` };
  };

  const getCardClasses = () => {
    // Determine background based on theme and customization
    let bgClass = "";
    if (effectiveCustomization.cardBackground === "bg-white") {
      bgClass = isDark ? "bg-gray-700" : "bg-white";
    } else if (effectiveCustomization.cardBackground === "bg-zinc-900") {
      bgClass = isDark ? "bg-gray-800" : "bg-zinc-900";
    } else {
      bgClass = effectiveCustomization.cardBackground;
    }

    let classes = `${bgClass} border ${
      isDark ? "border-gray-600" : "border-gray-200"
    } overflow-hidden transition-all duration-${Math.round(
      effectiveCustomization.animationSpeed * 1000
    )} cursor-pointer hover:shadow-lg hover:-translate-y-1`;

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
      "flex items-center justify-center gap-2 px-4 py-2.5 transition-all duration-300 text-sm font-medium";

    switch (style) {
      case "filled":
        classes += " text-white";
        break;
      case "ghost":
        classes += isDark ? " bg-transparent hover:bg-gray-700" : " bg-transparent hover:bg-gray-100";
        break;
      case "minimal":
        classes += " bg-transparent border-0 underline hover:no-underline";
        break;
      default:
        classes += isDark ? " bg-gray-700 hover:bg-gray-600 text-white" : " bg-gray-100 hover:bg-gray-200 text-gray-900";
    }

    return classes;
  };

  const getButtonStyle = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? effectiveCustomization.githubButtonStyle
        : effectiveCustomization.liveButtonStyle;

    const baseStyle = {
      borderRadius: `${effectiveCustomization.buttonBorderRadius}px`,
    };

    if (style === "filled") {
      return {
        ...baseStyle,
        backgroundColor: "#3b82f6", // Default blue, could be themed
      };
    }

    return baseStyle;
  };

  const getTechStackClasses = () => {
    let classes =
      "px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 flex items-center justify-center";

    switch (effectiveCustomization.techStackStyle) {
      case "badges":
        classes += isDark ? " bg-gray-600 text-white rounded" : " bg-gray-100 text-gray-800 rounded";
        break;
      case "minimal":
        classes += isDark ? " text-gray-300 hover:text-white" : " text-gray-600 hover:text-gray-900";
        break;
      case "colorful":
        classes += " text-white rounded-full border-2";
        break;
      default:
        classes += isDark ? " text-white rounded-full border border-gray-600 bg-gray-700" : " text-gray-800 rounded-full border border-gray-200 bg-gray-50";
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

    return `${sizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} ${isDark ? "text-white" : "text-gray-900"} mb-2 line-clamp-1`;
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

    return `${sizeMap[effectiveCustomization.descriptionSize]} ${weightMap[effectiveCustomization.descriptionWeight]} ${isDark ? "text-gray-300" : "text-gray-600"} mb-4 line-clamp-2 leading-relaxed`;
  };

  // MagicWrite handler for project descriptions
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this project description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
          context: context || "",
          section: "project-description"
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

  const handleDescriptionUpdate = async (projectIndex: number, newDescription: string) => {
    try {
      if(!portfolioId) return;
      const updatedProjects = [...projectsData];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        projectDescription: newDescription
      };
      setProjectsData(updatedProjects);
      
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
      toast.error("Failed to save changes");
    }
  };

  if (!projectsData || projectsData.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center p-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <p className="text-lg font-medium">No projects to display</p>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Add projects to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${isDark ? "bg-gray-800" : "bg-white"} overflow-y-auto relative`}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>Projects</h1>
            <p className={isDark ? "text-gray-400" : "text-gray-500"} style={{ fontSize: "0.875rem" }}>A collection of my recent work</p>
          </motion.div>
          
          <div className="flex gap-3">
            <EditButton sectionName="projects" />
            <button
              onClick={openVisualEditor}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isDark 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              <Settings size={16} />
              <span>Visual Editor</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={getLayoutClasses()} style={getLayoutStyle()}>
          {projectsData.map((project: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              {/* Project Card */}
              <div 
                className={getCardClasses()}
                style={getCardStyle()}
              >
                {/* Project Image/Illustration */}
                <div 
                  className={`relative ${isDark ? "bg-gradient-to-br from-gray-600 to-gray-700" : "bg-gradient-to-br from-gray-50 to-gray-100"} overflow-hidden`}
                  style={getImageStyle()}
                >
                  {project.projectImage ? (
                    <img
                      src={project.projectImage}
                      alt={project.projectName || project.projectTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-300 text-6xl">📁</div>
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Project Content */}
                <div className="mt-4">
                  {/* Project Title */}
                  <div className={getTitleAlignment()}>
                    <h3 className={getTitleClasses()}>
                      {project.projectTitle || project.projectName || `Project ${index + 1}`}
                    </h3>
                  </div>

                  {/* Project Description */}
                  <div className="relative group/desc">
                    <p className={getDescriptionClasses()}>
                      {project.projectDescription || "No description available"}
                    </p>
                    <div className="absolute top-0 right-0 opacity-0 group-hover/desc:opacity-100 transition-opacity">
                      <MagicWrite
                        onWrite={(prompt) => handleMagicWrite(prompt, project.projectDescription)}
                        onApply={(newDesc) => handleDescriptionUpdate(index, newDesc)}
                        originalText={project.projectDescription || ""}
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  {/* Tech Stack Icons */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mb-4 ${
                      effectiveCustomization.titleAlignment === "center" ? "justify-center" : 
                      effectiveCustomization.titleAlignment === "right" ? "justify-end" : "justify-start"
                    }`}>
                      {project.techStack.slice(0, 5).map((tech: any, techIndex: number) => (
                        <div
                          key={techIndex}
                          className={getTechStackClasses()}
                          title={tech.name}
                        >
                          {tech.logo ? (
                            <img
                              src={tech.logo}
                              alt={tech.name}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <span>{tech.name}</span>
                          )}
                        </div>
                      ))}
                      {project.techStack.length > 5 && (
                        <div className={getTechStackClasses()}>
                          <span>+{project.techStack.length - 5}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={`flex gap-2 ${
                    effectiveCustomization.titleAlignment === "center" ? "justify-center" : 
                    effectiveCustomization.titleAlignment === "right" ? "justify-end" : "justify-start"
                  }`}>
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getButtonClasses("live")} flex-1`}
                        style={getButtonStyle("live")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                        <span>Live</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getButtonClasses("github")} flex-1`}
                        style={getButtonStyle("github")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={14} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual Editor Floating Window */}
      <AnimatePresence>
        {visualEditorOpen && draftCustomization && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[9999] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700 overflow-hidden flex flex-col"
            style={{
              left: windowPosition.x,
              top: windowPosition.y,
              width: "400px",
              height: "600px",
            }}
          >
            {/* Window Header */}
            <div
              ref={dragRef}
              onMouseDown={handleMouseDown}
              className="h-10 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-4 cursor-move select-none"
            >
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-200">
                  Customize Projects
                </span>
              </div>
              <button
                onClick={() => setVisualEditorOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-700 bg-zinc-900">
              {[
                { id: "layout", icon: Layout, label: "Layout" },
                { id: "typography", icon: Type, label: "Type" },
                { id: "styling", icon: Palette, label: "Style" },
                { id: "timing", icon: RotateCcw, label: "Reset" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider transition-colors ${
                    activeTab === tab.id
                      ? "text-white bg-zinc-800 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-300 hover:bg-zinc-800/50"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {activeTab === "layout" && (
                <div className="space-y-6">
                  <LayoutSelector
                    value={draftCustomization.layout}
                    onChange={(val) => updateDraftCustomization("layout", val)}
                    gridColumns={draftCustomization.gridColumns}
                    onGridColumnsChange={(val) =>
                      updateDraftCustomization("gridColumns", val)
                    }
                  />

                  <AlignmentSelector
                    value={draftCustomization.titleAlignment}
                    onChange={(val) =>
                      updateDraftCustomization("titleAlignment", val)
                    }
                  />

                  <AspectRatioSelector
                    value={draftCustomization.imageAspectRatio}
                    onChange={(val) =>
                      updateDraftCustomization("imageAspectRatio", val)
                    }
                    imageHeight={draftCustomization.imageHeight}
                    onImageHeightChange={(val) =>
                      updateDraftCustomization("imageHeight", val)
                    }
                  />
                </div>
              )}

              {activeTab === "typography" && (
                <div className="space-y-6">
                  {/* Title Size */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Title Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["sm", "md", "lg", "xl"].map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            updateDraftCustomization("titleSize", size as any)
                          }
                          className={`py-2 rounded border transition-all ${
                            draftCustomization.titleSize === size
                              ? "bg-zinc-700 border-white text-white"
                              : "bg-zinc-800 border-gray-600 text-gray-400 hover:border-gray-400"
                          }`}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Weight */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Title Weight
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["normal", "medium", "semibold", "bold"].map((weight) => (
                        <button
                          key={weight}
                          onClick={() =>
                            updateDraftCustomization("titleWeight", weight as any)
                          }
                          className={`py-2 rounded border transition-all text-xs ${
                            draftCustomization.titleWeight === weight
                              ? "bg-zinc-700 border-white text-white"
                              : "bg-zinc-800 border-gray-600 text-gray-400 hover:border-gray-400"
                          }`}
                        >
                          {weight.charAt(0).toUpperCase() + weight.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description Size */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Description Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["sm", "md", "lg"].map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            updateDraftCustomization("descriptionSize", size as any)
                          }
                          className={`py-2 rounded border transition-all ${
                            draftCustomization.descriptionSize === size
                              ? "bg-zinc-700 border-white text-white"
                              : "bg-zinc-800 border-gray-600 text-gray-400 hover:border-gray-400"
                          }`}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "styling" && (
                <div className="space-y-6">
                  <TechStackStyleSelector
                    value={draftCustomization.techStackStyle}
                    onChange={(val) =>
                      updateDraftCustomization("techStackStyle", val)
                    }
                  />

                  <ButtonStyleSelector
                    label="Live Button Style"
                    value={draftCustomization.liveButtonStyle}
                    onChange={(val) =>
                      updateDraftCustomization("liveButtonStyle", val)
                    }
                  />

                  <ButtonStyleSelector
                    label="GitHub Button Style"
                    value={draftCustomization.githubButtonStyle}
                    onChange={(val) =>
                      updateDraftCustomization("githubButtonStyle", val)
                    }
                  />

                  {/* Card Border Radius */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Card Roundness: {draftCustomization.cardBorderRadius}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={draftCustomization.cardBorderRadius}
                      onChange={(e) =>
                        updateDraftCustomization(
                          "cardBorderRadius",
                          Number(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {activeTab === "timing" && (
                <div className="space-y-6">
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <h3 className="text-white font-medium mb-2">
                      Reset Customization
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Revert all changes to the default style.
                    </p>
                    <button
                      onClick={resetCustomization}
                      className="w-full py-2 bg-red-500/10 text-red-500 border border-red-500/50 rounded hover:bg-red-500/20 transition-colors"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-800 border-t border-zinc-700 flex justify-end gap-3">
              <button
                onClick={() => setVisualEditorOpen(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDraftCustomization}
                className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors shadow-lg shadow-blue-900/20"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsGrid;

import React, { useEffect, useState, useRef } from "react";
import {
  ExternalLink,
  Github,
  Calendar,
  Code,
  Star,
  ArrowUpRight,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Settings,
  Palette,
  Move,
  Grid3X3,
  RotateCcw,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns,
  Columns2,
  Columns3,
  Columns4,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton from '@/components/EditButton';
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
  // Layout & Structure
  gridColumns: number;
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
  
  // Badges & Tags
  yearBadge: boolean;
  yearBadgeStyle: "default" | "minimal" | "outlined" | "glow";
  
  // Links & Actions
  showLiveLink: boolean;
  showGithubLink: boolean;
  linkStyle: "default" | "minimal" | "outlined" | "glow";
}

const Projects = ({ currentTheme }: any) => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling">("layout");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);
  
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const projectsSection = portfolioData?.find(
    (item: any) => item.type === "projects"
  );
  const { theme } = useLumenFlowTheme();
  const sectionTitle = projectsSection?.sectionTitle || "Projects";
  const sectionDescription =
    projectsSection?.sectionDescription ||
    "Here are some of the projects I've worked on, showcasing my skills in full-stack development, UI/UX design, and problem-solving. Each project demonstrates different technologies and approaches to building scalable, user-friendly applications.";

  const themeClasses = getThemeClasses(currentTheme);
  
  // Get theme colors for LumenFlow
  const titleColor = theme === "light" ? "#f97316" : "#f97316"; // Orange color for LumenFlow

  // Default styles for Projects (current LumenFlow style)
  const defaultProjectStyles: CustomizationState = {
    gridColumns: 2,
    cardLayout: "default",
    cardBorderRadius: 16,
    cardPadding: 24,
    cardSpacing: 24,
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
    yearBadge: true,
    yearBadgeStyle: "default",
    showLiveLink: true,
    showGithubLink: true,
    linkStyle: "default",
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>(defaultProjectStyles);
  const [draftCustomization, setDraftCustomization] = useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "projects",
        });
        if (result.success && result.data) {
          setCustomization(result.data as any);
        } else {
          setCustomization(defaultProjectStyles);
        }
      } catch (error) {
        setCustomization(defaultProjectStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId]);

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
        componentType: "projects",
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
        componentType: "projects",
      });
      setCustomization(defaultProjectStyles);
      setDraftCustomization(defaultProjectStyles);
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

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Visual Editor Components
  const GridColumnsSelector: React.FC<{
    value: number;
    onChange: (value: number) => void;
  }> = ({ value, onChange }) => {
    return (
      <div>
        <label className="block text-white text-left font-medium mb-2">
          Grid Columns
        </label>
        <div className="flex gap-2">
          {[2, 3].map((cols) => (
            <div
              key={cols}
              onClick={() => onChange(cols)}
              className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                value === cols
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
    );
  };

  const CardStyleSelector: React.FC<{
    value: "default" | "minimal" | "glassmorphism" | "neon";
    onChange: (value: "default" | "minimal" | "glassmorphism" | "neon") => void;
  }> = ({ value, onChange }) => {
    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">Card Style</label>
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
          {label}: {value}{unit}
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
              background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`,
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
            background: ${ColorTheme.primary};
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
            background: ${ColorTheme.primary};
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
        <label className="block text-white text-left font-medium mb-3">Title Size</label>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map(({ value: size, label, size: sizeClass }) => (
            <div
              key={size}
              onClick={() => onChange(size as any)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                value === size
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
        <label className="block text-white text-left font-medium mb-3">Title Weight</label>
        <div className="grid grid-cols-2 gap-2">
          {weights.map(({ value: weight, label, weight: weightClass }) => (
            <div
              key={weight}
              onClick={() => onChange(weight as any)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                value === weight
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

  const displayedProjects = showAllProjects
    ? projectsData
    : projectsData.slice(0, 2);

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
    <div className="space-y-4 md:space-y-6 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto md:px-4">
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="projects"
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

      {/* Projects Grid */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-${effectiveCustomization.gridColumns} gap-${effectiveCustomization.cardSpacing / 4}`}
        style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
      >
        {displayedProjects.map((project, index) => (
          <div
            key={index}
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredProject(index)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{ 
                background: theme === "light"
                  ? "linear-gradient(to right, rgba(249,115,22,0.08), rgba(168,85,247,0.08))"
                  : themeClasses.gradientHover 
              }}
            ></div>

            {/* Main Card */}
            <div 
              className={`relative overflow-hidden transition-all duration-${effectiveCustomization.animationSpeed / 100} transform h-full flex flex-col ${
                theme === "light"
                  ? "bg-white text-gray-700 shadow-sm"
                  : "bg-transparent"
              }`}
              style={{
                borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                padding: `${effectiveCustomization.cardPadding}px`,
                transform: effectiveCustomization.hoverEffects && hoveredProject === index ? "translateY(-4px) scale(1.02)" : "none",
                filter: effectiveCustomization.glowEffect ? `drop-shadow(0 0 20px ${titleColor}30)` : "none",
                ...(effectiveCustomization.cardLayout === "minimal" && {
                  backgroundColor: "transparent",
                  borderWidth: "0px",
                  borderStyle: "none",
                  boxShadow: "none"
                }),
                ...(effectiveCustomization.cardLayout === "glassmorphism" && {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }),
                ...(effectiveCustomization.cardLayout === "neon" && {
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: titleColor,
                  boxShadow: `0 0 20px ${titleColor}50, inset 0 0 20px ${titleColor}10`
                }),
                ...(effectiveCustomization.cardLayout === "default" && {
                  backgroundColor: theme === "light" ? "white" : "transparent",
                  borderWidth: `${effectiveCustomization.borderWidth}px`,
                  borderStyle: "solid",
                  borderColor: theme === "light" ? "rgba(229, 231, 235, 0.5)" : "rgba(55, 65, 81, 0.5)"
                })
              }}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                {project.projectImage ? (
                  <>
                    <img
                      src={project.projectImage}
                      alt={project.projectName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 ${
                      theme === "light"
                        ? "bg-gradient-to-b from-gray-100/90 via-white/60 to-transparent"
                        : "bg-gradient-to-b from-gray-900/60 via-gray-900/30 to-transparent"
                    }`}></div>
                  </>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    theme === "light"
                      ? "bg-gradient-to-br from-gray-100 to-gray-200"
                      : "bg-gradient-to-br from-gray-700 to-gray-800"
                  }`}>
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Project Year Badge */}
                {effectiveCustomization.yearBadge && (
                  <div className="absolute bottom-4 left-4">
                    <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border backdrop-blur-md ${
                      theme === "light"
                        ? "bg-orange-500/10 border-orange-200 text-orange-700"
                        : "bg-black/40 border-white/10 text-white"
                    }`}>
                      <Calendar size={14} className="text-orange-400" />
                      <span className="text-sm font-medium">
                        {project.year}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600`}></div>
                                          <h3
                        className={`transition-colors duration-300 ${
                          theme === "light"
                            ? "text-gray-900 group-hover:text-orange-600"
                            : `${themeClasses.textPrimary} group-hover:${themeClasses.accent}`
                        } ${
                          effectiveCustomization.textAlignment === "center" 
                            ? "text-center" 
                            : effectiveCustomization.textAlignment === "right" 
                            ? "text-right" 
                            : "text-left"
                        } ${
                          effectiveCustomization.titleSize === "sm" ? "text-lg" :
                          effectiveCustomization.titleSize === "md" ? "text-xl" :
                          effectiveCustomization.titleSize === "lg" ? "text-2xl" :
                          "text-3xl"
                        } ${
                          effectiveCustomization.titleWeight === "normal" ? "font-normal" :
                          effectiveCustomization.titleWeight === "medium" ? "font-medium" :
                          effectiveCustomization.titleWeight === "semibold" ? "font-semibold" :
                          "font-bold"
                        }`}
                      >
                        {project.projectName}
                      </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 ${
                      theme === "light"
                        ? "text-gray-700"
                        : themeClasses.textSecondary
                    } ${!expandedDescriptions[index] ? "line-clamp-3" : ""}`}
                  >
                    {project.projectDescription}
                  </p>
                  {project.projectDescription &&
                    project.projectDescription.length > 150 && (
                      <button
                        onClick={() => toggleDescription(index)}
                        className={`text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center space-x-1 transition-colors`}
                      >
                        {expandedDescriptions[index] ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            <span>Show More</span>
                            <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    )}
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
                      {project.techStack?.map((tech, techIndex) => (
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
                              ? "border-gray-200 text-gray-700 bg-gray-50 hover:border-orange-400/50"
                              : "border-gray-700 text-gray-400 hover:border-orange-400/50"
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
                  theme === "light" ? "border-gray-200" : "border-gray-700/50"
                }`}>
                  <div className="flex items-center space-x-3">
                    {project.liveLink && effectiveCustomization.showLiveLink && (
                      <a
                        href={project.liveLink}
                        className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 group/btn ${
                          theme === "light"
                            ? "bg-white border-gray-200 hover:border-orange-400/50"
                            : `${themeClasses.bgSecondary} border-gray-600/50 hover:border-orange-400/50`
                        }`}
                        title="View Live Demo"
                      >
                        <ExternalLink
                          size={16}
                          className={`transition-colors ${
                            theme === "light"
                              ? "text-gray-700 group-hover/btn:text-orange-500"
                              : `${themeClasses.textPrimary} group-hover/btn:text-orange-400`
                          }`}
                        />
                      </a>
                    )}
                    {project.githubLink && effectiveCustomization.showGithubLink && (
                      <a
                        href={project.githubLink}
                        className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 group/btn ${
                          theme === "light"
                            ? "bg-white border-gray-200 hover:border-purple-400/50"
                            : `${themeClasses.bgSecondary} border-gray-600/50 hover:border-purple-400/50`
                        }`}
                        title="View Source Code"
                      >
                        <Github
                          size={16}
                          className={`transition-colors ${
                            theme === "light"
                              ? "text-gray-700 group-hover/btn:text-purple-500"
                              : `${themeClasses.textPrimary} group-hover/btn:text-purple-400`
                          }`}
                        />
                      </a>
                    )}
                  </div>

                  {/* View More Arrow */}
                  <div
                    className={`transition-all duration-300 ${
                      hoveredProject === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <ArrowUpRight size={18} className="text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Side Accent Line */}
              <div className={`absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                theme === "light"
                  ? "bg-gradient-to-b from-orange-400 to-purple-400"
                  : "bg-gradient-to-b from-orange-400 to-purple-600"
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {projectsData.length > 2 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="px-6 py-3 bg-gradient-to-r from-orange-400/20 to-purple-600/20 hover:from-orange-400/30 hover:to-purple-600/30 rounded-xl border border-gray-700/50 hover:border-orange-400/50 transition-all duration-300 flex items-center space-x-2 group"
          >
            <span className="text-white font-medium">
              {showAllProjects ? "Show Less" : "Show More"}
            </span>
            {showAllProjects ? (
              <ChevronUp
                size={20}
                className="text-orange-400 group-hover:translate-y-[-2px] transition-transform"
              />
            ) : (
              <ChevronDown
                size={20}
                className="text-orange-400 group-hover:translate-y-[2px] transition-transform"
              />
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {projectsData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Code size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400">
              No projects yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start adding your amazing projects to showcase your skills and
              experience.
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
            <h3 className="text-lg font-bold text-white">Projects Settings</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

                      {/* Tab Navigation */}
            <div className="flex border-b border-zinc-700">
              {["layout", "typography", "styling"].map((tab) => (
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
                  {tab === "typography" && (
                    <span className="text-lg mx-auto mb-1">T</span>
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
                  <GridColumnsSelector
                    value={draftCustomization?.gridColumns ?? customization.gridColumns}
                    onChange={(value) =>
                      updateDraftCustomization("gridColumns", value)
                    }
                  />

                  <CardStyleSelector
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

              {activeTab === "typography" && (
                <>
                  <TitleSizeSelector
                    value={draftCustomization?.titleSize ?? customization.titleSize}
                    onChange={(value) =>
                      updateDraftCustomization("titleSize", value)
                    }
                  />

                  <TitleWeightSelector
                    value={draftCustomization?.titleWeight ?? customization.titleWeight}
                    onChange={(value) =>
                      updateDraftCustomization("titleWeight", value)
                    }
                  />
                </>
              )}

              {activeTab === "styling" && (
                <>
                  <CustomSlider
                    value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                    onChange={(value) => updateDraftCustomization("cardBorderRadius", value)}
                    label="Border Radius"
                    min={0}
                    max={32}
                    step={1}
                    unit="px"
                  />

                  <CustomSlider
                    value={draftCustomization?.borderWidth ?? customization.borderWidth}
                    onChange={(value) => updateDraftCustomization("borderWidth", value)}
                    label="Border Width"
                    min={0}
                    max={4}
                    step={1}
                    unit="px"
                  />

                  <TechStackStyleSelector
                    value={draftCustomization?.techStackStyle ?? customization.techStackStyle}
                    onChange={(value) =>
                      updateDraftCustomization("techStackStyle", value)
                    }
                  />

                  <CustomSlider
                    value={draftCustomization?.animationSpeed ?? customization.animationSpeed}
                    onChange={(value) => updateDraftCustomization("animationSpeed", value)}
                    label="Animation Speed"
                    min={100}
                    max={1000}
                    step={50}
                    unit="ms"
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
                    <span className="text-white font-medium">Show Year Badge</span>
                    <Switch
                      checked={draftCustomization?.yearBadge ?? customization.yearBadge}
                      onCheckedChange={(checked) =>
                        updateDraftCustomization("yearBadge", checked)
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
                    <span className="text-white font-medium">Show Live Link</span>
                    <Switch
                      checked={draftCustomization?.showLiveLink ?? customization.showLiveLink}
                      onCheckedChange={(checked) =>
                        updateDraftCustomization("showLiveLink", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Show GitHub Link</span>
                    <Switch
                      checked={draftCustomization?.showGithubLink ?? customization.showGithubLink}
                      onCheckedChange={(checked) =>
                        updateDraftCustomization("showGithubLink", checked)
                      }
                    />
                  </div>
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

export default Projects;

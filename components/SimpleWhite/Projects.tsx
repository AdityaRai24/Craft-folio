import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Settings, Grid3X3, RotateCcw, Type, Zap, Eye, X, Layout, Image, Tag, Link } from "lucide-react";
import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from '@/components/EditButton';
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { defaultSimpleWhiteProjectsStyles } from "./defaultStyles/projects";
import { SimpleWhiteProjectsCustomizationState } from "./defaultStyles/types";
import { ColorTheme } from "@/lib/colorThemes";
import SectionHeader from './SectionHeader';

interface ProjectType {
  id: string;
  projectName: string;
  projectDescription: string;
  projectImage: string;
  techStack: [{
    name: string;
    logo: string;
  }];
  githubLink: string;
  liveLink: string;
}

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
                className="text-white text-center font-bold"
                style={{ 
                  fontSize: size,
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

const Projects: NextPage = ({ customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  
  const [isLoading, setIsLoading] = useState(true);
  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
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
  const getSectionClasses = () => {
    const bgMap = {
      white: "bg-white",
      "gray-50": "bg-gray-50",
      "gray-100": "bg-gray-100",
    };
    
    return `min-h-screen pb-24 bg-gradient-to-b text-gray-900 from-white to-white relative ${bgMap[effectiveCustomization.backgroundColor]}`;
  };

  const getHeaderClasses = () => {
    const alignmentMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    const titleSizeMap = {
      sm: "text-2xl md:text-3xl",
      md: "text-3xl md:text-4xl",
      lg: "text-4xl md:text-5xl",
      xl: "text-4xl md:text-5xl",
      "2xl": "text-5xl md:text-6xl",
      "3xl": "text-6xl md:text-7xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    return {
      container: `${alignmentMap[effectiveCustomization.titleAlignment]} mb-20`,
      title: `font-display section-title ${titleSizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} tracking-tight text-${effectiveCustomization.titleColor} mb-4 transition-all duration-700`,
      description: `font-sans text-lg section-description md:text-xl font-normal text-${effectiveCustomization.descriptionColor} tracking-normal leading-relaxed max-w-2xl ${effectiveCustomization.titleAlignment === "center" ? "mx-auto" : ""} transition-all duration-700`,
    };
  };

  const getProjectCardClasses = () => {
    const spacingMap = {
      compact: "gap-4",
      normal: "gap-8",
      spacious: "gap-12",
    };

    const layoutMap = {
      grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacingMap[effectiveCustomization.spacing]}`,
      list: `space-y-${effectiveCustomization.spacing === "compact" ? "12" : effectiveCustomization.spacing === "normal" ? "20" : "32"}`,
    };

    const shadowMap = {
      none: "",
      light: "shadow-sm",
      medium: "shadow-lg",
      heavy: "shadow-2xl",
    };

    return {
      container: layoutMap[effectiveCustomization.layout],
      card: `group relative border-2 border-black border-gray-200 ${shadowMap[effectiveCustomization.cardShadow]}`,
      image: `w-full ${effectiveCustomization.layout === "grid" ? "h-48" : "lg:w-[40%]"} cursor-pointer relative overflow-hidden shadow-xl transition-transform duration-500 ease-in-out`,
    };
  };

  const getTechStackClasses = () => {
    const sizeMap = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const styleMap = {
      pills: "rounded-full border border-gray-500 text-white",
      badges: "rounded bg-gray-600 text-white",
      minimal: "text-gray-300",
      colorful: "rounded-full border-2 text-white",
    };

    return `px-4 py-2 font-medium ${styleMap[effectiveCustomization.techStackStyle]} ${sizeMap[effectiveCustomization.techStackSize]}`;
  };

  useEffect(() => {
    if (portfolioData) {
      const projectsSectionData = portfolioData?.find((section: any) => section.type === "projects")?.data;
      const projectsSection = portfolioData?.find((section: any) => section.type === "projects");

      if (projectsSectionData) {
        setProjectsData(projectsSectionData);
      } else {
        setProjectsData([]);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);
  
  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-${portfolioId}-projects-simplewhite`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          // console.log('Projects update detected!', payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status for projects: ${status}`);
      });
      
    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, isLoading]);

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
      },
    },
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }



  const headerClasses = getHeaderClasses();
  const projectCardClasses = getProjectCardClasses();

  return (
    <section
      id="projects"
      className={getSectionClasses()}
    >
      <style>{customCSS}</style>
      
      <div className={`relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 ${
        effectiveCustomization.maxWidth === "md" ? "max-w-4xl" :
        effectiveCustomization.maxWidth === "lg" ? "max-w-5xl" :
        effectiveCustomization.maxWidth === "xl" ? "max-w-6xl" :
        effectiveCustomization.maxWidth === "2xl" ? "max-w-7xl" :
        effectiveCustomization.maxWidth === "full" ? "max-w-full" :
        "max-w-7xl"
      }`}>
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
          description={portfolioData?.find((section: any) => section.type === "projects")?.sectionDescription || "Some cool things that i have worked on."}
          onVisualEditorClick={openVisualEditor}
          headerClasses={headerClasses}
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className={projectCardClasses.container}>
            {projectsData.map((project, index) => (
              <motion.div
                key={project.id || index}
                variants={projectVariants}
                className={projectCardClasses.card}
                style={{
                  borderRadius: `${effectiveCustomization.cardBorderRadius ?? 8}px`,
                  padding: `${effectiveCustomization.cardPadding ?? 4}px`,
                }}
              >
                <div className={`flex flex-col ${effectiveCustomization.layout === "list" ? "lg:flex-row" : ""} gap-8 items-center`}>
                  {/* Project Image */}
                  {effectiveCustomization.showImages && (
                    <div 
                      className={projectCardClasses.image}
                      style={{
                        borderRadius: `${effectiveCustomization.imageBorderRadius ?? 8}px`,
                      }}
                    >
                      {effectiveCustomization.imageOverlay && (
                        <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-primary-900/0 transition-all duration-500" />
                      )}
                      <img
                        src={project.projectImage}
                        alt={project.projectName}
                        className={`w-full h-full section-image object-cover transform transition-all duration-700 ${
                          effectiveCustomization.imageHoverEffect === "zoom" ? "group-hover:scale-110" : 
                          effectiveCustomization.imageHoverEffect === "fade" ? "group-hover:opacity-80" : ""
                        }`}
                      />
                    </div>
                  )}

                  {/* Project Info */}
                  <div className={`w-full ${effectiveCustomization.layout === "list" && effectiveCustomization.showImages ? "lg:w-1/2" : ""} space-y-6`}>
                    <h3 className={`section-sub-title transition-all duration-300 cursor-pointer ${
                      effectiveCustomization.projectTitleSize === "sm" ? "text-xl" :
                      effectiveCustomization.projectTitleSize === "md" ? "text-2xl" :
                      effectiveCustomization.projectTitleSize === "lg" ? "text-3xl" : "text-4xl"
                    } ${
                      effectiveCustomization.projectTitleWeight === "normal" ? "font-normal" :
                      effectiveCustomization.projectTitleWeight === "medium" ? "font-medium" :
                      effectiveCustomization.projectTitleWeight === "semibold" ? "font-semibold" : "font-bold"
                    } ${
                      effectiveCustomization.projectTitleColor === "primary" ? "text-primary-900 hover:text-primary-700" :
                      `text-${effectiveCustomization.projectTitleColor}`
                    }`}>
                      {project.projectName}
                    </h3>

                    <p className={`section-sub-description leading-relaxed ${
                      effectiveCustomization.projectDescriptionSize === "sm" ? "text-sm" :
                      effectiveCustomization.projectDescriptionSize === "md" ? "text-base" : "text-lg"
                    } text-${effectiveCustomization.projectDescriptionColor}`}>
                      {project.projectDescription}
                    </p>

                    {effectiveCustomization.techStackVisible && (
                      <div className="flex flex-wrap gap-3">
                        {project.techStack.map((tech, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={getTechStackClasses()}
                          >
                            {effectiveCustomization.techStackStyle === "colorful" && (
                              <img src={tech.logo || "https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18"} alt={tech.name} className="h-4 w-4 inline-block mr-1"/>
                            )}
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {effectiveCustomization.linksVisible && (
                      <div className="flex gap-6 pt-4">
                        {effectiveCustomization.githubLinkVisible && project.githubLink && (
                          <motion.a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View project code"
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-all duration-300"
                            whileHover={effectiveCustomization.hoverEffects ? { scale: 1.05 } : {}}
                            whileTap={effectiveCustomization.hoverEffects ? { scale: 0.95 } : {}}
                          >
                            <FaGithub size={effectiveCustomization.buttonSize === "sm" ? 16 : effectiveCustomization.buttonSize === "md" ? 20 : 24} />
                            <span className={`font-medium ${effectiveCustomization.buttonSize === "sm" ? "text-sm" : effectiveCustomization.buttonSize === "md" ? "text-base" : "text-lg"}`}>View Code</span>
                          </motion.a>
                        )}
                        {effectiveCustomization.liveLinkVisible && project.liveLink && (
                          <motion.a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View live demo"
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-all duration-300"
                            whileHover={effectiveCustomization.hoverEffects ? { scale: 1.05 } : {}}
                            whileTap={effectiveCustomization.hoverEffects ? { scale: 0.95 } : {}}
                          >
                            <FaExternalLinkAlt size={effectiveCustomization.buttonSize === "sm" ? 16 : effectiveCustomization.buttonSize === "md" ? 20 : 24} />
                            <span className={`font-medium ${effectiveCustomization.buttonSize === "sm" ? "text-sm" : effectiveCustomization.buttonSize === "md" ? "text-base" : "text-lg"}`}>Live Demo</span>
                          </motion.a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
            <h3 className="text-lg font-bold text-white">Projects Visual Editor</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "typography", "styling", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-3 text-sm capitalize transition-colors`}
                style={{
                  background: activeTab === tab ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                  color: activeTab === tab ? "white" : "#9CA3AF",
                }}
              >
                {tab === "layout" && <Layout className="h-4 w-4 mx-auto mb-1" />}
                {tab === "typography" && <Type className="h-4 w-4 mx-auto mb-1" />}
                {tab === "styling" && <Image className="h-4 w-4 mx-auto mb-1" />}
                {tab === "effects" && <Eye className="h-4 w-4 mx-auto mb-1" />}
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
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "list", label: "List", icon: "☰" },
                      { value: "grid", label: "Grid", icon: "⊞" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("layout", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.layout ?? customization.layout) === value
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

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "compact", label: "Compact" },
                      { value: "normal", label: "Normal" },
                      { value: "spacious", label: "Spacious" },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("spacing", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.spacing ?? customization.spacing) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="text-center text-xs text-white">{label}</div>
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
                      { value: "md", label: "Medium", width: "max-w-4xl" },
                      { value: "lg", label: "Large", width: "max-w-5xl" },
                      { value: "xl", label: "Extra Large", width: "max-w-6xl" },
                      { value: "2xl", label: "2XL", width: "max-w-7xl" },
                      { value: "full", label: "Full", width: "max-w-full" },
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
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
                <div className="">

                  <SizeSelector
                    value={draftCustomization?.projectTitleSize ?? customization.projectTitleSize}
                    onChange={(value) => updateDraftCustomization("projectTitleSize", value)}
                    label="Project Title Size"
                    options={[
                      { value: "sm", label: "Small", size: "18px" },
                      { value: "md", label: "Medium", size: "20px" },
                      { value: "lg", label: "Large", size: "24px" },
                      { value: "xl", label: "Extra Large", size: "28px" },
                    ]}
                  />

                  <SizeSelector
                    value={draftCustomization?.projectDescriptionSize ?? customization.projectDescriptionSize}
                    onChange={(value) => updateDraftCustomization("projectDescriptionSize", value)}
                    label="Description Size"
                    options={[
                      { value: "sm", label: "Small", size: "14px" },
                      { value: "md", label: "Medium", size: "16px" },
                      { value: "lg", label: "Large", size: "18px" },
                    ]}
                  />

                  <SizeSelector
                    value={draftCustomization?.techStackSize ?? customization.techStackSize}
                    onChange={(value) => updateDraftCustomization("techStackSize", value)}
                    label="Tech Stack Size"
                    options={[
                      { value: "sm", label: "Small", size: "12px" },
                      { value: "md", label: "Medium", size: "14px" },
                      { value: "lg", label: "Large", size: "16px" },
                    ]}
                  />

                  <SizeSelector
                    value={draftCustomization?.buttonSize ?? customization.buttonSize}
                    onChange={(value) => updateDraftCustomization("buttonSize", value)}
                    label="Button Size"
                    options={[
                      { value: "sm", label: "Small", size: "12px" },
                      { value: "md", label: "Medium", size: "14px" },
                      { value: "lg", label: "Large", size: "16px" },
                    ]}
                  />

                </div>
              </div>
            )}

            {activeTab === "styling" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Card Border Radius: {(draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius ?? 8)}px
                  </label>
                    <input
                    type="range"
                    min={0}
                    max={24}
                    step={2}
                    value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius ?? 8}
                    onChange={(e) => updateDraftCustomization("cardBorderRadius", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(((draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius ?? 8) / 24) * 100)}%, #3f3f46 ${(((draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius ?? 8) / 24) * 100)}%, #3f3f46 100%)`,
                      }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Image Border Radius: {(draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius ?? 8)}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={2}
                    value={draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius ?? 8}
                    onChange={(e) => updateDraftCustomization("imageBorderRadius", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(((draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius ?? 8) / 24) * 100)}%, #3f3f46 ${(((draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius ?? 8) / 24) * 100)}%, #3f3f46 100%)`,
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                    Card Padding: {(draftCustomization?.cardPadding ?? customization.cardPadding ?? 4)}px
                  </label>
                      <input
                    type="range"
                    min={0}
                    max={12}
                    step={2}
                    value={draftCustomization?.cardPadding ?? customization.cardPadding ?? 4}
                    onChange={(e) => updateDraftCustomization("cardPadding", Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(((draftCustomization?.cardPadding ?? customization.cardPadding ?? 4) / 12) * 100)}%, #3f3f46 ${(((draftCustomization?.cardPadding ?? customization.cardPadding ?? 4) / 12) * 100)}%, #3f3f46 100%)`,
                        }}
                  />
                  </div>

                  <div>
                    <label className="block text-white text-left font-medium mb-3">
                    Tech Stack Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                      { value: "pills", label: "Pills" },
                      { value: "badges", label: "Badges" },
                      { value: "minimal", label: "Minimal" },
                      { value: "colorful", label: "Colorful" },
                    ].map(({ value, label }) => (
                        <div
                          key={value}
                        onClick={() => updateDraftCustomization("techStackStyle", value)}
                          className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.techStackStyle ?? customization.techStackStyle) === value
                              ? "border-white bg-zinc-700"
                              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                          }`}
                        >
                        <div className="flex flex-wrap gap-1 justify-center mb-2">
                          {["React", "TS"].map((tech, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-1 ${
                                value === "pills"
                                  ? "rounded-full border border-gray-500 text-white"
                                  : value === "badges"
                                  ? "rounded bg-gray-600 text-white"
                                  : value === "minimal"
                                  ? "text-gray-300"
                                  : "rounded-full border-2 text-white"
                              }`}
                              style={
                                value === "colorful"
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

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Hover Scale</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.hoverScale ?? customization.hoverScale}
                        onChange={(e) => updateDraftCustomization("hoverScale", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.hoverScale ?? customization.hoverScale) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>


                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Image Hover Effect
                  </h5>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "zoom", label: "Zoom", icon: "🔍" },
                      { value: "fade", label: "Fade", icon: "💫" },
                      { value: "overlay", label: "Overlay", icon: "🎭" },
                      { value: "none", label: "None", icon: "❌" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("imageHoverEffect", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.imageHoverEffect ?? customization.imageHoverEffect) === value
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

      {/* Custom CSS for sliders */}
      <style jsx>{`
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
    </section>
  );
};

export default Projects;
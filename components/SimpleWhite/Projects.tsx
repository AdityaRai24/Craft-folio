"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Github,
  ExternalLink,
  Code2,
  Calendar, Palette,
  Layout,
  Move,
  RotateCcw,
  X, Square,
  RectangleHorizontal,
  RectangleVertical, Type
} from "lucide-react";
import LayoutSelector from "@/components/VisualEditor/Projects/LayoutSelector";
import AlignmentSelector from "@/components/VisualEditor/Shared/AlignmentSelector";
import ButtonStyleSelector from "@/components/VisualEditor/Projects/ButtonStyleSelector";
import AspectRatioSelector from "@/components/VisualEditor/Projects/AspectRatioSelector";
import TechStackStyleSelector from "@/components/VisualEditor/Shared/TechStackStyleSelector";
import SliderControl from "@/components/VisualEditor/Shared/SliderControl";
import TypographySelector from "@/components/VisualEditor/Shared/TypographySelector";
import ImagePositionSelector from "@/components/VisualEditor/Projects/ImagePositionSelector";
import ProjectsVisualEditor from "@/components/VisualEditor/Projects/ProjectsVisualEditor";
import { useDraggable } from "@/hooks/useDraggable";
import { useProjectActions } from "@/hooks/useProjectActions";
import { Technology, Project } from "@/types/projects/portfolio";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import MagicWrite from "@/components/Shared/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";
import toast from "react-hot-toast";
import { defaultSimpleWhiteProjectsStyles } from "./defaultStyles/projects";
import { SimpleWhiteProjectsCustomizationState } from "./defaultStyles/types";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization, updateSection } from "@/app/actions/portfolio";




const Projects: React.FC = ({ currentPortTheme, portfolioId }: any) => {
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];



  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");
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
  const { handleMagicWrite, handleDescriptionUpdate: handleProjectDescriptionUpdate } = useProjectActions({
    portfolioId,
    projectsData: projects,
    setProjectsData: setProjects,
  });



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
    let classes = `${effectiveCustomization.cardBackground} section-card border ${effectiveCustomization.cardBorder
      }  transition-all duration-${Math.round(
        effectiveCustomization.animationSpeed * 1000
      )} cursor-pointer hover:bg-gray-50`;

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
      className="py-12  sm:py-16 md:py-20 lg:py-24 w-full bg-white overflow-hidden min-h-screen text-gray-900"
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
            className={`${getLayoutClasses()}`}
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
                      className={`flex flex-wrap items-center ${effectiveCustomization.titleAlignment === "center"
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
                      <div className="absolute -top-1 -right-1 z-10 hidden md:block">
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

      {/* Visual Editor */}
      <ProjectsVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={customization}
        draftCustomization={draftCustomization}
        onUpdateDraft={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        primaryColor={ColorTheme.primary}
        primaryDarkColor={ColorTheme.primaryDark}
      />
    </section>
  );
};

export default Projects;
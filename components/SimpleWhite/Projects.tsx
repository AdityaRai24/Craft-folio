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
import { defaultSimpleWhiteProjectsStyles } from "@/types/projects/simplewhite";
import { ProjectsCustomizationState } from "@/types/projects/portfolio";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization, updateSection } from "@/app/actions/portfolio";
import { useProjectStyles } from "@/hooks/useProjectStyles";
import { useCustomization } from "@/hooks/useCustomization";
import SectionLoading from "../Shared/SectionLoading";




const Projects: React.FC = ({ currentPortTheme, portfolioId }: any) => {
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];



  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");

  const {
    customization,
    effectiveCustomization,
    visualEditorOpen,
    setVisualEditorOpen,
    openVisualEditor,
    updateDraftCustomization,
    saveDraftCustomization,
    resetCustomization,
    draftCustomization
  } = useCustomization("projects", defaultSimpleWhiteProjectsStyles, portfolioId);

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


  // Magic Write functionality
  const { handleMagicWrite, handleDescriptionUpdate: handleProjectDescriptionUpdate } = useProjectActions({
    portfolioId,
    projectsData: projects,
    setProjectsData: setProjects,
  });

  // Theme color variables
  const primaryColor = theme?.colors?.primary || "#2563EB";
  const primaryHoverColor = theme?.colors?.primaryHover || "#1D4ED8";
  const accentColor = theme?.colors?.accent || "#3B82F6";
  const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
  const textSecondaryColor = theme?.colors?.text?.secondary || "#6B7280";
  const backgroundPrimaryColor = theme?.colors?.background?.primary || "#FFFFFF";
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || "#F8FAFC";
  const mutedColor = theme?.colors?.states?.muted || "rgba(59, 130, 246, 0.1)";

  // Use shared styling hook
  const {
    getLayoutClasses,
    getLayoutStyle,
    getCardClasses,
    getCardStyle,
    getImageStyle,
    getButtonClasses,
    getButtonStyle,
    getTechStackClasses,
    getTitleAlignment,
    getTitleClasses,
    getDescriptionClasses,
    getAnimationVariants
  } = useProjectStyles(effectiveCustomization, primaryColor, "light");

  const animationVariants = getAnimationVariants();

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
        }
      )
      .subscribe((status) => {
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

  if (isLoading) return <SectionLoading />


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
          headerVisible={effectiveCustomization.headerVisible ?? true}
          titleSize={effectiveCustomization.titleSize as "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"}
          titleWeight={effectiveCustomization.titleWeight}
          titleColor={effectiveCustomization.titleColor ?? "gray-900"}
          titleAlignment={effectiveCustomization.titleAlignment}
          descriptionSize={effectiveCustomization.descriptionSize as "sm" | "md" | "lg"}
          descriptionColor={effectiveCustomization.descriptionColor ?? "gray-600"}
          descriptionVisible={effectiveCustomization.descriptionVisible ?? true}
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
                              style={{
                                backgroundColor: backgroundSecondaryColor,
                                color: textPrimaryColor,
                                borderColor: `${textSecondaryColor}30`,
                              }}
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
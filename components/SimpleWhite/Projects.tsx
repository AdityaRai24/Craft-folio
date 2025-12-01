"use client";

import React, { useEffect, useState } from "react";
import {
  Github,
  ExternalLink,
  Code2,
  Calendar
} from "lucide-react";
import ProjectsVisualEditor from "@/components/VisualEditor/Projects/ProjectsVisualEditor";
import { useProjectActions } from "@/hooks/useProjectActions";
import { Project } from "@/types/interfaces/ProjectsCustomizationState";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import MagicWrite from "@/components/Shared/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";
import { defaultSimpleWhiteProjectsStyles } from "@/types/simplewhite/projects";
import { useProjectStyles } from "@/hooks/useProjectStyles";
import { useCustomization } from "@/hooks/useCustomization";
import SectionLoading from "../Shared/SectionLoading";
import { getContainerVariants, getProjectVariants, getImageVariants } from "./variants";


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
    getTechStackStyle,
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
      className="py-16 sm:py-24 w-full bg-white overflow-hidden min-h-screen text-gray-900"
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
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            container: "text-center mb-16 sm:mb-20",
            title: "font-display section-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 transition-all duration-700",
            description: "font-sans text-lg sm:text-xl section-description md:text-2xl font-normal text-gray-600 tracking-normal leading-relaxed max-w-3xl mx-auto transition-all duration-700"
          }}
          currentPortTheme={currentPortTheme}
        />

        {/* Projects Grid */}
        {Array.isArray(projects) && projects.length > 0 ? (
          <motion.div
            className={`${getLayoutClasses()} gap-8 sm:gap-10 lg:gap-12`}
            style={getLayoutStyle()}
            variants={getContainerVariants()}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project: Project, index: number) => (
              <motion.div
                key={index}
                variants={getProjectVariants(effectiveCustomization.animationSpeed || 0.5)}
                className={`${getCardClasses()} group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500`}
                style={getCardStyle()}
              >
                <div
                  className={
                    effectiveCustomization.layout === "grid"
                      ? "flex flex-col"
                      : effectiveCustomization.imagePosition === "right"
                        ? "flex flex-col lg:flex-row-reverse items-center gap-0"
                        : "flex flex-col max-w-[95%] mx-auto lg:flex-row items-center gap-0"
                  }
                >
                  {/* Project Image */}
                  {true && (
                    <div
                      className={
                        effectiveCustomization.layout === "grid"
                          ? "w-full overflow-hidden bg-gray-100"
                          : "w-full lg:w-2/5 relative overflow-hidden flex items-center justify-center"
                      }
                      style={getImageStyle()}
                    >
                      <motion.div
                        className="w-full h-full"
                        initial="rest"
                        whileHover="hover"
                        variants={getImageVariants(effectiveCustomization.animationSpeed || 0.5)}
                      >
                        {project?.projectImage ? (
                          <img
                            src={project.projectImage}
                            alt={`${project?.projectTitle} project screenshot`}
                            className="w-full h-full object-cover object-center transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                            <Code2 className="w-16 h-16 opacity-20" />
                          </div>
                        )}
                        {/* Fallback for broken images */}
                        <div className="hidden w-full h-full absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                          <Code2 className="w-16 h-16 opacity-20" />
                        </div>

                        {effectiveCustomization.imageOverlay && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div
                    className={
                      effectiveCustomization.layout === "grid"
                        ? "w-full p-6 sm:p-8 flex flex-col flex-grow"
                        : "flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center"
                    }
                  >
                    <div className="flex flex-col h-full">
                      <div
                        className={`flex flex-wrap items-center gap-3 mb-4 ${effectiveCustomization.titleAlignment === "center"
                          ? "justify-center"
                          : effectiveCustomization.titleAlignment === "right"
                            ? "justify-end"
                            : "justify-start"
                          }`}
                      >
                        <h3
                          className={`${getTitleClasses()} tracking-tight`}
                          style={{ color: textPrimaryColor }}
                        >
                          {project?.projectName}
                        </h3>
                        <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium tracking-wide uppercase" style={{ color: textSecondaryColor }}>
                          {project?.year}
                        </div>
                      </div>

                      <div className={`relative flex-grow ${getTitleAlignment()}`}>
                        <p
                          className={`${getDescriptionClasses()} mb-6`}
                          style={{ color: textSecondaryColor }}
                        >
                          {project?.projectDescription}
                        </p>
                        <div className="absolute -top-1 -right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <MagicWrite
                            onMagicWrite={async (prompt: string, context?: string) => {
                              const enhancedDescription = await handleMagicWrite(prompt, project?.projectDescription || "");
                              handleProjectDescriptionUpdate(index, enhancedDescription);
                              return enhancedDescription;
                            }}
                            placeholder="Enhance description..."
                            buttonText=""
                            context={project?.projectDescription || ""}
                            className="w-8 h-8 p-1.5 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 hover:text-blue-600"
                          />
                        </div>
                      </div>

                      {(true) && project?.techStack && (
                        <div className={`mb-8 ${getTitleAlignment()}`}>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, tagIndex) => (
                              <div
                                key={tagIndex}
                                className={getTechStackClasses()}
                                style={getTechStackStyle()}
                              >
                                {tech.logo ? (
                                  <img
                                    src={tech.logo}
                                    alt={tech.name}
                                    className="w-4 h-4 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <span>{tech.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {(true) && (
                        <div className={`flex gap-4 mt-auto ${effectiveCustomization.titleAlignment === "center"
                          ? "justify-center"
                          : effectiveCustomization.titleAlignment === "right"
                            ? "justify-end"
                            : "justify-start"
                          }`}>
                          {effectiveCustomization.githubLinkVisible && (
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
                          )}
                          {effectiveCustomization.liveLinkVisible && (
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
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No projects found.</p>
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

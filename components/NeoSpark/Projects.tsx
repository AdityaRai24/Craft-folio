"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Github,
  ExternalLink,
  Code2,
  Calendar
} from "lucide-react";
import ProjectsVisualEditor from "@/components/VisualEditor/Projects/ProjectsVisualEditor";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { ColorTheme } from "@/lib/colorThemes";
import toast from "react-hot-toast";
import { defaultProjectsStyles } from "./defaultStyles/projects";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization } from "@/app/actions/portfolio";
import MagicWrite from "@/components/Shared/MagicWrite";
import { Project, Technology, ProjectsCustomizationState } from "@/types/projects/portfolio";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useProjectStyles } from "@/hooks/useProjectStyles";


const Projects: React.FC = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();

  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");

  // Use defaultProjectsStyles for initial state
  const [customization, setCustomization] = useState<ProjectsCustomizationState>(defaultProjectsStyles);
  const [draftCustomization, setDraftCustomization] = useState<ProjectsCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

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

  // Helper functions for styling - update all to use effectiveCustomization
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
  } = useProjectStyles(effectiveCustomization, titleColor, "dark");

  const { handleMagicWrite, handleDescriptionUpdate } = useProjectActions({
    portfolioId,
    projectsData,
    setProjectsData
  });

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
        }
      )
      .subscribe((status) => {
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

  const animationVariants = getAnimationVariants();
  const projectVariants = animationVariants;

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
      className="py-12 sm:py-16 md:py-24 w-full bg-black overflow-hidden min-h-screen text-white"
    >
      <style>{customCSS}</style>
      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
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
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {projectsData.map((project, index) => (
              <div key={index} className="relative">
                <motion.div
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
                          ? "w-full relative"
                          : "w-full md:w-3/5 p-5 md:p-6 relative"
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
                          style={{ color: titleColor }}
                        >
                          {project?.projectName}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm mt-1 md:mt-0">
                          <Calendar className="h-4 w-4 mr-1" />
                          {project?.year}
                        </div>
                      </div>
                      <div className="relative">
                        <p
                          className={`${getDescriptionClasses()} text-gray-300 mb-4 ${getTitleAlignment()}`}
                        >
                          {project?.projectDescription}
                        </p>
                        {/* Magic Write Button */}
                        <div className="absolute -top-2 -right-2 z-10 hidden md:block">
                          <MagicWrite
                            onMagicWrite={async (prompt: string, context?: string) => {
                              const enhancedDescription = await handleMagicWrite(prompt, project?.projectDescription);
                              handleDescriptionUpdate(index, enhancedDescription);
                              return enhancedDescription;
                            }}
                            placeholder="Enhance this project description..."
                            buttonText=""
                            context={project?.projectDescription}
                            className="w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
                          />
                        </div>
                      </div>
                      <div className={getTitleAlignment()}>
                        <h4 className="flex items-center gap-2 font-semibold mb-2">
                          <Code2 className="h-4 w-4" />
                          Tech Stack
                        </h4>
                        <div
                          className={`flex flex-wrap gap-2 ${effectiveCustomization.titleAlignment === "center"
                            ? "justify-center"
                            : effectiveCustomization.titleAlignment === "right"
                              ? "justify-end"
                              : ""
                            }`}
                        >
                          {project?.techStack?.map((tech: Technology, idx: number) => (
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
                                src={tech.logo ||
                                  `https://placehold.co/100x100?text=${tech.name}&font=montserrat&fontsize=18`}
                                alt={tech.name}
                                className="h-4 w-4 inline-block mr-1"
                              />
                              {tech.name}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div> {/* <-- closes the flex layout div */}
                </motion.div>

              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            No projects found. Add some projects to see them here.
          </div>
        )}
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
      </div> {/* closes the main container div */}
    </section>
  );
};

export default Projects;

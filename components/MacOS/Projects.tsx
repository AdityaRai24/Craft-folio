"use client";

import { useEffect, useState } from "react";
import {
  Github,
  ExternalLink, Settings
} from "lucide-react";
import ProjectsVisualEditor from "@/components/VisualEditor/Projects/ProjectsVisualEditor";
import { useProjectActions } from "@/hooks/useProjectActions";
import { Project } from "@/types/projects/portfolio";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { motion } from "framer-motion";
import EditButton from "@/components/EditButton";
import toast from "react-hot-toast";
import { defaultProjectsStyles } from "../NeoSpark/defaultStyles/projects";
import { ProjectsCustomizationState } from "../NeoSpark/defaultStyles/types";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization } from "@/app/actions/portfolio";
import MagicWrite from "@/components/MagicWrite";
import { useProjectStyles } from "@/hooks/useProjectStyles";
import { ColorTheme } from "@/lib/colorThemes";
import React from "react";

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
    if (!portfolioId) return;
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
    if (!portfolioId) return;
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

  // Magic Write functionality
  const { handleMagicWrite, handleDescriptionUpdate } = useProjectActions({
    portfolioId: portfolioId || "",
    projectsData: projectsData,
    setProjectsData: setProjectsData,
  });



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
    getDescriptionClasses
  } = useProjectStyles(effectiveCustomization, "");



  if (!projectsData || projectsData.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center p-8 ${isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f7]"}`}>
        <div className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <p className="text-lg font-medium">No projects to display</p>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Add projects to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f7]"} overflow-y-auto relative`}>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className={`text-3xl md:text-4xl font-semibold ${isDark ? "text-white" : "text-[#1d1d1f]"} mb-1.5 tracking-tight`}>
              Projects
            </h1>
            <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-[#6e6e73]"}`}>
              A collection of my recent work
            </p>
          </motion.div>

          <div className="flex gap-2.5">
            <EditButton sectionName="projects" />
            <button
              onClick={openVisualEditor}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                
                `}
              style={{
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
              }}
            >
              <Settings size={16} />
              <span>Customize</span>
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
                className={`${getCardClasses()} ${isDark
                  ? "bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#4a4a4a] shadow-xl"
                  : "bg-white border-gray-200 hover:border-gray-300 shadow-md hover:shadow-xl"
                  } transition-all duration-300`}
                style={{
                  ...getCardStyle(),
                  backdropFilter: isDark ? "blur(10px)" : "none",
                }}
              >
                {/* Project Image/Illustration */}
                <div
                  className={`relative overflow-hidden ${isDark
                    ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"
                    : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
                    }`}
                  style={getImageStyle()}
                >
                  {project.projectImage ? (
                    <img
                      src={project.projectImage}
                      alt={project.projectName || project.projectTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`text-6xl ${isDark ? "opacity-20" : "opacity-30"}`}>📁</div>
                    </div>
                  )}
                  {/* Subtle gradient overlay */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark
                      ? "bg-gradient-to-t from-black/20 to-transparent"
                      : "bg-gradient-to-t from-black/5 to-transparent"
                      }`}
                  />
                </div>

                {/* Project Content */}
                <div className="mt-5">
                  {/* Project Title */}
                  <div className={getTitleAlignment()}>
                    <h3
                      className={`${getTitleClasses()} ${isDark ? "text-white" : "text-[#1d1d1f]"
                        } font-semibold tracking-tight`}
                    >
                      {project.projectTitle || project.projectName || `Project ${index + 1}`}
                    </h3>
                  </div>

                  {/* Project Description */}
                  <div className="relative group/desc mt-2">
                    <p
                      className={`${getDescriptionClasses()} ${isDark ? "text-gray-400" : "text-[#6e6e73]"
                        } leading-relaxed`}
                    >
                      {project.projectDescription || "No description available"}
                    </p>
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover/desc:opacity-100 transition-opacity">
                      <MagicWrite
                        onMagicWrite={async (prompt: string) => {
                          const result = await handleMagicWrite(prompt, project.projectDescription);
                          await handleDescriptionUpdate(index, result);
                          return result;
                        }}
                        context={project.projectDescription || ""}
                        placeholder="Enhance project description..."
                        className="p-1.5"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Icons */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div
                      className={`flex flex-wrap gap-2 mt-4 mb-4 ${effectiveCustomization.titleAlignment === "center"
                        ? "justify-center"
                        : effectiveCustomization.titleAlignment === "right"
                          ? "justify-end"
                          : "justify-start"
                        }`}
                    >
                      {project.techStack.slice(0, 5).map((tech: any, techIndex: number) => (
                        <div
                          key={techIndex}
                          className={`${getTechStackClasses()} ${isDark
                            ? "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-700 hover:border-gray-500"
                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
                            } transition-all duration-200`}
                          title={tech.name}
                        >
                          {tech.logo ? (
                            <img src={tech.logo} alt={tech.name} className="w-4 h-4 object-contain" />
                          ) : (
                            <span className="text-xs font-medium">{tech.name}</span>
                          )}
                        </div>
                      ))}
                      {project.techStack.length > 5 && (
                        <div
                          className={`${getTechStackClasses()} ${isDark
                            ? "bg-gray-700/50 text-gray-400 border-gray-600/50"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                        >
                          <span className="text-xs font-medium">+{project.techStack.length - 5}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div
                    className={`flex gap-2.5 ${effectiveCustomization.titleAlignment === "center"
                      ? "justify-center"
                      : effectiveCustomization.titleAlignment === "right"
                        ? "justify-end"
                        : "justify-start"
                      }`}
                  >
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getButtonClasses("live")} flex-1 ${isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                          : "bg-blue-500 hover:bg-blue-600 text-white border-blue-400"
                          } shadow-sm hover:shadow-md transition-all duration-200`}
                        style={getButtonStyle("live")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                        <span className="font-medium">Live</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getButtonClasses("github")} flex-1 ${isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                          : "bg-gray-800 hover:bg-gray-900 text-white border-gray-700"
                          } shadow-sm hover:shadow-md transition-all duration-200`}
                        style={getButtonStyle("github")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={14} />
                        <span className="font-medium">Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
        primaryColor="#10b981"
        primaryDarkColor="#059669"
      />
    </div>
  );
};

export default ProjectsGrid;

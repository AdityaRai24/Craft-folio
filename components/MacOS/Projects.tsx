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
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { defaultMacOSProjectsStyles } from "@/types/projects/macos";
import { ProjectsCustomizationState } from "@/types/projects/portfolio";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization } from "@/app/actions/portfolio";
import MagicWrite from "@/components/Shared/MagicWrite";
import { useProjectStyles } from "@/hooks/useProjectStyles";
import { ColorTheme } from "@/lib/colorThemes";
import { useMacOSTheme } from "./ThemeContext";
import { useCustomization } from "@/hooks/useCustomization";

const ProjectsGrid = ({
  currentPortTheme,
  customCSS,
  portfolioId,
  theme = "light",
  font,
}: {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId: string;
  theme?: "light" | "dark";
  font?: string;
}) => {
  const dispatch = useDispatch();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const { componentCustomizations } = useSelector((state: RootState) => state.data);
  const { currentTheme } = useMacOSTheme();

  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");

  const isDark = theme === "dark";
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();
  const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);


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
  } = useCustomization("project", defaultMacOSProjectsStyles, portfolioId);

  useEffect(() => {
    if (portfolioData) {
      const data = portfolioData.find((item: any) => item.type === "projects")?.data || [];
      setProjectsData(data.projects);
    }
  }, [portfolioData]);


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
    getDescriptionClasses,
    getAnimationVariants
  } = useProjectStyles(effectiveCustomization, "", theme);

  const animationVariants = getAnimationVariants();

  if (!projectsData || projectsData.length === 0) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center p-8 ${font || ""}`}
        style={{
          backgroundColor: currentTheme.background.primary,
        }}
      >
        <div className={`text-center`} style={{ color: currentTheme.text.secondary }}>
          <p className="text-lg font-medium" style={{ color: currentTheme.text.primary }}>No projects to display</p>
          <p className={`text-sm mt-2`}>Add projects to see them here</p>
        </div>
      </div>
    );
  }



  return (
    <div
      className={`w-full h-full overflow-y-auto relative ${isDark ? "bg-[#1a1a1a]" : "bg-gray-50"} ${font || ""}`}
    >
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className={`text-3xl md:text-4xl font-semibold mb-1.5 tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Projects
            </h1>
            <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              A collection of my recent work
            </p>
          </motion.div>

          {showEdit && (
            <div className="flex gap-2.5">
              <EditButton sectionName="projects" />
              <button
                onClick={openVisualEditor}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white`}
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              >
                <Settings size={16} />
                <span>Visual Editor</span>
              </button>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className={getLayoutClasses()} style={getLayoutStyle()}>
          {projectsData.map((project: any, index: number) => (
            <motion.div
              key={index}
              variants={animationVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              {/* Project Card */}
              <div
                className={getCardClasses()}
                style={{
                  ...getCardStyle(),
                }}
              >
                {/* Project Image/Illustration */}
                <div
                  className={`relative overflow-hidden`}
                  style={{
                    ...getImageStyle(),
                  }}
                >
                  {project.projectImage ? (
                    <img
                      src={project.projectImage}
                      alt={project.projectName || project.projectTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`text-6xl opacity-30`}>📁</div>
                    </div>
                  )}
                  {/* Subtle gradient overlay */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{
                      background: `linear-gradient(to top, ${currentTheme.background.primary}33, transparent)`
                    }}
                  />
                </div>

                {/* Project Content */}
                <div className="mt-5">
                  {/* Project Title */}
                  <div className={getTitleAlignment()}>
                    <h3 className={getTitleClasses()}>
                      {project.projectTitle || project.projectName || `Project ${index + 1}`}
                    </h3>
                  </div>

                  {/* Project Description */}
                  <div className="relative group/desc mt-2">
                    <p className={getDescriptionClasses()}>
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
                          className={getTechStackClasses()}
                          title={typeof tech === 'object' ? tech.name : tech}
                          style={{
                            backgroundColor: currentTheme.background.primary,
                            color: currentTheme.text.secondary,
                            borderColor: currentTheme.states.muted,
                          }}
                        >
                          <span className="text-xs font-medium">{typeof tech === 'object' ? tech.name : tech}</span>
                        </div>
                      ))}
                      {project.techStack.length > 5 && (
                        <div className={getTechStackClasses()} style={{
                          backgroundColor: currentTheme.background.primary,
                          color: currentTheme.text.secondary,
                          borderColor: currentTheme.states.muted,
                        }}>
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
                        className={getButtonClasses("live")}
                        style={{
                          ...getButtonStyle("live"),
                          backgroundColor: currentTheme.primary,
                          color: "white",
                        }}
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
                        className={getButtonClasses("github")}
                        style={{
                          ...getButtonStyle("github"),
                          backgroundColor: currentTheme.background.primary,
                          color: currentTheme.text.primary,
                          borderColor: currentTheme.states.muted,
                        }}
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
      />
    </div>
  );
};

export default ProjectsGrid;

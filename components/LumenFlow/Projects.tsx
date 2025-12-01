"use client"
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Calendar,
  Code,
  Star,
  ArrowUpRight,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import ProjectsVisualEditor from "@/components/VisualEditor/Projects/ProjectsVisualEditor";
import { useProjectActions } from "@/hooks/useProjectActions";
import { defaultLumenFlowProjectsStyles } from "@/types/lumenflow/projects";
import { Project } from "@/types/interfaces/ProjectsCustomizationState";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import MagicWrite from "@/components/Shared/MagicWrite";
import { useCustomization } from "@/hooks/useCustomization";
import SectionLoading from "../Shared/SectionLoading";


const Projects = ({ currentTheme, portfolioId }: any) => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});
  const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("layout");

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const projectsSection = portfolioData?.find(
    (item: any) => item.type === "projects"
  );
  const { theme } = useLumenFlowTheme();
  const sectionTitle = projectsSection?.sectionTitle || "Projects";
  const sectionDescription =
    projectsSection?.sectionDescription ||
    "Here are some of the projects I've worked on, showcasing my skills in full-stack development, UI/UX design, and problem-solving. Each project demonstrates different technologies and approaches to building scalable, user-friendly applications.";

  const { handleMagicWrite, handleDescriptionUpdate } = useProjectActions({
    portfolioId,
    projectsData,
    setProjectsData,
  });

  const themeClasses = getThemeClasses(currentTheme);

  // Get theme colors for LumenFlow
  const titleColor = theme === "light" ? "#f97316" : "#f97316"; // Orange color for LumenFlow

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
  } = useCustomization("projects", defaultLumenFlowProjectsStyles, portfolioId);


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


  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  const displayedProjects = showAllProjects
    ? projectsData
    : projectsData.slice(0, 2);

  if (isLoading) {
    return (
      <SectionLoading />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-hidden scrollbar-none max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="projects"
        openVisualEditor={openVisualEditor}
        visualEditorOpen={visualEditorOpen}
      />

      {/* Projects Grid */}
      <div
        className={`grid grid-cols-1 ${effectiveCustomization.layout === "single"
          ? "grid-cols-1"
          : `sm:grid-cols-2 md:grid-cols-${effectiveCustomization.gridColumns}`
          }`}
        style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
      >
        {displayedProjects.map((project, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredProject(index)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{
                borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                background: theme === "light"
                  ? "linear-gradient(to right, rgba(249,115,22,0.08), rgba(168,85,247,0.08))"
                  : themeClasses.gradientHover
              }}
            ></div>

            {/* Main Card */}
            <div
              className={`relative transition-all duration-300 transform h-full flex flex-col overflow-hidden ${effectiveCustomization.cardStyle === "default"
                ? theme === "light"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "bg-zinc-800 border border-zinc-700"
                : effectiveCustomization.cardStyle === "minimal"
                  ? "bg-transparent border-0"
                  : effectiveCustomization.cardStyle === "glass"
                    ? theme === "light"
                      ? "bg-white/50 backdrop-blur-sm border border-white/20"
                      : "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50"
                    : effectiveCustomization.cardStyle === "neon"
                      ? theme === "light"
                        ? "bg-orange-50/30 border border-orange-300/50 shadow-lg shadow-orange-500/20"
                        : "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                      : effectiveCustomization.cardStyle === "gradient"
                        ? theme === "light"
                          ? "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
                          : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700"
                        : theme === "light"
                          ? "bg-white border border-gray-200 shadow-sm"
                          : "bg-zinc-800 border border-zinc-700"
                }`}
              style={{
                borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                padding: `${effectiveCustomization.cardPadding}px`,
                borderWidth: effectiveCustomization.cardStyle === "minimal" ? 0 : `${effectiveCustomization.borderWidth}px`,
                filter: effectiveCustomization.glowEffect ? `drop-shadow(0 0 20px ${titleColor}30)` : "none",
              }}
            >
              {/* Project Image */}
              <div
                className="relative h-48 overflow-hidden mb-4"
                style={{
                  borderRadius: `${effectiveCustomization.imageBorderRadius}px`
                }}
              >
                {project.projectImage ? (
                  <>
                    <img
                      src={project.projectImage}
                      alt={project.projectName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 ${theme === "light"
                      ? "bg-gradient-to-b from-gray-100/90 via-white/60 to-transparent"
                      : "bg-gradient-to-b from-gray-900/60 via-gray-900/30 to-transparent"
                      }`}></div>
                  </>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${theme === "light"
                    ? "bg-gradient-to-br from-gray-100 to-gray-200"
                    : "bg-gradient-to-br from-gray-700 to-gray-800"
                    }`}>
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Project Year Badge - Always shown */}
                {project.year && (
                  <div className="absolute bottom-4 left-4">
                    <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border backdrop-blur-md ${theme === "light"
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
              <div className="space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600`}></div>
                    <h3
                      className={`transition-colors duration-300 ${theme === "light"
                        ? "text-gray-900 group-hover:text-orange-600"
                        : `${themeClasses.textPrimary} group-hover:${themeClasses.accent}`
                        } ${effectiveCustomization.titleAlignment === "center"
                          ? "text-center"
                          : effectiveCustomization.titleAlignment === "right"
                            ? "text-right"
                            : "text-left"
                        } ${effectiveCustomization.titleSize === "sm" ? "text-lg" :
                          effectiveCustomization.titleSize === "md" ? "text-xl" :
                            effectiveCustomization.titleSize === "lg" ? "text-2xl" :
                              "text-3xl"
                        } ${effectiveCustomization.titleWeight === "normal" ? "font-normal" :
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
                <div className="relative">
                  <p
                    className={`leading-relaxed transition-colors duration-300 mb-2 ${theme === "light"
                      ? "text-gray-700"
                      : themeClasses.textSecondary
                      } ${!expandedDescriptions[index] ? "line-clamp-3" : ""} ${effectiveCustomization.descriptionSize === "xs" ? "text-xs" :
                        effectiveCustomization.descriptionSize === "sm" ? "text-sm" :
                          effectiveCustomization.descriptionSize === "md" ? "text-base" :
                            "text-lg"
                      } ${effectiveCustomization.descriptionWeight === "normal" ? "font-normal" :
                        effectiveCustomization.descriptionWeight === "medium" ? "font-medium" :
                          effectiveCustomization.descriptionWeight === "semibold" ? "font-semibold" :
                            "font-bold"
                      }`}
                  >
                    {project.projectDescription}
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

                {/* Tech Stack - Always visible */}
                {project.techStack && project.techStack.length > 0 && (<div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star size={14} className="text-orange-400" />
                    <span className={`text-xs font-medium uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>
                      Tech Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack?.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-2 py-1 text-xs font-medium transition-all duration-300 ${effectiveCustomization.techStackStyle === "pills"
                          ? "rounded-full border"
                          : effectiveCustomization.techStackStyle === "badges"
                            ? "rounded bg-gray-600 text-white"
                            : effectiveCustomization.techStackStyle === "minimal"
                              ? "text-gray-300"
                              : "rounded-full border-2"
                          } ${theme === "light"
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
                <div className={`flex items-center justify-between pt-4 mt-auto border-t ${theme === "light" ? "border-gray-200" : "border-gray-700/50"
                  }`}>
                  <div className="flex items-center space-x-3">
                    {/* Live Link - Always shown if available */}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 group/btn ${theme === "light"
                          ? "bg-white border-gray-200 hover:border-orange-400/50"
                          : `${themeClasses.bgSecondary} border-gray-600/50 hover:border-orange-400/50`
                          }`}
                        title="View Live Demo"
                      >
                        <ExternalLink
                          size={16}
                          className={`transition-colors ${theme === "light"
                            ? "text-gray-700 group-hover/btn:text-orange-500"
                            : `${themeClasses.textPrimary} group-hover/btn:text-orange-400`
                            }`}
                        />
                      </a>
                    )}
                    {/* GitHub Link - Always shown if available */}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 group/btn ${theme === "light"
                          ? "bg-white border-gray-200 hover:border-purple-400/50"
                          : `${themeClasses.bgSecondary} border-gray-600/50 hover:border-purple-400/50`
                          }`}
                        title="View Source Code"
                      >
                        <Github
                          size={16}
                          className={`transition-colors ${theme === "light"
                            ? "text-gray-700 group-hover/btn:text-purple-500"
                            : `${themeClasses.textPrimary} group-hover/btn:text-purple-400`
                            }`}
                        />
                      </a>
                    )}
                  </div>

                  {/* View More Arrow */}
                  <div
                    className={`transition-all duration-300 ${hoveredProject === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2"
                      }`}
                  >
                    <ArrowUpRight size={18} className="text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Side Accent Line */}
              <div className={`absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme === "light"
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

export default Projects;

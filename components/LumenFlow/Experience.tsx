"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import {
  Briefcase,
  MapPin,
  Calendar,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import MagicWrite from "@/components/Shared/MagicWrite";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { defaultLumenFlowExperienceStyles } from "@/types/experience/lumenflow";

import { Experience as ExperienceData, Technology } from "@/types/experience/shared";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import SectionLoading from "../Shared/SectionLoading";

const Experience = ({ currentTheme, portfolioId }: any) => {
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("layout");

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
  } = useCustomization("experience", defaultLumenFlowExperienceStyles, portfolioId);

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "experience",
    sectionTitle: "Experience",
    sectionDescription: "Experience section"
  });

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const experienceSection = portfolioData?.find(
    (item: any) => item.type === "experience"
  );
  const sectionTitle = experienceSection?.sectionTitle || "Experience";
  const sectionDescription =
    experienceSection?.sectionDescription ||
    "My professional journey through various roles and technologies, showcasing growth, expertise, and the impact I've made in different organizations and projects.";

  const { theme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);

  useEffect(() => {
    if (portfolioData) {
      const expData = portfolioData.find(
        (section: any) => section.type === "experience"
      )?.data;
      if (expData) {
        setExperienceData(expData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-exp-${portfolioId}`)
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

  const titleColor = theme === "light" ? "#f97316" : "#f97316";

  if (isLoading) return <SectionLoading />

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-12 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="experience"
        openVisualEditor={openVisualEditor}
        visualEditorOpen={visualEditorOpen}
      />

      {/* Experience Timeline */}
      <div
        className="space-y-8"
        style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
      >
        {experienceData.map((exp, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredExperience(index)}
            onMouseLeave={() => setHoveredExperience(null)}
          >
            {/* Background Glow Effect */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{
              background: theme === "light"
                ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                : themeClasses.gradientHover
            }}></div>

            {/* Main Card */}
            <div
              className={`relative transition-all duration-${(typeof effectiveCustomization.animationSpeed === 'number' ? effectiveCustomization.animationSpeed : 500) / 100} transform h-full flex flex-col ${effectiveCustomization.cardLayout === "default"
                ? theme === "light"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "bg-zinc-800 border border-zinc-700"
                : effectiveCustomization.cardLayout === "minimal"
                  ? "bg-transparent border-0"
                  : effectiveCustomization.cardLayout === "glassmorphism"
                    ? theme === "light"
                      ? "bg-white/50 backdrop-blur-sm border border-white/20"
                      : "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50"
                    : effectiveCustomization.cardLayout === "neon"
                      ? theme === "light"
                        ? "bg-orange-50/30 border border-orange-300/50 shadow-lg shadow-orange-500/20"
                        : "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                      : effectiveCustomization.cardLayout === "gradient"
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
                borderWidth: effectiveCustomization.cardLayout === "minimal" ? 0 : `${effectiveCustomization.borderWidth}px`,
                transform: effectiveCustomization.hoverEffects && hoveredExperience === index ? "translateY(-4px)" : "none",
                filter: effectiveCustomization.glowEffect ? `drop-shadow(0 0 20px ${titleColor}30)` : "none",
              }}
            >
              {/* Experience Content */}
              <div className="space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{
                      background: theme === "light"
                        ? "linear-gradient(to right, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                        : themeClasses.gradientPrimary
                    }}></div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${theme === "light" ? "text-gray-900" : themeClasses.textPrimary
                      } ${effectiveCustomization.textAlignment === "center"
                        ? "text-center"
                        : effectiveCustomization.textAlignment === "right"
                          ? "text-right"
                          : "text-left"
                      }`}>
                      {exp.role}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 relative">
                  <p className={`text-sm leading-relaxed ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                    }`}>
                    {exp.description}
                  </p>
                  {/* Magic Write Button */}
                  <div className="absolute -top-2 -right-2 z-10 hidden md:block">
                    <MagicWrite
                      onMagicWrite={async (prompt: string) => {
                        const enhanced = await handleMagicWrite(prompt, exp.description, "experience");
                        const updated = [...experienceData];
                        updated[index] = { ...updated[index], description: enhanced };
                        setExperienceData(updated);
                        await saveEnhancedContent(updated);
                        return enhanced;
                      }}
                      placeholder="Enhance this experience description..."
                      buttonText=""
                      context={exp.description}
                      className="w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                {effectiveCustomization.techStackVisible && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star size={14} className="text-orange-400" />
                      <span className={`text-xs font-medium uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}>
                        Tech Stack
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.techStack?.map((tech: Technology, techIndex: number) => (
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
                              ? "border-gray-200 hover:border-orange-400/50 text-gray-600"
                              : "border-gray-700 hover:border-orange-400/50 text-gray-400"
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
                <div className={`flex items-center justify-between pt-4 mt-auto border-t ${theme === "light" ? "border-gray-200/50" : "border-gray-700/50"
                  }`}>
                  <div className="flex items-center space-x-3">
                    {effectiveCustomization.locationBadge && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-orange-400" />
                        <span className={`text-sm ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                          }`}>
                          {exp.location}
                        </span>
                      </div>
                    )}
                    {effectiveCustomization.dateBadge && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className="text-orange-400" />
                        <span className={`text-sm ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                          }`}>
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View More Arrow */}
                  <div
                    className={`transition-all duration-300 ${hoveredExperience === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2"
                      }`}
                  >
                    <ArrowUpRight size={18} className="text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Side Accent Line */}
              {effectiveCustomization.sideAccent && (
                <div
                  className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    width: `${effectiveCustomization.sideAccentWidth}px`,
                    background: theme === "light"
                      ? "linear-gradient(to bottom, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                      : themeClasses.gradientPrimary
                  }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {experienceData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400">
              No experience yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start adding your professional experience to showcase your career
              journey and expertise.
            </p>
          </div>
        </div>
      )}

      <ExperienceVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={customization}
        draftCustomization={draftCustomization}
        onUpdateDraft={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        primaryColor={titleColor}
        primaryDarkColor={titleColor}
      />
    </div>
  );
};

export default Experience;

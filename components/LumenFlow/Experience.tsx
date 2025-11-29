"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
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
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization, updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import MagicWrite from "@/components/Shared/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { ExperienceCustomizationState } from "@/types/experience/portfolio";

import { Experience as ExperienceData, Technology } from "@/types/experience/shared";

const Experience = ({ currentTheme, portfolioId }: any) => {
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(
    null
  );
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("layout");

  // Default styles for Experience
  const defaultExperienceStyles: ExperienceCustomizationState = {
    // Layout & Structure
    cardLayout: "default",
    cardBorderRadius: 12,
    cardPadding: 24,
    cardSpacing: 32,
    containerWidth: "wide",
    maxWidth: "full",
    containerPadding: 8,
    backgroundColor: "transparent",

    // Typography
    titleSize: "lg",
    titleWeight: "bold",
    descriptionSize: "md",
    textAlignment: "left",
    roleSize: "xl",
    roleWeight: "bold",
    roleColor: "primary",
    companyNameSize: "lg",
    companyNameWeight: "medium",
    companyNameColor: "gray-700",
    dateColor: "gray-500",
    descriptionColor: "gray-600",

    // Visual Effects
    hoverEffects: true,
    glowEffect: false,
    borderGlow: false,
    backgroundOpacity: 10,
    borderWidth: 1,
    cardBackground: "transparent",
    cardBorderColor: "gray-200",
    cardShadow: "none",

    // Animations
    animationStyle: "scale",
    animationSpeed: 300,
    staggerDelay: 100,

    // Tech Stack Display
    techStackVisible: true,
    techStackStyle: "pills",
    techStackSize: "sm",

    // Timeline Elements
    timelineStyle: "line",
    timelinePosition: "left",
    timelineWidth: 2,
    timelineColor: "primary",
    dotSize: "md",
    dotStyle: "circle",

    // Badges & Tags
    locationBadge: true,
    dateBadge: true,
    badgeStyle: "default",

    // Date Formatting
    dateFormat: "full-date",

    // Layout Options
    alternatingLayout: false,

    // Side Accent
    sideAccent: false,
    sideAccentColor: "primary",
    sideAccentWidth: 4,

    // Missing Properties
    cardBorderStyle: "none",
    titleColor: "gray-900",
    titleAlignment: "left",
    descriptionVisible: true,
    headerVisible: true,
    locationVisible: true,
    locationColor: "gray-500",
    descriptionTextSize: "md",
    descriptionTextColor: "gray-600",
    hoverScale: true,
    hoverShadow: true,
    cardHoverEffect: "lift",
    staggerAnimation: true,
    entranceAnimation: "fadeUp",
    techStackLimit: 5,
    techStackColor: "gray",
    techStackShowIcons: true,
  };

  const [customization, setCustomization] = useState<ExperienceCustomizationState>(defaultExperienceStyles);
  const [draftCustomization, setDraftCustomization] = useState<ExperienceCustomizationState | null>(null);

  const dispatch = useDispatch();
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const experienceSection = portfolioData?.find(
    (item: any) => item.type === "experience"
  );
  const sectionTitle = experienceSection?.sectionTitle || "Experience";
  const sectionDescription =
    experienceSection?.sectionDescription ||
    "My professional journey through various roles and technologies, showcasing growth, expertise, and the impact I've made in different organizations and projects.";

  // Magic Write functionality
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this experience description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
          context: context || "",
          section: "experience-description"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance description');
      }

      const data = await response.json();
      const enhancedDescription = data.response || data.content || data.result;

      return enhancedDescription;
    } catch (error) {
      console.error('Magic Write API error:', error);
      throw error;
    }
  };

  const handleDescriptionUpdate = async (experienceIndex: number, newDescription: string) => {
    const updatedExperience = [...experienceData];
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      description: newDescription
    };
    setExperienceData(updatedExperience);
    try {
      const result = await updateSection({
        sectionName: "experience",
        portfolioId,
        sectionContent: updatedExperience,
        sectionTitle: "Experience",
        sectionDescription: "Experience section"
      });
      if (result.success) {
        toast.success("Experience description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving experience description:", error);
      toast.error("Failed to save changes to database");
    }
  };

  const { theme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from Redux state or database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        // First check if customizations exist in Redux state
        if (componentCustomizations && componentCustomizations["experience"]) {
          setCustomization(componentCustomizations["experience"] as ExperienceCustomizationState);
        } else {
          // Fallback to database
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "experience",
          });
          if (result.success && result.data) {
            setCustomization(result.data as any);
            // Update Redux state
            dispatch(setComponentCustomizations({
              ...componentCustomizations,
              experience: result.data
            }));
          } else {
            setCustomization(defaultExperienceStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultExperienceStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId, componentCustomizations, dispatch]);

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

  // Visual Editor Functions
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  const updateDraftCustomization = (key: keyof ExperienceCustomizationState, value: any) => {
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
        componentType: "experience",
        settings: draftCustomization,
      });
      if (result.success) {
        // Update Redux state
        dispatch(setComponentCustomizations({
          ...componentCustomizations,
          experience: draftCustomization
        }));
        toast.success("Customization saved successfully");
      } else {
        toast.error("Failed to save customization");
      }
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "experience",
      });
      setCustomization(defaultExperienceStyles);
      setDraftCustomization(defaultExperienceStyles);
      setVisualEditorOpen(false);
      // Update Redux state
      const updatedCustomizations = { ...componentCustomizations };
      delete updatedCustomizations["experience"];
      dispatch(setComponentCustomizations(updatedCustomizations));
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

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
                      onMagicWrite={async (prompt: string, context?: string) => {
                        const enhancedDescription = await handleMagicWrite(prompt, exp.description);
                        handleDescriptionUpdate(index, enhancedDescription);
                        return enhancedDescription;
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

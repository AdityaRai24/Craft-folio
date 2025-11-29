"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { supabase } from "@/lib/supabase-client";
import {
  GraduationCap,
  MapPin,
  Calendar, ArrowUpRight,
} from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import {
  getComponentCustomization,
  saveComponentCustomization,
  deleteComponentCustomization,
  updateSection
} from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import MagicWrite from "@/components/Shared/MagicWrite";
import EducationVisualEditor from "@/components/VisualEditor/Education/EducationVisualEditor";
import { EducationCustomizationState } from "@/components/NeoSpark/defaultStyles/types";

import { Education as EducationData, Technology } from "@/types/experience/shared";

interface EducationProps {
  currentTheme: string;
  portfolioId: string;
}

const Education: React.FC<EducationProps> = ({ currentTheme, portfolioId }) => {
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredEducation, setHoveredEducation] = useState<number | null>(null);

  // Visual Editor States
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");

  const dispatch = useDispatch();
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const educationSection = portfolioData?.find(
    (item: any) => item.type === "education"
  );
  const sectionTitle = educationSection?.sectionTitle || "Education";
  const sectionDescription =
    educationSection?.sectionDescription ||
    "My educational journey through various institutions and courses, building the foundation of knowledge and skills that drive my professional growth and expertise.";

  // Magic Write functionality
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this education description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
          context: context || "",
          section: "education-description"
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

  const handleDescriptionUpdate = async (educationIndex: number, newDescription: string) => {
    const updatedEducation = [...educationData];
    updatedEducation[educationIndex] = {
      ...updatedEducation[educationIndex],
      description: newDescription
    };
    setEducationData(updatedEducation);
    toast.success("Education description enhanced successfully!");
    try {
      const result = await updateSection({
        sectionName: "education",
        portfolioId,
        sectionContent: updatedEducation,
        sectionTitle: "Education",
        sectionDescription: "Education section"
      });
      if (result.success) {
        toast.success("Education description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving education description:", error);
      toast.error("Failed to save changes to database");
    }
  };

  const themeClasses = getThemeClasses(currentTheme);
  const { theme } = useLumenFlowTheme();

  // Default styles matching current LumenFlow Education appearance
  const defaultEducationStyles: EducationCustomizationState = {
    cardStyle: "default",
    cardBorderRadius: 16,
    cardPadding: 24,
    cardSpacing: 32,
    titleSize: "lg",
    titleWeight: "bold",
    textAlignment: "left",
    hoverEffects: true,
    glowEffect: true,
    borderGlow: false,
    backgroundOpacity: 0,
    borderWidth: 1,
    animationStyle: "fade",
    animationSpeed: 500,
    staggerDelay: 100,
    showInstitution: true,
    showDates: true,
    showLocation: true,
    showDescription: true,
    descriptionStyle: "expand",
    accentLine: true,
    accentLineStyle: "gradient",
    accentLineWidth: 4,
    accentLineColor: "#f97316",
    cardShadow: false,
    shadowIntensity: 1,
    backgroundBlur: false,
    blurIntensity: 10,
    showArrow: true,
    arrowStyle: "animated",
    dateFormat: "short",
    institutionStyle: "minimal",
    institutionSize: "sm",
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<EducationCustomizationState>(
    defaultEducationStyles
  );
  const [draftCustomization, setDraftCustomization] =
    useState<EducationCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization =
    visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from Redux state or database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        // First check if customizations exist in Redux state
        if (componentCustomizations && componentCustomizations["education"]) {
          setCustomization(componentCustomizations["education"] as EducationCustomizationState);
        } else {
          // Fallback to database
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "education",
          });
          if (result.success && result.data) {
            setCustomization(result.data as any);
            // Update Redux state
            dispatch(setComponentCustomizations({
              ...componentCustomizations,
              education: result.data
            }));
          } else {
            setCustomization(defaultEducationStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultEducationStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId, componentCustomizations, dispatch]);

  // Visual Editor Functions
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  const updateDraftCustomization = (
    key: keyof EducationCustomizationState,
    value: any
  ) => {
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
        componentType: "education",
        settings: draftCustomization,
      });
      if (result.success) {
        // Update Redux state
        dispatch(setComponentCustomizations({
          ...componentCustomizations,
          education: draftCustomization
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
        componentType: "education",
      });
      setCustomization(defaultEducationStyles);
      setDraftCustomization(defaultEducationStyles);
      setVisualEditorOpen(false);
      // Update Redux state
      const updatedCustomizations = { ...componentCustomizations };
      delete updatedCustomizations["education"];
      dispatch(setComponentCustomizations(updatedCustomizations));
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  useEffect(() => {
    if (portfolioData) {
      const eduData = portfolioData.find(
        (section: any) => section.type === "education"
      )?.data;
      if (eduData) {
        setEducationData(eduData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-edu-${portfolioId}`)
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

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 lg:space-y-8 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-300 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  const titleColor = theme === "light" ? "#f97316" : "#f97316";

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="education"
        openVisualEditor={openVisualEditor}
        visualEditorOpen={visualEditorOpen}
      />

      {/* Education Content */}
      <div
        className="space-y-6"
        style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
      >
        {educationData.map((edu, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredEducation(index)}
            onMouseLeave={() => setHoveredEducation(null)}
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                    : themeClasses.gradientHover,
              }}
            ></div>

            {/* Main Card */}
            <div
              className={`relative transition-all duration-${effectiveCustomization.animationSpeed / 100
                } transform group-hover:translate-y-[-4px] h-full flex flex-col ${effectiveCustomization.cardStyle === "default"
                  ? theme === "light"
                    ? "bg-white border border-gray-200 shadow-sm"
                    : "bg-zinc-800 border border-zinc-700"
                  : effectiveCustomization.cardStyle === "minimal"
                    ? "bg-transparent border-0"
                    : effectiveCustomization.cardStyle === "glassmorphism"
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
                transform:
                  effectiveCustomization.hoverEffects &&
                    hoveredEducation === index
                    ? "translateY(-4px) scale(1.02)"
                    : "none",
                filter: effectiveCustomization.glowEffect
                  ? `drop-shadow(0 0 20px ${titleColor}30)`
                  : "none",
                ...(effectiveCustomization.cardShadow && {
                  boxShadow: `0 ${effectiveCustomization.shadowIntensity * 4
                    }px ${effectiveCustomization.shadowIntensity * 8
                    }px rgba(0,0,0,0.1), 0 0 ${effectiveCustomization.shadowIntensity * 20
                    }px ${titleColor}20`,
                }),
              }}
            >
              {/* Education Content */}
              <div className="space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background:
                          theme === "light"
                            ? "linear-gradient(to right, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                            : themeClasses.gradientPrimary,
                      }}
                    ></div>
                    <h3
                      className={`transition-colors duration-300 ${theme === "light"
                        ? "text-gray-900"
                        : themeClasses.textPrimary
                        } ${effectiveCustomization.textAlignment === "center"
                          ? "text-center"
                          : effectiveCustomization.textAlignment === "right"
                            ? "text-right"
                            : "text-left"
                        } ${effectiveCustomization.titleSize === "sm"
                          ? "text-lg"
                          : effectiveCustomization.titleSize === "md"
                            ? "text-xl"
                            : effectiveCustomization.titleSize === "lg"
                              ? "text-2xl"
                              : "text-3xl"
                        } ${effectiveCustomization.titleWeight === "normal"
                          ? "font-normal"
                          : effectiveCustomization.titleWeight === "medium"
                            ? "font-medium"
                            : effectiveCustomization.titleWeight === "semibold"
                              ? "font-semibold"
                              : "font-bold"
                        }`}
                    >
                      {edu.degree}
                    </h3>
                  </div>

                  {effectiveCustomization.showInstitution && (
                    <div className="flex items-center space-x-2 pl-6">
                      <GraduationCap size={16} className="text-orange-400" />
                      <span
                        className={`text-base font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"
                          }`}
                      >
                        {edu.institution}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {effectiveCustomization.showDescription && edu.description && (
                  <div className="space-y-2 relative pl-6">
                    <p
                      className={`text-sm leading-relaxed ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                        }`}
                    >
                      {edu.description}
                    </p>
                    {/* Magic Write Button */}
                    <div className="absolute -top-2 -right-2 z-10 hidden md:block">
                      <MagicWrite
                        onMagicWrite={async (prompt: string, context?: string) => {
                          const enhancedDescription = await handleMagicWrite(prompt, edu.description || "");
                          handleDescriptionUpdate(index, enhancedDescription);
                          return enhancedDescription;
                        }}
                        placeholder="Enhance this education description..."
                        buttonText=""
                        context={edu.description}
                        className="w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Section */}
                <div
                  className={`flex items-center justify-between pt-4 mt-auto border-t ${theme === "light" ? "border-gray-200/50" : "border-gray-700/50"
                    }`}
                >
                  <div className="flex items-center space-x-4 pl-6">
                    {effectiveCustomization.showLocation && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-orange-400" />
                        <span
                          className={`text-sm ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                            }`}
                        >
                          {edu.location}
                        </span>
                      </div>
                    )}
                    {effectiveCustomization.showDates && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className="text-orange-400" />
                        <span
                          className={`text-sm ${theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                            }`}
                        >
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View More Arrow */}
                  {effectiveCustomization.showArrow && (
                    <div
                      className={`transition-all duration-300 ${hoveredEducation === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                        }`}
                    >
                      <ArrowUpRight size={18} className="text-orange-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Side Accent Line */}
              {effectiveCustomization.accentLine && (
                <div
                  className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    width: `${effectiveCustomization.accentLineWidth}px`,
                    background:
                      theme === "light"
                        ? "linear-gradient(to bottom, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                        : themeClasses.gradientPrimary,
                  }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {educationData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <GraduationCap size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400">
              No education added yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Add your educational background to showcase your academic
              achievements.
            </p>
          </div>
        </div>
      )}

      <EducationVisualEditor
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

export default Education;

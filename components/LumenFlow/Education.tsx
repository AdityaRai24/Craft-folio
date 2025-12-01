"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  GraduationCap,
  MapPin,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";
import MagicWrite from "@/components/Shared/MagicWrite";
import LumenFlowEducationVisualEditor from "@/components/VisualEditor/Education/LumenFlowEducationVisualEditor";
import { defaultLumenFlowEducationStyles } from "@/types/education/lumenflow";
import { Education as EducationData } from "@/types/experience/shared";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import { useLumenEducationStyles } from "@/hooks/useLumenEducationStyles";
import SectionLoading from "../Shared/SectionLoading";

interface EducationProps {
  currentTheme: string;
  portfolioId: string;
}

type Tab = "layout" | "typography" | "styling" | "timing"


const Education: React.FC<EducationProps> = ({ currentTheme, portfolioId }) => {
  const [hoveredEducation, setHoveredEducation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("layout");

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const educationSection = portfolioData?.find(
    (item: any) => item.type === "education"
  );
  const sectionTitle = educationSection?.sectionTitle || "Education";
  const sectionDescription =
    educationSection?.sectionDescription ||
    "My educational journey through various institutions and courses, building the foundation of knowledge and skills that drive my professional growth and expertise.";

  const {
    customization,
    effectiveCustomization,
    visualEditorOpen,
    setVisualEditorOpen,
    openVisualEditor,
    updateDraftCustomization,
    saveDraftCustomization,
    resetCustomization,
    draftCustomization,
  } = useCustomization(
    "education",
    defaultLumenFlowEducationStyles,
    portfolioId
  );

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "education",
    sectionTitle: "Education",
    sectionDescription: "Education section",
  });

  const themeClasses = getThemeClasses(currentTheme);
  const { theme } = useLumenFlowTheme();

  const {
    getCardClasses,
    getCardStyle,
    getTitleClasses,
    getGlowStyle,
    getDotStyle,
    getAccentLineStyle,
  } = useLumenEducationStyles(
    effectiveCustomization,
    theme,
    themeClasses,
    hoveredEducation
  );

  const educationData: EducationData[] =
    portfolioData?.find((section: any) => section.type === "education")?.data ||
    [];

  if (!portfolioData) {
    return <SectionLoading />;
  }

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
              style={getGlowStyle()}
            ></div>

            {/* Main Card */}
            <div className={getCardClasses()} style={getCardStyle(index)}>
              {/* Education Content */}
              <div className="space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={getDotStyle()}
                    ></div>
                    <h3 className={getTitleClasses()}>{edu.degree}</h3>
                  </div>

                  {effectiveCustomization.showInstitution && (
                    <div className="flex items-center space-x-2 pl-6">
                      <GraduationCap size={16} className={theme === "light" ? "text-orange-500" : "text-emerald-500"} />
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
                      className={`text-sm leading-relaxed ${theme === "light"
                        ? "text-gray-600"
                        : themeClasses.textSecondary
                        }`}
                    >
                      {edu.description}
                    </p>
                    {/* Magic Write Button */}
                    <div className="absolute -top-2 -right-2 z-10 hidden md:block">
                      <MagicWrite
                        onMagicWrite={async (prompt: string) => {
                          const enhanced = await handleMagicWrite(
                            prompt,
                            edu.description || "",
                            "education"
                          );
                          const updated = [...educationData];
                          updated[index] = {
                            ...updated[index],
                            description: enhanced,
                          };
                          await saveEnhancedContent(updated);
                          return enhanced;
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
                  className={`flex items-center justify-between pt-4 mt-auto border-t ${theme === "light"
                    ? "border-gray-200/50"
                    : "border-gray-700/50"
                    }`}
                >
                  <div className="flex items-center space-x-4 pl-6">
                    {effectiveCustomization.showLocation && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className={theme === "light" ? "text-orange-500" : "text-emerald-500"} />
                        <span
                          className={`text-sm ${theme === "light"
                            ? "text-gray-600"
                            : themeClasses.textSecondary
                            }`}
                        >
                          {edu.location}
                        </span>
                      </div>
                    )}
                    {effectiveCustomization.showDates && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className={theme === "light" ? "text-orange-500" : "text-emerald-500"} />
                        <span
                          className={`text-sm ${theme === "light"
                            ? "text-gray-600"
                            : themeClasses.textSecondary
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
                      <ArrowUpRight size={18} className={theme === "light" ? "text-orange-500" : "text-emerald-500"} />
                    </div>
                  )}
                </div>
              </div>

              {/* Side Accent Line */}
              {effectiveCustomization.accentLine && (
                <div
                  className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={getAccentLineStyle()}
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

      <LumenFlowEducationVisualEditor
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

export default Education;

"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import SectionHeader from "./SectionHeader";
import { ColorTheme } from "@/lib/colorThemes";
import MagicWrite from "@/components/Shared/MagicWrite";
import {
  MapPin,
  Building,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { Experience } from "@/types/experience/shared";
import { defaultNeoSparkExperienceStyles } from "@/types/experience/neospark";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import SectionLoading from "../Shared/SectionLoading";

type Tab = "layout" | "typography" | "styling" | "timing";

const ProfessionalJourney = ({ currentPortTheme, customCSS, portfolioId }: any) => {

  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("layout");

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

  const experienceSection = portfolioData?.find(
    (item: any) => item.type === "experience"
  );

  const sectionTitle =
    experienceSection?.sectionTitle || "Professional Journey";
  const sectionDescription =
    experienceSection?.sectionDescription ||
    "Building real-world experience through innovative projects";

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "experience",
    sectionTitle: "Experience",
    sectionDescription: "Experience section"
  });

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
  } = useCustomization("experience", defaultNeoSparkExperienceStyles, portfolioId);

  const {
    getContainerClasses,
    getCardClasses,
    getCardStyle,
    getTitleClasses,
    getDescriptionClasses,
    getTechStackClasses,
    getTimelineStyles,
    getAnimationVariants,
    getBadgeClasses,
    getBadgeStyle
  } = useExperienceStyles(effectiveCustomization, "dark", titleColor);


  useEffect(() => {
    if (portfolioData) {
      const experienceSectionData = portfolioData.find(
        (section: any) => section.type === "experience"
      )?.data;
      if (experienceSectionData) {
        setExperienceData(experienceSectionData || []);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);


  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-experience-${portfolioId}`)
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


  const animationVariants = getAnimationVariants();
  const timelineStyles = getTimelineStyles();
  const isAlternating = effectiveCustomization.timelinePosition === "alternating";

  if (isLoading) return <SectionLoading />


  return (
    <section
      id="experience"
      className="py-12 sm:py-16 md:py-24 w-full bg-black overflow-hidden min-h-screen text-white relative"
    >
      <style>{customCSS}</style>
      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <SectionHeader
          sectionName="experience"
          sectionTitle={sectionTitle}
          sectionDescription={sectionDescription}
          titleColor={titleColor}
          onVisualEditorOpen={openVisualEditor}
        />

        <div className={getContainerClasses()}>
          {experienceData.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              No professional experience added yet.
            </div>
          ) : (
            experienceData.map((experience, index) => (
              <motion.div
                key={index}
                className={`relative mb-8 last:mb-0 ${isAlternating ? "w-full" : ""}`}
                variants={animationVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div
                  className={`absolute z-10 flex items-center justify-center ${timelineStyles.dot} ${isAlternating ? "left-1/2 -translate-x-1/2" : "left-4 -translate-x-1/2"
                    }`}
                  style={{
                    boxShadow: effectiveCustomization.borderGlow
                      ? `0 0 10px ${ColorTheme.primary}50`
                      : "none",
                    top: "1.5rem",
                    ...timelineStyles.dotStyle,
                  }}
                ></div>
                {index !== experienceData.length - 1 && (
                  <div
                    className={`absolute top-0 bottom-0 ${timelineStyles.line} ${isAlternating ? "left-1/2 -translate-x-1/2" : "left-4 -translate-x-1/2"
                      }`}
                    style={{
                      ...timelineStyles.lineStyle,
                      top: "3rem",
                      height: "calc(100% + 2rem)",
                    }}
                  ></div>
                )}

                <div
                  className={`${getCardClasses()} ${isAlternating
                    ? `w-[calc(50%-2rem)] ${index % 2 === 0 ? "mr-auto text-right" : "ml-auto text-left"
                    }`
                    : "ml-8 sm:ml-20"
                    }`}
                  style={{
                    ...getCardStyle(false),
                    borderColor:
                      effectiveCustomization.cardLayout === "minimal"
                        ? titleColor
                        : `${titleColor}30`,
                  }}
                >
                  <h2 className={getTitleClasses()}>{experience.role}</h2>

                  <div className={`flex flex-wrap items-center gap-2 mb-2 sm:mb-4 text-gray-400 ${isAlternating && index % 2 === 0 ? "justify-end" : "justify-start"
                    }`}>
                    <span
                      className={`truncate max-w-[60vw] sm:max-w-none ${effectiveCustomization.descriptionSize === "lg"
                        ? "text-lg"
                        : effectiveCustomization.descriptionSize === "md"
                          ? "text-base"
                          : "text-sm"
                        }`}
                    >
                      <Building className="inline h-4 w-4 mr-1" />
                      {experience.companyName}
                    </span>

                    {(draftCustomization?.locationBadge ?? customization.locationBadge) && experience.location && (
                      <span
                        className={getBadgeClasses()}
                        style={getBadgeStyle()}
                      >
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {experience.location}
                      </span>
                    )}

                    {(draftCustomization?.dateBadge ?? customization.dateBadge) && (
                      <span
                        className={getBadgeClasses()}
                        style={getBadgeStyle()}
                      >
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {experience.startDate} - {experience.endDate}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <p className={getDescriptionClasses()}>
                      {experience.description}
                    </p>
                    {/* Magic Write Button */}
                    <div className={`absolute -top-2 z-10 hidden md:block ${isAlternating && index % 2 === 0 ? "-left-10" : "-right-2"
                      }`}>
                      <MagicWrite
                        onMagicWrite={async (prompt: string) => {
                          const enhanced = await handleMagicWrite(prompt, experience.description, "experience");
                          const updated = [...experienceData];
                          updated[index] = { ...updated[index], description: enhanced };
                          setExperienceData(updated);
                          await saveEnhancedContent(updated);
                          return enhanced;
                        }}
                        placeholder="Enhance this experience description..."
                        buttonText=""
                        context={experience?.description}
                        className="w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
                      />
                    </div>
                  </div>

                  {effectiveCustomization.techStackVisible && experience.techStack && (
                    <div className={`mt-4 flex flex-wrap gap-2 ${isAlternating && index % 2 === 0 ? "justify-end" : "justify-start"
                      }`}>
                      {experience.techStack.map((tech, i) => (
                        <span key={i} className={getTechStackClasses()}>
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div >

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
        primaryColor={ColorTheme.primary}
        primaryDarkColor={ColorTheme.primaryDark}
      />

    </section >
  );
};

export default ProfessionalJourney;

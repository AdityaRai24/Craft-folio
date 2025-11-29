"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import SectionHeader from "./SectionHeader";
import { ColorTheme } from "@/lib/colorThemes";
import { updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import MagicWrite from "@/components/Shared/MagicWrite";
import {
  MapPin,
  Building,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { Experience } from "@/types/experience/shared";
import { defaultExperienceStyles } from "@/types/experience/portfolio";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";

const ProfessionalJourney = ({ currentPortTheme, customCSS, portfolioId }: any) => {


  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
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

  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  } = useCustomization("experience", defaultExperienceStyles, portfolioId);

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



  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadingVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
    if (experienceData.length > 0) {
      setVisibleItems(Array(experienceData.length).fill(false));

      experienceData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 500 + index * effectiveCustomization.staggerDelay);
      });
    }
  }, [experienceData, effectiveCustomization.staggerDelay]);

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

  const animationVariants = getAnimationVariants();
  const timelineStyles = getTimelineStyles();

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
                className="relative mb-8 last:mb-0"
                variants={animationVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div
                  className={`absolute left-0 sm:left-4 w-4 h-4 rounded-full z-10`}
                  style={{
                    boxShadow: effectiveCustomization.borderGlow
                      ? `0 0 10px ${ColorTheme.primary}50`
                      : "none",
                    top: "1.5rem",
                  }}
                ></div>
                {index !== experienceData.length - 1 && (
                  <div
                    className={`absolute left-2 sm:left-6 top-0 bottom-0 ${timelineStyles.line}`}
                    style={{
                      ...timelineStyles.lineStyle,
                      transform: "translateX(-50%)",
                      top: "3rem",
                      height: "calc(100% + 2rem)",
                    }}
                  ></div>
                )}

                <div
                  className={`ml-8 sm:ml-20 ${getCardClasses()}`}
                  style={{
                    ...getCardStyle(false),
                    borderColor:
                      effectiveCustomization.cardLayout === "minimal"
                        ? titleColor
                        : `${titleColor}30`,
                  }}
                >
                  <h2 className={getTitleClasses()}>{experience.role}</h2>

                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4 text-gray-400">
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
                    <div className="absolute -top-2 -right-2 z-10 hidden md:block">
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
                    <div className="mt-4 flex flex-wrap gap-2">
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

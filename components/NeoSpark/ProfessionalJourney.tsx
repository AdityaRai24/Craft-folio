"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { supabase } from "@/lib/supabase-client";
import SectionHeader from "./SectionHeader";
import { ColorTheme } from "@/lib/colorThemes";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization, updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import MagicWrite from "@/components/Shared/MagicWrite";
import {
  MapPin,
  Building,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { Experience, Technology } from "@/types/experience/shared";
import { ExperienceCustomizationState, defaultExperienceStyles } from "@/types/experience/portfolio";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";

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
    try {
      const updatedExperience = [...experienceData];
      updatedExperience[experienceIndex] = {
        ...updatedExperience[experienceIndex],
        description: newDescription
      };
      setExperienceData(updatedExperience);

      // Save to database
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

  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "styling" | "timing"
  >("layout");

  const dispatch = useDispatch();

  // Comprehensive customization state
  const [customization, setCustomization] = useState<ExperienceCustomizationState>(defaultExperienceStyles);
  const [draftCustomization, setDraftCustomization] = useState<ExperienceCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from Redux state or database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        // First check if customizations exist in Redux state
        if (componentCustomizations && componentCustomizations["professional-journey"]) {
          setCustomization(componentCustomizations["professional-journey"] as ExperienceCustomizationState);
        } else {
          // Fallback to database
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "professional-journey",
          });
          if (result.success && result.data) {
            setCustomization(result.data as any);
            // Update Redux state
            dispatch(setComponentCustomizations({
              ...componentCustomizations,
              "professional-journey": result.data
            }));
          } else {
            setCustomization(defaultExperienceStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultExperienceStyles);
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
  const updateDraftCustomization = (key: keyof ExperienceCustomizationState, value: any) => {
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
        componentType: "professional-journey",
        settings: draftCustomization,
      });
      if (result.success) {
        // Update Redux state
        dispatch(setComponentCustomizations({
          ...componentCustomizations,
          "professional-journey": draftCustomization
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
        componentType: "professional-journey",
      });
      setCustomization(defaultExperienceStyles);
      setDraftCustomization(defaultExperienceStyles);
      setVisualEditorOpen(false);
      // Update Redux state
      const updatedCustomizations = { ...componentCustomizations };
      delete updatedCustomizations["professional-journey"];
      dispatch(setComponentCustomizations(updatedCustomizations));
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

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
                        onMagicWrite={async (prompt: string, context?: string) => {
                          const enhancedDescription = await handleMagicWrite(prompt, experience?.description);
                          handleDescriptionUpdate(index, enhancedDescription);
                          return enhancedDescription;
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

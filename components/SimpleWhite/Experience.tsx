"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase-client';
import SectionHeader from './SectionHeader';
import MagicWrite from "@/components/Shared/MagicWrite";
import { Experience as ExperienceData, Technology } from "@/types/experience/shared";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { ColorTheme } from "@/lib/colorThemes";
import { defaultExperienceStyles } from "@/types/experience/portfolio";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";

const Experience: React.FC = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);

  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];

  const primaryColor = theme?.colors?.primary || "blue-600";
  const primaryDarkColor = theme?.colors?.primaryDark || "blue-700";
  const primaryHoverColor = theme?.colors?.primaryHover || "#1D4ED8";
  const accentColor = theme?.colors?.accent || "#3B82F6";
  const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
  const textSecondaryColor = theme?.colors?.text?.secondary || "gray-600";
  const backgroundPrimaryColor = theme?.colors?.backgroundPrimary || "white";
  const backgroundSecondaryColor = theme?.colors?.backgroundSecondary || "gray-50";
  const mutedColor = theme?.colors?.states?.muted || "rgba(59, 130, 246, 0.1)";

  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("layout");
  const [isSmallScreen, setIsSmallScreen] = useState(false);


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


  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "experience"
  });

  const {
    getCardClasses,
    getTechStackClasses,
    getAnimationVariants,
  } = useExperienceStyles(effectiveCustomization, "light", primaryColor);

  const alignmentMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const titleSizeMap = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-4xl md:text-5xl",
    "2xl": "text-5xl md:text-6xl",
    "3xl": "text-6xl md:text-7xl",
  };

  const weightMap = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const getHeaderClasses = () => {
    return {
      container: `${alignmentMap[effectiveCustomization.titleAlignment]} mb-12 sm:mb-16 md:mb-20`,
      title: `font-display section-title ${titleSizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} tracking-tight text-${effectiveCustomization.titleColor} mb-3 sm:mb-4 transition-all duration-700`,
      description: `font-sans text-base sm:text-lg section-description md:text-xl font-normal text-${effectiveCustomization.descriptionColor} tracking-normal leading-relaxed max-w-2xl ${effectiveCustomization.titleAlignment === "center" ? "mx-auto" : ""} transition-all duration-700`,
    };
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.matchMedia("(max-width: 640px)").matches);
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadingVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const experienceSectionData = portfolioData.find((section: any) => section.type === "experience")?.data;
      const experienceSection = portfolioData.find((section: any) => section.type === "experience");
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
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 500 + (index * 200)); // Staggered timing
      });
    }
  }, [experienceData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-experience-${portfolioId}`)
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Portfolio',
          filter: `id=eq.${portfolioId}`
        },
        (payload) => {
        }
      )
      .subscribe((status) => {
      });

    return () => {
      subscription.unsubscribe();
    }
  }, [portfolioId]);

  if (isLoading) {
    return (
      <section
        id="experience"
        className="min-h-screen flex items-center justify-center text-black relative overflow-hidden py-20"
      >
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">Loading...</div>
        </div>
      </section>
    );
  }

  const animationVariants = getAnimationVariants();

  return (
    <section
      id="experience"
      className="py-20 bg-white"
    >
      <style>{customCSS}</style>

      <div className={`relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 ${effectiveCustomization.maxWidth === "md" ? "max-w-4xl" :
        effectiveCustomization.maxWidth === "lg" ? "max-w-5xl" :
          effectiveCustomization.maxWidth === "xl" ? "max-w-6xl" :
            effectiveCustomization.maxWidth === "2xl" ? "max-w-7xl" :
              effectiveCustomization.maxWidth === "full" ? "max-w-full" :
                "max-w-7xl"
        }`}>
        <SectionHeader
          sectionName="experience"
          headerVisible={effectiveCustomization.headerVisible}
          titleSize={effectiveCustomization.titleSize as any}
          titleWeight={effectiveCustomization.titleWeight as any}
          titleColor={effectiveCustomization.titleColor as any}
          titleAlignment={effectiveCustomization.titleAlignment as any}
          descriptionSize={effectiveCustomization.descriptionSize as any}
          descriptionColor={effectiveCustomization.descriptionColor as any}
          descriptionVisible={effectiveCustomization.descriptionVisible}
          title={portfolioData?.find((section: any) => section.type === "experience")?.sectionTitle || "Professional Experience"}
          description={portfolioData?.find((section: any) => section.type === "experience")?.sectionDescription || "My journey in the industry"}
          onVisualEditorClick={openVisualEditor}
          headerClasses={getHeaderClasses()}
          currentPortTheme={currentPortTheme}
        />

        {experienceData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No professional experience added yet.
          </div>
        ) : (
          <>
            <motion.div
              variants={effectiveCustomization.staggerAnimation ? animationVariants : undefined}
              initial={effectiveCustomization.staggerAnimation ? "hidden" : undefined}
              whileInView={effectiveCustomization.staggerAnimation ? "visible" : undefined}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              {experienceData.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={effectiveCustomization.staggerAnimation ? animationVariants : undefined}
                  className={`${getCardClasses()} ${visibleItems[index] ? 'opacity-100' : 'opacity-0'
                    } mx-auto`}
                >

                  <motion.div className="mb-6">
                    <h3 className={`font-title section-sub-title mb-2 ${effectiveCustomization.roleSize === "sm" ? "text-lg md:text-xl" :
                      effectiveCustomization.roleSize === "md" ? "text-xl md:text-2xl" :
                        effectiveCustomization.roleSize === "lg" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
                      } ${effectiveCustomization.roleWeight === "normal" ? "font-normal" :
                        effectiveCustomization.roleWeight === "medium" ? "font-medium" :
                          effectiveCustomization.roleWeight === "semibold" ? "font-semibold" : "font-bold"
                      }`}
                      style={{ color: textPrimaryColor }}>
                      {exp.role}
                    </h3>
                    <p className={`font-title section-sub-title mb-3 ${effectiveCustomization.companyNameSize === "sm" ? "text-base" :
                      effectiveCustomization.companyNameSize === "md" ? "text-lg" :
                        effectiveCustomization.companyNameSize === "lg" ? "text-xl" : "text-2xl"
                      } ${effectiveCustomization.companyNameWeight === "normal" ? "font-normal" :
                        effectiveCustomization.companyNameWeight === "medium" ? "font-medium" :
                          effectiveCustomization.companyNameWeight === "semibold" ? "font-semibold" : "font-bold"
                      }`}
                      style={{ color: textSecondaryColor }}>
                      {exp.company}
                    </p>
                    <p className={`font-sans text-sm uppercase tracking-wider font-medium`}
                      style={{ color: textSecondaryColor }}>
                      {effectiveCustomization.dateFormat === "year-only"
                        ? `${(exp.startDate || "").split(' ')[1] || exp.startDate} - ${(exp.endDate || "").split(' ')[1] || exp.endDate}`
                        : `${exp.startDate} - ${exp.endDate}`}
                    </p>
                    {effectiveCustomization.locationVisible && exp.location && (
                      <span className="capitalize" style={{ color: textSecondaryColor }}>{exp.location}</span>
                    )}
                  </motion.div>

                  <ul className="space-y-4">
                    <motion.li
                      className="flex items-start group relative"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full mt-2.5 mr-3 flex-shrink-0" style={{ backgroundColor: textSecondaryColor }} />
                      <div className="flex-1 relative">
                        <p className={`font-sans section-sub-description leading-relaxed font-normal ${effectiveCustomization.descriptionTextSize === "sm" ? "text-sm" :
                          effectiveCustomization.descriptionTextSize === "md" ? "text-base" : "text-lg"
                          }`}
                          style={{ color: textSecondaryColor }}>
                          {exp.description}
                        </p>
                        <div className="absolute -top-1 -right-1 z-10 hidden md:block">
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
                            className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110"
                          />
                        </div>
                      </div>
                    </motion.li>
                  </ul>

                  {effectiveCustomization.techStackVisible && exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {exp.techStack.slice(0, effectiveCustomization.techStackLimit).map((tech: Technology, techIndex: number) => (
                        <span
                          key={techIndex}
                          className={getTechStackClasses()}
                        >
                          {effectiveCustomization.techStackShowIcons && tech.logo && (
                            <img src={tech.logo || "https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18"} alt={tech.name} className="h-4 w-4 inline-block mr-1" />
                          )}
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Shared Visual Editor */}
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
    </section>
  );
};

export default Experience;

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase-client';
import SectionHeader from './SectionHeader';
import MagicWrite from "@/components/Shared/MagicWrite";
import { Experience as ExperienceData, Technology } from "@/types/experience/shared";
import SimpleWhiteExperienceVisualEditor from "@/components/VisualEditor/Experience/SimpleWhiteExperienceVisualEditor";
import { ColorTheme } from "@/lib/colorThemes";
import { defaultSimpleWhiteExperienceStyles } from "@/types/simplewhite/experience";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import SectionLoading from "../Shared/SectionLoading";

import { useSimpleWhiteExperienceStyles } from "@/hooks/useSimpleWhiteExperienceStyles";

const Experience: React.FC = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { portfolioData } = useSelector((state: RootState) => state.data);

  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];

  const primaryColor = theme?.colors?.primary || "blue-600";
  const primaryDarkColor = theme?.colors?.primaryDark || "blue-700";
  const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
  const textSecondaryColor = theme?.colors?.text?.secondary || "gray-600";

  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
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
  } = useCustomization("experience", defaultSimpleWhiteExperienceStyles, portfolioId);

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "experience"
  });

  const {
    getCardClasses,
    getCardStyle,
    getTechStackClasses,
    getTechStackStyle,
    getTimelineStyles,
    getAnimationVariants,
    getRoleClasses,
    getCompanyClasses,
    getDescriptionTextClasses,
    getDateClasses,
    getLocationClasses
  } = useExperienceStyles(effectiveCustomization, "light", primaryColor);

  const { getHeaderClasses } = useSimpleWhiteExperienceStyles(effectiveCustomization);

  useEffect(() => {
    if (portfolioData) {
      const experienceSectionData = portfolioData.find((section: any) => section.type === "experience")?.data;
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

  if (isLoading) return <SectionLoading />

  const animationVariants = getAnimationVariants();

  console.log("Experience Data:", experienceData);

  return (
    <section
      id="experience"
      className="py-16 sm:py-24 bg-white"
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
          headerClasses={{
            container: "text-center mb-16 sm:mb-20",
            title: "font-display section-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 transition-all duration-700",
            description: "font-sans text-lg sm:text-xl section-description md:text-2xl font-normal text-gray-600 tracking-normal leading-relaxed max-w-3xl mx-auto transition-all duration-700"
          }}
          currentPortTheme={currentPortTheme}
        />

        {experienceData.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            No professional experience added yet.
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line Removed for SimpleWhite */}

            <motion.div
              variants={effectiveCustomization.staggerAnimation ? animationVariants : undefined}
              initial={effectiveCustomization.staggerAnimation ? "hidden" : undefined}
              whileInView={effectiveCustomization.staggerAnimation ? "visible" : undefined}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col"
              style={{ gap: `${effectiveCustomization.cardSpacing}px` }}
            >
              {experienceData.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={effectiveCustomization.staggerAnimation ? animationVariants : undefined}
                  className={`relative flex flex-col gap-8 ${visibleItems[index] ? 'opacity-100' : 'opacity-0'}`}
                >
                  {/* Timeline Dot Removed */}

                  {/* Content Card */}
                  <div className="w-full">
                    <div
                      className={getCardClasses()}
                      style={getCardStyle(false)}
                    >
                      <div className="flex flex-col gap-1 mb-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <h3 className={getRoleClasses()}
                              style={{ color: textPrimaryColor }}>
                              {exp.role}
                            </h3>
                            {exp.companyName && (
                              <div className="flex items-baseline gap-1">
                                <span className="text-gray-400">at</span>
                                <div className={getCompanyClasses()} style={{ color: primaryColor }}>
                                  {exp.companyName}
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        <div className="flex items-center gap-2">
                          {exp.location && (
                            <div
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 whitespace-nowrap  ${getLocationClasses()}`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {exp.location}
                            </div>

                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 whitespace-nowrap ${getDateClasses()}`}>
                            {effectiveCustomization.dateFormat === "year-only"
                              ? `${(exp.startDate || "").split(' ')[1] || exp.startDate} - ${(exp.endDate || "").split(' ')[1] || exp.endDate}`
                              : `${exp.startDate} - ${exp.endDate}`}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <p className={`${getDescriptionTextClasses()} mb-6`} style={{ color: textSecondaryColor }}>
                          {exp.description}
                        </p>
                        <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <MagicWrite
                            onMagicWrite={async (prompt: string) => {
                              const enhanced = await handleMagicWrite(prompt, exp.description, "experience");
                              const updated = [...experienceData];
                              updated[index] = { ...updated[index], description: enhanced };
                              setExperienceData(updated);
                              await saveEnhancedContent(updated);
                              return enhanced;
                            }}
                            placeholder="Enhance description..."
                            buttonText=""
                            context={exp.description}
                            className="w-8 h-8 p-1.5 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 hover:text-blue-600"
                          />
                        </div>
                      </div>

                      {effectiveCustomization.techStackVisible && exp.techStack && exp.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                          {exp.techStack.slice(0, effectiveCustomization.techStackLimit).map((tech: Technology, techIndex: number) => (
                            <div
                              key={techIndex}
                              className={getTechStackClasses()}
                              style={getTechStackStyle()}
                            >
                              {effectiveCustomization.techStackShowIcons && tech.logo && (
                                <img
                                  src={tech.logo}
                                  alt={tech.name}
                                  className="h-3.5 w-3.5 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              {tech.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Shared Visual Editor */}
      <SimpleWhiteExperienceVisualEditor
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

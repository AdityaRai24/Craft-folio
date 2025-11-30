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
import { defaultSimpleWhiteExperienceStyles } from "@/types/experience/simplewhite";
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
    getTechStackClasses,
    getAnimationVariants,
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

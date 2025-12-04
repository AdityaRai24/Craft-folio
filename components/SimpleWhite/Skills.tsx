"use client";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase-client';
import SectionHeader from './SectionHeader';
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { ColorTheme } from "@/lib/colorThemes";
import { defaultSimpleWhiteTechnologiesStyles } from "@/types/simplewhite/technologies";
import { TechnologiesVisualEditor } from "@/components/VisualEditor/Technologies/TechnologiesVisualEditor";
import { useTechnologiesStyles } from "@/hooks/useTechnologiesStyles";
import { useCustomization } from "@/hooks/useCustomization";
import SectionLoading from "../Shared/SectionLoading";
import { Technology } from "@/types/interfaces/TechnologiesCustomizationState";


const Skills: NextPage = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const dispatch = useDispatch();

  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const { previewMode } = useSelector((state: RootState) => state.editMode);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = currentPortTheme ? inTheme?.data?.[currentPortTheme] : undefined;

  // Theme colors
  const primaryColor = theme?.colors?.primary || ColorTheme.primary;
  const textSecondaryColor = "#4B5563"; // Darker gray for better contrast
  const backgroundPrimaryColor = theme?.colors?.background?.primary || ColorTheme.bgMain;
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || ColorTheme.bgCard;

  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<Technology[]>([]);

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
  } = useCustomization("technologies", defaultSimpleWhiteTechnologiesStyles, portfolioId);

  // Helper functions for styling based on customization
  const {
    getSectionClasses,
    getGridClasses,
    getCardClasses,
    getIconClasses,
    getLabelClasses,
    getAnimationVariants
  } = useTechnologiesStyles(effectiveCustomization, primaryColor, "light");

  const animationVariants = getAnimationVariants();

  useEffect(() => {
    if (portfolioData) {
      const technologiesSectionData = portfolioData?.find((section: any) => section.type === "technologies")?.data;
      if (technologiesSectionData) {
        setTechnologiesData(technologiesSectionData);
      } else {
        setTechnologiesData([]);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-${portfolioId}-technologies`)
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
    };
  }, [portfolioId, isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const skillVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (isLoading) return <SectionLoading />


  return (
    <section id="skills" className={getSectionClasses()}>
      <style>{customCSS}</style>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <SectionHeader
          sectionName="technologies"
          headerVisible={true}
          titleSize="3xl"
          titleWeight="bold"
          titleColor="black"
          titleAlignment="center"
          descriptionSize="lg"
          descriptionColor="gray-600"
          descriptionVisible={true}
          title={portfolioData?.find((section: any) => section.type === "technologies")?.sectionTitle || "Technical Skills"}
          description={portfolioData?.find((section: any) => section.type === "technologies")?.sectionDescription || "A comprehensive list of technologies and tools I work with"}
          onVisualEditorClick={openVisualEditor}
          headerClasses={{ container: "mb-12 text-center relative", title: "text-4xl font-bold mb-4", description: "text-lg text-gray-600" }}
          currentPortTheme={currentPortTheme}
          hideVisualEditor={previewMode}
        />
      </div>

      <div className={`container mx-auto px-4 relative z-10 max-w-${effectiveCustomization.containerWidth}`}>
        {effectiveCustomization.layout === "marquee" ? (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            <Marquee
              gradient={false}
              speed={effectiveCustomization.marqueeSpeed}
              direction={effectiveCustomization.marqueeDirection}
              pauseOnHover={effectiveCustomization.pauseOnHover}
              className="py-4"
            >
              {technologiesData.map((technology, index) => (
                <motion.div
                  key={index}
                  className={getCardClasses()}
                  style={{
                    borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                    padding: `${effectiveCustomization.cardPadding}px`,
                    borderWidth: `${effectiveCustomization.borderWidth}px`,
                    width: "160px",
                    height: "160px",
                    margin: `0 ${effectiveCustomization.gap / 2}px`,
                  }}
                  whileHover={effectiveCustomization.hoverEffects ? {
                    scale: effectiveCustomization.cardHoverEffect === "scale" ? 1.05 : 1,
                    y: effectiveCustomization.cardHoverEffect === "lift" ? -5 : 0,
                    rotate: effectiveCustomization.cardHoverEffect === "rotate" ? 3 : 0,
                    boxShadow: effectiveCustomization.cardHoverEffect === "glow" ? `0 0 20px ${primaryColor}40` : "none",
                  } : {}}
                >
                  {effectiveCustomization.showIcons && (
                    <div className={getIconClasses()} style={{ width: effectiveCustomization.iconSize, height: effectiveCustomization.iconSize }}>
                      <img
                        src={technology.logo}
                        alt={technology.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  {effectiveCustomization.showLabels && (
                    <h3 className={getLabelClasses()} style={{ color: textSecondaryColor }}>
                      {technology.name}
                    </h3>
                  )}
                </motion.div>
              ))}
            </Marquee>
          </div>
        ) : (
          <motion.div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${Math.min(effectiveCustomization.gridColumns, 6)}, minmax(0, 1fr))`,
              gap: `${effectiveCustomization.gap}px`
            }}
            variants={effectiveCustomization.staggerAnimation ? containerVariants : undefined}
            initial={effectiveCustomization.staggerAnimation ? "hidden" : false}
            animate={effectiveCustomization.staggerAnimation ? "visible" : false}
          >
            {technologiesData.map((technology, index) => (
              <motion.div
                key={index}
                className={getCardClasses()}
                style={{
                  borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                  padding: `${effectiveCustomization.cardPadding}px`,
                  borderWidth: `${effectiveCustomization.borderWidth}px`,
                }}
                variants={effectiveCustomization.staggerAnimation ? skillVariants : undefined}
                whileHover={effectiveCustomization.hoverEffects ? {
                  scale: effectiveCustomization.cardHoverEffect === "scale" ? 1.05 : 1,
                  y: effectiveCustomization.cardHoverEffect === "lift" ? -5 : 0,
                  rotate: effectiveCustomization.cardHoverEffect === "rotate" ? 3 : 0,
                  boxShadow: effectiveCustomization.cardHoverEffect === "glow" ? `0 0 20px ${primaryColor}40` : "none",
                } : {}}
                transition={{ duration: effectiveCustomization.animationSpeed / 1000 }}
              >
                {effectiveCustomization.showIcons && (
                  <div className={getIconClasses()} style={{ width: effectiveCustomization.iconSize, height: effectiveCustomization.iconSize }}>
                    <img
                      src={technology.logo}
                      alt={technology.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                {effectiveCustomization.showLabels && (
                  <h3 className={getLabelClasses()} style={{ color: textSecondaryColor }}>
                    {technology.name}
                  </h3>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <TechnologiesVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={draftCustomization || customization}
        updateCustomization={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
      />
    </section>
  );
};

export default Skills;

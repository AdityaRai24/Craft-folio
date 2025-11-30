"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { HeaderComponent } from "./Components";
import { useCustomization } from "@/hooks/useCustomization";
import { Technology } from "@/types/technologies/portfolio";
import { defaultLumenFlowTechnologiesStyles } from "@/types/technologies/lumenflow";
import LumenFlowTechnologiesVisualEditor from "@/components/VisualEditor/Technologies/LumenFlowTechnologiesVisualEditor";
import { useTechnologiesStyles } from "@/hooks/useTechnologiesStyles";
import { ColorTheme } from "@/lib/colorThemes";

const Technologies = ({ portfolioId, currentTheme }: { portfolioId: string, currentTheme: string }) => {
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  useEffect(() => {
    if (portfolioData) {
      const techSection = portfolioData.find((item: any) => item.type === "technologies");
      if (techSection && techSection.data) {
        setTechnologies(techSection.data);
      }
    }
  }, [portfolioData]);

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
  } = useCustomization("technologies", defaultLumenFlowTechnologiesStyles, portfolioId);

  const {
    getGridClasses,
    getCardClasses,
    getLabelClasses,
    getAnimationVariants
  } = useTechnologiesStyles(effectiveCustomization, ColorTheme.primary, currentTheme as "light" | "dark");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-32 bg-zinc-50 dark:bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className={`container mx-auto px-4 relative z-10 max-w-${effectiveCustomization.containerWidth}`}>
        <HeaderComponent
          sectionTitle="Technologies"
          sectionDescription="A curated list of technologies and tools I use to build digital products."
          sectionName="technologies"
          currentTheme={currentTheme}
          openVisualEditor={openVisualEditor}
          visualEditorOpen={visualEditorOpen}
        />

        <motion.div
          className={getGridClasses()}
          style={{
            gap: effectiveCustomization.gap
          }}
          variants={effectiveCustomization.staggerAnimation ? containerVariants : undefined}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              variants={effectiveCustomization.staggerAnimation ? getAnimationVariants() : undefined}
              className={getCardClasses()}
              style={{
                borderRadius: effectiveCustomization.cardBorderRadius,
                padding: effectiveCustomization.cardPadding,
                borderWidth: effectiveCustomization.borderWidth,
              }}
              whileHover={effectiveCustomization.hoverEffects ? {
                y: effectiveCustomization.cardHoverEffect === "lift" ? -8 : 0,
                scale: effectiveCustomization.cardHoverEffect === "scale" ? 1.05 : 1,
                rotate: effectiveCustomization.cardHoverEffect === "rotate" ? 3 : 0,
                boxShadow: effectiveCustomization.cardHoverEffect === "glow" ? `0 0 30px ${ColorTheme.primary}20` : "none",
              } : {}}
            >
              {effectiveCustomization.showIcons && (
                <div
                  style={{ width: effectiveCustomization.iconSize, height: effectiveCustomization.iconSize }}
                  className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                >
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                  />
                </div>
              )}
              {effectiveCustomization.showLabels && (
                <span className={getLabelClasses()}>{tech.name}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <LumenFlowTechnologiesVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={draftCustomization || defaultLumenFlowTechnologiesStyles}
        updateCustomization={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
      />
    </section>
  );
};

export default Technologies;

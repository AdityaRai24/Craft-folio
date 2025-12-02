"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { HeaderComponent } from "./Components";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultLumenFlowTechnologiesStyles } from "@/types/lumenflow/technologies";
import LumenFlowTechnologiesVisualEditor from "@/components/VisualEditor/Technologies/LumenFlowTechnologiesVisualEditor";
import { useTechnologiesStyles } from "@/hooks/useTechnologiesStyles";
import { ColorTheme } from "@/lib/colorThemes";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { Technology } from "@/types/interfaces/TechnologiesCustomizationState";

const Technologies = ({ portfolioId, currentTheme }: { portfolioId: string, currentTheme: string }) => {
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const { theme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);

  const technologiesSection = portfolioData?.find((item: any) => item.type === "technologies");
  const sectionTitle = technologiesSection?.sectionTitle || "Technologies";
  const sectionDescription = technologiesSection?.sectionDescription || "A curated list of technologies and tools I use to build digital products.";

  useEffect(() => {
    if (portfolioData) {
      const techSection = portfolioData.find((item: any) => item.type.toLowerCase() === "technologies");
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
  } = useTechnologiesStyles(effectiveCustomization, ColorTheme.primary, theme as "light" | "dark");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: effectiveCustomization.staggerAnimation ? 0.1 : 0,
      },
    },
  };

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-12 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="technologies"
        openVisualEditor={openVisualEditor}
        visualEditorOpen={visualEditorOpen}
      />

      {/* Technologies Grid */}
      <motion.div
        className={getGridClasses()}
        style={{
          gap: effectiveCustomization.gap
        }}
        variants={containerVariants}
        initial={effectiveCustomization.staggerAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true }}
      >
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            className="group relative"
            variants={effectiveCustomization.staggerAnimation ? getAnimationVariants() : undefined}
          >
            <motion.div
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
              } : {}}
            >
              {effectiveCustomization.showIcons && (
                <div
                  style={{ width: effectiveCustomization.iconSize, height: effectiveCustomization.iconSize }}
                  className="relative flex items-center justify-center"
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
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {technologies.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${theme === "light" ? "bg-gray-200" : "bg-gray-800"
              }`}>
              <span className="text-4xl">🛠️</span>
            </div>
            <h3 className={`text-xl font-semibold ${theme === "light" ? "text-gray-700" : "text-gray-400"
              }`}>
              No technologies added yet
            </h3>
            <p className={`max-w-md mx-auto ${theme === "light" ? "text-gray-600" : "text-gray-500"
              }`}>
              Add technologies to showcase your technical skills and tools.
            </p>
          </div>
        </div>
      )}

      <LumenFlowTechnologiesVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={draftCustomization || defaultLumenFlowTechnologiesStyles}
        updateCustomization={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
      />
    </div>
  );
};

export default Technologies;

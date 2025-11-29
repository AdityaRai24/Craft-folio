"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";
import { TechnologiesVisualEditor } from "@/components/VisualEditor/Technologies/TechnologiesVisualEditor";
import { HeaderComponent } from "./Components";
import { useCustomization } from "@/hooks/useCustomization";
import { Technology, defaultTechnologiesStyles } from "@/types/technologies/portfolio";


const Technologies = ({ portfolioId, currentTheme }: { portfolioId: string, currentTheme: string }) => {
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
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
  } = useCustomization("technologies", defaultTechnologiesStyles, portfolioId);

  const getCardClasses = () => {
    const styleMap: Record<string, string> = {
      minimal: "bg-transparent",
      elevated: "bg-white shadow-lg dark:bg-zinc-800",
      outlined: "border border-zinc-200 dark:border-zinc-700 bg-transparent",
      filled: "bg-zinc-100 dark:bg-zinc-800",
      glassmorphism: "bg-white/10 backdrop-blur-md border border-white/20",
      neon: "bg-black border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
      gradient: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20",
      default: "bg-white border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800",
    };

    return `flex flex-col items-center justify-center transition-all duration-300 ${styleMap[effectiveCustomization.cardStyle]}`;
  };

  const getLabelClasses = () => {
    const sizeMap: Record<string, string> = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    const weightMap: Record<string, string> = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return `${sizeMap[effectiveCustomization.labelSize]} ${weightMap[effectiveCustomization.labelWeight]} text-zinc-600 dark:text-zinc-400 mt-4 text-center`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: effectiveCustomization.animationStyle === "scale" ? 0.8 : 1
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: effectiveCustomization.animationSpeed / 1000,
        ease: "easeOut"
      }
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
          className="grid mt-16"
          style={{
            gridTemplateColumns: `repeat(${effectiveCustomization.gridColumns}, minmax(0, 1fr))`,
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
              variants={effectiveCustomization.staggerAnimation ? itemVariants : undefined}
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

      <TechnologiesVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={draftCustomization || defaultTechnologiesStyles}
        updateCustomization={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
      />
    </section>
  );
};

export default Technologies;

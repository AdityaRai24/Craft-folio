"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Marquee from "react-fast-marquee";
import { ColorTheme } from "@/lib/colorThemes";
import { defaultNeoSparkTechnologiesStyles } from "@/types/neospark/technologies";
import { Technology } from "@/types/technologies/portfolio";
import { TechnologiesVisualEditor } from "@/components/VisualEditor/Technologies/TechnologiesVisualEditor";
import SectionHeader from "./SectionHeader";
import { useTechnologiesStyles } from "@/hooks/useTechnologiesStyles";
import { useCustomization } from "@/hooks/useCustomization";

const Technologies = ({ portfolioId, currentPortTheme }: { portfolioId: string, currentPortTheme: string }) => {
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  // Get theme color
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];
  const titleColor = theme?.colors?.primary || ColorTheme.primary;

  const techSection = portfolioData?.find((item: any) => item.type === "technologies");
  const sectionTitle = techSection?.sectionTitle || "Technologies";
  const sectionDescription = techSection?.sectionDescription || "Tools and technologies I use to bring ideas to life.";

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
  } = useCustomization("technologies", defaultNeoSparkTechnologiesStyles, portfolioId);


  const { getCardClasses, getCardStyle, getLabelClasses, getAnimationVariants } = useTechnologiesStyles(
    effectiveCustomization,
    titleColor,
    "dark"
  );

  const animationVariants = getAnimationVariants();

  const TechnologyCard = ({ tech }: { tech: Technology }) => (
    <motion.div
      className={getCardClasses()}
      style={{
        borderRadius: effectiveCustomization.cardBorderRadius,
        padding: effectiveCustomization.cardPadding,
        borderWidth: effectiveCustomization.borderWidth,
        width: effectiveCustomization.layout === "grid" ? "100%" : "160px",
        height: effectiveCustomization.layout === "grid" ? "auto" : "160px",
        margin: effectiveCustomization.layout === "marquee" ? `0 ${effectiveCustomization.gap / 2}px` : 0,
        ...getCardStyle(),
      }}
      whileHover={effectiveCustomization.hoverEffects ? {
        y: effectiveCustomization.cardHoverEffect === "lift" ? -5 : 0,
        scale: effectiveCustomization.cardHoverEffect === "scale" ? 1.05 : 1,
        rotate: effectiveCustomization.cardHoverEffect === "rotate" ? 3 : 0,
        boxShadow: effectiveCustomization.cardHoverEffect === "glow" ? `0 0 20px ${ColorTheme.primary}40` : "none",
      } : {}}
    >
      {effectiveCustomization.showIcons && (
        <div style={{ width: effectiveCustomization.iconSize, height: effectiveCustomization.iconSize }} className="relative flex items-center justify-center">
          <img
            src={tech.logo}
            alt={tech.name}
            className="max-w-full max-h-full object-contain filter drop-shadow-lg"
          />
        </div>
      )}
      {effectiveCustomization.showLabels && (
        <span className={getLabelClasses()}>{tech.name}</span>
      )}
    </motion.div>
  );

  return (
    <section
      className="py-12  md:py-16 w-full bg-black overflow-hidden text-white relative"
    >      <div className="absolute inset-0 bg-zinc-950" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <SectionHeader
          sectionName="technologies"
          sectionTitle={sectionTitle}
          sectionDescription={sectionDescription}
          titleColor={titleColor}
          onVisualEditorOpen={openVisualEditor}
        />
      </div>

      <div className={`container mx-auto px-4 relative z-10 max-w-${effectiveCustomization.containerWidth}`}>
        {effectiveCustomization.layout === "marquee" ? (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
            <Marquee
              gradient={false}
              speed={effectiveCustomization.marqueeSpeed}
              direction={effectiveCustomization.marqueeDirection}
              pauseOnHover={effectiveCustomization.pauseOnHover}
              className="py-4"
            >
              {technologies.map((tech, index) => (
                <TechnologyCard key={index} tech={tech} />
              ))}
            </Marquee>
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${effectiveCustomization.gridColumns}, minmax(0, 1fr))`,
              gap: effectiveCustomization.gap
            }}
          >
            {technologies.map((tech, index) => (
              <TechnologyCard key={index} tech={tech} />
            ))}
          </div>
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

export default Technologies;

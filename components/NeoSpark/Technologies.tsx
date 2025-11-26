"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Marquee from "react-fast-marquee";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";
import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { TechnologiesVisualEditor } from "@/components/VisualEditor/Technologies/TechnologiesVisualEditor";
import EditButton from "@/components/Shared/EditButton";
import { Settings } from "lucide-react";

interface Technology {
  name: string;
  logo: string;
}

const defaultTechnologiesStyles: TechnologiesCustomizationState = {
  layout: "marquee",
  gridColumns: 4,
  gap: 24,
  containerWidth: "xl",
  cardStyle: "glassmorphism",
  cardBorderRadius: 12,
  cardPadding: 20,
  cardShadow: "medium",
  borderWidth: 1,
  backgroundOpacity: 10,
  showIcons: true,
  iconSize: 40,
  showLabels: true,
  labelPosition: "bottom",
  labelSize: "sm",
  labelWeight: "medium",
  textAlignment: "center",
  animationStyle: "fade",
  animationSpeed: 300,
  staggerAnimation: true,
  hoverEffects: true,
  cardHoverEffect: "glow",
  marqueeDirection: "left",
  marqueeSpeed: 40,
  pauseOnHover: true,
};

const Technologies = ({ portfolioId }: { portfolioId: string }) => {
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);

  // Main customization state (from DB or default)
  const [customization, setCustomization] = useState<TechnologiesCustomizationState>(defaultTechnologiesStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<TechnologiesCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  useEffect(() => {
    if (portfolioData) {
      const techSection = portfolioData.find((item: any) => item.type === "technologies");
      if (techSection && techSection.data) {
        setTechnologies(techSection.data);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        if (componentCustomizations && componentCustomizations["technologies"]) {
          setCustomization(componentCustomizations["technologies"] as unknown as TechnologiesCustomizationState);
        } else {
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "technologies",
          });
          if (result.success && result.data) {
            setCustomization(result.data as unknown as TechnologiesCustomizationState);
          } else {
            setCustomization(defaultTechnologiesStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultTechnologiesStyles);
      }
    };
    if (portfolioId) loadCustomizations();
  }, [portfolioId, componentCustomizations]);

  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  const updateDraftCustomization = (key: keyof TechnologiesCustomizationState, value: any) => {
    if (!draftCustomization) return;
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "technologies",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
      else toast.success("Customization saved successfully");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "technologies",
      });
      setCustomization(defaultTechnologiesStyles);
      setDraftCustomization(defaultTechnologiesStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  const getCardClasses = () => {
    const styleMap: Record<string, string> = {
      minimal: "bg-transparent",
      elevated: "bg-zinc-800 shadow-xl",
      outlined: "border border-zinc-700 bg-transparent",
      filled: "bg-zinc-800",
      glassmorphism: "bg-white/5 backdrop-blur-md border border-white/10",
      neon: "bg-black border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
      gradient: "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700",
      default: "bg-zinc-900 border border-zinc-800",
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
    return `${sizeMap[effectiveCustomization.labelSize]} ${weightMap[effectiveCustomization.labelWeight]} text-gray-300 mt-3 text-center`;
  };

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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />

      <div className={`container mx-auto px-4 relative z-10 max-w-${effectiveCustomization.containerWidth}`}>
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technologies
            </h2>
            <p className="text-zinc-400 max-w-2xl">
              Tools and technologies I use to bring ideas to life.
            </p>
          </div>
          <div className="flex gap-3">
            <EditButton sectionName="technologies" />
            <button
              onClick={openVisualEditor}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
              title="Visual Editor"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

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
        customization={draftCustomization || defaultTechnologiesStyles}
        updateCustomization={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
      />
    </section>
  );
};

export default Technologies;

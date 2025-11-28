"use client";
import { motion } from "framer-motion";
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase-client';
import SectionHeader from './SectionHeader';
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { ColorTheme } from "@/lib/colorThemes";
import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { TechnologiesVisualEditor } from "@/components/VisualEditor/Technologies/TechnologiesVisualEditor";

interface TechnologyType {
  name: string;
  logo: string;
}

const defaultTechnologiesStyles: TechnologiesCustomizationState = {
  layout: "grid",
  gridColumns: 4,
  gap: 24,
  containerWidth: "xl",
  cardStyle: "minimal",
  cardBorderRadius: 8,
  cardPadding: 16,
  cardShadow: "none",
  borderWidth: 1,
  backgroundOpacity: 100,
  showIcons: true,
  iconSize: 48,
  showLabels: true,
  labelPosition: "bottom",
  labelSize: "md",
  labelWeight: "medium",
  textAlignment: "center",
  animationStyle: "fade",
  animationSpeed: 300,
  staggerAnimation: true,
  hoverEffects: true,
  cardHoverEffect: "lift",
  marqueeDirection: "left",
  marqueeSpeed: 50,
  pauseOnHover: true,
};

const Skills: NextPage = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const dispatch = useDispatch();

  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = currentPortTheme ? inTheme?.data?.[currentPortTheme] : undefined;

  // Theme colors
  const primaryColor = theme?.colors?.primary || ColorTheme.primary;
  const textSecondaryColor = theme?.colors?.text?.secondary || ColorTheme.textSecondary;
  const backgroundPrimaryColor = theme?.colors?.background?.primary || ColorTheme.bgMain;
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || ColorTheme.bgCard;

  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<TechnologyType[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);

  // Main customization state (from DB or default)
  const [customization, setCustomization] = useState<TechnologiesCustomizationState>(defaultTechnologiesStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<TechnologiesCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        if (componentCustomizations && componentCustomizations["skills"]) {
          setCustomization(componentCustomizations["skills"] as unknown as TechnologiesCustomizationState);
        } else {
          const result = await getComponentCustomization({
            portfolioId,
            componentType: "skills",
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

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof TechnologiesCustomizationState, value: any) => {
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
        componentType: "skills",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
      else toast.success("Customization saved successfully");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  // On reset, delete from DB, set both states to default, and close editor
  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "skills",
      });
      setCustomization(defaultTechnologiesStyles);
      setDraftCustomization(defaultTechnologiesStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  // Helper functions for styling based on customization
  const getSectionClasses = () => {
    return `py-20 bg-white`; // Simplified for now, can be expanded
  };

  const getGridClasses = () => {
    const columnsMap: Record<number, string> = {
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      8: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
    };

    const maxWidthMap: Record<string, string> = {
      sm: "max-w-3xl",
      md: "max-w-4xl",
      lg: "max-w-5xl",
      xl: "max-w-6xl",
      "2xl": "max-w-7xl",
      full: "w-full",
    };

    return `grid ${columnsMap[effectiveCustomization.gridColumns] || "grid-cols-4"} ${maxWidthMap[effectiveCustomization.containerWidth]} mx-auto`;
  };

  const getCardClasses = () => {
    const styleMap: Record<string, string> = {
      minimal: "bg-transparent",
      elevated: `bg-[${backgroundPrimaryColor}] shadow-md`,
      outlined: `border border-[${textSecondaryColor}]/30 bg-transparent`,
      filled: `bg-[${backgroundSecondaryColor}]`,
      glassmorphism: "bg-white/10 backdrop-blur-sm border border-white/20",
      neon: "bg-black border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
      gradient: "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20",
      default: "bg-white border border-gray-200",
    };

    const hoverMap: Record<string, string> = {
      lift: "hover:shadow-lg hover:-translate-y-1",
      glow: `hover:shadow-lg hover:shadow-[${primaryColor}]/20`,
      scale: "hover:scale-105",
      rotate: "hover:rotate-3",
      none: "",
    };

    return `flex flex-col cursor-pointer items-center transition-all duration-300 ${styleMap[effectiveCustomization.cardStyle]} ${effectiveCustomization.hoverEffects ? hoverMap[effectiveCustomization.cardHoverEffect] : ""}`;
  };

  const getIconClasses = () => {
    return `flex items-center justify-center rounded-lg mb-3`;
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

    return `${weightMap[effectiveCustomization.labelWeight]} ${sizeMap[effectiveCustomization.labelSize]} text-center`;
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="skills" className={getSectionClasses()}>
      <style>{customCSS}</style>

      <div className="container mx-auto px-4">
        <SectionHeader
          sectionName="technologies"
          headerVisible={true} // Assuming always visible for now, or add to customization state if needed
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
          headerClasses={{ container: "mb-12 text-center", title: "text-4xl font-bold mb-4", description: "text-lg text-gray-600" }}
          currentPortTheme={currentPortTheme}
        />

        <motion.div
          className={getGridClasses()}
          style={{ gap: `${effectiveCustomization.gap}px` }}
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

export default Skills;
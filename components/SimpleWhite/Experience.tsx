import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Grid3X3, RotateCcw, Type, Eye, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase-client';
import { useParams } from 'next/navigation';
import SectionHeader from './SectionHeader';
import MagicWrite from "@/components/MagicWrite";
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization, updateSection } from "@/app/actions/portfolio";
import { defaultSimpleWhiteExperienceStyles } from "./defaultStyles/experience";
import { SimpleWhiteExperienceCustomizationState } from "./defaultStyles/types";
import { ColorTheme } from "@/lib/colorThemes";

interface Technology {
  name: string;
  logo: string;
}

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack?: Technology[];
  location?: string
}

// Visual Alignment Selector Component
const AlignmentSelector: React.FC<{
  value: "center" | "left" | "right";
  onChange: (value: "center" | "left" | "right") => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const alignments = [
    { value: "left", icon: "←", label: "Left" },
    { value: "center", icon: "↔", label: "Center" },
    { value: "right", icon: "→", label: "Right" },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {alignments.map(({ value: align, icon, label: alignLabel }) => (
          <div
            key={align}
            onClick={() => onChange(align as any)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === align
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="text-2xl text-white">{icon}</div>
            <div className="space-y-1 w-full">
              <div
                className={`h-1 bg-gradient-to-r rounded ${
                  align === "left"
                    ? "mr-auto w-3/4"
                    : align === "center"
                    ? "mx-auto w-1/2"
                    : "ml-auto w-3/4"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              ></div>
              <div
                className={`h-1 bg-gray-400 rounded ${
                  align === "left"
                    ? "mr-auto w-full"
                    : align === "center"
                    ? "mx-auto w-3/4"
                    : "ml-auto w-full"
                }`}
              ></div>
            </div>
            <div className="text-xs text-white">{alignLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Size Selector Component
const SizeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string; size: string }[];
}> = ({ value, onChange, label, options }) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value: optionValue, label: optionLabel, size }) => (
          <div
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
              value === optionValue
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className="text-white text-center font-bold"
                style={{ 
                  fontSize: size,
                }}
              >
                Aa
              </div>
            </div>
            <div className="text-center text-xs text-white">{optionLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Experience: React.FC = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme?.data?.[currentPortTheme];
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "effects"
  >("layout");

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Main customization state (from DB or default)
  const [customization, setCustomization] = useState<SimpleWhiteExperienceCustomizationState>(defaultSimpleWhiteExperienceStyles);
  // Local draft state for visual editor
  const [draftCustomization, setDraftCustomization] = useState<SimpleWhiteExperienceCustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "experience",
        });
        if (result.success && result.data) {
          setCustomization(result.data as unknown as SimpleWhiteExperienceCustomizationState);
        } else {
          setCustomization(defaultSimpleWhiteExperienceStyles);
        }
      } catch (error) {
        setCustomization(defaultSimpleWhiteExperienceStyles);
      }
    };
    if (portfolioId) loadCustomizations();
  }, [portfolioId]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof SimpleWhiteExperienceCustomizationState, value: any) => {
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
        componentType: "experience",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  // On reset, delete from DB, set both states to default, and close editor
  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "experience",
      });
      setCustomization(defaultSimpleWhiteExperienceStyles);
      setDraftCustomization(defaultSimpleWhiteExperienceStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  // Magic Write functionality
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: context || ""
        }),
      });

      if (!response.ok) {
        throw new Error('Magic Write API error');
      }

      const data = await response.json();
      return data.result || context || "";
    } catch (error) {
      console.error('Magic Write API error:', error);
      toast.error('Failed to enhance text');
      return context || "";
    }
  };

  const handleExperienceDescriptionUpdate = async (experienceIndex: number, newDescription: string) => {
    try {
      // Update the experience data with the new description
      const updatedExperience = [...experienceData];
      updatedExperience[experienceIndex] = {
        ...updatedExperience[experienceIndex],
        description: newDescription
      };
      setExperienceData(updatedExperience);
      
      // Save to database
      const result = await updateSection({
        sectionName: "experience",
        portfolioId,
        sectionContent: updatedExperience,
        sectionTitle: "Experience",
        sectionDescription: "Experience section"
      });
      
      if (result.success) {
        toast.success("Experience description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving experience description:", error);
      toast.error("Failed to save changes to database");
    }
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Helper functions for styling based on customization
  const getSectionClasses = () => {
    const bgMap = {
      white: "bg-white",
      "gray-50": "bg-gray-50",
      "gray-100": "bg-gray-100",
    };
    
    return `min-h-screen flex items-center justify-center ${bgMap[effectiveCustomization.backgroundColor]} text-black relative overflow-hidden py-12 sm:py-16 md:py-20`;
  };

  const getHeaderClasses = () => {
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

    return {
      container: `${alignmentMap[effectiveCustomization.titleAlignment]} mb-12 sm:mb-16 md:mb-20`,
      title: `font-display section-title ${titleSizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} tracking-tight text-${effectiveCustomization.titleColor} mb-3 sm:mb-4 transition-all duration-700`,
      description: `font-sans text-base sm:text-lg section-description md:text-xl font-normal text-${effectiveCustomization.descriptionColor} tracking-normal leading-relaxed max-w-2xl ${effectiveCustomization.titleAlignment === "center" ? "mx-auto" : ""} transition-all duration-700`,
    };
  };



  const getCardClasses = () => {
    const backgroundMap = {
      solid: `bg-[${backgroundPrimaryColor}]`,
      gradient: `bg-gradient-to-br from-[${backgroundPrimaryColor}] to-[${backgroundSecondaryColor}]`,
      glass: `bg-[${backgroundPrimaryColor}]/50 backdrop-blur-sm`,
    };

    const borderMap = {
      none: "border-transparent",
      subtle: `border border-[${textSecondaryColor}]/30`,
      bold: `border-2 border-[${textSecondaryColor}]/50`,
    };

    const shadowMap = {
      none: "",
      light: "shadow-sm",
      medium: "shadow-lg",
      heavy: "shadow-2xl",
    };

    const radiusMap = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-2xl",
      xl: "rounded-3xl",
    };

    const hoverMap = {
      lift: "hover:shadow-md hover:-translate-y-1",
      glow: `hover:shadow-lg hover:shadow-[${primaryColor}]/20`,
      border: `hover:border-[${primaryColor}]/50`,
      none: "",
    };

    // Card width based on container max width
    const cardWidthMap = {
      sm: "max-w-xl",
      md: "max-w-2xl",
      lg: "max-w-3xl", 
      xl: "max-w-4xl",
      "2xl": "max-w-5xl",
      full: "max-w-full",
    };

    return `relative ${backgroundMap[effectiveCustomization.cardBackground]} ${radiusMap[effectiveCustomization.cardBorderRadius]} p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 ${borderMap[effectiveCustomization.cardBorderStyle]} ${shadowMap[effectiveCustomization.cardShadow]} ${effectiveCustomization.hoverEffects ? hoverMap[effectiveCustomization.cardHoverEffect] : ""} transition-all duration-300 w-full ${cardWidthMap[effectiveCustomization.maxWidth] || "max-w-4xl"}`;
  };

  const getTechStackClasses = () => {
    if (!effectiveCustomization.techStackVisible) return "hidden";

    const colorMap = {
      gray: `bg-[${backgroundSecondaryColor}] text-[${textSecondaryColor}] border-[${textSecondaryColor}]/20`,
      blue: `bg-[${primaryColor}]/10 text-[${primaryColor}] border-[${primaryColor}]/20`,
      green: `bg-green-100 text-green-700 border-green-200`,
      purple: `bg-purple-100 text-purple-700 border-purple-200`,
    };

    const styleMap = {
      badges: "rounded-full",
      pills: "rounded-lg",
      minimal: "rounded-none border-0 bg-transparent",
    };

    return `${colorMap[effectiveCustomization.techStackColor]} px-3 py-1 text-sm border ${styleMap[effectiveCustomization.techStackStyle]}`;
  };

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
          // console.log('portfolio experience updated!', payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status experience: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    }
  }, [portfolioId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...(isSmallScreen ? { y: -20 } : { x: -20 }),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

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

  // Theme color variables
  const primaryColor = theme?.colors?.primary || "#2563EB";
  const primaryHoverColor = theme?.colors?.primaryHover || "#1D4ED8";
  const accentColor = theme?.colors?.accent || "#3B82F6";
  const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
  const textSecondaryColor = theme?.colors?.text?.secondary || "#6B7280";
  const backgroundPrimaryColor = theme?.colors?.background?.primary || "#FFFFFF";
  const backgroundSecondaryColor = theme?.colors?.background?.secondary || "#F8FAFC";
  const mutedColor = theme?.colors?.states?.muted || "rgba(59, 130, 246, 0.1)";

  const headerClasses = getHeaderClasses();

  return (
    <section
      id="experience"
      className={getSectionClasses()}
    >
      <style>{customCSS}</style>
     
      <div className={`relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 ${
        effectiveCustomization.maxWidth === "md" ? "max-w-4xl" :
        effectiveCustomization.maxWidth === "lg" ? "max-w-5xl" :
        effectiveCustomization.maxWidth === "xl" ? "max-w-6xl" :
        effectiveCustomization.maxWidth === "2xl" ? "max-w-7xl" :
        effectiveCustomization.maxWidth === "full" ? "max-w-full" :
        "max-w-7xl"
      }`}>
        <SectionHeader
          sectionName="experience"
          headerVisible={effectiveCustomization.headerVisible}
          titleSize={effectiveCustomization.titleSize}
          titleWeight={effectiveCustomization.titleWeight}
          titleColor={effectiveCustomization.titleColor}
          titleAlignment={effectiveCustomization.titleAlignment}
          descriptionSize={effectiveCustomization.descriptionSize}
          descriptionColor={effectiveCustomization.descriptionColor}
          descriptionVisible={effectiveCustomization.descriptionVisible}
          title={portfolioData?.find((section: any) => section.type === "experience")?.sectionTitle || "Professional Experience"}
          description={portfolioData?.find((section: any) => section.type === "experience")?.sectionDescription || "My journey in the industry"}
          onVisualEditorClick={openVisualEditor}
          headerClasses={headerClasses}
          currentPortTheme={currentPortTheme}
        />

        {experienceData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No professional experience added yet.
          </div>
        ) : (
          <>
            <motion.div
              variants={effectiveCustomization.staggerAnimation ? containerVariants : undefined}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              {experienceData.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={effectiveCustomization.staggerAnimation ? itemVariants : undefined}
                  className={`${getCardClasses()} ${
                    visibleItems[index] ? 'opacity-100' : 'opacity-0'
                  } mx-auto`}
                >

                  <motion.div className="mb-6">
                    <h3 className={`font-title section-sub-title mb-2 ${
                      effectiveCustomization.roleSize === "sm" ? "text-lg md:text-xl" :
                      effectiveCustomization.roleSize === "md" ? "text-xl md:text-2xl" :
                      effectiveCustomization.roleSize === "lg" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
                    } ${
                      effectiveCustomization.roleWeight === "normal" ? "font-normal" :
                      effectiveCustomization.roleWeight === "medium" ? "font-medium" :
                      effectiveCustomization.roleWeight === "semibold" ? "font-semibold" : "font-bold"
                    }`}
                    style={{ color: textPrimaryColor }}>
                      {exp.role}
                    </h3>
                    <p className={`font-title section-sub-title mb-3 ${
                      effectiveCustomization.companyNameSize === "sm" ? "text-base" :
                      effectiveCustomization.companyNameSize === "md" ? "text-lg" :
                      effectiveCustomization.companyNameSize === "lg" ? "text-xl" : "text-2xl"
                    } ${
                      effectiveCustomization.companyNameWeight === "normal" ? "font-normal" :
                      effectiveCustomization.companyNameWeight === "medium" ? "font-medium" :
                      effectiveCustomization.companyNameWeight === "semibold" ? "font-semibold" : "font-bold"
                    }`}
                    style={{ color: textSecondaryColor }}>
                      {exp.company}
                    </p>
                    <p className={`font-sans text-sm uppercase tracking-wider font-medium`}
                    style={{ color: textSecondaryColor }}>
                      {effectiveCustomization.dateFormat === "year-only" 
                        ? `${exp.startDate.split(' ')[1]} - ${exp.endDate.split(' ')[1]}` 
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
                        <p className={`font-sans section-sub-description leading-relaxed font-normal ${
                          effectiveCustomization.descriptionTextSize === "sm" ? "text-sm" :
                          effectiveCustomization.descriptionTextSize === "md" ? "text-base" : "text-lg"
                        }`}
                        style={{ color: textSecondaryColor }}>
                          {exp.description}
                        </p>
                        <div className="absolute -top-1 -right-1 z-10 hidden md:block">
                          <MagicWrite
                            onMagicWrite={async (prompt: string, context?: string) => {
                              const enhancedDescription = await handleMagicWrite(prompt, exp.description);
                              handleExperienceDescriptionUpdate(index, enhancedDescription);
                              return enhancedDescription;
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
                      {exp.techStack.slice(0, effectiveCustomization.techStackLimit).map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className={getTechStackClasses()}
                        >
                          {effectiveCustomization.techStackShowIcons && tech.logo && (
                            <img src={tech.logo || "https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18"} alt={tech.name} className="h-4 w-4 inline-block mr-1"/>
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

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <div
          ref={dragRef}
          className="fixed bg-zinc-900 shadow-2xl rounded-lg border border-zinc-700 w-96 max-h-[80vh] overflow-hidden"
                      style={{
              left: `${windowPosition.x}px`,
              top: `${windowPosition.y}px`,
              cursor: isDragging ? "grabbing" : "grab",
              zIndex: 99999999,
            }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-bold text-white">Experience Visual Editor</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "typography", "effects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-3 text-sm capitalize transition-colors`}
                style={{
                  background: activeTab === tab ? `linear-gradient(135deg, #10b981, #059669)` : "transparent",
                  color: activeTab === tab ? "white" : "#9CA3AF",
                }}
              >
                {tab === "layout" && <Grid3X3 className="h-4 w-4 mx-auto mb-1" />}
                {tab === "typography" && <Type className="h-4 w-4 mx-auto mb-1" />}
                {tab === "effects" && <Eye className="h-4 w-4 mx-auto mb-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {activeTab === "layout" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Max Width
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "sm", label: "Small", width: "40%" },
                      { value: "md", label: "Medium", width: "50%" },
                      { value: "lg", label: "Large", width: "75%" },
                      { value: "xl", label: "Extra Large", width: "85%" },
                      { value: "2xl", label: "2XL", width: "95%" },
                      { value: "full", label: "Full", width: "100%" },
                    ].map(({ value, label, width }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("maxWidth", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.maxWidth ?? customization.maxWidth) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full block mx-auto">
                            <div
                              className="h-4 rounded"
                              style={{
                                width: width,
                                background: `linear-gradient(135deg, #10b981, #059669)`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-white font-medium text-center">
                            {label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <SizeSelector
                    value={draftCustomization?.roleSize ?? customization.roleSize}
                    onChange={(value) => updateDraftCustomization("roleSize", value)}
                    label="Role Title Size"
                    options={[
                      { value: "sm", label: "Small", size: "18px" },
                      { value: "md", label: "Medium", size: "20px" },
                      { value: "lg", label: "Large", size: "24px" },
                      { value: "xl", label: "Extra Large", size: "28px" },
                    ]}
                  />

                  <SizeSelector
                    value={draftCustomization?.companyNameSize ?? customization.companyNameSize}
                    onChange={(value) => updateDraftCustomization("companyNameSize", value)}
                    label="Company Name Size"
                    options={[
                      { value: "sm", label: "Small", size: "16px" },
                      { value: "md", label: "Medium", size: "18px" },
                      { value: "lg", label: "Large", size: "20px" },
                      { value: "xl", label: "Extra Large", size: "24px" },
                    ]}
                  />

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Show Location</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.locationVisible ?? customization.locationVisible}
                        onChange={(e) => updateDraftCustomization("locationVisible", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.locationVisible ?? customization.locationVisible) ? "#10b981" : "",
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "effects" && (
              <div className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Hover Effects</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.hoverEffects ?? customization.hoverEffects}
                        onChange={(e) => updateDraftCustomization("hoverEffects", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.hoverEffects ?? customization.hoverEffects) ? "#10b981" : "",
                        }}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Stagger Animation</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.staggerAnimation ?? customization.staggerAnimation}
                        onChange={(e) => updateDraftCustomization("staggerAnimation", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.staggerAnimation ?? customization.staggerAnimation) ? "#10b981" : "",
                        }}
                      ></div>
                    </label>
                  </div>


                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "lift", label: "Lift", icon: "⬆️" },
                      { value: "glow", label: "Glow", icon: "✨" },
                      { value: "border", label: "Border", icon: "🔲" },
                      { value: "none", label: "None", icon: "❌" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardHoverEffect", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardHoverEffect ?? customization.cardHoverEffect) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="text-center text-lg text-white mb-1">
                          {icon}
                        </div>
                        <div className="text-center text-xs text-white">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-700 bg-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={resetCustomization}
                className="flex items-center gap-1 flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={saveDraftCustomization}
                className="flex-1 py-2 px-3 text-sm text-white rounded transition-colors"
                style={{
                  background: `linear-gradient(135deg, #10b981, #059669)`,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for floating window */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}

      {/* Custom CSS for sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </section>
  );
};

export default Experience;
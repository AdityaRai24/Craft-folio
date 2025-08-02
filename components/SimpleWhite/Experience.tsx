import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Settings, Grid3X3, RotateCcw, Type, Zap, Eye, X, Clock, Building, MapPin } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentEdit } from '@/slices/editModeSlice';
import { supabase } from '@/lib/supabase-client';
import { useParams } from 'next/navigation';
import EditButton from '@/components/EditButton';
import SectionHeader from './SectionHeader';
import toast from "react-hot-toast";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
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
  location ?: string
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

const Experience: React.FC = ({ customCSS }: any) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  
  const portfolioId = params.portfolioId as string;

  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "typography" | "timeline" | "effects"
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
    
    return `min-h-screen flex items-center justify-center ${bgMap[effectiveCustomization.backgroundColor]} text-black relative overflow-hidden py-20`;
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
      container: `${alignmentMap[effectiveCustomization.titleAlignment]} mb-20`,
      title: `font-display section-title ${titleSizeMap[effectiveCustomization.titleSize]} ${weightMap[effectiveCustomization.titleWeight]} tracking-tight text-${effectiveCustomization.titleColor} mb-4 transition-all duration-700`,
      description: `font-sans text-lg section-description md:text-xl font-normal text-${effectiveCustomization.descriptionColor} tracking-normal leading-relaxed max-w-2xl ${effectiveCustomization.titleAlignment === "center" ? "mx-auto" : ""} transition-all duration-700`,
    };
  };

  const getTimelineClasses = () => {
    const widthMap = {
      thin: "w-px",
      normal: "w-0.5",
      thick: "w-1",
    };

    const dotColorMap = {
      "gray-500": "bg-gray-500",
      primary: `bg-[${ColorTheme.primary}]`,
      white: "bg-white",
    };

    const dotSizeMap = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    return {
      line: `${widthMap[effectiveCustomization.timelineWidth]} bg-gray-300`,
      dot: effectiveCustomization.timelineDots ? `absolute top-1/2 ${dotSizeMap[effectiveCustomization.timelineDotSize]} rounded-full ${dotColorMap[effectiveCustomization.timelineDotColor]} border-4 border-white transform -translate-y-1/2` : "hidden",
    };
  };

  const getCardClasses = () => {
    const spacingMap = {
      compact: "mb-8",
      normal: "mb-12",
      spacious: "mb-16",
    };

    const backgroundMap = {
      solid: "bg-white",
      gradient: "bg-gradient-to-br from-white to-gray-50",
      glass: "bg-white/50 backdrop-blur-sm",
    };

    const borderMap = {
      none: "border-transparent",
      subtle: "border border-gray-300",
      bold: "border-2 border-gray-400",
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
      glow: `hover:shadow-lg hover:shadow-[${ColorTheme.primary}]/20`,
      border: "hover:border-gray-400",
      none: "",
    };

    return `relative ${backgroundMap[effectiveCustomization.cardBackground]} ${radiusMap[effectiveCustomization.cardBorderRadius]} p-6 md:p-8 ${spacingMap[effectiveCustomization.cardSpacing]} ${borderMap[effectiveCustomization.cardBorderStyle]} ${shadowMap[effectiveCustomization.cardShadow]} ${effectiveCustomization.hoverEffects ? hoverMap[effectiveCustomization.cardHoverEffect] : ""} transition-all duration-300 md:w-[calc(50%-2rem)]`;
  };

  const getTechStackClasses = () => {
    if (!effectiveCustomization.techStackVisible) return "hidden";

    const colorMap = {
      gray: "bg-gray-100 text-gray-600 border-gray-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-100 text-green-700 border-green-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
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


  const headerClasses = getHeaderClasses();
  const timelineClasses = getTimelineClasses();

  return (
    <section
      id="experience"
      className={getSectionClasses()}
    >
      <style>{customCSS}</style>
      
      {/* Visual Editor Toggle Button */}
      {/* <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <EditButton sectionName="experience" />
        <button
          onClick={openVisualEditor}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{
            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
          }}
        >
          <Settings className="h-4 w-4" />
          Visual Editor
        </button>
      </div> */}
      
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
        />

        {experienceData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No professional experience added yet.
          </div>
        ) : (
          <>
            {effectiveCustomization.layout === "timeline" && (
              <div 
                className={timelineClasses.line}
                style={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  left: effectiveCustomization.timelinePosition === "left" ? '2rem' : undefined,
                  right: effectiveCustomization.timelinePosition === "right" ? '2rem' : undefined,
                  transform: effectiveCustomization.timelinePosition === "center" ? 'translateX(-50%)' : undefined,
                }}
              />
            )}
            
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
                } ${
                  effectiveCustomization.layout === "timeline" && effectiveCustomization.timelinePosition === "center" && effectiveCustomization.alternatingLayout
                    ? index % 2 === 0
                      ? "md:mr-[calc(50%+2rem)]"
                      : "md:ml-[calc(50%+2rem)]"
                    : effectiveCustomization.layout === "timeline" && effectiveCustomization.timelinePosition === "left"
                    ? "md:ml-[calc(4rem+2rem)]"
                    : effectiveCustomization.layout === "timeline" && effectiveCustomization.timelinePosition === "right"
                    ? "md:mr-[calc(4rem+2rem)]"
                    : ""
                }`}
              >
                {effectiveCustomization.layout === "timeline" && (
                  <div
                    className={`${timelineClasses.dot} ${
                      effectiveCustomization.timelinePosition === "center" && effectiveCustomization.alternatingLayout
                        ? index % 2 === 0
                          ? "right-0 translate-x-[calc(100%+1rem+5px)]"
                          : "left-0 -translate-x-[calc(100%+1rem+6px)]"
                        : effectiveCustomization.timelinePosition === "center"
                        ? "right-0 translate-x-[calc(100%+1rem+5px)]"
                        : ""
                    }`}
                    style={{
                      left: effectiveCustomization.timelinePosition === "left" ? "calc(100% + 1rem)" : undefined,
                      right: effectiveCustomization.timelinePosition === "right" ? "calc(100% + 1rem)" : undefined,
                      display: effectiveCustomization.timelineDots ? "block" : "none",
                    }}
                  />
                )}

                <motion.div className="mb-6">
                  <h3 className={`font-title section-sub-title mb-2 ${
                    effectiveCustomization.roleSize === "sm" ? "text-lg md:text-xl" :
                    effectiveCustomization.roleSize === "md" ? "text-xl md:text-2xl" :
                    effectiveCustomization.roleSize === "lg" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
                  } ${
                    effectiveCustomization.roleWeight === "normal" ? "font-normal" :
                    effectiveCustomization.roleWeight === "medium" ? "font-medium" :
                    effectiveCustomization.roleWeight === "semibold" ? "font-semibold" : "font-bold"
                  } ${
                    effectiveCustomization.roleColor === "primary" ? "text-primary-900" :
                    `text-${effectiveCustomization.roleColor}`
                  }`}>
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
                  } text-${effectiveCustomization.companyNameColor}`}>
                    {exp.company}
                  </p>
                  <p className={`font-sans text-sm uppercase tracking-wider font-medium text-${effectiveCustomization.dateColor}`}>
                    {effectiveCustomization.dateFormat === "year-only" 
                      ? `${exp.startDate.split(' ')[1]} - ${exp.endDate.split(' ')[1]}` 
                      : `${exp.startDate} - ${exp.endDate}`}
                  </p>
                  {effectiveCustomization.locationVisible && exp.location && (
                    <span className={`text-${effectiveCustomization.locationColor} capitalize`}>{exp.location}</span>
                  )}
                </motion.div>

                <ul className="space-y-4">
                    <motion.li
                      className="flex items-start group"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5 mr-3 flex-shrink-0" />
                      <p className={`font-sans section-sub-description leading-relaxed font-normal ${
                        effectiveCustomization.descriptionTextSize === "sm" ? "text-sm" :
                        effectiveCustomization.descriptionTextSize === "md" ? "text-base" : "text-lg"
                      } text-${effectiveCustomization.descriptionTextColor}`}>
                        {exp.description}
                      </p>
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
          className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-96 max-h-[80vh] overflow-hidden"
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
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
                  background: activeTab === tab ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
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
                    Layout Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "timeline", label: "Timeline", icon: "⏰" },
                      { value: "cards", label: "Cards", icon: "🎴" },
                    ].map(({ value, label, icon }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("layout", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.layout ?? customization.layout) === value
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

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Card Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "compact", label: "Compact" },
                      { value: "normal", label: "Normal" },
                      { value: "spacious", label: "Spacious" },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        onClick={() => updateDraftCustomization("cardSpacing", value)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          (draftCustomization?.cardSpacing ?? customization.cardSpacing) === value
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                        }`}
                      >
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-left font-medium mb-3">
                    Max Width
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "md", label: "Medium", width: "max-w-4xl" },
                      { value: "lg", label: "Large", width: "max-w-5xl" },
                      { value: "xl", label: "Extra Large", width: "max-w-6xl" },
                      { value: "2xl", label: "2XL", width: "max-w-7xl" },
                      { value: "full", label: "Full", width: "max-w-full" },
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
                        <div className="text-center text-xs text-white">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Settings - Only show when timeline layout is selected */}
                {(draftCustomization?.layout ?? customization.layout) === "timeline" && (
                  <>
                    <div className="border-t border-zinc-700 pt-4">
                      <h5 className="text-sm text-left font-medium text-white mb-3">
                        Timeline Settings
                      </h5>

                      <div>
                        <label className="block text-white text-left font-medium mb-3">
                          Timeline Position
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "left", label: "Left", icon: "←", desc: "Timeline on left, cards on right" },
                            { value: "center", label: "Center", icon: "↕", desc: "Timeline in center, cards alternate" },
                            { value: "right", label: "Right", icon: "→", desc: "Timeline on right, cards on left" },
                          ].map(({ value, label, icon, desc }) => (
                            <div
                              key={value}
                              onClick={() => updateDraftCustomization("timelinePosition", value)}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                (draftCustomization?.timelinePosition ?? customization.timelinePosition) === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              <div className="text-center text-lg text-white mb-1">
                                {icon}
                              </div>
                              <div className="text-center text-xs text-white mb-1">
                                {label}
                              </div>
                              <div className="text-center text-xs text-gray-400">
                                {desc}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white text-left font-medium mb-3">
                          Timeline Width
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "thin", label: "Thin", width: "1px" },
                            { value: "normal", label: "Normal", width: "2px" },
                            { value: "thick", label: "Thick", width: "4px" },
                          ].map(({ value, label, width }) => (
                            <div
                              key={value}
                              onClick={() => updateDraftCustomization("timelineWidth", value)}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                                (draftCustomization?.timelineWidth ?? customization.timelineWidth) === value
                                  ? "border-white bg-zinc-700"
                                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                              }`}
                            >
                              <div className="text-center text-xs text-white">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">Show Timeline Dots</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={draftCustomization?.timelineDots ?? customization.timelineDots}
                            onChange={(e) => updateDraftCustomization("timelineDots", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                            style={{
                              backgroundColor: (draftCustomization?.timelineDots ?? customization.timelineDots) ? ColorTheme.primary : "",
                            }}
                          ></div>
                        </label>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-4">
                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Experience Card Typography
                  </h5>

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
                          backgroundColor: (draftCustomization?.locationVisible ?? customization.locationVisible) ? ColorTheme.primary : "",
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
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Animation Settings
                  </h5>

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
                          backgroundColor: (draftCustomization?.hoverEffects ?? customization.hoverEffects) ? ColorTheme.primary : "",
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
                          backgroundColor: (draftCustomization?.staggerAnimation ?? customization.staggerAnimation) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Alternating Layout</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftCustomization?.alternatingLayout ?? customization.alternatingLayout}
                        onChange={(e) => updateDraftCustomization("alternatingLayout", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                        style={{
                          backgroundColor: (draftCustomization?.alternatingLayout ?? customization.alternatingLayout) ? ColorTheme.primary : "",
                        }}
                      ></div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h5 className="text-sm text-left font-medium text-white mb-3">
                    Card Hover Effect
                  </h5>

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
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
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
          background: ${ColorTheme.primary};
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${ColorTheme.primary};
          cursor: pointer;
          border: none;
        }
      `}</style>
    </section>
  );
};

export default Experience;
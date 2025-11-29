"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Marquee from "react-fast-marquee";
import { ColorTheme } from "@/lib/colorThemes";
import { defaultTechnologiesStyles, Technology } from "@/types/technologies/portfolio";
import { TechnologiesVisualEditor } from "@/components/VisualEditor/Technologies/TechnologiesVisualEditor";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { Settings } from "lucide-react";
import { useMacOSTheme } from "./ThemeContext";
import { useUser } from "@clerk/nextjs";
import { useTechnologiesStyles } from "@/hooks/useTechnologiesStyles";
import { useCustomization } from "@/hooks/useCustomization";


const Technologies = ({ portfolioId }: { portfolioId: string }) => {
    const dispatch = useDispatch();
    const { portfolioData, componentCustomizations, portfolioUserId } = useSelector((state: RootState) => state.data);
    const { currentTheme, theme } = useMacOSTheme();
    const isDark = theme === "dark";
    const { user, isLoaded } = useUser();
    const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);

    const [technologies, setTechnologies] = useState<Technology[]>([]);

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

    useEffect(() => {
        if (portfolioData) {
            const techSection = portfolioData.find((item: any) => item.type === "technologies");
            if (techSection && techSection.data) {
                // Handle both array format and object format with categories
                if (Array.isArray(techSection.data)) {
                    setTechnologies(techSection.data);
                } else if (techSection.data.categories) {
                    // Flatten categories for display if needed, or just take all techs
                    const allTechs = techSection.data.categories.flatMap((cat: any) => cat.technologies);
                    setTechnologies(allTechs);
                }
            }
        }
    }, [portfolioData]);



    const { getCardClasses, getLabelClasses, getAnimationVariants } = useTechnologiesStyles(
        effectiveCustomization,
        currentTheme.primary,
        theme
    );


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
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.6)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(12px)",
            }}
            whileHover={effectiveCustomization.hoverEffects ? {
                y: effectiveCustomization.cardHoverEffect === "lift" ? -5 : 0,
                scale: effectiveCustomization.cardHoverEffect === "scale" ? 1.05 : 1,
                rotate: effectiveCustomization.cardHoverEffect === "rotate" ? 3 : 0,
                boxShadow: effectiveCustomization.cardHoverEffect === "glow" ? `0 0 20px ${currentTheme.primary}40` : "none",
                borderColor: currentTheme.primary,
            } : {}}
        >
            {effectiveCustomization.showIcons && (
                <div style={{ width: effectiveCustomization.iconSize, height: effectiveCustomization.iconSize }} className="relative flex items-center justify-center z-10">
                    <img
                        src={tech.logo || tech.icon}
                        alt={tech.name}
                        className="max-w-full max-h-full object-contain filter drop-shadow-lg"
                    />
                </div>
            )}
            {effectiveCustomization.showLabels && (
                <span
                    className={getLabelClasses()}
                    style={{ color: isDark ? currentTheme.text.primary : "#1f2937" }}
                >
                    {tech.name}
                </span>
            )}
        </motion.div>
    );

    return (
        <div className={`w-full h-full overflow-y-auto relative ${isDark ? "bg-[#1a1a1a]" : "bg-gray-50"}`}>
            <div className={`mx-auto p-8 max-w-${effectiveCustomization.containerWidth}`}>
                <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className={`text-3xl md:text-4xl font-semibold mb-1.5 tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                            Technologies
                        </h2>
                        <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Tools and technologies I use to bring ideas to life.
                        </p>
                    </motion.div>

                    {showEdit && (
                        <div className="flex gap-2.5">
                            <EditButton sectionName="technologies" />
                            <button
                                onClick={openVisualEditor}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white`}
                                style={{
                                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                }}
                            >
                                <Settings size={16} />
                                <span>Visual Editor</span>
                            </button>
                        </div>
                    )}
                </div>

                {effectiveCustomization.layout === "marquee" ? (
                    <div className="relative">
                        <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r ${isDark ? "from-[#1a1a1a]" : "from-gray-50"} to-transparent`} />
                        <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l ${isDark ? "from-[#1a1a1a]" : "from-gray-50"} to-transparent`} />
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
        </div>
    );
};

export default Technologies;

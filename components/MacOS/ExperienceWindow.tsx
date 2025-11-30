"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Settings } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { defaultMacOSExperienceStyles } from "@/types/experience/macos";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";
import { useMacOSTheme } from "./ThemeContext";
import { useUser } from "@clerk/nextjs";
import { useCustomization } from "@/hooks/useCustomization";

const ExperienceWindow = ({ theme = "light", portfolioId, font }: { theme?: "light" | "dark"; portfolioId: string; font?: string }) => {
    const isDark = theme === "dark";
    const dispatch = useDispatch();
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const { currentTheme } = useMacOSTheme();

    const [experienceData, setExperienceData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("layout");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    } = useCustomization("experience", defaultMacOSExperienceStyles, portfolioId);

    const {
        getCardClasses,
        getCardStyle,
        getTitleClasses,
        getDescriptionClasses,
        getTechStackClasses,
        getTechStackStyle,
        getAnimationVariants
    } = useExperienceStyles(effectiveCustomization, theme, currentTheme.primary);

    const { portfolioUserId } = useSelector((state: RootState) => state.data);
    const { user, isLoaded } = useUser();
    const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);

    useEffect(() => {
        if (portfolioData) {
            const data = portfolioData.find((item: any) => item.type === "experience")?.data || [];
            setExperienceData(data);
        }
    }, [portfolioData]);


    return (
        <div className={`w-full h-full flex flex-col relative ${isDark ? "bg-[#1a1a1a]" : "bg-gray-50"} ${font || ""}`}>
            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className={`max-w-4xl mx-auto ${effectiveCustomization.containerWidth === "narrow" ? "max-w-2xl" : effectiveCustomization.containerWidth === "wide" ? "max-w-6xl" : ""}`}>
                    {/* Header */}
                    <div className="flex justify-between items-start md:items-center mb-10 flex-col md:flex-row gap-4">
                        <div>
                            <h1 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                                Work Experience
                            </h1>
                            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                My professional journey and career highlights
                            </p>
                        </div>
                        {showEdit && (
                            <div className="flex gap-2.5">
                                <EditButton sectionName="experience" />
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

                    {experienceData.length > 0 ? (
                        <div className={`space-y-8 relative ${effectiveCustomization.timelineStyle !== "minimal" ? "before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent" : ""}`}>
                            {experienceData.map((exp: any, index: number) => {
                                const animationVariants = getAnimationVariants();
                                return (
                                    <motion.div
                                        key={index}
                                        variants={animationVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        transition={{ delay: index * (effectiveCustomization.staggerDelay / 1000) }}
                                        className={`relative flex items-center justify-between md:justify-normal ${effectiveCustomization.timelinePosition === "alternating" ? "md:odd:flex-row-reverse" : ""} group is-active`}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        {/* Timeline Icon */}
                                        {effectiveCustomization.timelineStyle !== "minimal" && (
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 ${effectiveCustomization.timelinePosition === "alternating" ? "md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" : "md:-translate-x-1/2"}`}>
                                                <Briefcase size={18} />
                                            </div>
                                        )}

                                        {/* Card */}
                                        <div
                                            className={`w-[calc(100%-4rem)] ${effectiveCustomization.timelinePosition === "alternating" ? "md:w-[calc(50%-2.5rem)]" : "md:w-full md:ml-12"} ${getCardClasses()}`}
                                            style={{
                                                ...getCardStyle(hoveredIndex === index),
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-4">
                                                <div className={effectiveCustomization.textAlignment === "center" ? "text-center w-full" : effectiveCustomization.textAlignment === "right" ? "text-right w-full" : ""}>
                                                    <h3 className={getTitleClasses()}>
                                                        {exp.role}
                                                    </h3>
                                                    <div className={`font-medium`} style={{ color: currentTheme.primary }}>
                                                        {exp.companyName}
                                                    </div>
                                                </div>
                                                {(effectiveCustomization.dateBadge || effectiveCustomization.locationBadge) && (
                                                    <div className={`flex flex-col ${effectiveCustomization.textAlignment === "right" ? "items-end" : effectiveCustomization.textAlignment === "center" ? "items-center" : "items-start sm:items-end"} gap-1 text-xs font-medium`} style={{ color: currentTheme.text.secondary }}>
                                                        {effectiveCustomization.dateBadge && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={12} />
                                                                {exp.startDate} - {exp.endDate}
                                                            </span>
                                                        )}
                                                        {effectiveCustomization.locationBadge && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={12} />
                                                                {exp.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <p className={getDescriptionClasses()}>
                                                {exp.description}
                                            </p>

                                            {effectiveCustomization.techStackVisible && exp.techStack && exp.techStack.length > 0 && (
                                                <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${effectiveCustomization.textAlignment === "center" ? "justify-center" : effectiveCustomization.textAlignment === "right" ? "justify-end" : ""}`} style={{ borderColor: currentTheme.states.muted }}>
                                                    {exp.techStack.map((tech: any, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className={getTechStackClasses()}
                                                            style={{
                                                                ...getTechStackStyle(),
                                                                backgroundColor: currentTheme.background.primary,
                                                                color: currentTheme.text.secondary,
                                                                borderColor: currentTheme.states.muted,
                                                            }}
                                                        >
                                                            {typeof tech === 'string' ? tech : tech.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4`} style={{ background: currentTheme.background.secondary }}>
                                <Briefcase size={32} style={{ color: currentTheme.text.secondary }} />
                            </div>
                            <h3 className={`text-lg font-medium mb-2`} style={{ color: currentTheme.text.primary }}>
                                No Experience Added
                            </h3>
                            <p className={`text-sm`} style={{ color: currentTheme.text.secondary }}>
                                Add your work experience to showcase your professional journey.
                            </p>
                        </div>
                    )}
                </div>
            </div >

            <ExperienceVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={customization}
                draftCustomization={draftCustomization}
                onUpdateDraft={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div >
    );
};

export default ExperienceWindow;

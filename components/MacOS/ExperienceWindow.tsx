"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Settings } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import EditButton from "@/components/Shared/EditButton";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import { ExperienceCustomizationState } from "@/components/NeoSpark/defaultStyles/types";
import { defaultExperienceStyles } from "@/components/NeoSpark/defaultStyles/experience";
import { deleteComponentCustomization, getComponentCustomization, saveComponentCustomization } from "@/app/actions/portfolio";
import { setComponentCustomizations } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";

const ExperienceWindow = ({ theme = "light", portfolioId }: { theme?: "light" | "dark"; portfolioId?: string }) => {
    const isDark = theme === "dark";
    const dispatch = useDispatch();
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const { componentCustomizations } = useSelector((state: RootState) => state.data);

    const [experienceData, setExperienceData] = useState<any[]>([]);
    const [visualEditorOpen, setVisualEditorOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("layout");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Customization State
    const [customization, setCustomization] = useState<ExperienceCustomizationState>(defaultExperienceStyles);
    const [draftCustomization, setDraftCustomization] = useState<ExperienceCustomizationState | null>(null);

    const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

    const {
        getCardClasses,
        getCardStyle,
        getTitleClasses,
        getDescriptionClasses,
        getTechStackClasses,
        getTechStackStyle
    } = useExperienceStyles(effectiveCustomization, theme, ColorTheme.primary);

    useEffect(() => {
        if (portfolioData) {
            const data = portfolioData.find((item: any) => item.type === "experience")?.data || [];
            setExperienceData(data);
        }
    }, [portfolioData]);

    useEffect(() => {
        const loadCustomizations = async () => {
            if (!portfolioId) return;
            try {
                if (componentCustomizations && componentCustomizations["experience"]) {
                    setCustomization(componentCustomizations["experience"] as ExperienceCustomizationState);
                } else {
                    const result = await getComponentCustomization({
                        portfolioId,
                        componentType: "experience",
                    });
                    if (result.success && result.data) {
                        setCustomization(result.data as any);
                        dispatch(setComponentCustomizations({
                            ...componentCustomizations,
                            experience: result.data
                        }));
                    } else {
                        setCustomization(defaultExperienceStyles);
                    }
                }
            } catch (error) {
                setCustomization(defaultExperienceStyles);
            }
        };
        if (portfolioId) loadCustomizations();
    }, [portfolioId, componentCustomizations, dispatch]);

    const openVisualEditor = () => {
        setDraftCustomization({ ...customization });
        setVisualEditorOpen(true);
    };

    const updateDraftCustomization = (key: keyof ExperienceCustomizationState, value: any) => {
        if (!draftCustomization) return;
        setDraftCustomization({ ...draftCustomization, [key]: value });
    };

    const saveDraftCustomization = async () => {
        if (!draftCustomization || !portfolioId) return;
        setCustomization(draftCustomization);
        setVisualEditorOpen(false);
        try {
            const result = await saveComponentCustomization({
                portfolioId,
                componentType: "experience",
                settings: draftCustomization,
            });
            if (result.success) {
                dispatch(setComponentCustomizations({
                    ...componentCustomizations,
                    experience: draftCustomization
                }));
                toast.success("Customization saved successfully");
            } else {
                toast.error("Failed to save customization");
            }
        } catch (error) {
            toast.error("Failed to save customization");
        }
    };

    const resetCustomization = async () => {
        if (!portfolioId) return;
        try {
            await deleteComponentCustomization({
                portfolioId,
                componentType: "experience",
            });
            setCustomization(defaultExperienceStyles);
            setDraftCustomization(defaultExperienceStyles);
            setVisualEditorOpen(false);
            const updatedCustomizations = { ...componentCustomizations };
            delete updatedCustomizations["experience"];
            dispatch(setComponentCustomizations(updatedCustomizations));
            toast.success("Customization reset successfully");
        } catch (error) {
            toast.error("Failed to reset customization");
        }
    };

    return (
        <div className={`w-full h-full flex flex-col ${isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f7]"} relative`}>
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
                        <div className="flex gap-2.5">
                            <EditButton sectionName="experience" />
                            <button
                                onClick={openVisualEditor}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                                style={{
                                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                    color: "white"
                                }}
                            >
                                <Settings size={16} />
                                <span>Customize</span>
                            </button>
                        </div>
                    </div>

                    {experienceData.length > 0 ? (
                        <div className={`space-y-8 relative ${effectiveCustomization.timelineStyle !== "minimal" ? "before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent" : ""}`}>
                            {experienceData.map((exp: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
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
                                        style={getCardStyle(hoveredIndex === index)}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-4">
                                            <div className={effectiveCustomization.textAlignment === "center" ? "text-center w-full" : effectiveCustomization.textAlignment === "right" ? "text-right w-full" : ""}>
                                                <h3 className={getTitleClasses()}>
                                                    {exp.role}
                                                </h3>
                                                <div className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                                                    {exp.companyName}
                                                </div>
                                            </div>
                                            {(effectiveCustomization.dateBadge || effectiveCustomization.locationBadge) && (
                                                <div className={`flex flex-col ${effectiveCustomization.textAlignment === "right" ? "items-end" : effectiveCustomization.textAlignment === "center" ? "items-center" : "items-start sm:items-end"} gap-1 text-xs font-medium text-slate-500 dark:text-slate-400`}>
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
                                            <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"} ${effectiveCustomization.textAlignment === "center" ? "justify-center" : effectiveCustomization.textAlignment === "right" ? "justify-end" : ""}`}>
                                                {exp.techStack.map((tech: any, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className={getTechStackClasses()}
                                                        style={getTechStackStyle()}
                                                    >
                                                        {typeof tech === 'string' ? tech : tech.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-gray-800 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
                                <Briefcase size={32} />
                            </div>
                            <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                                No Experience Added
                            </h3>
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                Add your work experience to showcase your professional journey.
                            </p>
                        </div>
                    )}
                </div>
            </div>

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
                primaryColor={ColorTheme.primary}
                primaryDarkColor={ColorTheme.primaryDark}
            />
        </div>
    );
};

export default ExperienceWindow;

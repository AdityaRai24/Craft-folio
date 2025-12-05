"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Settings } from "lucide-react";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultBentoExperienceStyles } from "@/types/bento";
import ExperienceVisualEditor from "@/components/VisualEditor/Experience/ExperienceVisualEditor";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useUser } from "@clerk/nextjs";
import { ColorTheme } from "@/lib/colorThemes";
import { useState } from "react";

const BentoCard = ({ children, className = "", delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`border transition-all duration-300 ${className}`}
        style={style}
    >
        {children}
    </motion.div>
);

type Tab = "layout" | "typography" | "styling" | "timing";

const Experience = ({ currentPortTheme, customCSS, portfolioId }: any) => {
    const { portfolioData, portfolioUserId } = useSelector((state: RootState) => state.data);
    const { currentlyEditing, previewMode } = useSelector((state: RootState) => state.editMode);
    const { user, isLoaded } = useUser();
    const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded) && !previewMode;

    const experienceSection = portfolioData?.find((item: any) => item.type === "experience");
    const experience = experienceSection?.data || [];
    const [activeTab, setActiveTab] = useState<Tab>("layout");

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
    } = useCustomization("experience", defaultBentoExperienceStyles, portfolioId);

    if (!experience || experience.length === 0) return null;

    // Helper to map size to Tailwind classes
    const getSizeClass = (size: string, type: 'title' | 'desc' | 'meta') => {
        const sizes: Record<string, string> = {
            xs: type === 'meta' ? 'text-[10px]' : 'text-xs',
            sm: type === 'title' ? 'text-lg' : type === 'meta' ? 'text-xs' : 'text-sm',
            md: type === 'title' ? 'text-xl' : type === 'meta' ? 'text-sm' : 'text-base',
            lg: type === 'title' ? 'text-2xl' : type === 'meta' ? 'text-base' : 'text-lg',
            xl: type === 'title' ? 'text-3xl' : 'text-xl',
            '2xl': 'text-4xl',
        };
        return sizes[size] || sizes.md;
    };

    const getWeightClass = (weight: string) => {
        const weights: Record<string, string> = {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
            extrabold: 'font-extrabold',
        };
        return weights[weight] || 'font-normal';
    };

    // Dynamic Styles
    // Dynamic Styles
    const getCardStyle = () => {
        const baseStyle = {
            borderRadius: typeof effectiveCustomization.cardBorderRadius === 'number' ? `${effectiveCustomization.cardBorderRadius}px` : '24px',
            borderWidth: `${effectiveCustomization.borderWidth}px`,
            borderColor: effectiveCustomization.cardBorderColor?.replace('border-', '') || '#27272a',
            padding: `${effectiveCustomization.cardPadding}px`,
        };

        switch (effectiveCustomization.cardLayout) {
            case 'minimal':
                return { ...baseStyle, backgroundColor: 'transparent', borderColor: 'transparent' };
            case 'glass':
                return { ...baseStyle, backgroundColor: 'rgba(24, 24, 27, 0.5)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.1)' };
            case 'neon':
                return { ...baseStyle, backgroundColor: '#000', borderColor: ColorTheme.primary, boxShadow: `0 0 10px ${ColorTheme.primary}` };
            case 'gradient':
                return { ...baseStyle, background: `linear-gradient(135deg, rgba(24, 24, 27, 0.9), rgba(24, 24, 27, 0.6))` };
            default: // 'default'
                return {
                    ...baseStyle,
                    backgroundColor: effectiveCustomization.cardBackground === 'solid' ? '#18181b' :
                        effectiveCustomization.cardBackground === 'glass' ? 'rgba(24, 24, 27, 0.5)' :
                            effectiveCustomization.cardBackground === 'transparent' ? 'transparent' : '#18181b'
                };
        }
    };

    const cardStyle = getCardStyle();

    const cardBgClass = effectiveCustomization.cardLayout === 'default' && effectiveCustomization.cardBackground === 'glass' ? 'backdrop-blur-sm' : '';

    return (
        <section id="experience" className="w-full max-w-7xl mx-auto px-4 py-12 relative group">
            <style>{customCSS}</style>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">Experience</h2>
                        <p className="text-zinc-400">
                            My professional journey and career milestones.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Edit Controls */}
                    <div className={`flex justify-end gap-2 mb-4 transition-opacity ${shouldShowButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {!previewMode && (
                            <EditButton
                                sectionName={"experience"}
                                styles="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700"
                            />
                        )}
                        {shouldShowButton && (
                            <button
                                onClick={openVisualEditor}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                }}
                            >
                                <Settings className="h-3 w-3" />
                                <span>Visual Editor</span>
                            </button>
                        )}
                    </div>

                    {experience.map((exp: any, index: number) => (
                        <BentoCard key={index} delay={index * 0.1} className={`${cardBgClass} hover:border-zinc-500`} style={cardStyle}>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-zinc-800 text-white mt-1">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h3
                                            className={`text-white ${getSizeClass(effectiveCustomization.roleSize, 'title')} ${getWeightClass(effectiveCustomization.roleWeight)}`}
                                            style={{ color: effectiveCustomization.roleColor !== 'white' ? effectiveCustomization.roleColor : undefined }}
                                        >
                                            {exp.role}
                                        </h3>
                                        <p
                                            className={`text-zinc-400 ${getSizeClass(effectiveCustomization.companyNameSize, 'desc')} ${getWeightClass(effectiveCustomization.companyNameWeight)}`}
                                        >
                                            {exp.companyName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className={`flex items-center gap-2 text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-full w-fit ${getSizeClass(effectiveCustomization.dateSize, 'meta')} ${getWeightClass(effectiveCustomization.dateWeight)}`}>
                                        <Calendar size={14} />
                                        <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                                    </div>

                                    {effectiveCustomization.locationVisible && exp.location && (
                                        <div className={`flex items-center gap-2 text-zinc-500 ${getSizeClass(effectiveCustomization.locationSize, 'meta')}`}>
                                            <MapPin size={14} />
                                            <span>{exp.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {effectiveCustomization.descriptionVisible && (
                                <p
                                    className={`text-zinc-300 leading-relaxed mb-4 ${getSizeClass(effectiveCustomization.descriptionTextSize, 'desc')} ${getWeightClass(effectiveCustomization.descriptionTextWeight)}`}
                                >
                                    {exp.description}
                                </p>
                            )}

                            {effectiveCustomization.techStackVisible && exp.techStack && exp.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800/50">
                                    {exp.techStack.map((tech: any, i: number) => (
                                        <span
                                            key={i}
                                            className={`
                        ${effectiveCustomization.techStackStyle === 'pills' ? 'rounded-full' : 'rounded-md'}
                        ${effectiveCustomization.techStackStyle === 'minimal' ? 'border border-zinc-700 text-zinc-400 px-2 py-0.5' : 'bg-zinc-800 text-zinc-400 px-2 py-1'}
                        text-xs font-medium
                      `}
                                        >
                                            {typeof tech === 'string' ? tech : tech.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </BentoCard>
                    ))}
                </div>
            </div>

            {/* Visual Editor */}
            {visualEditorOpen && (
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
            )}
        </section>
    );
};

export default Experience;

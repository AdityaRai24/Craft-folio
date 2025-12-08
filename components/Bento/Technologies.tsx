"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultBentoTechnologiesStyles } from "@/types/bento";
import BentoTechnologiesVisualEditor from "@/components/VisualEditor/Technologies/BentoTechnologiesVisualEditor";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useUser } from "@clerk/nextjs";
import { ColorTheme } from "@/lib/colorThemes";

const Technologies = ({ currentPortTheme, customCSS, portfolioId }: any) => {
    const { portfolioData, portfolioUserId } = useSelector((state: RootState) => state.data);
    const { currentlyEditing, previewMode } = useSelector((state: RootState) => state.editMode);
    const { user, isLoaded } = useUser();
    const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded) && !previewMode;

    const techSection = portfolioData?.find((item: any) => item.type === "technologies");
    const techData = techSection?.data || [];

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
    } = useCustomization("technologies", defaultBentoTechnologiesStyles, portfolioId);

    // Flatten categories if they exist, or use flat array
    const technologies = Array.isArray(techData)
        ? techData
        : (techData.categories?.flatMap((cat: any) => cat.technologies) || []);

    if (!technologies || technologies.length === 0) return null;

    const getCardStyle = () => {
        const baseStyle = {
            borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
            borderWidth: '1px',
            borderColor: effectiveCustomization.borderColor?.replace('border-', '') || '#27272a',
            padding: `${effectiveCustomization.cardPadding}px`,
        };

        const bg = effectiveCustomization.cardBackground;
        const isTailwindBg = bg?.startsWith('bg-');
        const customBg = isTailwindBg ? undefined : bg;

        switch (effectiveCustomization.cardStyle) {
            case 'minimal':
                return { ...baseStyle, backgroundColor: 'transparent', borderColor: 'transparent' };
            case 'glass':
                return { ...baseStyle, backgroundColor: 'rgba(24, 24, 27, 0.5)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.1)' };
            case 'neon':
                return { ...baseStyle, backgroundColor: '#000', borderColor: ColorTheme.primary, boxShadow: `0 0 10px ${ColorTheme.primary}` };
            case 'gradient':
                return { ...baseStyle, background: `linear-gradient(135deg, rgba(24, 24, 27, 0.9), rgba(24, 24, 27, 0.6))` };
            default: // 'solid' or others
                return {
                    ...baseStyle,
                    backgroundColor: customBg || '#18181b'
                };
        }
    };

    const cardStyle = getCardStyle();
    const cardBgClass = effectiveCustomization.cardBackground?.startsWith('bg-') && effectiveCustomization.cardStyle === 'solid'
        ? effectiveCustomization.cardBackground
        : '';

    return (
        <section id="technologies" className="w-full max-w-7xl mx-auto px-4 py-12 relative group">
            <style>{customCSS}</style>

            <div className={`bg-zinc-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative border border-zinc-800`}>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-3xl font-bold text-center md:text-left">Technologies & Tools</h2>

                        {/* Edit Controls */}
                        <div className={`flex gap-2 transition-opacity ${shouldShowButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {!previewMode && (
                                <EditButton
                                    sectionName={"technologies"}
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
                    </div>

                    <div className="flex flex-wrap justify-center" style={{ gap: `${effectiveCustomization.gap}px` }}>
                        {technologies.map((tech: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`${cardBgClass} flex flex-col items-center justify-center hover:bg-zinc-700/50 transition-colors cursor-default`}
                                style={{
                                    ...cardStyle,
                                    width: effectiveCustomization.showIcons ? 'auto' : 'auto',
                                    minWidth: effectiveCustomization.showIcons ? '120px' : 'auto',
                                }}
                            >
                                {effectiveCustomization.showIcons && (
                                    <div
                                        className="mb-3 relative flex items-center justify-center"
                                        style={{ width: `${effectiveCustomization.iconSize}px`, height: `${effectiveCustomization.iconSize}px` }}
                                    >
                                        {tech.logo ? (
                                            <img
                                                src={tech.logo}
                                                alt={typeof tech === 'string' ? tech : tech.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <Settings className="w-full h-full text-zinc-600" />
                                        )}
                                    </div>
                                )}
                                <span className="font-semibold text-sm sm:text-base text-center break-words w-full text-zinc-200">
                                    {typeof tech === 'string' ? tech : tech.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600 rounded-full blur-3xl" />
                </div>
            </div>

            {/* Visual Editor */}
            {visualEditorOpen && (
                <BentoTechnologiesVisualEditor
                    isOpen={visualEditorOpen}
                    onClose={() => setVisualEditorOpen(false)}
                    customization={customization}
                    draftCustomization={draftCustomization}
                    onUpdateDraft={updateDraftCustomization}
                    onSave={saveDraftCustomization}
                    onReset={resetCustomization}
                />
            )}
        </section>
    );
};

export default Technologies;

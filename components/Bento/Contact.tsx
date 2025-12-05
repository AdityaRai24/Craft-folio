"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultBentoContactStyles } from "@/types/bento";
import BentoContactVisualEditor from "@/components/VisualEditor/Contact/BentoContactVisualEditor";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useUser } from "@clerk/nextjs";
import { ColorTheme } from "@/lib/colorThemes";

const Contact = ({ currentPortTheme, customCSS, portfolioId }: any) => {
    const { portfolioData, portfolioUserId } = useSelector((state: RootState) => state.data);
    const { currentlyEditing, previewMode } = useSelector((state: RootState) => state.editMode);
    const { user, isLoaded } = useUser();
    const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded) && !previewMode;

    const userInfo = portfolioData?.find((item: any) => item.type === "userInfo")?.data;

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
    } = useCustomization("contact", defaultBentoContactStyles, portfolioId);

    // Derived styles from customization
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

    return (
        <section id="contact" className="w-full max-w-7xl mx-auto px-4 py-12 relative group">
            <style>{customCSS}</style>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden text-center`}
                style={cardStyle}
            >
                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        {/* Edit Controls */}
                        <div className={`flex gap-2 transition-opacity ${shouldShowButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {!previewMode && (
                                <EditButton
                                    sectionName={"contact"}
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

                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            {effectiveCustomization.title}
                        </h2>
                    </div>
                    <p className="text-lg text-white/90 mb-8 leading-relaxed">
                        {effectiveCustomization.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {effectiveCustomization.buttons?.map((btn: any) => (
                            <Button
                                key={btn.id}
                                size="lg"
                                variant={btn.style === 'outline' ? 'outline' : btn.style === 'ghost' ? 'ghost' : 'default'}
                                className={`rounded-full w-full sm:w-auto text-lg h-12 px-8 ${btn.style === 'solid' ? 'bg-white text-black hover:bg-zinc-100' :
                                    btn.style === 'outline' ? 'border-white/30 text-white hover:bg-white/10 hover:text-white' :
                                        'text-white hover:bg-white/10'
                                    }`}
                                onClick={() => window.open(btn.url, '_blank')}
                            >
                                {btn.label}
                                {btn.style !== 'ghost' && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Decorative circles - Only show for certain styles if needed, or keep generic */}
                {effectiveCustomization.cardStyle !== 'minimal' && (
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
                    </div>
                )}
            </motion.div>

            {effectiveCustomization.showFooter && (
                <footer className="mt-12 text-center text-zinc-500 text-sm">
                    <p>© {new Date().getFullYear()} {userInfo?.name || "Portfolio"}. All rights reserved.</p>
                </footer>
            )}

            {/* Visual Editor */}
            {visualEditorOpen && (
                <BentoContactVisualEditor
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

export default Contact;

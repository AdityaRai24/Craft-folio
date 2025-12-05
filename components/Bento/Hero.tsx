"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultBentoHeroStyles } from "@/types/bento";
import BentoHeroVisualEditor from "@/components/VisualEditor/Hero/BentoHeroVisualEditor";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useUser } from "@clerk/nextjs";
import { ColorTheme } from "@/lib/colorThemes";
import { getPlatformConfig } from "@/lib/socialLinkUtils";

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
        {children}
    </motion.div>
);

const Hero = ({ currentPortTheme, customCSS, portfolioId }: any) => {
    const { portfolioData, portfolioUserId } = useSelector((state: RootState) => state.data);
    const { currentlyEditing, previewMode } = useSelector((state: RootState) => state.editMode);
    const { user, isLoaded } = useUser();
    const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded) && !previewMode;

    const heroData = portfolioData?.find((item: any) => item.type === "hero")?.data;
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
    } = useCustomization("hero", defaultBentoHeroStyles, portfolioId);

    if (!heroData) return null;

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
    const glowClass = effectiveCustomization.glowColor === 'none' ? '' :
        effectiveCustomization.glowColor === 'purple' ? 'from-purple-500/20 to-blue-500/20' :
            effectiveCustomization.glowColor === 'blue' ? 'from-blue-500/20 to-cyan-500/20' :
                effectiveCustomization.glowColor === 'green' ? 'from-green-500/20 to-emerald-500/20' :
                    'from-orange-500/20 to-red-500/20';

    const renderBlock = (block: any) => {
        if (!block.visible) return null;

        const commonClasses = `flex flex-col justify-between transition-all duration-300 hover:shadow-lg`;
        const colSpanMap: Record<number, string> = { 1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4' };
        const rowSpanMap: Record<number, string> = { 1: 'md:row-span-1', 2: 'md:row-span-2', 3: 'md:row-span-3', 4: 'md:row-span-4' };
        const colSpanClass = colSpanMap[block.colSpan] || `md:col-span-${block.colSpan}`;
        const rowSpanClass = rowSpanMap[block.rowSpan] || `md:row-span-${block.rowSpan}`;

        switch (block.type) {
            case 'intro':
                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`${commonClasses} ${colSpanClass} ${rowSpanClass}`}
                        style={cardStyle}
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-zinc-400">Available for work</span>
                            </div>
                            <h1 className="font-bold mb-4 tracking-tight text-white" style={{ fontSize: `${effectiveCustomization.nameSize}px`, lineHeight: 1.1 }}>
                                {heroData.name}
                            </h1>
                            <p className="text-zinc-300 leading-relaxed" style={{ fontSize: `${effectiveCustomization.titleSize}px` }}>
                                {heroData.title}
                            </p>
                        </div>
                        <div className="mt-8">
                            <p className="text-zinc-400 mb-6 line-clamp-3">
                                {heroData.summary}
                            </p>
                            <div className="flex gap-3">
                                <Button className="rounded-full bg-white text-black hover:bg-zinc-200" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Contact Me
                                </Button>
                                <Button variant="outline" className="rounded-full border-zinc-700 text-white hover:bg-zinc-800 hover:text-white" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                                    View Work
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'image':
                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`${commonClasses} ${colSpanClass} ${rowSpanClass} overflow-hidden relative group p-0`}
                        style={{ ...cardStyle, padding: 0 }}
                    >
                        {effectiveCustomization.heroImage || userInfo?.profileImage ? (
                            <Image
                                src={effectiveCustomization.heroImage || userInfo.profileImage}
                                alt="Profile"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-zinc-500">No Image</span>
                            </div>
                        )}
                    </motion.div>
                );

            case 'quote':
                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className={`${commonClasses} ${colSpanClass} ${rowSpanClass} p-6 flex flex-col justify-center`}
                        style={cardStyle}
                    >
                        <div className="text-4xl text-zinc-600 font-serif mb-2">"</div>
                        <p className="text-sm text-zinc-300 italic leading-relaxed">
                            {effectiveCustomization.quote || "Design is intelligence made visible."}
                        </p>
                    </motion.div>
                );
            case 'socials':
                const socials = Array.isArray(effectiveCustomization.socials) ? effectiveCustomization.socials : [];

                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`${commonClasses} ${colSpanClass} ${rowSpanClass} p-6`}
                        style={cardStyle}
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-zinc-400" />
                                <span className="text-xs text-zinc-400 truncate">{userInfo?.location || "Remote"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {socials.map((link: any) => {
                                    const config = getPlatformConfig(link.platform);
                                    const Icon = config.icon;
                                    return (
                                        <a
                                            key={link.id}
                                            href={link.platform === 'email' ? `mailto:${link.url}` : link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors ${link.platform === 'email' ? 'col-span-2' : ''}`}
                                        >
                                            <Icon size={18} />
                                        </a>
                                    );
                                })}
                                {socials.length === 0 && (
                                    <div className="col-span-2 text-center text-xs text-zinc-500 py-4">
                                        No links added
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'stats':
                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`${commonClasses} ${colSpanClass} ${rowSpanClass} p-6 flex items-center justify-around`}
                        style={cardStyle}
                    >
                        {effectiveCustomization.stats?.map((stat: any, index: number) => (
                            <div key={index} className="text-center">
                                <h4 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h4>
                                <p className="text-xs text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                );
            case 'services':
                return (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className={`${commonClasses} ${colSpanClass} ${rowSpanClass} p-6`}
                        style={cardStyle}
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
                        <div className="flex flex-wrap gap-2">
                            {effectiveCustomization.services?.map((service: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {service}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative group">
            <style>{customCSS}</style>

            {/* Edit Controls */}
            <div className={`flex justify-end gap-2 mb-4 transition-opacity ${shouldShowButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {!previewMode && (
                    <EditButton
                        sectionName={"hero"}
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

            <div
                className={`grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)]`}
                style={{ gap: `${effectiveCustomization.gap}px` }}
            >
                {effectiveCustomization.slots?.map((block: any) => renderBlock(block))}
            </div>

            {/* Visual Editor */}
            {
                visualEditorOpen && (
                    <BentoHeroVisualEditor
                        isOpen={visualEditorOpen}
                        onClose={() => setVisualEditorOpen(false)}
                        customization={customization}
                        draftCustomization={draftCustomization}
                        onUpdateDraft={updateDraftCustomization}
                        onSave={saveDraftCustomization}
                        onReset={resetCustomization}
                    />
                )
            }
        </section >
    );
};

export default Hero;

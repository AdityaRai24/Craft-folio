"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Settings } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultBentoProjectsStyles } from "@/types/bento";
import ProjectsVisualEditor from "@/components/VisualEditor/Projects/ProjectsVisualEditor";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useUser } from "@clerk/nextjs";
import { ColorTheme } from "@/lib/colorThemes";
import { useState } from "react";

const BentoCard = ({ children, className = "", delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
        style={style}
    >
        {children}
    </motion.div>
);

type Tab = "layout" | "typography" | "styling" | "timing";

const Projects = ({ currentPortTheme, customCSS, portfolioId }: any) => {
    const { portfolioData, portfolioUserId } = useSelector((state: RootState) => state.data);
    const { currentlyEditing, previewMode } = useSelector((state: RootState) => state.editMode);
    const { user, isLoaded } = useUser();
    const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded) && !previewMode;

    const projectsSection = portfolioData?.find((item: any) => item.type === "projects");
    const projects = projectsSection?.data || [];
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
    } = useCustomization("projects", defaultBentoProjectsStyles, portfolioId);

    if (!projects || projects.length === 0) return null;

    // Helper to map size to Tailwind classes or CSS values
    const getSizeClass = (size: string, type: 'title' | 'desc') => {
        const sizes: Record<string, string> = {
            xs: type === 'title' ? 'text-lg' : 'text-xs',
            sm: type === 'title' ? 'text-xl' : 'text-sm',
            md: type === 'title' ? 'text-2xl' : 'text-base',
            lg: type === 'title' ? 'text-3xl' : 'text-lg',
            xl: type === 'title' ? 'text-4xl' : 'text-xl',
        };
        return sizes[size] || sizes.md;
    };

    const getWeightClass = (weight: string) => {
        const weights: Record<string, string> = {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        };
        return weights[weight] || 'font-normal';
    };

    const isSplitLayout = effectiveCustomization.layout === 'split';
    const bentoInnerLayout = effectiveCustomization.bentoInnerLayout || 'single';

    // Dynamic Styles
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: isSplitLayout
            ? (bentoInnerLayout === 'two-cols' ? 'repeat(2, minmax(0, 1fr))' : '1fr')
            : `repeat(${effectiveCustomization.gridColumns || 2}, minmax(0, 1fr))`,
        gap: `${effectiveCustomization.cardSpacing || 24}px`,
    };

    // Card Style Logic
    const getCardStyle = () => {
        const baseStyle = {
            borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
            borderWidth: `${effectiveCustomization.borderWidth}px`,
            borderColor: effectiveCustomization.cardBorder?.replace('border-', '') || '#27272a',
            padding: `${effectiveCustomization.cardPadding}px`,
        };

        switch (effectiveCustomization.cardStyle) {
            case 'minimal':
                return { ...baseStyle, backgroundColor: 'transparent', borderColor: 'transparent' };
            case 'glass':
                return { ...baseStyle, backgroundColor: 'rgba(24, 24, 27, 0.5)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.1)' };
            case 'neon':
                return { ...baseStyle, backgroundColor: '#000', borderColor: ColorTheme.primary, boxShadow: `0 0 10px ${ColorTheme.primary}` };
            case 'gradient':
                return { ...baseStyle, background: `linear-gradient(135deg, rgba(24, 24, 27, 0.9), rgba(24, 24, 27, 0.6))` };
            default: // 'default'
                return { ...baseStyle, backgroundColor: effectiveCustomization.cardBackground?.startsWith('bg-') ? undefined : effectiveCustomization.cardBackground };
        }
    };

    const cardStyle = getCardStyle();

    // Handle background class if it's a Tailwind class and style is default
    const cardBgClass = effectiveCustomization.cardStyle === 'default' && effectiveCustomization.cardBackground?.startsWith('bg-')
        ? effectiveCustomization.cardBackground
        : '';

    const imageStyle = {
        height: `${effectiveCustomization.imageHeight || 200}px`,
        borderTopLeftRadius: `${effectiveCustomization.imageBorderRadius}px`,
        borderTopRightRadius: `${effectiveCustomization.imageBorderRadius}px`,
        borderBottomLeftRadius: effectiveCustomization.imagePosition === 'left' || effectiveCustomization.imagePosition === 'right' ? `${effectiveCustomization.imageBorderRadius}px` : 0,
        borderBottomRightRadius: effectiveCustomization.imagePosition === 'left' || effectiveCustomization.imagePosition === 'right' ? `${effectiveCustomization.imageBorderRadius}px` : 0,
    };

    const imageFitClass = effectiveCustomization.imageAspectRatio === 'square' ? 'aspect-square' :
        effectiveCustomization.imageAspectRatio === 'wide' ? 'aspect-video' :
            effectiveCustomization.imageAspectRatio === 'tall' ? 'aspect-[3/4]' : 'aspect-auto';

    console.log(projects);

    return (
        <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-12 relative group">
            <style>{customCSS}</style>

            <div className={`flex gap-2 justify-end mb-4 transition-opacity ${shouldShowButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {!previewMode && (
                    <EditButton
                        sectionName={"projects"}
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

            <div className={isSplitLayout ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}>
                <div className={isSplitLayout ? "lg:col-span-1" : "mb-12"}>
                    <div className={isSplitLayout ? "sticky top-24" : "flex flex-col items-start"}>
                        <div className="flex justify-between items-start w-full mb-4">
                            <h2 className="text-3xl font-bold tracking-tight text-white">Selected Work</h2>
                            {/* Edit Controls */}

                        </div>
                        <p className="text-zinc-400 max-w-2xl">
                            A collection of projects I've worked on, ranging from web applications to open source tools.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div
                    className={isSplitLayout ? "lg:col-span-2" : ""}
                    style={gridStyle}
                >
                    {projects.map((project: any, index: number) => (
                        <BentoCard key={index} delay={index * 0.1} className={`flex flex-col h-full group ${cardBgClass}`} style={cardStyle}>
                            <div className="relative w-full overflow-hidden bg-zinc-800" style={imageStyle}>
                                {project.projectImage ? (
                                    <Image
                                        src={project.projectImage}
                                        alt={project.projectName}
                                        fill
                                        className={`object-cover ${imageFitClass} transition-transform duration-500 group-hover:scale-105`}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-zinc-500">
                                        No Preview
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            <div className="flex flex-col flex-grow">
                                <div className={`flex justify-between items-start my-4 ${effectiveCustomization.titleAlignment === 'center' ? 'text-center flex-col items-center' : effectiveCustomization.titleAlignment === 'right' ? 'text-right flex-row-reverse' : ''}`}>
                                    <h3
                                        className={`text-white group-hover:text-blue-400 transition-colors ${getSizeClass(effectiveCustomization.titleSize, 'title')} ${getWeightClass(effectiveCustomization.titleWeight)}`}
                                    >
                                        {project.projectName}
                                    </h3>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-2 rounded-full transition-colors ${effectiveCustomization.githubButtonStyle === 'filled' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                                                style={{ borderRadius: `${effectiveCustomization.buttonBorderRadius}px` }}
                                            >
                                                <Github size={18} />
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-2 rounded-full transition-colors ${effectiveCustomization.liveButtonStyle === 'filled' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                                                style={{ borderRadius: `${effectiveCustomization.buttonBorderRadius}px` }}
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <p
                                    className={`text-zinc-400 mb-6  flex-grow ${getSizeClass(effectiveCustomization.descriptionSize, 'desc')} ${getWeightClass(effectiveCustomization.descriptionWeight)}`}
                                    style={{ textAlign: effectiveCustomization.titleAlignment }}
                                >
                                    {project.projectDescription}
                                </p>

                                <div className={`flex flex-wrap gap-2 mt-auto ${effectiveCustomization.titleAlignment === 'center' ? 'justify-center' : effectiveCustomization.titleAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                                    {project.techStack?.map((tech: any, i: number) => (
                                        <Badge
                                            key={i}
                                            variant={effectiveCustomization.techStackStyle === 'minimal' ? 'outline' : 'secondary'}
                                            className={`
                        ${effectiveCustomization.techStackStyle === 'pills' ? 'rounded-full' : 'rounded-md'}
                        ${effectiveCustomization.techStackStyle === 'minimal' ? 'border-zinc-700 text-zinc-400' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}
                      `}
                                        >
                                            {typeof tech === 'string' ? tech : tech.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </BentoCard>
                    ))}
                </div>
            </div>

            {/* Visual Editor */}
            {
                visualEditorOpen && (
                    <ProjectsVisualEditor
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
                )
            }
        </section >
    );
};

export default Projects;

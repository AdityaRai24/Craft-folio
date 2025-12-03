"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultAcademicStyles } from "@/types/academic";

import { Settings } from "lucide-react";
import EditButton from "@/components/Shared/EditButton";
import AcademicProjectsVisualEditor from "@/components/VisualEditor/Projects/AcademicProjectsVisualEditor";

const Research = ({ portfolioId }: { portfolioId: string }) => {
    const { portfolioData } = useSelector((state: RootState) => state.data);
    const [researchData, setResearchData] = useState<any[]>([]);

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
    } = useCustomization("projects", defaultAcademicStyles.projects, portfolioId);

    useEffect(() => {
        if (portfolioData) {
            // We use the 'projects' data type for Research/Publications
            const projectsSection = portfolioData.find((item: any) => item.type === "projects");
            if (projectsSection && projectsSection.data) {
                setResearchData(projectsSection.data);
            }
        }
    }, [portfolioData]);

    if (!researchData || researchData.length === 0) return null;

    // Mappings for Tailwind classes
    const sizeMap: Record<string, string> = {
        "xs": "text-xs",
        "sm": "text-sm",
        "md": "text-base",
        "lg": "text-lg",
        "xl": "text-xl",
    };

    const weightMap: Record<string, string> = {
        "normal": "font-normal",
        "medium": "font-medium",
        "semibold": "font-semibold",
        "bold": "font-bold",
    };

    return (
        <section
            id="research"
            className="px-8 md:px-16 lg:px-24 py-16 border-t relative group"
            style={{
                backgroundColor: effectiveCustomization.backgroundColor || "#ffffff",
                borderColor: effectiveCustomization.cardBorder || "#e2e8f0",
            }}
        >
            {/* Edit Buttons */}
            <div className="absolute top-4 right-4 flex flex-row gap-2 z-50">
                <EditButton
                    sectionName="projects"
                    divStyles=""
                    styles="bg-white/90 hover:bg-white text-gray-800 shadow-sm !px-3 !py-1.5 !text-xs"
                />
                <button
                    onClick={openVisualEditor}
                    className="flex items-center justify-center gap-2 px-4 py-2 cursor-pointer text-xs font-medium text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                    style={{
                        background: `linear-gradient(135deg, #10b981, #059669)`,
                    }}
                    title="Visual Editor"
                >
                    <Settings size={14} />
                    <span>Visual Editor</span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl"
            >
                <h2
                    className="text-3xl font-bold mb-10"
                    style={{
                        color: effectiveCustomization.titleColor || "#1a202c",
                        fontFamily: "Merriweather, serif",
                    }}
                >
                    Selected Publications
                </h2>

                <div className="space-y-8">
                    {researchData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 min-w-[24px]">
                                    <FileText size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <div>
                                    <h3
                                        className={`mb-2 transition-colors group-hover:text-blue-600 ${sizeMap[effectiveCustomization.titleSize || "xl"]} ${weightMap[effectiveCustomization.titleWeight || "bold"]}`}
                                        style={{ color: effectiveCustomization.titleColor || "#111827" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className={`mb-3 leading-relaxed ${sizeMap[effectiveCustomization.descriptionSize || "md"]} ${weightMap[effectiveCustomization.descriptionWeight || "normal"]}`}
                                        style={{ color: effectiveCustomization.descriptionColor || "#4b5563" }}
                                    >
                                        {item.description}
                                    </p>
                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            Read Paper <ExternalLink size={14} className="ml-1" />
                                        </a>
                                    )}
                                    {/* If there are technologies/tags, treat them as keywords */}
                                    {item.technologies && item.technologies.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item.technologies.map((tech: string, i: number) => (
                                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <AcademicProjectsVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={effectiveCustomization}
                draftCustomization={draftCustomization}
                onUpdateDraft={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
                activeTab="typography"
                onTabChange={() => { }}
            />
        </section>
    );
};

export default Research;

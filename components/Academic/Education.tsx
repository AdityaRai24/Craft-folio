"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultAcademicStyles } from "@/types/academic";
import { Settings } from "lucide-react";
import EditButton from "@/components/Shared/EditButton";
import AcademicEducationVisualEditor from "@/components/VisualEditor/Education/AcademicEducationVisualEditor";

const Education = ({ portfolioId }: { portfolioId: string }) => {
    const { portfolioData } = useSelector((state: RootState) => state.data);
    const [educationData, setEducationData] = useState<any[]>([]);

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
    } = useCustomization("education", defaultAcademicStyles.education, portfolioId);

    useEffect(() => {
        if (portfolioData) {
            const educationSection = portfolioData.find((item: any) => item.type === "education");
            if (educationSection && educationSection.data) {
                setEducationData(educationSection.data);
            }
        }
    }, [portfolioData]);

    if (!educationData || educationData.length === 0) return null;

    // Mappings for Tailwind classes
    const sizeMap: Record<string, string> = {
        "sm": "text-sm",
        "md": "text-base",
        "lg": "text-lg",
        "xl": "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
    };

    const weightMap: Record<string, string> = {
        "normal": "font-normal",
        "medium": "font-medium",
        "semibold": "font-semibold",
        "bold": "font-bold",
        "extrabold": "font-extrabold",
    };

    return (
        <section
            id="education"
            className="px-8 md:px-16 lg:px-24 py-16 border-t relative group"
            style={{
                backgroundColor: effectiveCustomization.backgroundColor || "#ffffff",
                borderColor: effectiveCustomization.borderColor || "#e2e8f0",
            }}
        >
            {/* Edit Buttons */}
            <div className="absolute top-4 right-4 flex flex-row gap-2 z-50">
                <EditButton
                    sectionName="education"
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
                        color: effectiveCustomization.headingColor || "#1a202c",
                        fontFamily: "Merriweather, serif",
                    }}
                >
                    Education
                </h2>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-10">
                    {educationData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="ml-8 relative"
                        >
                            <span className="absolute -left-[41px] top-1 bg-white border-2 border-gray-200 rounded-full p-1">
                                <GraduationCap size={16} className="text-gray-500" />
                            </span>

                            <h3
                                className={`text-gray-900 ${sizeMap[effectiveCustomization.titleSize || "xl"]} ${weightMap[effectiveCustomization.titleWeight || "bold"]}`}
                            >
                                {item.degree}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-2">
                                <span className={`font-medium ${sizeMap[effectiveCustomization.institutionSize || "md"]}`}>{item.institution}</span>
                                <span className="hidden sm:inline mx-2">•</span>
                                <span className="text-sm">{item.year}</span>
                            </div>
                            {item.description && (
                                <p className="text-gray-600 leading-relaxed mt-2">
                                    {item.description}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <AcademicEducationVisualEditor
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

export default Education;

"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultAcademicStyles } from "@/types/academic";
import { Settings } from "lucide-react";
import EditButton from "@/components/Shared/EditButton";
import AcademicExperienceVisualEditor from "@/components/VisualEditor/Experience/AcademicExperienceVisualEditor";
import { useExperienceStyles } from "@/hooks/useExperienceStyles";
import { ColorTheme } from "@/lib/colorThemes";

const Experience = ({ portfolioId }: { portfolioId: string }) => {
    const { portfolioData } = useSelector((state: RootState) => state.data);
    const [experienceData, setExperienceData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "timing">("typography");

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
    } = useCustomization("experience", defaultAcademicStyles.experience, portfolioId);

    const {
        getContainerClasses,
        getContainerStyle,
        getCardClasses,
        getCardStyle,
        getRoleClasses,
        getCompanyClasses,
        getDescriptionTextClasses,
        getDateClasses,
        getLocationClasses
    } = useExperienceStyles(effectiveCustomization, "light", ColorTheme.primary);

    useEffect(() => {
        if (portfolioData) {
            const experienceSection = portfolioData.find((item: any) => item.type === "experience");
            if (experienceSection && experienceSection.data) {
                setExperienceData(experienceSection.data);
            }
        }
    }, [portfolioData]);

    if (!experienceData || experienceData.length === 0) return null;

    return (
        <section
            id="experience"
            className="px-8 md:px-16 lg:px-24 py-16 border-t relative group text-gray-900"
            style={{
                backgroundColor: effectiveCustomization.backgroundColor || "#ffffff",
                borderColor: effectiveCustomization.cardBorderColor || "#e2e8f0",
            }}
        >
            {/* Edit Buttons */}
            <div className="absolute top-4 right-4 flex flex-row gap-2 z-50">
                <EditButton
                    sectionName="experience"
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
                    Academic Experience
                </h2>

                <div className="space-y-12">
                    {experienceData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col md:flex-row md:gap-8"
                        >
                            <div className="md:w-1/4 mb-2 md:mb-0">
                                <span
                                    className={`uppercase tracking-wider ${getDateClasses()}`}
                                    style={{ color: effectiveCustomization.dateColor || "#6b7280" }}
                                >
                                    {item.duration}
                                </span>
                            </div>
                            <div className="md:w-3/4">
                                <h3
                                    className={`mb-1 ${getRoleClasses()}`}
                                    style={{ color: effectiveCustomization.roleColor || "#111827" }}
                                >
                                    {item.role}
                                </h3>
                                <div
                                    className={`mb-3 ${getCompanyClasses()}`}
                                    style={{ color: effectiveCustomization.companyNameColor || "#111827" }}
                                >
                                    {item.company}
                                </div>
                                <p
                                    className={`leading-relaxed ${getDescriptionTextClasses()}`}
                                    style={{ color: effectiveCustomization.descriptionTextColor || "#4b5563" }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <AcademicExperienceVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={effectiveCustomization}
                draftCustomization={draftCustomization}
                onUpdateDraft={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                primaryColor={ColorTheme.primary}
            />
        </section>
    );
};

export default Experience;

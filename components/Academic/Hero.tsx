"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultAcademicStyles } from "@/types/academic";
import EditButton from "@/components/Shared/EditButton";
import { Settings } from "lucide-react";
import AcademicHeroVisualEditor from "@/components/VisualEditor/Hero/AcademicHeroVisualEditor";

const Hero = ({ portfolioId }: { portfolioId: string }) => {
    const { portfolioData } = useSelector((state: RootState) => state.data);
    const [heroData, setHeroData] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

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
    } = useCustomization("hero", defaultAcademicStyles.hero, portfolioId);

    useEffect(() => {
        if (portfolioData) {
            const heroSection = portfolioData.find((item: any) => item.type === "hero");
            if (heroSection) {
                setHeroData(heroSection.data);
            }
            const userSection = portfolioData.find((item: any) => item.type === "userInfo");
            if (userSection) {
                setUserInfo(userSection.data);
            }
        }
    }, [portfolioData]);

    if (!heroData) return null;

    // Determine which image to show: Hero specific image or User Profile image
    const displayImage = heroData.heroImage || userInfo?.profileImage;

    // Mappings for Tailwind classes
    const sizeMap: Record<string, string> = {
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl",
        "base": "text-base",
        "lg": "text-lg",
        "xl": "text-xl",
    };

    const weightMap: Record<string, string> = {
        "normal": "font-normal",
        "medium": "font-medium",
        "bold": "font-bold",
        "extrabold": "font-extrabold",
    };

    const leadingMap: Record<string, string> = {
        "normal": "leading-normal",
        "relaxed": "leading-relaxed",
        "loose": "leading-loose",
    };

    return (
        <section
            id="about"
            className="min-h-[60vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 relative group"
            style={{
                backgroundColor: effectiveCustomization.backgroundColor || "#ffffff",
                color: effectiveCustomization.textColor || "#1a202c",
            }}
        >
            {/* Edit Buttons */}
            <div className="absolute top-4 right-4 flex flex-row gap-2 z-50">
                <EditButton
                    sectionName="academic-hero-content"
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

            <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1"
                >
                    <h1
                        className={`mb-6 leading-tight ${sizeMap[effectiveCustomization.titleSize || "4xl"]} ${weightMap[effectiveCustomization.titleWeight || "bold"]}`}
                        style={{ fontFamily: effectiveCustomization.fontFamily || "Merriweather, serif" }}
                    >
                        {heroData.title || "Hello, I'm a Researcher."}
                    </h1>

                    <div
                        className={`mb-8 text-gray-700 ${leadingMap[effectiveCustomization.lineHeight || "relaxed"]} ${sizeMap[effectiveCustomization.summarySize || "lg"]} ${weightMap[effectiveCustomization.summaryWeight || "normal"]}`}
                        dangerouslySetInnerHTML={{ __html: heroData.summary || "I specialize in..." }}
                    />

                    {heroData.longSummary && (
                        <div
                            className={`text-base text-gray-600 space-y-4 ${leadingMap[effectiveCustomization.lineHeight || "relaxed"]}`}
                            dangerouslySetInnerHTML={{ __html: heroData.longSummary }}
                        />
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full md:w-1/3 flex justify-center"
                >
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-lg">No Image</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <AcademicHeroVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={effectiveCustomization}
                draftCustomization={draftCustomization}
                onUpdateDraft={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
            />
        </section>
    );
};

export default Hero;

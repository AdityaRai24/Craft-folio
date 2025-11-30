import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Contact from "./Contact";
import MagicWrite from "@/components/Shared/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";

interface HomeTabProps {
    heroData: any;
    setHeroData: (data: any) => void;
    contactData: any;
    theme: string;
    themeClasses: any;
    effectiveCustomization: any;
    handleMagicWrite: (prompt: string, context: string, section: string) => Promise<string>;
    saveEnhancedContent: (data: any) => Promise<boolean>;
    portfolioData: any;
}

const HomeTab: React.FC<HomeTabProps> = ({
    heroData,
    setHeroData,
    contactData,
    theme,
    themeClasses,
    effectiveCustomization,
    handleMagicWrite,
    saveEnhancedContent,
    portfolioData,
}) => {
    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            {/* About Card */}
            <motion.div
                className="group relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: effectiveCustomization.animationSpeed / 1000,
                    delay: 0.6,
                }}
                whileHover={
                    effectiveCustomization.hoverEffects ? { y: -2 } : {}
                }
            >
                <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    style={{ background: themeClasses.gradientHover }}
                />
                <div
                    className={`relative ${theme === "light"
                        ? "bg-white border-gray-200/60"
                        : "bg-transparent"
                        } overflow-hidden border transition-all duration-500 transform ${effectiveCustomization.hoverEffects
                            ? "group-hover:translate-y-[-2px]"
                            : ""
                        }`}
                    style={{
                        borderColor:
                            theme === "light" ? "rgba(0,0,0,0.08)" : undefined,
                        borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                        padding: `${effectiveCustomization.cardPadding}px`,
                        boxShadow: effectiveCustomization.cardShadow
                            ? `0 ${effectiveCustomization.shadowIntensity * 4}px ${effectiveCustomization.shadowIntensity * 8
                            }px rgba(0, 0, 0, 0.1)`
                            : undefined,
                    }}
                >
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                            <div className="flex-shrink-0 flex justify-center sm:justify-start">
                                <motion.div
                                    className={`p-2 rounded-lg ${theme === "light"
                                        ? "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200/50"
                                        : "bg-gradient-to-r from-orange-400/20 to-purple-600/20"
                                        }`}
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Sparkles
                                        size={20}
                                        className={
                                            theme === "light"
                                                ? "text-orange-600"
                                                : "text-orange-400"
                                        }
                                    />
                                </motion.div>
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <motion.h3
                                    className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                                        }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    My Story
                                </motion.h3>
                                <div className="relative">
                                    <motion.p
                                        className={`text-base text-justify leading-relaxed ${theme === "dark"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                            }`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                    >
                                        {heroData?.longSummary ||
                                            "No description available"}
                                    </motion.p>
                                    <div className="absolute -top-1 -right-1 z-10 hidden md:block">
                                        <MagicWrite
                                            onMagicWrite={async (prompt: string) => {
                                                const enhanced = await handleMagicWrite(
                                                    prompt,
                                                    heroData?.longSummary || "No description available",
                                                    "hero"
                                                );
                                                const updated = { ...heroData, longSummary: enhanced };
                                                setHeroData(updated);
                                                await saveEnhancedContent(updated);
                                                return enhanced;
                                            }}
                                            placeholder="Enhance this description..."
                                            buttonText=""
                                            context={
                                                heroData?.longSummary ||
                                                "No description available"
                                            }
                                            className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `linear-gradient(to bottom, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                        }}
                    ></div>
                </div>
            </motion.div>

            {/* Let's Work Together Card */}
            <Contact
                contactData={contactData}
                theme={theme}
                themeClasses={themeClasses}
                effectiveCustomization={effectiveCustomization}
                portfolioData={portfolioData}
            />
        </motion.div>
    );
};

export default HomeTab;

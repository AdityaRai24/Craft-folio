import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";

interface ContactProps {
    contactData: any;
    theme: string;
    themeClasses: any;
    effectiveCustomization: any;
    portfolioData: any;
}

const Contact: React.FC<ContactProps> = ({
    contactData,
    theme,
    themeClasses,
    effectiveCustomization,
    portfolioData,
}) => {
    return (
        <motion.div
            className="group relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: effectiveCustomization.animationSpeed / 1000,
                delay: 0.8,
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
                    : "backdrop-blur-sm"
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
                    <div className="md:flex items-center justify-between">
                        <div className="space-y-4 mb-4 md:mb-0">
                            <motion.h3
                                className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                                    }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                            >
                                Let's Work Together
                            </motion.h3>
                            <motion.p
                                className={`text-base leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                            >
                                <span
                                    className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Interested in collaborating?
                                </span>{" "}
                                Download my CV to learn more about my experience and
                                expertise.
                            </motion.p>
                        </div>
                        <div className="flex-shrink-0">
                            <motion.a
                                href={
                                    contactData?.resumeLink ||
                                    contactData?.resumeLink ||
                                    undefined
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex cursor-pointer items-center space-x-3 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105 group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 1.1 }}
                                onClick={(e) => {
                                    if (
                                        !contactData?.resumeLink &&
                                        !contactData?.resumeLink
                                    ) {
                                        e.preventDefault();
                                        // Check if portfolio is hosted (has slug or subdomain)
                                        const isHosted =
                                            portfolioData?.find(
                                                (section: any) => section.type === "themes"
                                            )?.data?.PortfolioLink?.slug ||
                                            portfolioData?.find(
                                                (section: any) => section.type === "themes"
                                            )?.data?.PortfolioLink?.subdomain;
                                        if (isHosted) {
                                            toast.error("No resume available.");
                                        } else {
                                            toast.error(
                                                "No resume available. Please upload a resume in the contact section."
                                            );
                                        }
                                    }
                                }}
                            >
                                <span>Download CV</span>
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Download size={18} />
                                </motion.div>
                            </motion.a>
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme === "light"
                        ? "bg-gradient-to-b from-orange-500 to-orange-600"
                        : "bg-gradient-to-b from-orange-400 to-orange-600"
                        }`}
                ></div>
            </div>
        </motion.div>
    );
};

export default Contact;

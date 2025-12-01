import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

interface SidebarProfileProps {
    heroData: any;
    contactData: any;
    theme: string;
    themeClasses: any;
    effectiveCustomization: any;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({
    heroData,
    contactData,
    theme,
    themeClasses,
    effectiveCustomization,
}) => {
    return (
        <motion.div
            className="hidden lg:block mt-16 flex-shrink-0 sticky h-fit"
            style={{ width: `${effectiveCustomization.sidebarWidth}px` }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${theme === "light"
                    ? "bg-white/80 shadow-2xl border-gray-200/50"
                    : ""
                    } ${effectiveCustomization.backgroundBlur ? "backdrop-blur-md" : ""
                    }`}
                style={{
                    backdropFilter: effectiveCustomization.backgroundBlur
                        ? `blur(${effectiveCustomization.blurIntensity}px)`
                        : undefined,
                }}
            >
                <div className="absolute -inset-1 rounded-2xl opacity-50 blur-xl"></div>

                <div className="relative z-10">
                    {/* Profile Image with Enhanced Styling - Only show if enabled */}
                    {effectiveCustomization.showProfileImage && (
                        <motion.div
                            className="relative mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div
                                className="relative block mx-auto"
                                style={{
                                    width: `${effectiveCustomization.profileImageSize}px`,
                                    height: `${effectiveCustomization.profileImageSize}px`,
                                }}
                            >
                                <div
                                    className={`absolute -inset-2 rounded-full opacity-20 blur-lg ${theme === "light" ? "opacity-30" : ""
                                        }`}
                                    style={{ background: themeClasses.gradientPrimary }}
                                ></div>
                                <motion.div
                                    className={`relative w-full h-full rounded-full overflow-hidden shadow-2xl ${theme === "light"
                                        ? "border-white shadow-orange-100/50"
                                        : "border-gray-600/50"
                                        }`}
                                    style={{
                                        border: effectiveCustomization.profileImageBorder
                                            ? `${effectiveCustomization.profileImageBorderWidth
                                            }px solid ${theme === "light"
                                                ? "#ffffff"
                                                : "rgba(75, 85, 99, 0.5)"
                                            }`
                                            : "none",
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img
                                        src={
                                            contactData?.profileImage ||
                                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                                        }
                                        alt={contactData?.name || "Profile"}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Name and Title - Larger when profile image is hidden */}
                    <motion.div
                        className={`space-y-1 mb-6 text-center ${!effectiveCustomization.showProfileImage ? "py-8" : ""
                            }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <motion.h1
                            className={`font-bold ${theme === "light" ? "text-gray-900" : ""
                                } ${effectiveCustomization.showProfileImage
                                    ? effectiveCustomization.nameSize === "sm"
                                        ? "text-lg"
                                        : effectiveCustomization.nameSize === "md"
                                            ? "text-xl"
                                            : effectiveCustomization.nameSize === "lg"
                                                ? "text-2xl"
                                                : "text-3xl"
                                    : "text-3xl"
                                }`}
                            style={{
                                color:
                                    theme === "light"
                                        ? undefined
                                        : themeClasses.textPrimary,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            {heroData?.name || "Your Name"}
                        </motion.h1>
                        <motion.p
                            className={`leading-relaxed max-w-xs mx-auto ${theme === "light" ? "text-gray-600" : ""
                                } ${effectiveCustomization.showProfileImage
                                    ? effectiveCustomization.titleSize === "sm"
                                        ? "text-xs"
                                        : effectiveCustomization.titleSize === "md"
                                            ? "text-sm"
                                            : "text-base"
                                    : "text-lg"
                                }`}
                            style={{
                                color:
                                    theme === "light"
                                        ? undefined
                                        : themeClasses.textSecondary,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            {heroData?.title || "Your Title"}
                        </motion.p>
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        {contactData?.email && (
                            <a
                                href={`mailto:${contactData.email}`}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${theme === "light"
                                        ? "hover:bg-orange-50 text-gray-600 hover:text-orange-600"
                                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <div className={`p-2 rounded-lg transition-colors ${theme === "light" ? "bg-gray-100 group-hover:bg-orange-100" : "bg-white/5 group-hover:bg-white/10"
                                    }`}>
                                    <Mail size={18} />
                                </div>
                                <span className="text-sm font-medium truncate">{contactData.email}</span>
                            </a>
                        )}

                        {contactData?.linkedin && (
                            <a
                                href={contactData.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${theme === "light"
                                        ? "hover:bg-orange-50 text-gray-600 hover:text-orange-600"
                                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <div className={`p-2 rounded-lg transition-colors ${theme === "light" ? "bg-gray-100 group-hover:bg-orange-100" : "bg-white/5 group-hover:bg-white/10"
                                    }`}>
                                    <Linkedin size={18} />
                                </div>
                                <span className="text-sm font-medium">LinkedIn</span>
                            </a>
                        )}

                        {contactData?.github && (
                            <a
                                href={contactData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${theme === "light"
                                        ? "hover:bg-orange-50 text-gray-600 hover:text-orange-600"
                                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <div className={`p-2 rounded-lg transition-colors ${theme === "light" ? "bg-gray-100 group-hover:bg-orange-100" : "bg-white/5 group-hover:bg-white/10"
                                    }`}>
                                    <Github size={18} />
                                </div>
                                <span className="text-sm font-medium">GitHub</span>
                            </a>
                        )}

                        {contactData?.location && (
                            <div className={`flex items-center gap-3 p-3 rounded-xl ${theme === "light" ? "text-gray-600" : "text-gray-400"
                                }`}>
                                <div className={`p-2 rounded-lg ${theme === "light" ? "bg-gray-100" : "bg-white/5"
                                    }`}>
                                    <MapPin size={18} />
                                </div>
                                <span className="text-sm font-medium">{contactData.location}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default SidebarProfile;

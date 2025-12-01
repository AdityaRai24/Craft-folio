import React from "react";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

interface MobileProfileCardProps {
    heroData: any;
    contactData: any;
    theme: string;
    themeClasses: any;
    effectiveCustomization: any;
}

const MobileProfileCard: React.FC<MobileProfileCardProps> = ({
    heroData,
    contactData,
    theme,
    themeClasses,
    effectiveCustomization,
}) => (
    <div className="block lg:hidden w-full mx-auto ">
        <div
            className={`relative rounded-2xl overflow-hidden border ${theme === "light"
                ? "bg-white/90 shadow-xl border-gray-200/60"
                : "bg-transparent"
                }`}
        >
            {/* Main Content Container */}
            <div className="p-4">
                {/* Top Section: Profile Image and Social Links */}
                <div className="flex items-center justify-between mb-3">
                    {/* Profile Image - Only show if enabled */}
                    {effectiveCustomization.showProfileImage && (
                        <div className="flex-shrink-0">
                            <div
                                className={`rounded-full overflow-hidden shadow-lg ${theme === "light" ? "bg-gray-50" : "bg-gray-800"
                                    }`}
                                style={{
                                    width: `${Math.min(
                                        effectiveCustomization.profileImageSize,
                                        96
                                    )}px`,
                                    height: `${Math.min(
                                        effectiveCustomization.profileImageSize,
                                        96
                                    )}px`,
                                    border: effectiveCustomization.profileImageBorder
                                        ? `${effectiveCustomization.profileImageBorderWidth
                                        }px solid ${theme === "light" ? "#f97316" : "#f97316"}`
                                        : "none",
                                }}
                            >
                                <img
                                    src={
                                        contactData?.profileImage ||
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                                    }
                                    alt={contactData?.name || "Profile"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Contact Info */}
                    {effectiveCustomization.socialLinksVisible && (
                        <div className="flex flex-wrap items-center justify-end gap-2 max-w-[60%]">
                            {contactData?.github && (
                                <a
                                    href={contactData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`rounded-full p-2 transition-all duration-200 hover:scale-110 ${theme === "light"
                                        ? "bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                                        : "bg-gray-800/80 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400"
                                        }`}
                                >
                                    <Github size={16} />
                                </a>
                            )}
                            {contactData?.linkedin && (
                                <a
                                    href={contactData.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`rounded-full p-2 transition-all duration-200 hover:scale-110 ${theme === "light"
                                        ? "bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                                        : "bg-gray-800/80 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400"
                                        }`}
                                >
                                    <Linkedin size={16} />
                                </a>
                            )}
                            {contactData?.email && (
                                <a
                                    href={`mailto:${contactData.email}`}
                                    className={`rounded-full p-2 transition-all duration-200 hover:scale-110 ${theme === "light"
                                        ? "bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                                        : "bg-gray-800/80 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400"
                                        }`}
                                >
                                    <Mail size={16} />
                                </a>
                            )}
                            {contactData?.location && (
                                <div
                                    className={`rounded-full p-2 ${theme === "light"
                                        ? "bg-gray-50 text-gray-700"
                                        : "bg-gray-800/80 text-gray-300"
                                        }`}
                                >
                                    <MapPin size={16} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Information */}
                <div
                    className={`space-y-1 ${!effectiveCustomization.showProfileImage ? "text-center" : ""
                        }`}
                >
                    <div
                        className={`font-bold leading-tight ${theme === "light" ? "text-gray-900" : "text-white"
                            } ${effectiveCustomization.showProfileImage
                                ? effectiveCustomization.nameSize === "sm"
                                    ? "text-base"
                                    : effectiveCustomization.nameSize === "md"
                                        ? "text-lg"
                                        : effectiveCustomization.nameSize === "lg"
                                            ? "text-xl"
                                            : "text-2xl"
                                : "text-2xl"
                            }`}
                    >
                        {contactData?.name || "Your Name"}
                    </div>

                    <div
                        className={`font-medium ${theme === "light" ? "text-orange-600" : "text-orange-400"
                            } ${effectiveCustomization.showProfileImage
                                ? effectiveCustomization.titleSize === "sm"
                                    ? "text-xs"
                                    : effectiveCustomization.titleSize === "md"
                                        ? "text-sm"
                                        : "text-base"
                                : "text-base"
                            }`}
                    >
                        {heroData?.title || "Your Title"}
                    </div>

                    <div
                        className={`text-xs break-all leading-relaxed ${theme === "light" ? "text-gray-600" : "text-gray-300"
                            }`}
                    >
                        {contactData?.email || "your@email.com"}
                    </div>
                </div>

                {/* Additional Info or Badge */}
                {heroData?.location && (
                    <div className="mt-3 pt-3 border-t border-gray-200/20">
                        <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${theme === "light"
                                ? "bg-gray-50 text-gray-700"
                                : "bg-gray-800/60 text-gray-400"
                                }`}
                        >
                            <MapPin size={12} />
                            {heroData.location}
                        </div>
                    </div>
                )}
            </div>

            {/* Subtle gradient overlay for depth */}
            <div
                className={`absolute inset-0 pointer-events-none ${theme === "light"
                    ? "bg-gradient-to-br from-transparent via-transparent to-orange-50/30"
                    : "bg-gradient-to-br from-transparent via-transparent to-orange-900/10"
                    }`}
            />
        </div>
    </div>
);

export default MobileProfileCard;

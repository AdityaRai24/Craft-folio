"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Github, Linkedin, Mail, GraduationCap, Edit, Palette, Settings } from "lucide-react";
import EditButton from "@/components/Shared/EditButton";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultAcademicSidebarStyles } from "@/types/academic/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AcademicSidebarVisualEditor from "@/components/VisualEditor/Sidebar/AcademicSidebarVisualEditor";

export interface SidebarProps {
    portfolioId: string;
    customization: any;
    effectiveCustomization: any;
    visualEditorOpen: boolean;
    setVisualEditorOpen: (open: boolean) => void;
    openVisualEditor: () => void;
    updateDraftCustomization: (key: string, value: any) => void;
    saveDraftCustomization: () => void;
    resetCustomization: () => void;
    draftCustomization: any;
}

const Sidebar = ({
    portfolioId,
    customization,
    effectiveCustomization,
    visualEditorOpen,
    setVisualEditorOpen,
    openVisualEditor,
    updateDraftCustomization,
    saveDraftCustomization,
    resetCustomization,
    draftCustomization
}: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const { portfolioData } = useSelector((state: RootState) => state.data);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        if (portfolioData) {
            const userSection = portfolioData.find((item: any) => item.type === "userInfo");
            if (userSection) {
                setUserInfo(userSection.data);
            }
        }
    }, [portfolioData]);

    const navItems = [
        { name: "About", href: "#about" },
        { name: "Research", href: "#research" },
        { name: "Experience", href: "#experience" },
        { name: "Education", href: "#education" },
        { name: "Contact", href: "#contact" },
    ];

    const sidebarVariants = {
        open: { x: 0 },
        closed: { x: "-100%" },
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <motion.div
                className="fixed md:sticky top-0 left-0 h-full md:h-screen z-40 flex flex-col border-r overflow-y-auto group bg-white"
                style={{
                    width: effectiveCustomization.width || "280px",
                    backgroundColor: effectiveCustomization.backgroundColor || "#f8f9fa",
                    borderColor: effectiveCustomization.borderColor || "#e2e8f0",
                    color: effectiveCustomization.textColor || "#2d3748",
                    borderRightWidth: effectiveCustomization.alignment === "right" ? 0 : 1,
                    borderLeftWidth: effectiveCustomization.alignment === "right" ? 1 : 0,
                }}
                variants={sidebarVariants}
                initial="closed"
                animate={
                    effectiveCustomization.layout === "collapsible" && window.innerWidth < 768
                        ? isOpen ? "open" : "closed"
                        : window.innerWidth >= 768 ? "open" : isOpen ? "open" : "closed"
                }
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Edit Buttons */}
                <div className="absolute top-4 right-4 flex flex-row gap-2 z-50">
                    <EditButton
                        sectionName="academic-sidebar-content"
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

                <div className="p-8 flex flex-col items-center text-center">
                    {effectiveCustomization.showProfileImage && (
                        <div
                            className="rounded-full overflow-hidden mb-6 border-4 border-white shadow-md mx-auto"
                            style={{
                                width: effectiveCustomization.profileImageSize || 160,
                                height: effectiveCustomization.profileImageSize || 160,
                            }}
                        >
                            {userInfo?.profileImage ? (
                                <img
                                    src={userInfo.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <GraduationCap size={48} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    )}

                    {effectiveCustomization.showName && (
                        <h2 className="text-xl font-bold font-serif mb-2">{userInfo?.name || "Dr. Alex Researcher"}</h2>
                    )}

                    {effectiveCustomization.showTitle && (
                        <p className="text-sm text-gray-600 mb-6">{userInfo?.title || "PhD Candidate"}</p>
                    )}

                    {effectiveCustomization.showSocialLinks && (
                        <div className="flex gap-4 mb-8">
                            <Github size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                            <Linkedin size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                            <Mail size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className="block py-2 px-4 rounded-md hover:bg-black/5 transition-colors font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {(effectiveCustomization.showDownloadButton || effectiveCustomization.showFooter) && (
                    <div className="p-8">
                        {effectiveCustomization.showDownloadButton && (
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium mb-4">
                                <Download size={16} />
                                Download CV
                            </button>
                        )}
                        {effectiveCustomization.showFooter && (
                            <p className="text-xs text-center text-gray-500">
                                © 2025 Academic Portfolio
                            </p>
                        )}
                    </div>
                )}
            </motion.div>

            <AcademicSidebarVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={effectiveCustomization}
                draftCustomization={draftCustomization}
                onUpdateDraft={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
            />
        </>
    );
};

export default Sidebar;

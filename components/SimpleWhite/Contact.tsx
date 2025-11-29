"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setComponentCustomizations } from '@/slices/dataSlice';
import { supabase } from '@/lib/supabase-client';
import { ColorTheme } from '@/lib/colorThemes';
import { ContactCustomizationState } from '@/types/contact/portfolio';
import { ContactVisualEditor } from '@/components/VisualEditor/Contact/ContactVisualEditor';
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from '@/app/actions/portfolio';
import toast from 'react-hot-toast';
import SectionHeader from './SectionHeader';

const Contact = ({ currentPortTheme, portfolioId }: any) => {
    const dispatch = useDispatch();
    const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
    const inTheme = portfolioData?.find((item: any) => item.type === "themes");
    const theme = inTheme?.data?.[currentPortTheme];

    const [isLoading, setIsLoading] = useState(true);
    const [heroData, setHeroData] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    // Visual editor state
    const [visualEditorOpen, setVisualEditorOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"layout" | "styling">("layout");

    // Default customization
    const defaultContactStyles: ContactCustomizationState = {
        layout: "grid",
        gridColumns: 3,
        cardLayout: "stacked",
        cardSize: "default",
        cardStyle: "default",
        cardBorderRadius: 8,
        cardPadding: 8,
        cardSpacing: 24,
        containerWidth: "wide",
        iconSize: 24,
        iconStyle: "outline",
        showLabels: true,
        showDescriptions: false,
        textAlignment: "left",
        animationStyle: "none",
        animationSpeed: 300,
        staggerDelay: 100,
        hoverEffects: true,
        backgroundOpacity: 100,
        borderWidth: 1,
        copyToClipboard: false,
        openInNewTab: true,
    };

    const [customization, setCustomization] = useState<ContactCustomizationState>(defaultContactStyles);
    const [draftCustomization, setDraftCustomization] = useState<ContactCustomizationState | null>(null);

    useEffect(() => {
        if (portfolioData) {
            const heroSectionData = portfolioData?.find((section: any) => section.type === "hero")?.data;
            const userInfoData = portfolioData?.find((section: any) => section.type === "userInfo")?.data;

            if (userInfoData) {
                setUserInfo(userInfoData);
            }

            if (heroSectionData) {
                setHeroData(heroSectionData);
            } else {
                setHeroData({
                    name: "John Doe",
                    title: "Full Stack Developer",
                    summary: "I build exceptional and accessible digital experiences for the web.",
                    shortSummary: "I build exceptional and accessible digital experiences for the web.",
                });
            }
            setIsLoading(false);
        }
    }, [portfolioData]);

    // Load customizations
    useEffect(() => {
        const loadCustomizations = async () => {
            try {
                if (componentCustomizations && componentCustomizations["contact"]) {
                    setCustomization(componentCustomizations["contact"] as unknown as ContactCustomizationState);
                } else {
                    const result = await getComponentCustomization({
                        portfolioId,
                        componentType: "contact",
                    });
                    if (result.success && result.data) {
                        setCustomization(result.data as unknown as ContactCustomizationState);
                        dispatch(setComponentCustomizations({ contact: result.data }));
                    }
                }
            } catch (error) {
                console.error("Error loading customizations:", error);
            }
        };

        if (portfolioId) {
            loadCustomizations();
        }
    }, [portfolioId, componentCustomizations, dispatch]);

    useEffect(() => {
        if (!portfolioId || isLoading) return;

        const subscription = supabase
            .channel(`portfolio-contact-${portfolioId}`)
            .on('postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'Portfolio',
                    filter: `id=eq.${portfolioId}`
                },
                (payload) => {
                    // Handle real-time updates
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [portfolioId, isLoading]);

    const updateDraftCustomization = (key: keyof ContactCustomizationState, value: any) => {
        if (!draftCustomization) return;
        setDraftCustomization({ ...draftCustomization, [key]: value });
    };

    const saveDraftCustomization = async () => {
        if (!draftCustomization || !portfolioId) return;

        try {
            const result = await saveComponentCustomization({
                portfolioId,
                componentType: "contact",
                settings: draftCustomization,
            });

            if (result.success) {
                setCustomization(draftCustomization);
                dispatch(setComponentCustomizations({ contact: draftCustomization }));
                setDraftCustomization(null);
                setVisualEditorOpen(false);
                toast.success("Contact settings saved!");
            }
        } catch (error) {
            console.error("Error saving customization:", error);
            toast.error("Failed to save settings");
        }
    };

    const resetCustomization = async () => {
        if (!portfolioId) return;

        try {
            const result = await deleteComponentCustomization({
                portfolioId,
                componentType: "contact",
            });

            if (result.success) {
                setCustomization(defaultContactStyles);
                setDraftCustomization(defaultContactStyles);
                dispatch(setComponentCustomizations({ contact: null }));
                toast.success("Reset to default settings!");
            }
        } catch (error) {
            console.error("Error resetting customization:", error);
            toast.error("Failed to reset settings");
        }
    };

    // Theme color variables
    const primaryColor = theme?.colors?.primary || ColorTheme.primary;
    const primaryHoverColor = theme?.colors?.primaryHover || ColorTheme.primaryDark;
    const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
    const textSecondaryColor = theme?.colors?.text?.secondary || "#6B7280";
    const backgroundPrimaryColor = theme?.colors?.background?.primary || "#FFFFFF";

    const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

    return (
        <div className="relative">
            <SectionHeader
                sectionName="contact"
                headerVisible={false}
                titleSize="3xl"
                titleWeight="bold"
                titleColor="black"
                titleAlignment="center"
                descriptionSize="lg"
                descriptionColor="gray-600"
                descriptionVisible={true}
                title="Get in Touch"
                description="Let's connect and discuss your next project"
                onVisualEditorClick={() => {
                    setDraftCustomization({ ...customization });
                    setVisualEditorOpen(true);
                }}
                headerClasses={{ container: "mb-12 text-center relative", title: "text-4xl font-bold mb-4", description: "text-lg text-gray-600" }}
                currentPortTheme={currentPortTheme}
            />

            <footer
                className="w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8"
                style={{ backgroundColor: backgroundPrimaryColor, color: textPrimaryColor }}
            >
                {/* Divider line */}
                <div className="border-t border-gray-200 mb-6 sm:mb-8"></div>

                <div
                    className={`flex flex-col md:flex-row justify-between mx-auto items-start md:items-start space-y-6 md:space-y-0 ${effectiveCustomization.containerWidth === "narrow" ? "max-w-4xl" :
                        effectiveCustomization.containerWidth === "wide" ? "max-w-6xl" :
                            "max-w-full"
                        }`}
                >
                    {/* Left section - Name */}
                    <div className="mb-4 md:mb-0">
                        <h2
                            className="text-2xl sm:text-3xl font-bold"
                            style={{ textAlign: effectiveCustomization.textAlignment }}
                        >
                            {heroData?.name || "John Doe"}
                        </h2>
                        <p
                            className="mt-2 max-w-md text-sm sm:text-base"
                            style={{
                                color: textSecondaryColor,
                                textAlign: effectiveCustomization.textAlignment
                            }}
                        >
                            {userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web."}
                        </p>
                    </div>

                    {/* Middle section - Quick Links */}
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Quick Links</h3>
                        <nav>
                            <ul className="space-y-1 sm:space-y-2">
                                <li><a href="#about" style={{ color: textSecondaryColor }} className="hover:opacity-80 text-sm sm:text-base">About Me</a></li>
                                <li><a href="#projects" style={{ color: textSecondaryColor }} className="hover:opacity-80 text-sm sm:text-base">Projects</a></li>
                                <li><a href="#skills" style={{ color: textSecondaryColor }} className="hover:opacity-80 text-sm sm:text-base">Skills</a></li>
                                <li><a href="#experience" style={{ color: textSecondaryColor }} className="hover:opacity-80 text-sm sm:text-base">Experience</a></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Right section - Connect */}
                    <div>
                        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Connect</h3>
                        <div className="flex space-x-3 sm:space-x-4">
                            <a
                                href={userInfo?.github}
                                target={effectiveCustomization.openInNewTab ? "_blank" : undefined}
                                rel={effectiveCustomization.openInNewTab ? "noopener noreferrer" : undefined}
                                className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
                            >
                                GitHub
                            </a>
                            <a
                                href={userInfo?.linkedin}
                                target={effectiveCustomization.openInNewTab ? "_blank" : undefined}
                                rel={effectiveCustomization.openInNewTab ? "noopener noreferrer" : undefined}
                                className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
                    © 2025 {heroData?.name || "John Doe"}. All rights reserved.
                </div>
            </footer>

            {/* Contact Visual Editor */}
            <ContactVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={customization}
                draftCustomization={draftCustomization}
                onUpdateDraft={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                primaryColor={primaryColor}
                primaryDarkColor={primaryHoverColor}
            />
        </div>
    );
};

export default Contact;
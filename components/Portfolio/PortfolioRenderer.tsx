"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useCustomization } from "@/hooks/useCustomization";
import {
    setCustomCSSState,
    setFontName,
    setThemeName,
} from "@/slices/dataSlice";
import { defaultAcademicSidebarStyles } from "@/types/academic/sidebar";
import { templateConfig } from "@/lib/templateConfig";
import Sidebar from "@/app/p/Sidebar";
import { Spotlight } from "@/components/NeoSpark/Spotlight";
import Chatbot from "@/components/Chatbot/Chatbot";
import { motion } from "framer-motion";
import { fontClassMap } from "@/lib/font";
import { cn } from "@/lib/utils";
import PortfolioNotFound from "@/components/Shared/PortfolioNotFound";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import { CheckCircle, Layout, Palette } from "lucide-react";
import GuestWarningModal from "@/components/Modals/GuestWarningModal";

interface PortfolioRendererProps {
    isLoading: boolean;
    dataLoaded: boolean;
    portfolioNotFound: boolean;
    portfolioId: string;
    portfolioLink: string;
}

const PortfolioRenderer = ({
    isLoading,
    dataLoaded,
    portfolioNotFound,
    portfolioId,
    portfolioLink,
}: PortfolioRendererProps) => {
    const dispatch = useDispatch();

    const {
        portfolioData,
        portfolioUserId,
        templateName,
        themeName,
        fontName,
        customCSSState,
        componentCustomizations,
    } = useSelector((state: RootState) => state.data);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false);

    type TemplateType = {
        navbar: React.ComponentType;
        spotlight?: boolean;
        sections: {
            [key: string]: React.ComponentType;
        };
    };

    const allSections = dataLoaded
        ? portfolioData?.map((item: any) => item.type)
        : [];

    const themes = dataLoaded
        ? portfolioData?.find((item: any) => item.type === "themes")?.data || {}
        : {};

    // Show guest modal on first load if in guest mode
    useEffect(() => {
        if (dataLoaded && portfolioUserId === "guest") {
            setShowGuestModal(true);
        }
    }, [dataLoaded, portfolioUserId]);

    // Get sidebar customization for Academic template
    // We move the hook here to control layout preview
    const sidebarState = useCustomization("sidebar", defaultAcademicSidebarStyles, portfolioId);
    const { effectiveCustomization } = sidebarState;

    const sidebarWidth = effectiveCustomization.width || "280px";
    const sidebarAlignment = effectiveCustomization.alignment || "left";
    const isAcademic = templateName === "Academic";

    // Don't try to access template config until we have template name
    const Template =
        dataLoaded && templateName
            ? (templateConfig[
                templateName as keyof typeof templateConfig
            ] as TemplateType)
            : null;

    const getComponentForSection = (sectionType: string) => {
        if (!Template || !Template.sections || !Template.sections[sectionType]) {
            return null;
        }
        const SectionComponent: any = Template.sections[sectionType];
        return SectionComponent ? (
            <SectionComponent
                currentPortTheme={themeName}
                customCSS={customCSSState}
                portfolioId={portfolioId}
                key={`${sectionType}`}
            />
        ) : null;
    };

    if (portfolioNotFound) {
        return <PortfolioNotFound />;
    }

    if (isLoading || !dataLoaded || !Template) {
        const portfolioMessages: any = [
            { text: "Loading the portfolio", icon: Palette },
            { text: "Fetching data", icon: Layout },
            { text: "Almost there", icon: CheckCircle },
        ];
        return <LoadingSpinner loadingMessages={portfolioMessages} />;
    }

    // By this point, we guarantee the data is loaded
    const NavbarComponent: any = Template.navbar;
    const hasSpotlight = Template.spotlight;
    const selectedFontClass = fontClassMap[fontName] || fontClassMap["raleway"];

    // Special handling for MacOS and Windows templates - render Desktop component
    if (templateName === "MacOS" || templateName === "Windows") {
        const DesktopComponent = Template.sections?.desktop as React.ComponentType<{
            currentPortTheme?: string;
            customCSS?: string;
            portfolioId?: string;
            font?: string;
        }>;
        return (
            <>
                <GuestWarningModal
                    open={showGuestModal}
                    onClose={() => setShowGuestModal(false)}
                />
                <Sidebar />
                <div className={cn(" min-h-screen w-full", selectedFontClass)}>
                    {DesktopComponent && (
                        <DesktopComponent
                            currentPortTheme={themeName}
                            customCSS={customCSSState}
                            portfolioId={portfolioId}
                            font={selectedFontClass}
                        />
                    )}
                </div>
                {/* Only render Chatbot after data is loaded */}
                {dataLoaded && (
                    <Chatbot
                        portfolioData={portfolioData}
                        themeOptions={themes}
                        setCurrentFont={(font) => dispatch(setFontName(font))}
                        setCurrentPortTheme={(theme) => dispatch(setThemeName(theme))}
                        portfolioId={portfolioId}
                        currentPortTheme={themeName}
                        currentFont={fontName}
                        portfolioLink={portfolioLink}
                        onOpenChange={setIsChatOpen}
                        setCustomCSS={(css) => dispatch(setCustomCSSState(css))}
                        customCSSState={customCSSState}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <GuestWarningModal
                open={showGuestModal}
                onClose={() => setShowGuestModal(false)}
            />
            {/* Removed overflow-x-hidden to fix sticky sidebar */}
            <div className="min-h-screen flex flex-col">
                {hasSpotlight && (
                    <div className="absolute inset-0">
                        <Spotlight
                            className="-top-40 left-0 md:-top-80 md:left-5"
                            fill="white"
                        />
                    </div>
                )}

                {/* Responsive layout: on md+ if chat is open, add right margin to main content */}
                <div
                    className={
                        isChatOpen
                            ? "w-full md:w-[80%] md:mr-[20%] transition-all duration-300"
                            : "w-full transition-all duration-300"
                    }
                >
                    <motion.div
                        className={cn(
                            "min-h-screen w-full transition-all duration-300 ease-in-out",
                            selectedFontClass,
                            isAcademic ? "flex flex-col md:flex-row" : "",
                            isAcademic && sidebarAlignment === "right" ? "md:flex-row-reverse" : ""
                        )}
                        style={
                            {
                                "--sidebar-width": sidebarWidth,
                            } as React.CSSProperties
                        }
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {NavbarComponent && (
                            <div className={cn(isAcademic ? "w-full md:w-[var(--sidebar-width)] flex-shrink-0" : "")}>
                                <NavbarComponent
                                    customCSS={customCSSState}
                                    currentPortTheme={themeName}
                                    portfolioId={portfolioId}
                                    {...sidebarState}
                                />
                            </div>
                        )}
                        <Sidebar />

                        <div className={cn("flex-1", isAcademic ? "min-w-0" : "")}>
                            {allSections && allSections.length > 0 ? (
                                allSections.map((section: string) =>
                                    getComponentForSection(section)
                                )
                            ) : (
                                <div className={cn("flex items-center justify-center h-screen")}>
                                    <p className="text-xl">Portfolio content not found</p>
                                </div>
                            )}

                            {/* Ensure Contact/Footer is always rendered if supported by template but missing from data */}
                            {allSections &&
                                !allSections.includes("contact") &&
                                getComponentForSection("contact")}
                        </div>
                    </motion.div>
                </div>

                {/* Only render Chatbot after data is loaded */}
                {dataLoaded && (
                    <Chatbot
                        portfolioData={portfolioData}
                        themeOptions={themes}
                        setCurrentFont={(font) => dispatch(setFontName(font))}
                        setCurrentPortTheme={(theme) => dispatch(setThemeName(theme))}
                        portfolioId={portfolioId}
                        currentPortTheme={themeName}
                        currentFont={fontName}
                        portfolioLink={portfolioLink}
                        onOpenChange={setIsChatOpen}
                        setCustomCSS={(css) => dispatch(setCustomCSSState(css))}
                        customCSSState={customCSSState}
                    />
                )}
            </div>
        </>
    );
};

export default PortfolioRenderer;

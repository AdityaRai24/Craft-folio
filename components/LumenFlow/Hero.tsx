"use client"
import Projects from "./Projects";
import Navbar from "./Navbar";
import Technologies from "./Technologies";
import Experience from "./Experience";
import Education from "./Education";
import { useEffect, useState } from "react";
import {
  LumenFlowThemeProvider,
  useLumenFlowTheme,
  getThemeClasses,
} from "./ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderComponent } from "./Components";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import { defaultLumenFlowHeroStyles } from "@/types/hero/lumenflow";
import LumenFlowHeroVisualEditor from "@/components/VisualEditor/Hero/LumenFlowHeroVisualEditor";
import { useLumenHeroStyles } from "@/hooks/useLumenHeroStyles";
import SectionLoading from "../Shared/SectionLoading";
import MobileProfileCard from "./MobileProfileCard";
import SidebarProfile from "./SidebarProfile";
import HomeTab from "./HomeTab";

const HeroContent = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const [activeTab, setActiveTab] = useState("home");
  const { theme } = useLumenFlowTheme();
  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const currentTheme = inTheme.data[currentPortTheme];
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);

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
  } = useCustomization("hero", defaultLumenFlowHeroStyles, portfolioId);

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "hero",
    sectionTitle: "Hero",
    sectionDescription: "Hero section"
  });

  const themeClasses = getThemeClasses(currentTheme);
  const { hexToRgba } = useLumenHeroStyles();

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData.find(
        (section: any) => section.type === "hero"
      )?.data;
      const contactSectionData = portfolioData.find(
        (section: any) => section.type === "userInfo"
      )?.data;

      if (heroSectionData) {
        setHeroData(heroSectionData);
      }
      if (contactSectionData) {
        setContactData(contactSectionData);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-hero-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
        }
      )
      .subscribe((status) => {
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, heroData, isLoading]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <Projects currentTheme={currentTheme} portfolioId={portfolioId} />;
      case "experience":
        return <Experience currentTheme={currentTheme} portfolioId={portfolioId} />;
      case "education":
        return <Education currentTheme={currentTheme} portfolioId={portfolioId} />;
      case "technologies":
        return <Technologies currentTheme={currentTheme} portfolioId={portfolioId} />;
      case "home":
      default:
        return (
          <motion.div
            className="space-y-4 md:space-y-6 lg:space-y-8 px-4 md:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Mobile Profile Card below navbar (hidden on desktop) */}
            <div className="block lg:hidden mb-4">
              <MobileProfileCard
                heroData={heroData}
                contactData={contactData}
                theme={theme}
                themeClasses={themeClasses}
                effectiveCustomization={effectiveCustomization}
              />
            </div>
            <HeaderComponent
              currentTheme={currentTheme}
              sectionTitle="About Me"
              sectionDescription="Discover my journey, skills, and passion for creating amazing digital experiences."
              sectionName="hero"
              openVisualEditor={openVisualEditor}
              visualEditorOpen={visualEditorOpen}
            />

            {/* Main Content Cards */}
            <HomeTab
              heroData={heroData}
              setHeroData={setHeroData}
              contactData={contactData}
              theme={theme}
              themeClasses={themeClasses}
              effectiveCustomization={effectiveCustomization}
              handleMagicWrite={handleMagicWrite}
              saveEnhancedContent={saveEnhancedContent}
              portfolioData={portfolioData}
            />
          </motion.div>
        );
    }
  };

  if (isLoading || !heroData) return <SectionLoading />

  return (
    <motion.div
      className={`min-h-screen lg:min-h-screen transition-colors duration-300 relative overflow-x-hidden`}
      style={{
        borderColor:
          theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
        background:
          theme === "light"
            ? "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)"
            : "",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0" />

      {/* Grid Background */}
      <motion.div
        className="fixed inset-0 z-0 opacity-25"
        style={{
          backgroundImage: 'url("/grid5.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: theme === "light" ? "none" : "block",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.2 }}
      />

      {/* Light mode subtle pattern */}
      {theme === "light" && (
        <motion.div
          className="fixed inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(251, 146, 60, 0.03) 0%, transparent 50%),
              linear-gradient(45deg, transparent 49%, rgba(251, 146, 60, 0.01) 50%, transparent 51%)
            `,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Gradient Overlay with controlled color opacity */}
      {effectiveCustomization.gradientOverlay && (
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            display: theme === "light" ? "none" : "block",
            backgroundColor: theme === "dark" ? "#05020A" : "#ffffff",
            background: `
              radial-gradient(
                at 50% 0%, 
                ${hexToRgba(
              themeClasses.gradientPrimary.split(", ")[1].split(" ")[0],
              theme === "dark" ? 0.23 : 0.4
            )} 0%, 
                transparent 70%
              )
            `,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      <div className="container mx-auto px-4 lg:px-8 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Sidebar Profile Card (hidden on mobile, left on desktop) */}
          <SidebarProfile
            heroData={heroData}
            contactData={contactData}
            theme={theme}
            themeClasses={themeClasses}
            effectiveCustomization={effectiveCustomization}
          />

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0 pt-24 lg:pt-8 pb-24">
            <Navbar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              currentTheme={currentTheme}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <LumenFlowHeroVisualEditor
        isOpen={visualEditorOpen}
        onClose={() => setVisualEditorOpen(false)}
        customization={customization}
        draftCustomization={draftCustomization}
        onUpdateDraft={updateDraftCustomization}
        onSave={saveDraftCustomization}
        onReset={resetCustomization}
      />
    </motion.div>
  );
};

const Hero = (props: any) => {
  return (
    <LumenFlowThemeProvider>
      <HeroContent {...props} />
    </LumenFlowThemeProvider>
  );
};

export default Hero;

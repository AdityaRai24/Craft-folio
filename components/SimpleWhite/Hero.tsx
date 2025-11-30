
"use client";

import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Settings } from "lucide-react";
import type { NextPage } from "next";
import AnimatedButton from "./AnimatedButton";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import MagicWrite from "@/components/Shared/MagicWrite";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { updateSection } from "@/app/actions/portfolio";
import { defaultSimpleWhiteHeroStyles } from "./defaultStyles/hero";
import { ColorTheme } from "@/lib/colorThemes";
import { useUser } from '@clerk/nextjs';
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import SectionLoading from "../Shared/SectionLoading";
import SimpleWhiteHeroVisualEditor from "@/components/VisualEditor/Hero/SimpleWhiteHeroVisualEditor";
import { useSimpleWhiteHeroStyles } from "@/hooks/useSimpleWhiteHeroStyles";


type Tab = "layout" | "typography" | "buttons" | "effects";

const Hero: NextPage = ({ currentPortTheme, customCSS, portfolioId }: any) => {

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = currentPortTheme ? inTheme?.data?.[currentPortTheme] : undefined;

  // Authentication check
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();
  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  // Theme colors
  const textPrimaryColor = theme?.colors?.text?.primary || ColorTheme.textPrimary;
  const textSecondaryColor = theme?.colors?.text?.secondary || ColorTheme.textSecondary;

  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("layout");


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
  } = useCustomization("hero", defaultSimpleWhiteHeroStyles, portfolioId);


  const {
    getContainerClasses,
    getTitleClasses,
    getSubtitleClasses,
    getDescriptionClasses,
    getBackgroundStyle,
    getBackgroundThemeStyle,
    getCardStyle,
    getSocialLinksClasses,
    getResumeButtonStyle,
    getResumeButtonInlineStyle,
  } = useSimpleWhiteHeroStyles(customization, theme, ColorTheme);



  const handleResumeDownload = () => {
    if (userInfo?.resumeLink) {
      window.open(userInfo.resumeLink, "_blank");
      return;
    }

    const isHosted = portfolioData?.find(
      (section: any) => section.type === "themes"
    )?.data?.PortfolioLink?.slug || portfolioData?.find(
      (section: any) => section.type === "themes"
    )?.data?.PortfolioLink?.subdomain;

    if (isHosted) {
      toast.error("No resume available.");
    } else {
      toast.error("No resume available. Please upload a resume in the contact section.");
    }
  };

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "hero",
    sectionTitle: "Hero",
    sectionDescription: "Hero section"
  });



  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData?.find(
        (section: any) => section.type === "hero"
      )?.data;
      const userInfoData = portfolioData?.find(
        (section: any) => section.type === "userInfo"
      )?.data;

      if (userInfoData) {
        setUserInfo(userInfoData);
      }

      if (heroSectionData) {
        setHeroData(heroSectionData);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || isLoading) return;

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
  }, [portfolioId, isLoading]);



  if (isLoading || !heroData) return <SectionLoading />


  return (
    <>
      <div id="about" className={`relative simple-white pt-8 sm:pt-12 md:pt-16 lg:pt-20`} style={getBackgroundThemeStyle()}>
        <style>{customCSS}</style>

        <div className="flex h-full pt-16 sm:pt-20 md:pt-24 justify-center items-end mb-16 sm:mb-20 md:mb-24">
          <div className={getContainerClasses()}>
            <div className="flex absolute gap-4 right-2 sm:right-24 top-2 sm:top-24 z-20">
              <EditButton
                sectionName={"hero"}
                styles="text-xs px-2 sm:px-3 py-1"
              />
              {shouldShowButton && (
                <button
                  onClick={openVisualEditor}
                  className="md:flex hidden cursor-pointer items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  }}
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Visual Editor</span>

                </button>
              )}
            </div>


            <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4 xl:gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 relative">
                <motion.h1
                  className={getTitleClasses()}
                  style={{ color: textPrimaryColor }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: 0.1,
                  }}
                >
                  {heroData?.name || "John Doe"}
                </motion.h1>

                <motion.h2
                  className={getSubtitleClasses()}
                  style={{ color: textSecondaryColor }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: 0.2,
                  }}
                >
                  {heroData?.title || "Full Stack Developer"}
                </motion.h2>

                <div className="relative">
                  <motion.p
                    className={getDescriptionClasses()}
                    style={{ color: textSecondaryColor }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                      delay: 0.3,
                    }}
                  >
                    {heroData?.summary ||
                      "I build exceptional and accessible digital experiences for the web."}
                  </motion.p>
                  <div className="absolute -top-1 -right-1 z-10 hidden md:block">
                    <MagicWrite
                      onMagicWrite={async (prompt: string) => {
                        const enhanced = await handleMagicWrite(prompt, heroData.summary, "hero");
                        const updated = { ...heroData, summary: enhanced };
                        setHeroData(updated);
                        await saveEnhancedContent(updated);
                        return enhanced;
                      }}
                      placeholder="Enhance this description..."
                      buttonText=""
                      context={heroData?.summary || "I build exceptional and accessible digital experiences for the web."}
                      className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className={`flex space-x-2 sm:space-x-3 md:space-x-4 mb-6 sm:mb-8 md:mb-12 lg:mb-16 ${effectiveCustomization.socialLinksVisible ? "" : "hidden"}`}>
                  <motion.a
                    href={userInfo?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getSocialLinksClasses()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                  >
                    <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" style={{ color: textPrimaryColor }} />
                  </motion.a>

                  <motion.a
                    href={userInfo?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getSocialLinksClasses()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                  >
                    <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" style={{ color: textPrimaryColor }} />
                  </motion.a>
                </div>
              </div>

              {/* Right Column - About */}
              <div className="lg:col-span-2 relative">
                {effectiveCustomization.aboutCardVisible && (
                  <motion.div
                    className={`${getCardStyle()} cursor-pointer`}
                    initial={{ x: 0, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                        delay: 0.4,
                      },
                    }}
                    style={{
                      scale: effectiveCustomization.hoverEffects ? 1.02 : 1,
                      boxShadow: effectiveCustomization.hoverEffects
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.01)"
                        : "",
                    }}
                  >
                    <motion.h2
                      className="text-2xl sm:text-3xl text-left lg:text-4xl font-bold section-sub-title mb-4 sm:mb-5 lg:mb-6"
                      style={{ color: textPrimaryColor }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.5, duration: 0.5 },
                      }}
                    >
                      About Me
                    </motion.h2>

                    <motion.div
                      className="flex items-center mb-3 sm:mb-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.6, duration: 0.5 },
                      }}
                    >
                      <MdEmail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: textSecondaryColor }} />
                      <a
                        href={`mailto:${userInfo?.email}`}
                        className="text-base sm:text-lg lg:text-xl font-medium break-all"
                        style={{ color: textSecondaryColor }}
                      >
                        {userInfo?.email}
                      </a>
                    </motion.div>

                    <motion.div
                      className="flex items-center mb-6 sm:mb-7 lg:mb-8"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.7, duration: 0.5 },
                      }}
                    >
                      <MdLocationOn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: textSecondaryColor }} />
                      <span className="text-base sm:text-lg font-medium" style={{ color: textSecondaryColor }}>
                        {userInfo?.location}
                      </span>
                    </motion.div>

                    <div className="relative">
                      <motion.p
                        className="section-sub-description text-sm sm:text-base lg:text-md leading-relaxed"
                        style={{ color: textSecondaryColor }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: { delay: 0.8, duration: 0.5 },
                        }}
                      >
                        {userInfo?.shortSummary ||
                          "I build exceptional and accessible digital experiences for the web."}
                      </motion.p>
                      <div className="absolute -top-1 -right-1 z-10 hidden md:block">
                        <MagicWrite
                          onMagicWrite={async (prompt: string, context?: string) => {
                            const enhancedSummary = await handleMagicWrite(prompt, userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web.");
                            // Update userInfo with enhanced summary
                            const updatedUserInfo = {
                              ...userInfo,
                              shortSummary: enhancedSummary
                            };
                            setUserInfo(updatedUserInfo);

                            // Save to database
                            try {
                              const result = await updateSection({
                                sectionName: "userInfo",
                                portfolioId,
                                sectionContent: updatedUserInfo,
                                sectionTitle: "User Info",
                                sectionDescription: "User information section"
                              });

                              if (result.success) {
                                toast.success("Summary enhanced and saved successfully!");
                              } else {
                                toast.error("Failed to save changes to database");
                              }
                            } catch (error) {
                              console.error("Error saving user info:", error);
                              toast.error("Failed to save changes to database");
                            }

                            return enhancedSummary;
                          }}
                          placeholder="Enhance this summary..."
                          buttonText=""
                          context={userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web."}
                          className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="mt-4 sm:mt-6 lg:mt-8 cursor-pointer lg:ml-32 flex justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {effectiveCustomization.resumeButtonVisible ? (
                    <motion.button
                      onClick={handleResumeDownload}
                      className={`${getResumeButtonStyle()} cursor-pointer flex items-center gap-2`}
                      style={getResumeButtonInlineStyle()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaFile size={20} />
                      Download Resume
                    </motion.button>
                  ) : (
                    <AnimatedButton
                      text="Download Resume"
                      icon={<FaFile size={20} />}
                      onClick={handleResumeDownload}
                    />
                  )}
                </motion.div>
              </div>
            </main>


            {/* Scroll Down Indicator */}
            {effectiveCustomization.scrollIndicatorVisible && (
              <motion.div
                className="flex justify-center mt-8 sm:mt-10 lg:mt-12"
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 1.2, duration: 0.5 },
                }}
                whileHover={{
                  y: [0, -8, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                    },
                  },
                }}
              >
                <motion.button
                  className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border transition-colors`}
                  style={{
                    borderColor: textSecondaryColor,
                    color: textSecondaryColor
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>



        {/* Bottom gradient edge to soften transition to next component */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <SimpleWhiteHeroVisualEditor
          isOpen={visualEditorOpen}
          onClose={() => setVisualEditorOpen(false)}
          customization={customization}
          draftCustomization={draftCustomization}
          onUpdateDraft={updateDraftCustomization}
          onSave={saveDraftCustomization}
          onReset={resetCustomization}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </>
  );
};

export default Hero;
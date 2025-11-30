"use client"
import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin, Sparkles, ExternalLink
} from "lucide-react";
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
import EditButton from "@/components/Shared/EditButton";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderComponent } from "./Components";
import { toast } from "react-hot-toast";
import MagicWrite from "@/components/Shared/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import { defaultLumenFlowHeroStyles } from "@/types/hero/lumenflow";
import LumenFlowHeroVisualEditor from "@/components/VisualEditor/Hero/LumenFlowHeroVisualEditor";
import { useLumenHeroStyles } from "@/hooks/useLumenHeroStyles";

const MobileProfileCard = ({
  heroData,
  contactData,
  theme,
  themeClasses,
  effectiveCustomization,
}: any) => (
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

const HeroContent = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const dispatch = useDispatch();
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
            </motion.div>
          </motion.div>
        );
    }
  };

  if (isLoading || !heroData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-orange-400/20 border-t-orange-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-300 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    );
  }

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

                {/* Social Links */}
                {effectiveCustomization.socialLinksVisible && (
                  <motion.div
                    className="space-y-2 w-full pt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    {/* GitHub */}
                    {contactData?.github && (
                      <motion.a
                        href={contactData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center space-x-3 text-sm transition-all duration-300 p-3 rounded-xl border hover:shadow-lg ${theme === "light"
                          ? "bg-white/60 backdrop-blur-sm border-gray-200/60 hover:bg-white/80 hover:shadow-orange-100/50"
                          : "backdrop-blur-sm"
                          }`}
                        style={{
                          borderColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.15)",
                          backgroundColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(0,0,0,0.2)"
                                : "rgba(255,255,255,0.5)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <motion.div
                          className={`p-1.5 rounded-lg group-hover:from-orange-400/20 group-hover:to-purple-600/20 transition-all duration-300 ${theme === "light"
                            ? "bg-gradient-to-br from-orange-50 to-orange-100"
                            : ""
                            }`}
                          style={{
                            background:
                              theme === "light"
                                ? undefined
                                : themeClasses.gradientHover,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Github
                            size={16}
                            className={`group-hover:scale-110 transition-transform ${theme === "light" ? "text-orange-600" : ""
                              }`}
                            style={{
                              color:
                                theme === "light"
                                  ? undefined
                                  : themeClasses.textPrimary,
                            }}
                          />
                        </motion.div>
                        <span
                          className={`font-medium group-hover:translate-x-1 transition-transform overflow-hidden whitespace-nowrap text-ellipsis flex-1 ${theme === "light" ? "text-gray-700" : ""
                            }`}
                          style={{
                            color:
                              theme === "light"
                                ? undefined
                                : themeClasses.textSecondary,
                          }}
                        >
                          GitHub
                        </span>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ExternalLink
                            size={12}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${theme === "light" ? "text-gray-500" : ""
                              }`}
                            style={{
                              color:
                                theme === "light"
                                  ? undefined
                                  : themeClasses.textSecondary,
                            }}
                          />
                        </motion.div>
                      </motion.a>
                    )}

                    {/* LinkedIn */}
                    {contactData?.linkedin && (
                      <motion.a
                        href={contactData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center space-x-3 text-sm transition-all duration-300 p-3 rounded-xl border hover:shadow-lg ${theme === "light"
                          ? "bg-white/60 backdrop-blur-sm border-gray-200/60 hover:bg-white/80 hover:shadow-orange-100/50"
                          : "backdrop-blur-sm"
                          }`}
                        style={{
                          borderColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.15)",
                          backgroundColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(0,0,0,0.2)"
                                : "rgba(255,255,255,0.5)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <motion.div
                          className={`p-1.5 rounded-lg group-hover:from-orange-400/20 group-hover:to-purple-600/20 transition-all duration-300 ${theme === "light"
                            ? "bg-gradient-to-br from-orange-50 to-orange-100"
                            : ""
                            }`}
                          style={{
                            background:
                              theme === "light"
                                ? undefined
                                : themeClasses.gradientHover,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Linkedin
                            size={16}
                            className={`group-hover:scale-110 transition-transform ${theme === "light" ? "text-orange-600" : ""
                              }`}
                            style={{
                              color:
                                theme === "light"
                                  ? undefined
                                  : themeClasses.textPrimary,
                            }}
                          />
                        </motion.div>
                        <span
                          className={`font-medium group-hover:translate-x-1 transition-transform overflow-hidden whitespace-nowrap text-ellipsis flex-1 ${theme === "light" ? "text-gray-700" : ""
                            }`}
                          style={{
                            color:
                              theme === "light"
                                ? undefined
                                : themeClasses.textSecondary,
                          }}
                        >
                          LinkedIn
                        </span>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ExternalLink
                            size={12}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${theme === "light" ? "text-gray-500" : ""
                              }`}
                            style={{
                              color:
                                theme === "light"
                                  ? undefined
                                  : themeClasses.textSecondary,
                            }}
                          />
                        </motion.div>
                      </motion.a>
                    )}

                    {/* Email */}
                    {contactData?.email && (
                      <motion.a
                        href={`mailto:${contactData.email}`}
                        className={`group flex items-center space-x-3 text-sm transition-all duration-300 p-3 rounded-xl border hover:shadow-lg ${theme === "light"
                          ? "bg-white/60 backdrop-blur-sm border-gray-200/60 hover:bg-white/80 hover:shadow-orange-100/50"
                          : "backdrop-blur-sm"
                          }`}
                        style={{
                          borderColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.15)",
                          backgroundColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(0,0,0,0.2)"
                                : "rgba(255,255,255,0.5)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <motion.div
                          className={`p-1.5 rounded-lg group-hover:from-orange-400/20 group-hover:to-purple-600/20 transition-all duration-300 ${theme === "light"
                            ? "bg-gradient-to-br from-orange-50 to-orange-100"
                            : ""
                            }`}
                          style={{
                            background:
                              theme === "light"
                                ? undefined
                                : themeClasses.gradientHover,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Mail
                            size={16}
                            className={`group-hover:scale-110 transition-transform ${theme === "light" ? "text-orange-600" : ""
                              }`}
                            style={{
                              color:
                                theme === "light"
                                  ? undefined
                                  : themeClasses.textPrimary,
                            }}
                          />
                        </motion.div>
                        <span
                          className={`font-medium group-hover:translate-x-1 transition-transform overflow-hidden whitespace-nowrap text-ellipsis flex-1 ${theme === "light" ? "text-gray-700" : ""
                            }`}
                          style={{
                            color:
                              theme === "light"
                                ? undefined
                                : themeClasses.textSecondary,
                          }}
                        >
                          {contactData.email}
                        </span>
                      </motion.a>
                    )}

                    {/* Location */}
                    {contactData?.location && (
                      <motion.div
                        className={`group flex items-center space-x-3 text-sm transition-all duration-300 p-3 rounded-xl border ${theme === "light"
                          ? "bg-white/60 backdrop-blur-sm border-gray-200/60"
                          : "backdrop-blur-sm"
                          }`}
                        style={{
                          borderColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.15)",
                          backgroundColor:
                            theme === "light"
                              ? undefined
                              : theme === "dark"
                                ? "rgba(0,0,0,0.2)"
                                : "rgba(255,255,255,0.5)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        <motion.div
                          className={`p-1.5 rounded-lg ${theme === "light"
                            ? "bg-gradient-to-br from-orange-50 to-orange-100"
                            : ""
                            }`}
                          style={{
                            background:
                              theme === "light"
                                ? undefined
                                : themeClasses.gradientHover,
                          }}
                        >
                          <MapPin
                            size={16}
                            className={`${theme === "light" ? "text-orange-600" : ""
                              }`}
                            style={{
                              color:
                                theme === "light"
                                  ? undefined
                                  : themeClasses.textPrimary,
                            }}
                          />
                        </motion.div>
                        <span
                          className={`font-medium overflow-hidden whitespace-nowrap text-ellipsis flex-1 ${theme === "light" ? "text-gray-700" : ""
                            }`}
                          style={{
                            color:
                              theme === "light"
                                ? undefined
                                : themeClasses.textSecondary,
                          }}
                        >
                          {contactData.location}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                <div className="absolute -right-24 top-8">
                  <EditButton
                    sectionName="contact"
                    styles={` ${theme === "light" ? "text-gray-700" : ""
                      } mr-14 opacity-70 hover:opacity-100 transition-opacity`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main content area (full width on mobile, right side on desktop) */}
          <div className="flex-1 w-full">
            {/* Navbar always at the top */}
            <motion.div
              className="sticky top-0 z-5 w-full flex justify-center md:px-4 pt-8 pb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-full">
                <Navbar
                  currentTheme={currentTheme}
                  onTabChange={handleTabChange}
                  activeTab={activeTab}
                />
              </div>
            </motion.div>

            {/* Main content (projects, experience, etc.) */}
            <div className="relative z-10 w-full pb-8 lg:pb-8">
              <div className="w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
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

      {/* Overlay for floating window */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}
    </motion.div>
  );
};

const Hero = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  return (
    <LumenFlowThemeProvider>
      <HeroContent currentPortTheme={currentPortTheme} customCSS={customCSS} portfolioId={portfolioId} />
    </LumenFlowThemeProvider>
  );
};

export default Hero;

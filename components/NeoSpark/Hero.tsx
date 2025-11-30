"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { ColorTheme } from "@/lib/colorThemes";
import MagicWrite from "@/components/Shared/MagicWrite";
import { defaultNeoSparkHeroStyles } from "@/types/hero/neospark";
import HeroVisualEditor from "@/components/VisualEditor/Hero/NeoSparkHeroVisualEditor";
import { useUser } from '@clerk/nextjs';
import { useNeoHeroStyles } from "@/hooks/useNeoHeroStyles";
import { useCustomization } from "@/hooks/useCustomization";
import { useMagicWrite } from "@/hooks/useMagicWrite";
import SectionLoading from "../Shared/SectionLoading";


type Tab = "layout" | "typography" | "buttons" | "effects";

const Hero = ({ currentPortTheme, customCSS, portfolioId }: any) => {

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];

  // Authentication check
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();
  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  const { handleMagicWrite, saveEnhancedContent } = useMagicWrite({
    portfolioId,
    sectionName: "hero",
    sectionTitle: "Hero",
    sectionDescription: "Hero section"
  });

  const [badgeScope, animateBadge] = useAnimate();
  const [titleScope, animateTitle] = useAnimate();
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
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
  } = useCustomization("hero", defaultNeoSparkHeroStyles, portfolioId);

  const { getContainerClasses,
    getTitleClasses,
    getDescriptionClasses,
    getBadgeClasses,
    getButtonClasses,
    getAnimationVariants,
    getTitleStyle,
    getBackgroundStyle,
    customCssAnimations,
    getThemeButtonStyle
  } = useNeoHeroStyles(effectiveCustomization, theme, ColorTheme)

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData.find(
        (section: any) => section.type === "hero"
      )?.data;
      if (heroSectionData) {
        setHeroData(heroSectionData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || !heroData || isLoading) return;

    const badgeTexts = heroData?.badge?.texts || [];
    const intervalId = setInterval(() => {
      if (badgeScope.current && badgeTexts.length > 1) {
        animateBadge(
          badgeScope.current,
          { opacity: 0, y: 20 },
          { duration: 0.3 }
        );

        setTimeout(() => {
          setBadgeIndex((prev) => (prev + 1) % badgeTexts.length);
          if (badgeScope.current) {
            animateBadge(
              badgeScope.current,
              { opacity: 1, y: 0 },
              { duration: 0.3 }
            );
          }
        }, 300);
      }
    }, 3000);

    const titleTexts = heroData?.titleSuffixOptions || [];
    const titleIntervalId = setInterval(() => {
      if (titleScope.current && titleTexts.length > 1) {
        animateTitle(
          titleScope.current,
          { opacity: 0, y: 20 },
          { duration: 0.3 }
        );

        setTimeout(() => {
          setTitleIndex((prev) => (prev + 1) % titleTexts.length);
          if (titleScope.current) {
            animateTitle(
              titleScope.current,
              { opacity: 1, y: 0 },
              { duration: 0.3 }
            );
          }
        }, 300);
      }
    }, 2000);

    const subscription = supabase
      .channel(`portfolio-${portfolioId}`)
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
      clearInterval(intervalId);
      clearInterval(titleIntervalId);
      subscription.unsubscribe();
    };
  }, [
    portfolioId,
    heroData,
    isLoading,
    badgeScope,
    titleScope,
    animateBadge,
    animateTitle,
  ]);

  if (isLoading || !heroData) {
    return (
      <SectionLoading />
    );
  }

  const badgeTexts = heroData.badge?.texts || [];
  const titleTexts = heroData.titleSuffixOptions || [];

  const badgeColor = theme.colors.primary;
  const badgeTextColor = theme.colors.text.primary;
  const accentColor = theme.colors.accent;
  const titleColor = theme.colors.primary;
  const buttonBgColor = theme.colors.primary;
  const buttonHoverBgColor = theme.colors.primaryHover;
  const buttonTextColor = theme.colors.text.primary;
  const buttonHoverTextColor = theme.colors.text.secondary;
  const scrollLineColor = theme.colors.background.secondary;

  const animationVariants = getAnimationVariants();
  const buttonClasses = getButtonClasses();

  return (
    <div className="w-full relative bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0" style={getBackgroundStyle()} />
      {/* Fade effect at bottom to smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
      <div
        className={getContainerClasses()}
        style={{
          paddingLeft: `${effectiveCustomization.containerPadding}px`,
          paddingRight: `${effectiveCustomization.containerPadding}px`,
        }}
      >
        <style>{customCSS}</style>

        {/* Badge */}
        {effectiveCustomization.badgeVisible && heroData?.badge?.isVisible && (
          <motion.div
            initial={animationVariants.hidden}
            animate={animationVariants.visible}
            transition={{ duration: 0.7 }}
            style={{
              background: badgeColor,
              color: badgeTextColor,
            }}
            className={getBadgeClasses()}
          >
            <span
              style={{
                height: "0.5rem",
                width: "0.5rem",
                backgroundColor: accentColor,
                borderRadius: "9999px",
                marginRight: "0.5rem",
              }}
            ></span>
            <span ref={badgeScope} className="text-inherit">
              {badgeTexts[badgeIndex]}
            </span>
          </motion.div>
        )}

        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 flex items-center gap-1 sm:gap-2">
          <EditButton sectionName="hero" />
          {shouldShowButton && (
            <button
              onClick={openVisualEditor}
              className="md:flex hidden items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-white rounded-lg transition-colors text-xs sm:text-sm"
              style={getThemeButtonStyle(true)}
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="">Visual Editor</span>
            </button>
          )}
        </div>

        {/* Title */}
        <motion.h1
          initial={animationVariants.hidden}
          animate={animationVariants.visible}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className={getTitleClasses()}
          style={getTitleStyle()}
        >
          Hi, I'm {heroData?.name} <br />
          <span style={{ color: titleColor }}>
            {heroData.titlePrefix}
            <span ref={titleScope}> {titleTexts[titleIndex]}</span>.
          </span>
        </motion.h1>

        {/* Description */}
        <div className="relative">
          <motion.p
            initial={animationVariants.hidden}
            animate={animationVariants.visible}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
            className={getDescriptionClasses()}
            dangerouslySetInnerHTML={{ __html: heroData.summary }}
          ></motion.p>
          {/* Magic Write Button */}
          <div className="absolute hidden md:block -top-1 sm:-top-2 -right-1 sm:-right-2 z-10">
            <MagicWrite
              onMagicWrite={async (prompt: string) => {
                const enhanced = await handleMagicWrite(prompt, heroData.summary, "hero");
                const updated = { ...heroData, summary: enhanced };
                setHeroData(updated);
                await saveEnhancedContent(updated);
                return enhanced;
              }}
              placeholder="Enhance this hero description..."
              buttonText=""
              context={heroData.summary}
              className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full shadow-lg hover:scale-110 relative"
            />
          </div>
        </div>

        {/* Buttons */}
        <motion.div
          initial={animationVariants.hidden}
          animate={animationVariants.visible}
          transition={{
            duration: 0.7,
            delay: 0.6,
          }}
          className={buttonClasses.container}
        >
          {heroData?.actions?.map((item: any) => {
            return (
              <motion.div key={item.label}>
                <Button
                  style={{
                    backgroundColor:
                      item.style === "primary" ? buttonBgColor : "transparent",
                    color: item.style === "primary" ? buttonTextColor : "white",
                    border:
                      item.style === "outline"
                        ? `1px solid ${buttonBgColor}`
                        : "",
                  }}
                  className={buttonClasses.button}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = buttonHoverBgColor;
                    e.currentTarget.style.color = buttonHoverTextColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      item.style === "primary" ? buttonBgColor : "transparent";
                    e.currentTarget.style.color =
                      item.style === "primary" ? buttonTextColor : "white";
                    e.currentTarget.style.border =
                      item.style === "outline"
                        ? `1px solid ${buttonBgColor}`
                        : "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  onClick={() => {
                    const labelToIdMap: Record<string, string> = {
                      "View Projects": "projects",
                      "Contact Me": "contact",
                      About: "about",
                      "Tech Stack": "tech-stack",
                    };
                    const sectionId =
                      labelToIdMap[item.label] ||
                      item.label.toLowerCase().replace(/ /g, "-");
                    const section = document.getElementById(sectionId);
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    } else if (item.href) {
                      window.location.href = item.href;
                    }
                  }}
                >
                  {item.label} <ArrowRight size={18} />
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
        {/* Scroll Indicator */}
        {effectiveCustomization.scrollIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ color: 'white' }}
            className="mt-16 text-center"
          >
            <p>Scroll to explore</p>
            {(() => {
              const style = effectiveCustomization.scrollIndicatorStyle?.toLowerCase();

              return null;
            })()}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "line") && (
              <motion.div
                initial={{ height: 32 }}
                animate={{ height: 32 }}
                style={{
                  width: "0.125rem",
                  backgroundColor: scrollLineColor,
                  margin: "0.5rem auto 0 auto",
                }}
              ></motion.div>
            )}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "arrow") && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-2"
              >
                ↓
              </motion.div>
            )}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "dot") && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-current rounded-full mx-auto mt-2"
              ></motion.div>
            )}
            {(effectiveCustomization.scrollIndicatorStyle?.toLowerCase() === "animated") && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-2"
              >
                <div className="w-6 h-10 border-2 border-current rounded-full mx-auto">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-3 bg-current rounded-full mx-auto mt-1"
                  ></motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Floating Visual Editor Window */}
        {visualEditorOpen && (
          <HeroVisualEditor
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

        {/* Overlay for floating window */}
        {visualEditorOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setVisualEditorOpen(false)}
          />
        )}

        {/* Custom CSS for animations */}
        <style>{customCssAnimations()}</style>
      </div>
    </div>
  );
};

export default Hero;
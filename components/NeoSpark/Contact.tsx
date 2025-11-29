"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase-client";
import { ColorTheme } from "@/lib/colorThemes";
import SectionHeader from "./SectionHeader";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { ContactCustomizationState, defaultContactStyles } from "@/types/contact/portfolio";
import { ContactVisualEditor } from "@/components/VisualEditor/Contact/ContactVisualEditor";
import { useCustomization } from "@/hooks/useCustomization";


const Contact = ({ currentPortTheme, customCSS, portfolioId }: any) => {
  const dispatch = useDispatch();

  const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

  const contactSection = portfolioData?.find(
    (item: any) => item.type === "userInfo"
  );
  const sectionTitle = contactSection?.sectionTitle || "Let's Work Together!";
  const sectionDescription =
    contactSection?.sectionDescription ||
    "Interested in collaborating, hiring, or just having a chat? Reach out to me on your favorite platform!";

  const [isLoading, setIsLoading] = useState(true);
  const [contactData, setContactData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "styling"
  >("layout");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);



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
  } = useCustomization("contact", defaultContactStyles, portfolioId);


  // Copy to clipboard functionality
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Helper functions for styling
  const getLayoutClasses = () => {
    return `grid grid-cols-2 md:grid-cols-${effectiveCustomization.gridColumns}`;
  };

  const getLayoutStyle = () => {
    return { gap: `${effectiveCustomization.cardSpacing}px` };
  };

  const getContainerStyle = () => {
    switch (effectiveCustomization.containerWidth) {
      case "narrow":
        return {
          maxWidth: "100%",
          margin: "0 auto",
          "@media (min-width: 768px)": { maxWidth: "60%" }
        };
      case "wide":
        return {
          maxWidth: "100%",
          margin: "0 auto",
          "@media (min-width: 768px)": { maxWidth: "80%" }
        };
      case "full":
        return { maxWidth: "100%", margin: "0 auto" };
      default:
        return {
          maxWidth: "100%",
          margin: "0 auto",
          "@media (min-width: 768px)": { maxWidth: "80%" }
        };
    }
  };

  const getCardClasses = (platform: string) => {
    const isHovered = visualEditorOpen && hoveredCard === platform;
    let classes = `cursor-pointer flex transition-all shadow-lg`;

    // Card layout-specific classes
    if (effectiveCustomization.cardLayout === "flex") {
      classes += " items-center";
    } else {
      classes += " flex-col items-center justify-center";
    }

    // Size variations
    const sizeClasses = {
      compact: effectiveCustomization.cardLayout === "flex" ? "p-3 sm:p-4" : "p-4 sm:p-5",
      default: effectiveCustomization.cardLayout === "flex" ? "p-4 sm:p-5" : "p-6 sm:p-8",
      large: effectiveCustomization.cardLayout === "flex" ? "p-5 sm:p-6" : "p-8 sm:p-10",
    };
    classes += ` ${sizeClasses[effectiveCustomization.cardSize]}`;

    // Style variations
    switch (effectiveCustomization.cardStyle) {
      case "minimal":
        classes += " bg-transparent border-gray-600 hover:border-gray-400";
        break;
      case "glassmorphism":
        classes +=
          " bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20";
        break;
      case "neon":
        classes += " bg-black/70 border-2 hover:shadow-lg";
        break;
      default:
        classes += " bg-stone-900/60 border-gray-700";
    }

    // Animation duration
    classes += ` duration-${effectiveCustomization.animationSpeed}`;

    // Hover effects
    if (effectiveCustomization.hoverEffects && effectiveCustomization.animationStyle !== "none") {
      switch (effectiveCustomization.animationStyle) {
        case "rotate":
          classes += " hover:rotate-1";
          break;
        case "bounce":
          classes += " hover:-translate-y-1";
          break;
        case "slide":
          classes += " hover:translate-x-1";
          break;
        default:
          classes += " hover:scale-105";
      }
    }

    // Visual editor highlight
    if (isHovered) {
      classes += " ring-2";
      classes += ` ring-[${ColorTheme.primary}]`;
    }

    return classes;
  };

  const getCardStyle = (platform: string) => {
    let style: any = {
      borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
    };

    // Border styling
    if (effectiveCustomization.cardStyle === "neon") {
      style.borderColor = titleColor;
      style.borderWidth = `${effectiveCustomization.borderWidth}px`;
    } else {
      style.borderColor = `${titleColor}30`;
      style.borderWidth = `${effectiveCustomization.borderWidth}px`;
    }

    // Background opacity for default style
    if (effectiveCustomization.cardStyle === "default") {
      style.backgroundColor = `rgba(28, 25, 23, ${effectiveCustomization.backgroundOpacity / 100
        })`;
    }

    return style;
  };

  const getIconSize = () => ({
    width: `${effectiveCustomization.iconSize}px`,
    height: `${effectiveCustomization.iconSize}px`,
  });

  const getTextAlignment = () => {
    switch (effectiveCustomization.textAlignment) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    switch (effectiveCustomization.animationStyle) {
      case "slide":
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
        };
      case "rotate":
        return {
          hidden: { opacity: 0, rotate: -10 },
          visible: { opacity: 1, rotate: 0 },
        };
      case "bounce":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      default:
        return baseVariants;
    }
  };

  // Contact platforms data
  const getContactPlatforms = () => {
    const platforms = [];

    if (contactData.email) {
      platforms.push({
        key: "email",
        icon: Mail,
        label: "Email",
        value: contactData.email,
        href: `mailto:${contactData.email}`,
        description: contactData.email,
      });
    }

    if (contactData.linkedin) {
      platforms.push({
        key: "linkedin",
        icon: Linkedin,
        label: "LinkedIn",
        value: contactData.linkedin,
        href: contactData.linkedin,
        description: contactData.linkedin.includes("/")
          ? "@" + contactData.linkedin.split("/").filter(Boolean).pop()
          : contactData.linkedin,
      });
    }

    if (contactData.github) {
      platforms.push({
        key: "github",
        icon: Github,
        label: "GitHub",
        value: contactData.github,
        href: contactData.github,
        description: contactData.github.includes("/")
          ? "@" + contactData.github.split("/").filter(Boolean).pop()
          : contactData.github,
      });
    }

    // Add phone if available
    if (contactData.phone) {
      platforms.push({
        key: "phone",
        icon: Phone,
        label: "Phone",
        value: contactData.phone,
        href: `tel:${contactData.phone}`,
        description: contactData.phone,
      });
    }

    // Add location if available
    if (contactData.location) {
      platforms.push({
        key: "location",
        icon: MapPin,
        label: "Location",
        value: contactData.location,
        href: `https://maps.google.com/?q=${encodeURIComponent(
          contactData.location
        )}`,
        description: contactData.location,
      });
    }

    return platforms;
  };

  useEffect(() => {
    if (portfolioData) {
      const contactSectionData = portfolioData.find(
        (section: any) => section.type === "userInfo"
      )?.data;
      if (contactSectionData) {
        setContactData(contactSectionData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-contact-${portfolioId}`)
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
  }, [portfolioId, contactData, isLoading]);

  if (isLoading || !contactData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const platforms = getContactPlatforms();
  const animationVariants = getAnimationVariants();

  return (
    <div
      id="contact"
      className="py-8 bg-black sm:py-12 md:py-16 px-2 sm:px-4 md:px-8 relative text-white"
    >
      <style>{customCSS}</style>

      <SectionHeader
        sectionName="contact"
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        titleColor={titleColor}
        onVisualEditorOpen={openVisualEditor}
      />

      <div className="mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{
            staggerChildren: effectiveCustomization.staggerDelay / 1000,
            delayChildren: 0.2,
          }}
          className={`${getLayoutClasses()} w-full ${effectiveCustomization.containerWidth === "narrow"
            ? "md:max-w-[60%] md:mx-auto"
            : effectiveCustomization.containerWidth === "wide"
              ? "md:max-w-[80%] md:mx-auto"
              : "max-w-full"
            }`}
          style={{ ...getLayoutStyle() }}
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.key}
              variants={
                customization.animationStyle !== "none" ? animationVariants : {}
              }
              transition={{
                duration: effectiveCustomization.animationSpeed / 1000,
                delay: index * (effectiveCustomization.staggerDelay / 1000),
              }}
              onMouseEnter={() =>
                visualEditorOpen && setHoveredCard(platform.key)
              }
              onMouseLeave={() => visualEditorOpen && setHoveredCard(null)}
              className=""
            >
              <div
                className={getCardClasses(platform.key)}
                style={getCardStyle(platform.key)}
                onClick={(e) => {
                  if (
                    effectiveCustomization.copyToClipboard &&
                    platform.key === "email"
                  ) {
                    e.preventDefault();
                    copyToClipboard(platform.value, platform.key);
                  } else if (
                    !effectiveCustomization.openInNewTab &&
                    platform.href.startsWith("http")
                  ) {
                    e.preventDefault();
                    window.location.href = platform.href;
                  }
                }}
              >
                {effectiveCustomization.copyToClipboard && platform.key === "email" ? (
                  <div className={`flex ${effectiveCustomization.cardLayout === "flex" ? "items-center w-full" : "flex-col"} ${getTextAlignment()}`}>
                    <div className={`flex items-center ${effectiveCustomization.cardLayout === "flex" ? "mr-4" : "justify-center mb-2"} relative`}>
                      <platform.icon
                        style={{ ...getIconSize(), color: titleColor }}
                        className={`${effectiveCustomization.cardLayout === "flex" ? "" : "mb-2 sm:mb-3"} ${effectiveCustomization.iconStyle === "filled"
                          ? "fill-current"
                          : ""
                          }`}
                      />
                      {copiedItem === platform.key && (
                        <Check className="absolute -top-2 -right-2 w-4 h-4 text-green-500 bg-white rounded-full p-0.5" />
                      )}
                    </div>
                    <div className={`${effectiveCustomization.cardLayout === "flex" ? "flex-1" : ""}`}>
                      {effectiveCustomization.showLabels && (
                        <div className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
                          {platform.label}
                        </div>
                      )}
                      {effectiveCustomization.showDescriptions && (
                        <p className="text-gray-300 break-all text-xs sm:text-base">
                          {platform.description}
                        </p>
                      )}
                    </div>
                    <Copy className="w-4 h-4 mt-2 opacity-50" />
                  </div>
                ) : (
                  <motion.a
                    href={platform.href}
                    target={
                      effectiveCustomization.openInNewTab &&
                        platform.href.startsWith("http")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      effectiveCustomization.openInNewTab &&
                        platform.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`flex ${effectiveCustomization.cardLayout === "flex" ? "items-center w-full" : "flex-col"} ${getTextAlignment()} w-full h-full`}
                    whileHover={
                      effectiveCustomization.hoverEffects ? { scale: 1.02 } : {}
                    }
                    whileTap={effectiveCustomization.hoverEffects ? { scale: 0.98 } : {}}
                  >
                    <div className={`flex items-center ${effectiveCustomization.cardLayout === "flex" ? "mr-4" : "justify-center mb-2"}`}>
                      <platform.icon
                        style={{ ...getIconSize(), color: titleColor }}
                        className={`${effectiveCustomization.cardLayout === "flex" ? "" : "mb-2 sm:mb-3"} ${effectiveCustomization.iconStyle === "filled"
                          ? "fill-current"
                          : ""
                          }`}
                      />
                    </div>
                    <div className={`${effectiveCustomization.cardLayout === "flex" ? "flex-1" : ""}`}>
                      {effectiveCustomization.showLabels && (
                        <div className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
                          {platform.label}
                          {effectiveCustomization.openInNewTab &&
                            platform.href.startsWith("http") && (
                              <ExternalLink className="w-3 h-3 ml-1 inline opacity-50" />
                            )}
                        </div>
                      )}
                      {effectiveCustomization.showDescriptions && (
                        <p className="text-gray-300 break-all text-xs sm:text-base">
                          {platform.description}
                        </p>
                      )}
                    </div>
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>

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
        primaryColor={ColorTheme.primary}
        primaryDarkColor={ColorTheme.primaryDark}
      />
    </div>
  );
};

export default Contact;


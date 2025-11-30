"use client";

import { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase-client";
import { ColorTheme } from "@/lib/colorThemes";
import SectionHeader from "./SectionHeader";
import { defaultNeoSparkContactStyles } from "@/types/contact/neospark";
import { ContactVisualEditor } from "@/components/VisualEditor/Contact/ContactVisualEditor";
import { useCustomization } from "@/hooks/useCustomization";
import SectionLoading from "../Shared/SectionLoading";
import { useContactStyles } from "@/hooks/useContactStyles";

type Tab = "layout" | "styling"

const Contact = ({ currentPortTheme, customCSS, portfolioId }: any) => {

  const { portfolioData } = useSelector((state: RootState) => state.data);
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
  const [activeTab, setActiveTab] = useState<Tab>("layout");
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
  } = useCustomization("contact", defaultNeoSparkContactStyles, portfolioId);


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

  const {
    getLayoutClasses,
    getLayoutStyle,
    getContainerStyle,
    getCardClasses,
    getCardStyle,
    getIconSize,
    getTextAlignment,
    getAnimationVariants
  } = useContactStyles(effectiveCustomization, visualEditorOpen, hoveredCard, titleColor);

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
      <SectionLoading />
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


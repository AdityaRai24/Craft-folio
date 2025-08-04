"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Phone,
  MapPin,
  ExternalLink,
  Settings,
  Palette,
  Move,
  Grid3X3,
  RotateCcw,
  Copy,
  Check,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns,
  Columns2,
  Columns3,
  Columns4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Switch } from "@/components/ui/switch";
import { ColorTheme } from "@/lib/colorThemes";
import EditButton from "@/components/EditButton";
import SectionHeader from "./SectionHeader";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";

interface CustomizationState {
  layout: "grid";
  gridColumns: number;
  cardLayout: "flex" | "stacked";
  cardSize: "compact" | "default" | "large";
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon";
  cardBorderRadius: number;
  cardPadding: number;
  cardSpacing: number;
  containerWidth: "full" | "narrow" | "wide";
  iconSize: number;
  iconStyle: "outline" | "filled";
  showLabels: boolean;
  showDescriptions: boolean;
  textAlignment: "center" | "left" | "right";
  animationStyle: "scale" | "slide" | "rotate" | "bounce" | "none";
  animationSpeed: number;
  staggerDelay: number;
  hoverEffects: boolean;
  backgroundOpacity: number;
  borderWidth: number;
  copyToClipboard: boolean;
  openInNewTab: boolean;
}

// Visual Grid Columns Selector Component
const GridColumnsSelector: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-2">
        Grid Columns
      </label>
      <div className="flex gap-2">
        {[2, 3, 4].map((cols) => (
          <div
            key={cols}
            onClick={() => onChange(cols)}
            className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
              value === cols
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className={`grid gap-1 ${
              cols === 2 ? "grid-cols-2" :
              cols === 3 ? "grid-cols-3" :
              "grid-cols-4"
            }`}>
              {Array.from({ length: cols }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded"
                  style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                ></div>
              ))}
            </div>
            <div className="text-center text-xs text-white mt-2">
              {cols} Cols
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Card Layout Selector Component
const CardLayoutSelector: React.FC<{
  value: "flex" | "stacked";
  onChange: (value: "flex" | "stacked") => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">Card Layout</label>
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onChange("stacked")}
          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
            value === "stacked"
              ? "border-white bg-zinc-700"
              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
          }`}
        >
          <div className="space-y-2">
            <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
            <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
            <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
          </div>
          <div className="text-center text-sm text-white mt-2">
            Stacked
          </div>
        </div>

        <div
          onClick={() => onChange("flex")}
          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
            value === "flex"
              ? "border-white bg-zinc-700"
              : "border-gray-600 hover:border-gray-400 bg-zinc-800"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              <div className="flex-1 h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
              <div className="flex-1 h-3 rounded" style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}></div>
            </div>
          </div>
          <div className="text-center text-sm text-white mt-2">
            Flex
          </div>
        </div>
      </div>
    </div>
  );
};



// Visual Width Selector Component
const WidthSelector: React.FC<{
  value: "full" | "narrow" | "wide";
  onChange: (value: "full" | "narrow" | "wide") => void;
}> = ({ value, onChange }) => {
  const widths = [
    { value: "narrow", label: "Narrow", width: "60%" },
    { value: "wide", label: "Wide", width: "80%" },
    { value: "full", label: "Full", width: "100%" },
  ];

  return (
    <div>
      <label className="block text-white text-left font-medium mb-3">
        Container Width
      </label>
      <div className="grid grid-cols-3 gap-2">
        {widths.map(({ value: width, label, width: widthValue }) => (
          <div
            key={width}
            onClick={() => onChange(width as any)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === width
                ? "border-white bg-zinc-700"
                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
            }`}
          >
            <div className="w-full h-3 rounded" style={{ 
              width: widthValue,
              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`
            }}></div>
            <div className="text-xs text-white">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Spacing Selector Component (like Projects.tsx)
const SpacingSelector: React.FC<{
  value: number;
  onChange: (value: number) => void;
  label: string;
  type: "gap" | "padding";
}> = ({ value, onChange, label, type }) => {
  return (
    <div>
      <label className="block text-left text-sm font-medium text-gray-300 mb-2">
        {label}: {value}px
      </label>
      <input
        type="range"
        min={type === "gap" ? 2 : 1}
        max={type === "gap" ? 64 : 12}
        step={type === "gap" ? 4 : 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(value / (type === "gap" ? 64 : 12)) * 100}%, #3f3f46 ${(value / (type === "gap" ? 64 : 12)) * 100}%, #3f3f46 100%)`
        }}
      />
    </div>
  );
};


const Contact = ({ currentPortTheme, customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();

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
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "layout" | "styling"
  >("layout");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Helper function to get theme-based button style
  const getThemeButtonStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
        color: 'white'
      };
    }
    return {};
  };

  // Alignment Selector Component
  const AlignmentSelector: React.FC<{
    value: "left" | "center" | "right";
    onChange: (value: "left" | "center" | "right") => void;
  }> = ({ value, onChange }) => {
    const alignments = [
      { value: "left", icon: "←", label: "Left" },
      { value: "center", icon: "↔", label: "Center" },
      { value: "right", icon: "→", label: "Right" },
    ];

    return (
      <div>
        <label className="block text-white text-left font-medium mb-3">
          Title Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          {alignments.map(({ value: align, icon, label }) => (
            <div
              key={align}
              onClick={() => onChange(align as any)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                value === align
                  ? "border-white bg-zinc-700"
                  : "border-gray-600 hover:border-gray-400 bg-zinc-800"
              }`}
            >
              <div className="text-2xl text-white">{icon}</div>
              <div className="space-y-1 w-full">
                <div
                  className={`h-1 rounded ${
                    align === "left"
                      ? "mr-auto w-3/4"
                      : align === "center"
                      ? "mx-auto w-1/2"
                      : "ml-auto w-3/4"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                ></div>
                <div
                  className={`h-1 bg-gray-400 rounded ${
                    align === "left"
                      ? "mr-auto w-full"
                      : align === "center"
                      ? "mx-auto w-3/4"
                      : "ml-auto w-full"
                  }`}
                ></div>
              </div>
              <div className="text-xs text-white">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Default styles for Contact
  const defaultContactStyles: CustomizationState = {
    layout: "grid",
    gridColumns: 2,
    cardLayout: "stacked",
    cardSize: "default",
    cardStyle: "default",
    cardBorderRadius: 8,
    cardPadding: 8,
    cardSpacing: 36,
    containerWidth: "wide",
    iconSize: 32,
    iconStyle: "outline",
    showLabels: true,
    showDescriptions: true,
    textAlignment: "left",
    animationStyle: "scale",
    animationSpeed: 300,
    staggerDelay: 200,
    hoverEffects: true,
    backgroundOpacity: 60,
    borderWidth: 1,
    copyToClipboard: false,
    openInNewTab: true,
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>(defaultContactStyles);
  const [draftCustomization, setDraftCustomization] = useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "contact",
        });
        if (result.success && result.data) {
          setCustomization(result.data as any);
        } else {
          setCustomization(defaultContactStyles);
        }
      } catch (error) {
        setCustomization(defaultContactStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof CustomizationState, value: any) => {
    if (!draftCustomization) return;
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  // When 'Done' is clicked, save draft to DB and update main state
  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "contact",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  // On reset, delete from DB, set both states to default, and close editor
  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "contact",
      });
      setCustomization(defaultContactStyles);
      setDraftCustomization(defaultContactStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
    return `grid grid-cols-1 md:grid-cols-${effectiveCustomization.gridColumns}`;
  };

  const getLayoutStyle = () => {
    return { gap: `${effectiveCustomization.cardSpacing}px` };
  };

  const getContainerStyle = () => {
    switch (effectiveCustomization.containerWidth) {
      case "narrow":
        return { maxWidth: "60%", margin: "0 auto" };
      case "wide":
        return { maxWidth: "80%", margin: "0 auto" };
      case "full":
        return { maxWidth: "100%", margin: "0 auto" };
      default:
        return { maxWidth: "80%", margin: "0 auto" };
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
      style.backgroundColor = `rgba(28, 25, 23, ${
        effectiveCustomization.backgroundOpacity / 100
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
          // console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status: ${status}`);
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
          className={getLayoutClasses()}
          style={{ ...getLayoutStyle(), ...getContainerStyle() }}
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
                        className={`${effectiveCustomization.cardLayout === "flex" ? "" : "mb-2 sm:mb-3"} ${
                          effectiveCustomization.iconStyle === "filled"
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
                        className={`${effectiveCustomization.cardLayout === "flex" ? "" : "mb-2 sm:mb-3"} ${
                          effectiveCustomization.iconStyle === "filled"
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

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <div
          ref={dragRef}
          className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-96 max-h-[80vh] overflow-hidden"
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-bold text-white">Contact Settings</h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["layout", "styling"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-2 text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
                style={getThemeButtonStyle(activeTab === tab)}
              >
                {tab === "layout" && (
                  <Grid3X3 className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab === "styling" && (
                  <Palette className="h-3 w-3 mx-auto mb-1" />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {activeTab === "layout" && (
              <>
                <GridColumnsSelector
                  value={draftCustomization?.gridColumns ?? customization.gridColumns}
                  onChange={(value) =>
                    updateDraftCustomization("gridColumns", value)
                  }
                />

                <CardLayoutSelector
                  value={draftCustomization?.cardLayout ?? customization.cardLayout}
                  onChange={(value) =>
                    updateDraftCustomization("cardLayout", value)
                  }
                />

                <WidthSelector
                  value={draftCustomization?.containerWidth ?? customization.containerWidth}
                  onChange={(value) =>
                    updateDraftCustomization("containerWidth", value)
                  }
                />

                <SpacingSelector
                  value={draftCustomization?.cardSpacing ?? customization.cardSpacing}
                  onChange={(value) =>
                    updateDraftCustomization("cardSpacing", value)
                  }
                  label="Card Spacing"
                  type="gap"
                />

                <AlignmentSelector
                  value={draftCustomization?.textAlignment ?? customization.textAlignment}
                  onChange={(value) =>
                    updateDraftCustomization("textAlignment", value)
                  }
                />
              </>
            )}

            {activeTab === "styling" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "default", label: "Default" },
                      { value: "minimal", label: "Minimal" },
                      { value: "glassmorphism", label: "Glass" },
                      { value: "neon", label: "Neon" },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() =>
                          updateDraftCustomization("cardStyle", style.value as any)
                        }
                        className={`py-2 px-3 text-sm rounded transition-colors ${
                          (draftCustomization?.cardStyle ?? customization.cardStyle) === style.value
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                        }`}
                        style={getThemeButtonStyle((draftCustomization?.cardStyle ?? customization.cardStyle) === style.value)}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Radius: {draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                    onChange={(e) =>
                      updateDraftCustomization("cardBorderRadius", Number(e.target.value))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Icon Size: {draftCustomization?.iconSize ?? customization.iconSize}px
                  </label>
                  <input
                    type="range"
                    min={24}
                    max={64}
                    value={draftCustomization?.iconSize ?? customization.iconSize}
                    onChange={(e) =>
                      updateDraftCustomization("iconSize", Number(e.target.value))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Icon Style
                  </label>
                  <div className="flex gap-1">
                    {["outline", "filled"].map((style) => (
                      <button
                        key={style}
                        onClick={() =>
                          updateDraftCustomization("iconStyle", style as any)
                        }
                        className={`flex-1 py-2 px-3 text-sm capitalize rounded transition-colors ${
                          (draftCustomization?.iconStyle ?? customization.iconStyle) === style
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                        }`}
                        style={getThemeButtonStyle((draftCustomization?.iconStyle ?? customization.iconStyle) === style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>



                <div>
                  <label className="block text-white font-medium mb-2">
                    Background Opacity: {draftCustomization?.backgroundOpacity ?? customization.backgroundOpacity}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={draftCustomization?.backgroundOpacity ?? customization.backgroundOpacity}
                    onChange={(e) =>
                      updateDraftCustomization("backgroundOpacity", Number(e.target.value))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Width: {draftCustomization?.borderWidth ?? customization.borderWidth}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={draftCustomization?.borderWidth ?? customization.borderWidth}
                    onChange={(e) =>
                      updateDraftCustomization("borderWidth", Number(e.target.value))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Labels</span>
                  <Switch
                    checked={draftCustomization?.showLabels ?? customization.showLabels}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("showLabels", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    Show Descriptions
                  </span>
                  <Switch
                    checked={draftCustomization?.showDescriptions ?? customization.showDescriptions}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("showDescriptions", checked)
                    }
                  />
                </div>
              </>
            )}


          </div>

          {/* Footer */}
          <div className="border-t border-zinc-700 p-4 bg-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={resetCustomization}
                className="flex items-center gap-1 flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={saveDraftCustomization}
                className="flex-1 py-2 px-3 text-sm text-white rounded transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for floating window */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default Contact;

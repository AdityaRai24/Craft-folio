"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Settings } from "lucide-react";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { ContactCustomizationState } from "@/types/contact/portfolio";
import { ContactVisualEditor } from "@/components/VisualEditor/Contact/ContactVisualEditor";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import { ColorTheme } from "@/lib/colorThemes";

const Contact = ({
  currentPortTheme,
  customCSS,
  portfolioId,
  theme = "light",
}: {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId?: string;
  theme?: "light" | "dark";
}) => {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
  const currentlyEditing = useSelector((state: RootState) => state.editMode.currentlyEditing);
  const { componentCustomizations } = useSelector((state: RootState) => state.data);

  const userInfoData = portfolioData?.find((item: any) => item.type === "userInfo")?.data || {};
  const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  const [editedData, setEditedData] = useState(userInfoData);
  const isDark = theme === "dark";

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
    cardBorderRadius: 16,
    cardPadding: 8,
    cardSpacing: 24,
    containerWidth: "wide",
    iconSize: 32,
    iconStyle: "filled",
    showLabels: true,
    showDescriptions: false,
    textAlignment: "center",
    animationStyle: "scale",
    animationSpeed: 300,
    staggerDelay: 100,
    hoverEffects: true,
    backgroundOpacity: 100,
    borderWidth: 0,
    copyToClipboard: false,
    openInNewTab: true,
  };

  const [customization, setCustomization] = useState<ContactCustomizationState>(defaultContactStyles);
  const [draftCustomization, setDraftCustomization] = useState<ContactCustomizationState | null>(null);

  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  useEffect(() => {
    setEditedData(userInfoData);
  }, [userInfoData]);

  // Load customizations
  useEffect(() => {
    const loadCustomizations = async () => {
      if (!portfolioId) return;
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
          } else {
            setCustomization(defaultContactStyles);
          }
        }
      } catch (error) {
        setCustomization(defaultContactStyles);
      }
    };
    if (portfolioId) loadCustomizations();
  }, [portfolioId, componentCustomizations, dispatch]);

  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

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

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: userInfoData.github,
      color: isDark ? "from-gray-800 to-gray-900" : "from-gray-900 to-gray-800",
      hoverColor: isDark ? "hover:from-gray-700 hover:to-gray-800" : "hover:from-gray-800 hover:to-gray-700",
      iconBg: isDark ? "bg-gray-700" : "bg-gray-800",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: userInfoData.linkedin,
      color: isDark ? "from-blue-700 to-blue-800" : "from-blue-600 to-blue-700",
      hoverColor: isDark ? "hover:from-blue-600 hover:to-blue-700" : "hover:from-blue-500 hover:to-blue-600",
      iconBg: isDark ? "bg-blue-600" : "bg-blue-500",
    },
    {
      name: "Email",
      icon: Mail,
      url: userInfoData.email ? `mailto:${userInfoData.email}` : null,
      color: isDark ? "from-red-600 to-red-700" : "from-red-500 to-red-600",
      hoverColor: isDark ? "hover:from-red-500 hover:to-red-600" : "hover:from-red-400 hover:to-red-500",
      iconBg: isDark ? "bg-red-600" : "bg-red-500",
    },
  ].filter((link) => link.url);

  return (
    <div className={`w-full h-full ${isDark ? "bg-gray-800" : "bg-white"} overflow-y-auto relative`}>
      <div className={`mx-auto p-8 ${effectiveCustomization.containerWidth === "narrow" ? "max-w-4xl" :
        effectiveCustomization.containerWidth === "wide" ? "max-w-5xl" :
          "max-w-full"
        }`}>

        {/* Header with Edit and Visual Editor buttons */}
        {showEdit && (
          <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className={`text-3xl md:text-4xl font-semibold ${isDark ? "text-white" : "text-[#1d1d1f]"} mb-1.5 tracking-tight`}>
                Contact
              </h1>
              <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-[#6e6e73]"}`}>
                Get in touch with me
              </p>
            </motion.div>

            <div className="flex gap-2.5">
              <EditButton sectionName="contact" />
              <button
                onClick={openVisualEditor}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white`}
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              >
                <Settings size={16} />
                <span>Visual Editor</span>
              </button>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          style={{ textAlign: effectiveCustomization.textAlignment }}
        >
          <h1 className={`text-4xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-3`}>
            Get In Touch
          </h1>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
            Let's connect and build something amazing
          </p>
        </motion.div>

        {socialLinks.length > 0 ? (
          <div
            className={`grid gap-6 mb-8`}
            style={{
              gridTemplateColumns: `repeat(${effectiveCustomization.gridColumns}, minmax(0, 1fr))`,
              gap: `${effectiveCustomization.cardSpacing}px`
            }}
          >
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={index}
                  href={link.url || "#"}
                  target={effectiveCustomization.openInNewTab && link.url?.startsWith("http") ? "_blank" : undefined}
                  rel={effectiveCustomization.openInNewTab && link.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={effectiveCustomization.hoverEffects ? { scale: 1.05, y: -8 } : {}}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: effectiveCustomization.animationSpeed / 1000, delay: index * (effectiveCustomization.staggerDelay / 1000) }}
                  className={`bg-gradient-to-br ${link.color} ${link.hoverColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center gap-6 group relative overflow-hidden`}
                  style={{
                    borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                    padding: `${effectiveCustomization.cardPadding * 4}px`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div
                    className={`${link.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}
                    style={{
                      width: `${effectiveCustomization.iconSize * 2.5}px`,
                      height: `${effectiveCustomization.iconSize * 2.5}px`,
                      borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
                    }}
                  >
                    <Icon size={effectiveCustomization.iconSize} className="text-white" />
                  </div>

                  {effectiveCustomization.showLabels && (
                    <span className="text-white text-xl font-bold relative z-10">
                      {link.name}
                    </span>
                  )}

                  {effectiveCustomization.openInNewTab && link.url?.startsWith("http") && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} className="text-white/80" />
                    </div>
                  )}
                </motion.a>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className={`w-24 h-24 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center mb-6`}>
              <Mail size={40} className={isDark ? "text-gray-400" : "text-gray-400"} />
            </div>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg font-medium`}>
              No contact information available
            </p>
            <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm mt-2`}>
              Add your contact details to get started
            </p>
          </div>
        )}

        {userInfoData.email && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm mb-3`}>
              Or reach me directly at
            </p>
            <a
              href={`mailto:${userInfoData.email}`}
              className={`inline-block ${isDark ? "text-white hover:text-blue-400 bg-gray-700 hover:bg-gray-600 border-gray-600" : "text-gray-900 hover:text-blue-600 bg-gray-50 hover:bg-gray-100 border-gray-200"} text-lg font-medium transition-colors px-6 py-3 rounded-xl border hover:border-gray-300`}
            >
              {userInfoData.email}
            </a>
          </motion.div>
        )}
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

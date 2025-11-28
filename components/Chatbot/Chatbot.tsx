import { useState, useRef, useEffect } from "react";
import {
  X, Sun,
  Moon, Palette,
  Type,
  Layout, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  updateFont,
  updatePortfolio,
  updateTheme,
  updatePortfolioUserId,
  updateSection,
  getThemeNameApi,
} from "@/app/actions/portfolio";
import { useDispatch, useSelector } from "react-redux";
import { newPortfolioData } from "@/slices/dataSlice";
import { RootState } from "@/store/store";
import { SignInButton, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FontSelector from "./FontSelector";
import SectionReorder from "./SectionReorder";
import AdvancedSettings from "./AdvancedSettings";
import { usePathname } from "next/navigation";
import {
  CHATBOT_THEMES,
  Message,
  ChatbotProps
} from "./constants";
import ChangeTheme from "./ChangeTheme";
import SEOSettings from "./SEOSettings";
import ChatInterface from "./ChatInterface";
import SettingsMenu from "./SettingsMenu";
import GuestWarning from "./GuestWarning";
import DeployModal from "@/components/Modals/DeployModal";

const PortfolioChatbot = ({
  portfolioData,
  setCurrentPortTheme,
  currentPortTheme,
  currentFont,
  portfolioId,
  themeOptions,
  onOpenChange,
  setCurrentFont,
  setCustomCSS,
  customCSSState,
  portfolioLink,
}: ChatbotProps) => {
  const { user, isLoaded } = useUser();
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showFontOptions, setShowFontOptions] = useState(false);
  const [showSectionReorder, setShowSectionReorder] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [sections, setSections] = useState<string[]>([]);
  const [reorderedSections, setReorderedSections] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [chatbotTheme, setChatbotTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatbotTheme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return "dark";
  });
  const [faviconUrl, setFaviconUrl] = useState("");
  const [isFaviconUploaded, setIsFaviconUploaded] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUpdatedUserId, setHasUpdatedUserId] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Processing your request..."
  );
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const seoSettingsRef = useRef<any>(null);

  const themeColors = CHATBOT_THEMES[chatbotTheme];

  const dispatch = useDispatch();
  const themeOptionsArray = Object.keys(themeOptions);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatbotTheme", chatbotTheme);
    }
  }, [chatbotTheme]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuExpanded && !target.closest(".settings-menu-container")) {
        setIsMenuExpanded(false);
      }
    };

    if (isMenuExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuExpanded]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (portfolioData) {
      let mainSections: any = [];
      portfolioData.map(
        (item: any) =>
          !(
            item.type === "userInfo" ||
            item.type === "themes" ||
            item.type === "hero" ||
            item.type === "seo"
          ) && mainSections.push(item.type)
      );
      setSections(mainSections);
      setReorderedSections(mainSections);
    }
  }, [portfolioData]);

  const isFirstTime = useRef(true);

  useEffect(() => {
    const updateUserId = async () => {
      if (
        isLoaded &&
        user &&
        !isFirstTime.current &&
        portfolioUserId === "guest" &&
        !hasUpdatedUserId
      ) {
        try {
          const result = await updatePortfolioUserId({
            portfolioId,
            newUserId: user.id,
          });

          if (result.success) {
            dispatch(
              newPortfolioData(
                portfolioData.map((item: any) =>
                  item.type === "userInfo"
                    ? { ...item, data: { ...item.data, userId: user.id } }
                    : item
                )
              )
            );
            toast.success("Portfolio linked to your account!");
            setHasUpdatedUserId(true);
          } else {
            toast.error("Failed to link portfolio to your account");
            setHasUpdatedUserId(true);
          }
        } catch (error) {
          console.error("Error updating portfolio userId:", error);
          toast.error("Failed to link portfolio to your account");
          setHasUpdatedUserId(true);
        }
      }
    };

    updateUserId();
    isFirstTime.current = false;
  }, [
    isLoaded,
    user,
    portfolioId,
    portfolioUserId,
    portfolioData,
    dispatch,
    hasUpdatedUserId,
  ]);

  const handleThemeToggle = () => {
    setChatbotTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleThemeSelect = (theme: string) => {
    setCurrentPortTheme(theme);
    setSelectedTheme(theme);
  };

  const handleFontSelect = (font: string) => {
    setCurrentFont(font);
    setSelectedFont(font);
  };

  const [isApplyingFont, setIsApplyingFont] = useState(false);
  const [isApplyingTheme, setIsApplyingTheme] = useState(false);

  const handleApplyFont = async (font: string) => {
    if (!user) {
      toast.error("Please sign up to apply changes to your portfolio", {
        duration: 2500,
        style: {
          zIndex: 999999,
        },
      });
      return;
    }
    try {
      setIsApplyingFont(true);
      await updateFont({ fontName: font, portfolioId });
      toast.success("Font applied successfully!");
      setShowFontOptions(false);
      setSelectedFont("");
      handleChatClose();
    } catch (error) {
      toast.error("Failed to apply font");
    } finally {
      setIsApplyingFont(false);
    }
  };

  const handleApplySelectedTheme = async () => {
    if (!user) {
      toast.error("Please sign up to apply changes to your portfolio", {
        duration: 2500,
        style: {
          zIndex: 999999,
        },
      });
      return;
    }
    try {
      setIsApplyingTheme(true);
      setCurrentPortTheme(selectedTheme);
      await updateTheme({ themeName: selectedTheme, portfolioId });
      toast.success(`Theme "${selectedTheme}" applied!`);
      setShowThemeOptions(false);
      setSelectedTheme("");
      handleChatClose();
    } catch (error) {
      toast.error("Failed to apply theme");
    } finally {
      setIsApplyingTheme(false);
    }
  };

  const handleShowThemeOptions = () => {
    setShowHelpPanel(false);
    setShowFontOptions(false);
    setShowThemeOptions(true);
    setIsOpen(true);
    onOpenChange(true);
  };

  const handleShowFontOptions = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(true);
    setIsOpen(true);
    onOpenChange(true);
  };

  const handleShowSectionReorder = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(true);
    setReorderedSections([...sections]);
    setIsOpen(true);
    onOpenChange(true);
  };

  const handleShowAdvanced = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(false);
    setShowAdvanced(true);
    setIsOpen(true);
    onOpenChange(true);
  };

  const handleShowSEOSettings = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(false);
    setShowAdvanced(false);
    setShowSEOSettings(true);
    setIsOpen(true);
    onOpenChange(true);
  };

  const handleShowDeploy = () => {
    // Allow all users to open the deploy modal
    setShowDeployModal(true);
  };

  const handleSectionReorder = async () => {
    if (!user) {
      toast.error("Please sign up to apply changes to your portfolio", {
        duration: 2500,
        style: {
          zIndex: 999999,
        },
      });
      return;
    }

    try {
      setIsProcessing(true);

      const sectionOrder: any = [];
      portfolioData.map((item: any) => sectionOrder.push(item.type));
      const updatedOrder: any = [];
      let idx = 0;
      sectionOrder.forEach((section: any) => {
        if (
          section === "hero" ||
          section === "userInfo" ||
          section === "themes" ||
          section === "seo"
        ) {
          updatedOrder.push(section);
        } else {
          updatedOrder.push(reorderedSections[idx]);
          idx++;
        }
      });

      const finalSections: any = [];
      updatedOrder.forEach((item: any) => {
        const found = portfolioData.find((it: any) => it.type === item);
        if (found) {
          finalSections.push({ type: item, data: found.data });
        } else {
          toast.error("Error while re ordering sections");
          return;
        }
      });

      await updatePortfolio({
        portfolioId: portfolioId,
        newPortfolioData: finalSections,
      });

      dispatch(newPortfolioData(finalSections));
      toast.success("Sections reordered successfully!");
      setShowSectionReorder(false);
      handleChatClose();
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Failed to reorder sections");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSectionOrder = () => {
    if (portfolioData) {
      let mainSections: any = [];
      portfolioData.forEach((item: any) => {
        if (
          item.type === "hero" ||
          item.type === "userInfo" ||
          item.type === "themes" ||
          item.type === "seo"
        ) {
          // Skip these sections
        } else {
          mainSections.push(item.type);
        }
      });
      setReorderedSections(mainSections);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(false);
    setShowSEOSettings(false);
    setShowAdvanced(false);
    setShowDeployModal(false);
    setIsOpen(newIsOpen);
    onOpenChange(newIsOpen);
  };

  const handleChatClose = () => {
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowHelpPanel(false);
    setShowSectionReorder(false);
    setShowSEOSettings(false);
    setShowAdvanced(false);
    setCurrentFont(currentFont);
    setSelectedFont(currentFont);
    setCurrentPortTheme(currentPortTheme);
    setSelectedTheme(currentPortTheme);
    handleOpenChange(false);
  };

  const handleFaviconUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    );

    try {
      toast.loading("Uploading favicon...", { id: "faviconUpload" });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Upload failed", { id: "faviconUpload" });
        return;
      }

      const data = await response.json();
      setFaviconUrl(data.secure_url);
      setIsFaviconUploaded(true);
      toast.success("Favicon uploaded successfully!", { id: "faviconUpload" });
    } catch (error) {
      toast.error("An error occurred during upload", { id: "faviconUpload" });
      console.error("Upload error:", error);
    }
  };

  const removeFavicon = () => {
    setFaviconUrl("");
    setIsFaviconUploaded(false);
  };

  const handleGenerateSEO = async () => {
    try {
      setIsGeneratingSEO(true);
      const response = await axios.post(`/api/seo-settings`, {
        portfolioData: portfolioData,
      });
      setSeoTitle(response.data.seoTitle);
      setSeoDescription(response.data.seoDescription);
      toast.success("SEO content generated successfully!");
    } catch (error) {
      console.error("Error generating SEO content:", error);
      toast.error("Failed to generate SEO content");
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleSaveSEOSettings = async () => {
    // This function is no longer needed as SEOSettings handles its own saving
    // The save button in SEOSettings component will handle the saving
  };

  const handleSaveSEO = async () => {
    if (!user) {
      toast.error("Please sign up to apply changes to your portfolio", {
        duration: 2500,
        style: {
          zIndex: 999999,
        },
      });
      return;
    }

    // Call the save function from SEOSettings component
    if (seoSettingsRef.current) {
      try {
        await seoSettingsRef.current.handleSaveSEOSettings();
        // Close the chatbot after successful save
        setShowSEOSettings(false);
        handleChatClose();
      } catch (error) {
        console.error("Error saving SEO settings:", error);
      }
    } else {
      console.error("seoSettingsRef is not available");
    }
  };

  useEffect(() => {
    const fetchSEOSettings = async () => {
      if (showSEOSettings && portfolioId) {
        try {
          const themeResult = await getThemeNameApi({ portfolioId });
          if (themeResult.success && themeResult.data?.content) {
            const content = themeResult.data.content as any;
            const seoSection = content.sections?.find(
              (section: any) => section.type === "seo"
            );
            if (seoSection?.data) {
              setSeoTitle(seoSection.data.title || "");
              setSeoDescription(seoSection.data.description || "");
              setFaviconUrl(seoSection.data.favicon || "");
            } else {
              setSeoTitle("");
              setSeoDescription("");
              setFaviconUrl("");
            }
          }
        } catch (error) {
          setSeoTitle("");
          setSeoDescription("");
          setFaviconUrl("");
        }
      }
    };
    fetchSEOSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSEOSettings, portfolioId]);

  const handleCopyUrl = () => {
    const url = `https://craft-folio-three.vercel.app/p/${portfolioLink}`;
    navigator.clipboard.writeText(url);
    toast.success("Portfolio URL copied to clipboard!");
  };

  const handleShare = (platform: string) => {
    const url = `https://craft-folio-three.vercel.app/p/${portfolioLink}`;
    const text = "Check out my portfolio!";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
    }
  };

  if (portfolioUserId !== "guest" && (!user || user.id !== portfolioUserId)) {
    return null;
  }

  return (
    <div
      className={
        isOpen
          ? "fixed top-0 right-0 h-screen z-50 w-full md:w-[350px] lg:w-[400px]"
          : ""
      }
    >
      {/* Mobile-only overlay: show ONLY when chatbot is open and on mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white text-center px-6 py-12 md:hidden">
          <button
            className="absolute top-4 right-4 text-white text-2xl p-2 rounded-full hover:bg-white/10 focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
          >
            ×
          </button>
          <div className="text-2xl font-bold mb-4">
            Editing Unavailable on Mobile
          </div>
          <div className="text-lg">
            Editing is only available on desktop or larger screens.
            <br />
            Please use a laptop or desktop to edit your portfolio.
          </div>
        </div>
      )}
      {/* Chatbot content (hidden on mobile by overlay above) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full w-full flex flex-col"
            style={{
              backgroundColor: themeColors.bgMain,
              color: themeColors.textPrimary,
              borderLeft: `1px solid ${themeColors.borderLight}`,
            }}
          >
            {(portfolioUserId === "guest" && !isLoaded) ||
              (portfolioUserId === "guest" && isLoaded && !user) ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-center border-b"
                style={{
                  backgroundColor: themeColors.bgCard,
                  borderColor: themeColors.borderLight,
                }}
              >
                <div
                  className="text-sm"
                  style={{ color: themeColors.textSecondary }}
                >
                  ⚠️ You are in guest mode. Sign up to save your portfolio and
                  unlock all features including the AI chatbot, theme
                  customization, and more.{" "}
                  <SignInButton
                    mode="modal"
                    fallbackRedirectUrl={pathname}
                    signUpFallbackRedirectUrl={pathname}
                  >
                    <div className="underline inline-block cursor-pointer text-blue-300">
                      Sign up
                    </div>
                  </SignInButton>{" "}
                  to get started.
                </div>
              </motion.div>
            ) : null}


            <div
              className="flex-1 p-4 overflow-y-auto rounded-lg relative"
              style={{ backgroundColor: themeColors.bgMain }}
            >
              <AnimatePresence>
                {showThemeOptions ||
                  showFontOptions ||
                  showHelpPanel ||
                  showSectionReorder ||
                  showSEOSettings ||
                  showAdvanced ? (
                  <motion.div
                    key="options-panel"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-0 left-0 right-0 bottom-0 z-10 p-4 overflow-y-auto"
                    style={{ backgroundColor: themeColors.bgMain }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleChatClose()}
                        className="ml-auto p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                        style={{ color: themeColors.textPrimary }}
                      >
                        <X size={18}
                          className="cursor-pointer" />
                      </motion.button>
                    </div>

                    {showThemeOptions && (
                      <ChangeTheme
                        handleThemeSelect={handleThemeSelect}
                        themeOptions={themeOptions}
                        currentPortTheme={currentPortTheme}
                        selectedTheme={selectedTheme}
                      />
                    )}

                    {showFontOptions && (
                      <FontSelector
                        portfolioId={portfolioId}
                        currentFont={currentFont}
                        setCurrentFont={setCurrentFont}
                        onClose={() => setShowFontOptions(false)}
                        themeColors={themeColors}
                        handleFontSelect={handleFontSelect}
                        selectedFont={selectedFont}
                      />
                    )}

                    {showSectionReorder && (
                      <SectionReorder
                        portfolioData={portfolioData}
                        portfolioId={portfolioId}
                        onClose={() => setShowSectionReorder(false)}
                        themeColors={themeColors}
                        reorderedSections={reorderedSections}
                        setReorderedSections={setReorderedSections}
                      />
                    )}

                    {showSEOSettings && (
                      <SEOSettings
                        portfolioData={portfolioData}
                        portfolioId={portfolioId}
                        onClose={() => setShowSEOSettings(false)}
                        themeColors={themeColors}
                        onSave={handleSaveSEO}
                        ref={seoSettingsRef}
                      />
                    )}

                    {showAdvanced && (
                      <AdvancedSettings
                        portfolioData={portfolioData}
                        portfolioId={portfolioId}
                        onClose={() => setShowAdvanced(false)}
                        themeColors={themeColors}
                      />
                    )}
                  </motion.div>
                ) : (
                  <ChatInterface
                    messages={messages}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    isProcessing={isProcessing}
                    loadingMessage={loadingMessage}
                    themeColors={themeColors}
                  />
                )}
              </AnimatePresence>
            </div>





            {showFontOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: themeColors.bgNav,
                  borderColor: themeColors.borderLight,
                }}
              >
                <Button
                  onClick={() => selectedFont && handleApplyFont(selectedFont)}
                  disabled={!selectedFont || isApplyingFont}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !selectedFont || isApplyingFont
                      ? themeColors.bgCard
                      : themeColors.primary,
                    color: themeColors.textPrimary,
                    boxShadow: selectedFont && !isApplyingFont
                      ? `0 4px 14px ${themeColors.primaryGlow}`
                      : "none",
                  }}
                >
                  {isApplyingFont ? "Applying Font..." : "Apply Selected Font"}
                </Button>
              </motion.div>
            )}
            {showThemeOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: themeColors.bgNav,
                  borderColor: themeColors.borderLight,
                }}
              >
                <Button
                  onClick={handleApplySelectedTheme}
                  disabled={!selectedTheme || isApplyingTheme}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !selectedTheme || isApplyingTheme
                      ? themeColors.bgCard
                      : themeColors.primary,
                    color: themeColors.textPrimary,
                    boxShadow: selectedTheme && !isApplyingTheme
                      ? `0 4px 14px ${themeColors.primaryGlow}`
                      : "none",
                  }}
                >
                  {isApplyingTheme ? "Applying Theme..." : "Apply Selected Theme"}
                </Button>
              </motion.div>
            )}
            {showSEOSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: themeColors.bgNav,
                  borderColor: themeColors.borderLight,
                }}
              >
                <Button
                  onClick={handleSaveSEO}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: themeColors.textPrimary,
                    boxShadow: `0 4px 14px ${themeColors.primaryGlow}`,
                  }}
                >
                  Save SEO Settings
                </Button>
              </motion.div>
            )}
            {showSectionReorder && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: themeColors.bgNav,
                  borderColor: themeColors.borderLight,
                }}
              >
                <div className="flex gap-2">
                  <Button
                    onClick={resetSectionOrder}
                    className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      color: themeColors.textPrimary,
                      borderColor: themeColors.borderLight,
                    }}
                  >
                    Reset Order
                  </Button>
                  <Button
                    onClick={handleSectionReorder}
                    disabled={isProcessing}
                    className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: isProcessing
                        ? themeColors.bgCard
                        : themeColors.primary,
                      color: themeColors.textPrimary,
                      boxShadow: !isProcessing
                        ? `0 4px 14px ${themeColors.primaryGlow}`
                        : "none",
                    }}
                  >
                    Apply New Order
                  </Button>
                </div>
              </motion.div>
            )}
            <GuestWarning user={user} themeColors={themeColors} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <SettingsMenu
          isMenuExpanded={isMenuExpanded}
          setIsMenuExpanded={setIsMenuExpanded}
          themeColors={themeColors}
          onOpenChange={handleOpenChange}
          onShowThemeOptions={handleShowThemeOptions}
          onShowFontOptions={handleShowFontOptions}
          onShowSectionReorder={handleShowSectionReorder}
          onShowAdvanced={handleShowAdvanced}
          onShowDeploy={handleShowDeploy}
          onShowSEOSettings={handleShowSEOSettings}
        />
      )}

      {/* Deploy Modal */}
      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        portfolioId={portfolioId}
        portfolioData={portfolioData}
        portfolioLink={portfolioLink}
      />
    </div>
  );
};

export default PortfolioChatbot;

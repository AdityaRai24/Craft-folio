import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, GripVertical, Sun, Moon, Rocket } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import axios from "axios";
import {
  updateCustomCSS,
  updateFont,
  updatePortfolio,
  updateTheme,
} from "@/app/actions/portfolio";
import { useDispatch, useSelector } from "react-redux";
import { newPortfolioData } from "@/slices/dataSlice";
import { RootState } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { fontClassMap, fontOptions } from "@/lib/font";
import { Button } from "../ui/button";
import { ColorTheme } from "@/lib/colorThemes";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";
import DeployModal from "../DeployModal";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSystemNotification?: boolean;
}

interface ChatbotProps {
  portfolioData: any;
  portfolioId: string;
  themeOptions: any;
  currentPortTheme: any;
  currentFont: any;
  onOpenChange: (isOpen: boolean) => void;
  setCurrentFont: (font: string) => void;
  setCurrentPortTheme: (theme: string) => void;
  setCustomCSS: (css: string) => void;
  customCSSState: string;
}

interface MessageMemory {
  text: string;
  timestamp: Date;
}
const SectionItem = ({
  section,
  index,
}: {
  section: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center gap-2 p-3 rounded-lg cursor-move"
      style={{
        backgroundColor: ColorTheme.bgCardHover,
        border: `1px solid ${ColorTheme.borderLight}`,
      }}
    >
      <GripVertical
        size={16}
        style={{
          color: ColorTheme.textSecondary,
        }}
      />
      <div className="flex-1">
        <span
          className="font-medium capitalize"
          style={{ color: ColorTheme.textPrimary }}
        >
          {section.replace(/_/g, " ")}
        </span>
        <p
          className="text-xs mt-1"
          style={{
            color: ColorTheme.textSecondary,
          }}
        >
          {section} Section
        </p>
      </div>
    </motion.div>
  );
};

const CHATBOT_THEMES = {
  dark: {
    bgMain: ColorTheme.bgMain,
    bgNav: ColorTheme.bgNav,
    bgCard: ColorTheme.bgCard,
    bgCardHover: ColorTheme.bgCardHover,
    textPrimary: ColorTheme.textPrimary,
    textSecondary: ColorTheme.textSecondary,
    borderLight: ColorTheme.borderLight,
    primary: ColorTheme.primary,
    primaryGlow: ColorTheme.primaryGlow,
  },
  light: {
    bgMain: "#F9FAFB",
    bgNav: "#F3F4F6",
    bgCard: "#FFFFFF",
    bgCardHover: "#F3F4F6",
    textPrimary: "#18181B",
    textSecondary: "#52525B",
    borderLight: "#E5E7EB",
    primary: "#10B981",
    primaryGlow: "#10B98133",
  },
};

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
}: ChatbotProps) => {
  const {user} = useUser();
  const {portfolioUserId} = useSelector((state: RootState) => state.data);

  // If user is not the portfolio owner, don't show the chatbot
  if (user === null || !user?.id || user.id !== portfolioUserId) {
    return null;
  }

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
  const [messageMemory, setMessageMemory] = useState<MessageMemory[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [reorderedSections, setReorderedSections] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showCSSOptions, setShowCSSOptions] = useState(false);
  const [customCSS, setCustomCSSState] = useState(customCSSState);
  const [chatbotTheme, setChatbotTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatbotTheme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return "dark";
  });
  const [showDeployModal, setShowDeployModal] = useState(false);

  const themeColors = CHATBOT_THEMES[chatbotTheme];

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatbotTheme", chatbotTheme);
    }
  }, [chatbotTheme]);

  const handleThemeToggle = () => {
    setChatbotTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const dispatch = useDispatch();
  const themeOptionsArray = Object.keys(themeOptions);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "👋 Hi there! I'm your AI portfolio assistant. I can help you edit content, change themes, and update fonts. Use the buttons below to customize your portfolio or just type your request directly.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (portfolioData) {
      let mainSections: any = [];
      portfolioData.map(
        (item: any) =>
          !(
            item.type === "userInfo" ||
            item.type === "themes" ||
            item.type === "hero"
          ) && mainSections.push(item.type)
      );
      setSections(mainSections);
      setReorderedSections(mainSections);
    }
  }, [portfolioData]);

  const callGeminiAPI = async (inputValue: string) => {
    try {
      const response = await axios.post("/api/updateDataWithChatbot", {
        portfolioData,
        inputValue,
        messageMemory: messageMemory.slice(-3),
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setMessageMemory((prev) =>
      [
        ...prev,
        {
          text: messageText,
          timestamp: new Date(),
        },
      ].slice(-3)
    );

    setInputValue("");
    setIsProcessing(true);

    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);

    try {
      const tempId = Date.now() + 1;
      const tempMessage: Message = {
        id: tempId,
        text: "Processing your request...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      const apiResponse = await callGeminiAPI(messageText);

      await updatePortfolio({
        portfolioId: portfolioId,
        newPortfolioData: apiResponse.updatedData,
      });

      dispatch(newPortfolioData(apiResponse.updatedData));

      const botResponse =
        apiResponse.userReply ||
        "I've updated your portfolio with the requested changes.";

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== tempId)
          .concat({
            id: Date.now() + 2,
            text: botResponse,
            isUser: false,
            timestamp: new Date(),
          })
      );

      toast.success("Portfolio updated successfully!");
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to update portfolio");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleThemeSelect = (theme: string) => {
    setCurrentPortTheme(theme);
    setSelectedTheme(theme);
  };

  const handleApplySelectedTheme = async () => {
    setCurrentPortTheme(selectedTheme);
    await updateTheme({ themeName: selectedTheme, portfolioId });
    toast.success(`Theme "${selectedTheme}" applied!`);
    const notificationMessage: Message = {
      id: Date.now(),
      text: `Theme changed to ${selectedTheme}.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, notificationMessage]);
    setShowThemeOptions(false);
    setSelectedTheme("");
  };

  const handleShowThemeOptions = () => {
    setShowHelpPanel(false);
    setShowFontOptions(false);
    setShowThemeOptions(true);
  };

  const handleShowFontOptions = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(true);
  };

  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
    setCurrentFont(font);
  };

  const handleApplyFont = async (font: string) => {
    await updateFont({ fontName: font, portfolioId });
    toast.success("Font applied successfully!");
    const notificationMessage: Message = {
      id: Date.now(),
      text: `Font changed to ${font}.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, notificationMessage]);
    setShowFontOptions(false);
    setSelectedFont("");
  };

  const handleShowHelp = () => {
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowHelpPanel(true);
  };

  const handleShowSectionReorder = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(true);
    setReorderedSections([...sections]);
  };

  const handleSectionReorder = async () => {
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
          section === "themes"
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
      setSections(reorderedSections);

      const notificationMessage: Message = {
        id: Date.now(),
        text: "Sections reordered successfully!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, notificationMessage]);
      toast.success("Sections reordered successfully!");
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Failed to reorder sections");
    } finally {
      setIsProcessing(false);
      setShowSectionReorder(false);
    }
  };

  const resetSectionOrder = () => {
    setReorderedSections([...sections]);
  };

  const EXAMPLE_PROMPTS = [
    {
      category: "Content Editing",
      examples: [
        "Update my name to John Smith",
        "Change my bio to 'Full-stack developer with 5 years of experience'",
        "Update my job title to Senior Software Engineer",
        "Add a new project called 'E-commerce Platform'",
        "Update my email to john@example.com",
      ],
    },
    {
      category: "Section Management",
      examples: [
        "Move the Projects section above Skills",
        "Hide the Education section",
        "Add a new section called 'Certifications'",
        "Reorder sections to: About, Skills, Projects, Contact",
        "Make the About section more prominent",
      ],
    },
    {
      category: "Project Updates",
      examples: [
        "Update the description of my React project",
        "Add new technologies to my Portfolio project",
        "Change the image of my E-commerce project",
        "Update the live demo link for Project X",
        "Add a new screenshot to my Mobile App project",
      ],
    },
    {
      category: "Skills & Experience",
      examples: [
        "Add React Native to my skills",
        "Update my years of experience with JavaScript",
        "Add a new skill category called 'Cloud Services'",
        "Update my proficiency level in Python",
        "Add AWS certification to my skills",
      ],
    },
  ];

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
    setShowCSSOptions(false);
    setIsOpen(newIsOpen);
    onOpenChange(newIsOpen);
  };

  const handleShowCSSOptions = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(false);
    setShowCSSOptions(true);
  };

  const handleApplyCSS = async () => {
    if (setCustomCSS) {
      setCustomCSS(customCSS);
      await updateCustomCSS({ customCSS: customCSS, portfolioId });
      toast.success("Custom CSS applied successfully!");
      const notificationMessage: Message = {
        id: Date.now(),
        text: "Custom CSS has been applied to your portfolio.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, notificationMessage]);
    }
  };

  const handleChatClose = () => {
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowHelpPanel(false);
    setShowSectionReorder(false);
    setShowCSSOptions(false);
    setCurrentFont(currentFont);
    setSelectedFont(currentFont);
    setCurrentPortTheme(currentPortTheme);
    setSelectedTheme(currentPortTheme);
    setCustomCSSState(customCSSState);
    handleOpenChange(false);
  };

  const CSS_TEMPLATES = {
    "Hover Effects": `
.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}`,
    "Gradient Text": `
.section-title {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`,
    "Custom Animation": `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-content {
  animation: fadeIn 0.5s ease-out;
}`,
    "Custom Border": `
.section-container {
  border: 2px solid #4ecdc4;
  border-radius: 10px;
  padding: 20px;
  position: relative;
}

.section-container::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid #ff6b6b;
  border-radius: 12px;
  z-index: -1;
}`,
  };

  // Update local state when prop changes
  useEffect(() => {
    setCustomCSSState(customCSSState);
  }, [customCSSState]);

  return (
    <div
      className={
        isOpen
          ? "fixed top-0 right-0 h-screen z-50 w-full md:w-[350px] lg:w-[400px]"
          : ""
      }
    >
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
            <div
              className="p-4 flex rounded-t-lg justify-between items-center"
              style={{ backgroundColor: themeColors.bgNav }}
            >
              <div className="flex items-center gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleChatClose()}
                  className="p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                  style={{ color: themeColors.textPrimary }}
                >
                  <X size={20} className="cursor-pointer" />
                </motion.button>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold text-lg"
                  style={{ color: themeColors.textPrimary }}
                >
                  Portfolio Assistant
                </motion.h3>
              </div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleThemeToggle}
                className="ml-2 p-1 rounded-full transition-colors"
                style={{ color: themeColors.textPrimary }}
                aria-label="Toggle chatbot theme"
              >
                {chatbotTheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </motion.button>
            </div>

            <div
              className="flex-1 p-4 overflow-y-auto rounded-lg relative"
              style={{ backgroundColor: themeColors.bgMain }}
            >
              <AnimatePresence>
                {showThemeOptions ||
                showFontOptions ||
                showHelpPanel ||
                showSectionReorder ||
                showCSSOptions ? (
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
                      <h4
                        className="font-bold text-lg"
                        style={{ color: themeColors.textPrimary }}
                      >
                        {showThemeOptions
                          ? "Select a Theme"
                          : showFontOptions
                          ? "Select a Font"
                          : showSectionReorder
                          ? "Reorder Sections"
                          : showCSSOptions
                          ? "Custom CSS Injection"
                          : "How Can I Help You?"}
                      </h4>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleChatClose}
                        className="ml-auto p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                        style={{ color: themeColors.textPrimary }}
                      >
                        <X size={18} className="cursor-pointer" />
                      </motion.button>
                    </div>

                    {showHelpPanel && (
                      <div className="space-y-6">
                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: themeColors.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: themeColors.primary }}
                          >
                            About Me
                          </h5>
                          <p
                            className="text-sm"
                            style={{ color: themeColors.textSecondary }}
                          >
                            I'm your AI portfolio assistant. I can help you
                            customize your portfolio's content, layout, and
                            appearance. Just type your request in natural
                            language, and I'll help you make the changes.
                          </p>
                        </div>

                        {EXAMPLE_PROMPTS.map((section, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="rounded-lg p-4"
                            style={{ backgroundColor: themeColors.bgCard }}
                          >
                            <h5
                              className="font-semibold mb-3"
                              style={{ color: themeColors.primary }}
                            >
                              {section.category}
                            </h5>
                            <div className="space-y-2">
                              {section.examples.map((example, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * (index + idx) }}
                                  className="rounded-lg p-3 cursor-pointer transition-colors"
                                  style={{
                                    backgroundColor: themeColors.bgCardHover,
                                    color: themeColors.textPrimary,
                                  }}
                                  onClick={() => {
                                    setInputValue(example);
                                    setShowHelpPanel(false);
                                  }}
                                >
                                  <p className="text-sm">{example}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}

                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: themeColors.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: themeColors.primary }}
                          >
                            Tips
                          </h5>
                          <ul
                            className="text-sm space-y-2"
                            style={{ color: themeColors.textSecondary }}
                          >
                            <li>
                              • Be specific in your requests for better results
                            </li>
                            <li>
                              • You can combine multiple changes in one request
                            </li>
                            <li>
                              • Use the Theme and Font buttons to quickly change
                              appearance
                            </li>
                            <li>• Click any example above to try it out</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {showThemeOptions && (
                      <div className="grid grid-cols-2 gap-3">
                        {themeOptionsArray.map((theme, index) => {
                          const themeDetails = themeOptions[theme];
                          const bgColor =
                            themeDetails?.colors?.primary || "#f0f0f0";
                          const textColor =
                            themeDetails?.colors?.text?.primary || "#333333";

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              onClick={() => handleThemeSelect(theme)}
                              className={`p-4 rounded-lg border cursor-pointer transition-all text-center relative ${
                                currentPortTheme === theme
                                  ? "ring ring-opacity-50"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: themeColors.bgCard,
                                borderColor:
                                  currentPortTheme === theme
                                    ? themeColors.primary
                                    : themeColors.borderLight,
                                boxShadow:
                                  currentPortTheme === theme
                                    ? `0 0 20px ${themeColors.primaryGlow}`
                                    : "none",
                              }}
                            >
                              {(selectedTheme === theme ||
                                currentPortTheme === theme) && (
                                <div
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: themeColors.primary,
                                  }}
                                >
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div
                                className="w-full h-16 rounded-md mb-3 flex flex-col items-center justify-center p-1 shadow-inner"
                                style={{ backgroundColor: bgColor }}
                              >
                                <span
                                  style={{ color: textColor }}
                                  className="text-lg font-semibold"
                                >
                                  Aa
                                </span>
                                <div
                                  className="w-10 h-3 mt-1 rounded-sm"
                                  style={{ backgroundColor: bgColor }}
                                ></div>
                              </div>
                              <p
                                className="font-medium capitalize"
                                style={{ color: themeColors.textPrimary }}
                              >
                                {theme}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    {showFontOptions && (
                      <div className="grid grid-cols-2 gap-3">
                        {fontOptions.map((font, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            onClick={() => handleFontSelect(font)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all text-center relative ${
                              currentFont === font ? "ring ring-opacity-50" : ""
                            } ${fontClassMap[font]}`}
                            style={{
                              backgroundColor: themeColors.bgCard,
                              borderColor:
                                currentFont === font
                                  ? themeColors.primary
                                  : themeColors.borderLight,
                              boxShadow:
                                currentFont === font
                                  ? `0 0 20px ${themeColors.primaryGlow}`
                                  : "none",
                            }}
                          >
                            {(currentFont === font ||
                              selectedFont === font) && (
                              <div
                                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: themeColors.primary }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                            <p
                              className={`text-xl font-medium`}
                              style={{ color: themeColors.textPrimary }}
                            >
                              Aa
                            </p>
                            <p
                              className="font-medium mt-2"
                              style={{ color: themeColors.textPrimary }}
                            >
                              {font}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {showSectionReorder && (
                      <div className="space-y-4">
                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: themeColors.bgCard }}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <p
                              className="text-sm"
                              style={{ color: themeColors.textSecondary }}
                            >
                              Drag and drop to reorder sections
                            </p>
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={resetSectionOrder}
                              className="text-sm px-3 py-1 rounded-lg border transition-colors"
                              style={{
                                backgroundColor: themeColors.bgCardHover,
                                borderColor: themeColors.borderLight,
                                color: themeColors.textPrimary,
                              }}
                            >
                              Reset Order
                            </motion.button>
                          </div>
                          <Reorder.Group
                            axis="y"
                            values={reorderedSections}
                            onReorder={setReorderedSections}
                            className="space-y-2"
                          >
                            {reorderedSections.map((section, index) => (
                              <Reorder.Item
                                key={section}
                                value={section}
                                initial={false}
                                whileDrag={{
                                  scale: 1.02,
                                  boxShadow: `0 8px 16px ${themeColors.primaryGlow}`,
                                  opacity: 0.8,
                                  backgroundColor: `${themeColors.primary}20`,
                                  border: `2px dashed ${themeColors.primary}`,
                                  transition: {
                                    duration: 0.2,
                                    ease: "easeInOut",
                                  },
                                }}
                                animate={{
                                  scale: 1,
                                  opacity: 1,
                                  backgroundColor: themeColors.bgCardHover,
                                  border: `1px solid ${themeColors.borderLight}`,
                                  transition: {
                                    duration: 0.2,
                                    ease: "easeInOut",
                                  },
                                }}
                                className="cursor-move"
                              >
                                <SectionItem section={section} index={index} />
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        </div>
                      </div>
                    )}

                    {showCSSOptions && (
                      <div className="space-y-4">
                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: themeColors.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: themeColors.primary }}
                          >
                            Custom CSS Editor
                          </h5>
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1">
                                <div
                                  className="text-xs px-2 py-1 rounded bg-[#2c2c2e] inline-block"
                                  style={{ color: themeColors.textSecondary }}
                                >
                                  CSS Editor
                                </div>
                              </div>
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setCustomCSSState("")}
                                className="p-1.5 rounded-md hover:bg-[#2c2c2e] transition-colors"
                                style={{ color: themeColors.textPrimary }}
                              >
                                <X size={16} />
                              </motion.button>
                            </div>
                            <Editor
                              value={customCSS}
                              onValueChange={setCustomCSSState}
                              highlight={(code) =>
                                Prism.highlight(
                                  code,
                                  Prism.languages.css,
                                  "css"
                                )
                              }
                              padding={16}
                              style={{
                                fontFamily:
                                  "Fira Mono, Menlo, Monaco, Consolas, monospace",
                                fontSize: 14,
                                minHeight: "16rem",
                                borderRadius: "0.5rem",
                                background: themeColors.bgCardHover,
                                color: themeColors.textPrimary,
                                outline: "none",
                                border: "none",
                                caretColor: themeColors.primary,
                                resize: "vertical",
                                tabSize: 2,
                                whiteSpace: "pre",
                              }}
                              textareaId="custom-css-editor"
                              placeholder={`/* Example CSS */\n.section {\n  padding: 2rem;\n  margin: 1rem;\n}\n\n.section-title {\n  font-size: 2rem;\n  color: #fff;\n}`}
                              spellCheck={false}
                            />
                          </div>
                        </div>

                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: themeColors.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: themeColors.primary }}
                          >
                            Available Classes
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <h6
                                className="text-sm font-medium"
                                style={{ color: themeColors.textSecondary }}
                              >
                                Section Classes
                              </h6>
                              <div className="space-y-1">
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section
                                </code>
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section-card
                                </code>
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section-image
                                </code>
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .btn-primary
                                </code>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h6
                                className="text-sm font-medium"
                                style={{ color: themeColors.textSecondary }}
                              >
                                Typography Classes
                              </h6>
                              <div className="space-y-1">
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section-title
                                </code>
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section-sub-heading
                                </code>
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section-description
                                </code>
                                <code
                                  className="text-xs block p-1.5 rounded bg-[#2c2c2e]"
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  .section-sub-description
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: themeColors.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: themeColors.primary }}
                          >
                            Tips
                          </h5>
                          <ul
                            className="text-sm space-y-2"
                            style={{ color: themeColors.textSecondary }}
                          >
                            <li>
                              • Use <b>.section</b> for main section wrappers
                            </li>
                            <li>
                              • Use <b>.section-card</b> for card elements
                            </li>
                            <li>
                              • Use <b>.section-image</b> for images
                            </li>
                            <li>
                              • Use <b>.btn-primary</b> to style primary buttons
                            </li>
                            <li>
                              • Use <b>.section-title</b> for main headings
                            </li>
                            <li>
                              • Use <b>.section-sub-heading</b> for subheadings
                            </li>
                            <li>
                              • Use <b>.section-description</b> for main
                              descriptions
                            </li>
                            <li>
                              • Use <b>.section-sub-description</b> for
                              secondary text
                            </li>
                            <li>
                              • If your changes don't apply, try adding{" "}
                              <b>!important</b> to your CSS rule
                            </li>
                            <li>• Test your CSS before applying</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`${
                            message.isUser
                              ? "flex justify-end"
                              : "flex justify-start"
                          } ${
                            message.isSystemNotification ? "justify-center" : ""
                          }`}
                        >
                          {message.isSystemNotification ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs py-1 px-3 rounded-full max-w-[80%]"
                              style={{
                                backgroundColor: themeColors.primary,
                                color: themeColors.textPrimary,
                              }}
                            >
                              {message.text}
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.isUser
                                  ? "rounded-br-none"
                                  : "rounded-bl-none"
                              }`}
                              style={{
                                backgroundColor: message.isUser
                                  ? themeColors.primary
                                  : themeColors.bgCard,
                                color: themeColors.textPrimary,
                              }}
                            >
                              <p className="text-sm whitespace-pre-line">
                                {message.text}
                              </p>
                              <span
                                className="text-xs opacity-70 mt-1 block"
                                style={{ color: themeColors.textSecondary }}
                              >
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                      {isProcessing && (
                        <motion.div
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex justify-start"
                        >
                          <div
                            className="rounded-lg rounded-bl-none p-3 max-w-[80%]"
                            style={{ backgroundColor: themeColors.bgCard }}
                          >
                            <div className="flex space-x-2">
                              <div
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: themeColors.primary,
                                  animationDelay: "0ms",
                                }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: themeColors.primary,
                                  animationDelay: "150ms",
                                }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: themeColors.primary,
                                  animationDelay: "300ms",
                                }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {!(
              showFontOptions ||
              showThemeOptions ||
              showSectionReorder ||
              showCSSOptions
            ) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 border-t rounded-lg"
                style={{
                  backgroundColor: themeColors.bgNav,
                  borderColor: themeColors.borderLight,
                }}
              >
                <div className="flex gap-2 mb-3">
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isProcessing}
                    className="flex-1 px-3 py-2 rounded-lg outline-none resize-none min-h-[80px]"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      color: themeColors.textPrimary,
                      borderColor: themeColors.borderLight,
                    }}
                    rows={3}
                  />
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleSendMessage()}
                    disabled={isProcessing || !inputValue.trim()}
                    className={`px-4 rounded-lg font-medium flex items-center justify-center transition-colors`}
                    style={{
                      backgroundColor:
                        isProcessing || !inputValue.trim()
                          ? themeColors.bgCard
                          : themeColors.primary,
                      color: themeColors.textPrimary,
                      boxShadow:
                        !isProcessing && inputValue.trim()
                          ? `0 4px 14px ${themeColors.primaryGlow}`
                          : "none",
                    }}
                  >
                    <Send size={18} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowThemeOptions}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      borderColor: themeColors.borderLight,
                      color: themeColors.textPrimary,
                    }}
                  >
                    Change Theme
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowFontOptions}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      borderColor: themeColors.borderLight,
                      color: themeColors.textPrimary,
                    }}
                  >
                    Change Font
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowSectionReorder}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      borderColor: themeColors.borderLight,
                      color: themeColors.textPrimary,
                    }}
                  >
                    Reorder Sections
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowCSSOptions}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      borderColor: themeColors.borderLight,
                      color: themeColors.textPrimary,
                    }}
                  >
                    Custom CSS
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowDeployModal(true)}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors col-span-2"
                    style={{
                      backgroundColor: themeColors.bgCard,
                      borderColor: themeColors.borderLight,
                      color: themeColors.textPrimary,
                    }}
                  >
                    <Rocket className="w-4 h-4 inline-block mr-2" />
                    Deploy Portfolio
                  </motion.button>
                </div>
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
                    Reset
                  </Button>
                  <Button
                    onClick={handleSectionReorder}
                    disabled={
                      isProcessing ||
                      JSON.stringify(sections) ===
                        JSON.stringify(reorderedSections)
                    }
                    className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor:
                        isProcessing ||
                        JSON.stringify(sections) ===
                          JSON.stringify(reorderedSections)
                          ? themeColors.bgCard
                          : themeColors.primary,
                      color: themeColors.textPrimary,
                      boxShadow:
                        !isProcessing &&
                        JSON.stringify(sections) !==
                          JSON.stringify(reorderedSections)
                          ? `0 4px 14px ${themeColors.primaryGlow}`
                          : "none",
                    }}
                  >
                    Apply New Order
                  </Button>
                </div>
              </motion.div>
            )}

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
                  disabled={!selectedFont}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !selectedFont
                      ? themeColors.bgCard
                      : themeColors.primary,
                    color: themeColors.textPrimary,
                    boxShadow: selectedFont
                      ? `0 4px 14px ${themeColors.primaryGlow}`
                      : "none",
                  }}
                >
                  Apply Selected Font
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
                  disabled={!selectedTheme}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !selectedTheme
                      ? themeColors.bgCard
                      : themeColors.primary,
                    color: themeColors.textPrimary,
                    boxShadow: selectedTheme
                      ? `0 4px 14px ${themeColors.primaryGlow}`
                      : "none",
                  }}
                >
                  Apply Selected Theme
                </Button>
              </motion.div>
            )}

            {showCSSOptions && (
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
                  onClick={handleApplyCSS}
                  disabled={!customCSS.trim()}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !customCSS.trim()
                      ? themeColors.bgCard
                      : themeColors.primary,
                    color: themeColors.textPrimary,
                    boxShadow: customCSS.trim()
                      ? `0 4px 14px ${themeColors.primaryGlow}`
                      : "none",
                  }}
                >
                  Apply Custom CSS
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        portfolioId={portfolioId}
        portfolioData={portfolioData}
      />

      {!isOpen && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 p-4 cursor-pointer rounded-full shadow-lg transition-colors z-[100]"
          style={{
            backgroundColor: themeColors.primary,
            color: themeColors.textPrimary,
            boxShadow: `0 4px 14px ${themeColors.primaryGlow}`,
          }}
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default PortfolioChatbot;

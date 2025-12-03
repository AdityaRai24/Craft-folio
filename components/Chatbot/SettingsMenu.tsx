import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Palette,
  Type,
  Layout,
  Search,
  Rocket,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setPreviewMode } from "@/slices/editModeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Eye, EyeOff } from "lucide-react";
interface SettingsMenuProps {
  isMenuExpanded: boolean;
  setIsMenuExpanded: (expanded: boolean) => void;
  themeColors: any;
  onOpenChange: (open: boolean) => void;
  onShowThemeOptions: () => void;
  onShowFontOptions: () => void;
  onShowSectionReorder: () => void;
  onShowAdvanced: () => void;
  onShowDeploy: () => void;
  onShowSEOSettings: () => void;
}

const SettingsMenu = ({
  isMenuExpanded,
  setIsMenuExpanded,
  themeColors,
  onOpenChange,
  onShowThemeOptions,
  onShowFontOptions,
  onShowSectionReorder,
  onShowAdvanced,
  onShowDeploy,
  onShowSEOSettings,
}: SettingsMenuProps) => {

  const { previewMode } = useSelector((state: RootState) => state.editMode);
  const dispatch = useDispatch();


  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  // Semi-circle positioning (right side)
  const radius = 80;
  const centerX = 0;
  const centerY = 0;

  // Calculate positions for 5 buttons in a semi-circle (top to bottom)
  const menuItems = [
    {
      icon: Palette,
      onClick: () => {
        onShowThemeOptions();
        setIsMenuExpanded(false);
      },
      angle: -72, // Top
      delay: 0.1,
      tooltip: "Change Theme",
    },
    {
      icon: Type,
      onClick: () => {
        onShowFontOptions();
        setIsMenuExpanded(false);
      },
      angle: -36, // Top right
      delay: 0.2,
      tooltip: "Change Font",
    },
    {
      icon: Layout,
      onClick: () => {
        onShowSectionReorder();
        setIsMenuExpanded(false);
      },
      angle: 0, // Right
      delay: 0.3,
      tooltip: "Reorder Sections",
    },
    {
      icon: Search,
      onClick: () => {
        onShowSEOSettings();
        setIsMenuExpanded(false);
      },
      angle: 36, // Bottom right
      delay: 0.4,
      tooltip: "SEO Settings",
    },
    {
      icon: Rocket,
      onClick: () => {
        onShowDeploy();
        setIsMenuExpanded(false);
      },
      angle: 72, // Bottom
      delay: 0.5,
      tooltip: "Deploy & Share",
    },
  ];

  const getCircularPosition = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };


  return (
    <TooltipProvider>
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[9999] settings-menu-container flex flex-col gap-4 items-center">
        {/* Main Settings Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: isMenuExpanded ? 180 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              className="relative p-3 cursor-pointer rounded-full shadow-lg transition-all duration-300"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.textPrimary,
                boxShadow: `0 4px 16px ${themeColors.primaryGlow}`,
              }}
            >
              <Settings size={20} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-black border border-gray-200 shadow-lg z-[9999]">
            <p>Settings Menu</p>
          </TooltipContent>
        </Tooltip>

        {/* Preview Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => dispatch(setPreviewMode(!previewMode))}
              className="relative p-3 cursor-pointer rounded-full shadow-lg transition-all duration-300"
              style={{
                backgroundColor: previewMode ? "#10b981" : themeColors.bgCard, // Green when active
                color: previewMode ? "#ffffff" : themeColors.textPrimary,
                boxShadow: `0 4px 16px ${themeColors.primaryGlow}`,
                border: `1px solid ${themeColors.borderLight}`
              }}
            >
              {previewMode ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-black border border-gray-200 shadow-lg z-[9999]">
            <p>{previewMode ? "Exit Preview" : "Preview Mode"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Expanded Menu - Semi-circle Layout */}
        <AnimatePresence>
          {isMenuExpanded && (
            <div className="absolute left-0 top-0">
              {/* Menu Items */}
              {menuItems.map((item, index) => {
                const position = getCircularPosition(item.angle);
                const IconComponent = item.icon;

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <motion.button
                        initial={{
                          scale: 0,
                          x: 0,
                          y: 0,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          x: position.x,
                          y: position.y,
                          opacity: 1,
                        }}
                        exit={{
                          scale: 0,
                          x: 0,
                          y: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: item.delay,
                          ease: "backOut",
                        }}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={item.onClick}
                        className="absolute p-3 cursor-pointer rounded-full shadow-lg transition-all duration-200"
                        style={{
                          backgroundColor: "#ffffff",
                          color: "#000000",
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                          left: "12px",
                          top: "12px",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <IconComponent size={18} />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black border border-gray-200 shadow-lg z-[9999]">
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default SettingsMenu;

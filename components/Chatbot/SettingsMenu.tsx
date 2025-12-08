import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Palette,
  Type,
  Layout,
  Search,
  Rocket,
  PlusCircle,
  Sparkles,
  X
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
  onShowAddSection?: () => void; // New prop
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
  onShowAddSection,
}: SettingsMenuProps) => {

  const { previewMode, currentlyEditing } = useSelector((state: RootState) => state.editMode);
  const dispatch = useDispatch();

  const menuItems = [
    {
      icon: Palette,
      label: "Theme",
      onClick: () => {
        setIsMenuExpanded(false);
        onShowThemeOptions();
      },
      color: "#3b82f6", // Blue
    },
    {
      icon: Type,
      label: "Typography",
      onClick: () => {
        setIsMenuExpanded(false);
        onShowFontOptions();
      },
      color: "#8b5cf6", // Violet
    },
    {
      icon: PlusCircle,
      label: "Add Section",
      onClick: () => {
        setIsMenuExpanded(false);
        if (onShowAddSection) onShowAddSection();
      },
      color: "#10b981", // Emerald
    },
    {
      icon: Layout,
      label: "Reorder",
      onClick: () => {
        setIsMenuExpanded(false);
        onShowSectionReorder();
      },
      color: "#f59e0b", // Amber
    },
    {
      icon: Search,
      label: "SEO",
      onClick: () => {
        setIsMenuExpanded(false);
        onShowSEOSettings();
      },
      color: "#ec4899", // Pink
    },
    {
      icon: Rocket,
      label: "Deploy",
      onClick: () => {
        setIsMenuExpanded(false);
        onShowDeploy();
      },
      color: "#ef4444", // Red
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (currentlyEditing) return null;

  return (
    <TooltipProvider>
      <div className="settings-menu-container fixed left-6 bottom-6 z-[100000] flex flex-col items-start gap-4">

        {/* Expanded Menu */}
        <AnimatePresence>
          {isMenuExpanded && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-2 flex flex-col gap-2"
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md border text-left group"
                  style={{
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderColor: themeColors.primary || '#10b981',
                  }}
                >
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Controls Row */}
        <div className="flex items-center gap-3">
          {/* Studio Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            className="flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 border border-white/10"
            style={{
              background: `linear-gradient(135deg, #10b981, #059669)`,
              color: "#ffffff",
              boxShadow: `0 8px 32px rgba(16, 185, 129, 0.4)`,
            }}
          >
            {isMenuExpanded ? (
              <X size={20} />
            ) : (
              <Sparkles size={20} className="animate-pulse" />
            )}
            <span className="font-bold tracking-wide">
              {isMenuExpanded ? "Close" : "Customize"}
            </span>
          </motion.button>

          {/* Preview Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(setPreviewMode(!previewMode))}
                className="p-3 rounded-full shadow-xl border border-white/10 backdrop-blur-md"
                style={{
                  backgroundColor: previewMode ? "#ef4444" : "#10b981", // Red when active (to exit), Green when inactive
                  color: "#ffffff",
                  boxShadow: `0 4px 16px rgba(16, 185, 129, 0.4)`,
                }}
              >
                {previewMode ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{previewMode ? "Exit Preview" : "Preview Mode"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

      </div>
    </TooltipProvider>
  );
};

export default SettingsMenu;

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, X, Search, Code } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import SEOSettings from "./SEOSettings";

interface AdvancedSettingsProps {
  portfolioData: any;
  portfolioId: string;
  onClose: () => void;
  themeColors: any;
}

const AdvancedSettings = ({
  portfolioData,
  portfolioId,
  onClose,
  themeColors,
}: AdvancedSettingsProps) => {
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [showCSSOptions, setShowCSSOptions] = useState(false);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };



  if (showSEOSettings) {
    return (
      <SEOSettings
        portfolioData={portfolioData}
        portfolioId={portfolioId}
        onClose={() => setShowSEOSettings(false)}
        themeColors={themeColors}
      />
    );
  }

  if (showCSSOptions) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <h4
            className="font-bold text-lg"
            style={{ color: themeColors.textPrimary }}
          >
            Custom CSS
          </h4>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowCSSOptions(false)}
            className="ml-auto p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
            style={{ color: themeColors.textPrimary }}
          >
            <X size={18} className="cursor-pointer" />
          </motion.button>
        </div>

        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: themeColors.bgCard }}
        >
          <p
            className="text-sm mb-4"
            style={{ color: themeColors.textSecondary }}
          >
            Custom CSS functionality has been removed from this version.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <h4
          className="font-bold text-lg"
          style={{ color: themeColors.textPrimary }}
        >
          Advanced Settings
        </h4>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onClose}
          className="ml-auto p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
          style={{ color: themeColors.textPrimary }}
        >
          <X size={18} className="cursor-pointer" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowSEOSettings(true)}
          className="p-4 rounded-lg border transition-colors flex items-center gap-3"
          style={{
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
            color: themeColors.textPrimary,
          }}
        >
          <Search size={20} />
          <div className="text-left">
            <h5
              className="font-medium"
              style={{ color: themeColors.textPrimary }}
            >
              SEO Settings
            </h5>
            <p
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              Configure page title and meta description
            </p>
          </div>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowCSSOptions(true)}
          className="p-4 rounded-lg border transition-colors flex items-center gap-3"
          style={{
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
            color: themeColors.textPrimary,
          }}
        >
          <Code size={20} />
          <div className="text-left">
            <h5
              className="font-medium"
              style={{ color: themeColors.textPrimary }}
            >
              Custom CSS
            </h5>
            <p
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              Add custom styles to your portfolio (Disabled)
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default AdvancedSettings; 
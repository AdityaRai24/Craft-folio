import { motion } from "framer-motion";
import { Rocket, Twitter, Linkedin, Facebook, Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeployShareProps {
  user: any;
  portfolioLink: string;
  themeColors: any;
  onDeployClick: () => void;
}

const DeployShare = ({
  user,
  portfolioLink,
  themeColors,
  onDeployClick,
}: DeployShareProps) => {
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

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

  return (
    <div className="grid grid-cols-2 gap-2">
      {user && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onDeployClick}
          className="text-sm py-2 cursor-pointer px-3 text-center rounded-lg border transition-colors flex items-center justify-center gap-2 col-span-2"
          style={{
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
            color: themeColors.textPrimary,
          }}
        >
          <Rocket size={16} />
          {portfolioLink ? "Already Deployed" : "Deploy Portfolio"}
        </motion.button>
      )}
      {portfolioLink && (
        <div className="flex flex-col gap-2 mt-2">
          <p
            className="text-sm font-medium text-center"
            style={{ color: themeColors.textSecondary }}
          >
            Share your portfolio:
          </p>
          <div className="flex justify-center gap-2">
            <motion.button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: themeColors.bgCard,
                color: themeColors.textPrimary,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-5 w-5" />
            </motion.button>
            <motion.button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: themeColors.bgCard,
                color: themeColors.textPrimary,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-5 w-5" />
            </motion.button>
            <motion.button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: themeColors.bgCard,
                color: themeColors.textPrimary,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-5 w-5" />
            </motion.button>
            <motion.button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: themeColors.bgCard,
                color: themeColors.textPrimary,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyUrl}
            >
              <Link2 className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeployShare; 
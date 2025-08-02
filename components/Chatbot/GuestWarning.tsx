import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

interface GuestWarningProps {
  user: any;
  themeColors: any;
}

const GuestWarning = ({ user, themeColors }: GuestWarningProps) => {
  const pathname = usePathname();
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  if (user) return null;

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: themeColors.bgCard }}
      >
        <h5
          className="font-semibold mb-2"
          style={{ color: themeColors.primary }}
        >
          Login to Access Premium Features
        </h5>
        <ul
          className="text-sm space-y-2"
          style={{ color: themeColors.textSecondary }}
        >
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Multiple theme options and customization
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Custom subdomain deployment
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Advanced SEO optimization
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Full chatbot functionality
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Section reordering and management
          </li>
        </ul>
        <SignInButton
          mode="modal"
          fallbackRedirectUrl={pathname}
          signUpFallbackRedirectUrl={pathname}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full mt-4 text-sm py-2 px-4 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: themeColors.primary,
              color: themeColors.textPrimary,
              boxShadow: `0 4px 14px ${themeColors.primaryGlow}`,
            }}
          >
            Sign In to Unlock Features
          </motion.button>
        </SignInButton>
      </div>
    </div>
  );
};

export default GuestWarning; 
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
          Deploy Your Portfolio
        </h5>
        <div
          className="text-sm mb-4"
          style={{ color: themeColors.textSecondary }}
        >
          <p className="mb-2">
            You are currently in <strong>Guest Mode</strong>. While you can customize your portfolio freely, you need to sign in to:
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span>Deploy your portfolio to a live URL</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span>Claim a custom subdomain</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span>Save your progress permanently</span>
            </li>
          </ul>
        </div>
        <SignInButton
          mode="modal"
          fallbackRedirectUrl={pathname}
          signUpFallbackRedirectUrl={pathname}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full text-sm py-2 px-4 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: themeColors.primary,
              color: themeColors.textPrimary,
              boxShadow: `0 4px 14px ${themeColors.primaryGlow}`,
            }}
          >
            Sign In to Deploy
          </motion.button>
        </SignInButton>
      </div>
    </div>
  );
};

export default GuestWarning;
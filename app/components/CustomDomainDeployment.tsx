import React, { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Rocket } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { deployPortfolio } from "@/app/actions/portfolio";
import toast from "react-hot-toast";

interface CustomDomainDeploymentProps {
  userId: string;
  portfolioId: string;
  onDeploySuccess: (url: string) => void;
}

const CustomDomainDeployment: React.FC<CustomDomainDeploymentProps> = ({
  userId,
  portfolioId,
  onDeploySuccess,
}) => {
  const [customDomain, setCustomDomain] = useState("");
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [showDomainInstructions, setShowDomainInstructions] = useState(false);
  const [domainCheckStatus, setDomainCheckStatus] = useState<'idle' | 'checking' | 'failed'>('idle');
  const [isDomainConnected, setIsDomainConnected] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDomainConnection = async () => {
    if (!customDomain) {
      toast.error("Please enter a domain name");
      return;
    }

    // Basic domain validation
    if (!customDomain.includes('.') || customDomain.length < 3) {
      toast.error("Please enter a valid domain name (e.g., yourdomain.com)");
      return;
    }

    try {
      setIsCheckingDomain(true);
      setDomainCheckStatus('checking');
      
      const result = await deployPortfolio(
        userId,
        portfolioId,
        customDomain,
        false,
        true
      );

      if (result.success) {
        setShowDomainInstructions(true);
        setIsDomainConnected(true);
        setDomainCheckStatus('idle');
        toast.success("Domain connected successfully! Please configure your DNS settings.");
      } else {
        setDomainCheckStatus('failed');
        const errorMessage = result.error || "Failed to connect domain";
        if (errorMessage.includes("already exists")) {
          toast.error("This domain is already connected to another portfolio.");
        } else if (errorMessage.includes("invalid")) {
          toast.error("Invalid domain format. Please enter a valid domain name.");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error connecting domain:", error);
      setDomainCheckStatus('failed');
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleDomainCheck = async () => {
    try {
      setDomainCheckStatus('checking');
      
      const result = await deployPortfolio(
        userId,
        portfolioId,
        customDomain,
        false,
        true
      );

      if (result.success) {
        setDomainCheckStatus('idle');
        toast.success("Domain configuration verified! Your portfolio is now live.");
      } else {
        setDomainCheckStatus('failed');
        const errorMessage = result.error || "Domain configuration failed";
        if (errorMessage.includes("DNS")) {
          toast.error("DNS configuration not found. Please check your DNS settings and try again.");
        } else if (errorMessage.includes("propagation")) {
          toast.error("DNS propagation in progress. Please wait a few minutes and try again.");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error checking domain:", error);
      setDomainCheckStatus('failed');
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      const result = await deployPortfolio(
        userId,
        portfolioId,
        customDomain,
        false,
        true
      );

      if (result.success && result.data) {
        onDeploySuccess(result.data.url);
        toast.success("Portfolio deployed successfully!");
      } else {
        const errorMessage = result.error || "Failed to deploy portfolio";
        if (errorMessage.includes("DNS")) {
          toast.error("DNS configuration not found. Please configure your DNS settings first.");
        } else if (errorMessage.includes("propagation")) {
          toast.error("DNS propagation in progress. Please wait a few minutes and try again.");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: "rgba(234, 179, 8, 0.1)",
          borderColor: "rgba(234, 179, 8, 0.2)",
        }}
      >
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-400 mb-1">
              Recommended Option
            </h4>
            <p
              className="text-sm"
              style={{ color: ColorTheme.textSecondary }}
            >
              Connect your own custom domain for a professional look. This option is recommended for serious portfolio owners who want complete control over their domain.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: ColorTheme.textPrimary }}
        >
          Enter your custom domain
        </label>
        <div className="relative border mb-4 border-[rgba(75,85,99,0.3)] rounded-lg overflow-hidden">
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="yourdomain.com"
            className="w-full px-4 py-2 bg-[rgba(28,28,30,0.9)] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none transition-colors"
          />
        </div>
      </div>

      <motion.button
        onClick={handleDomainConnection}
        disabled={isCheckingDomain}
        className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
        style={{
          backgroundColor: isCheckingDomain ? ColorTheme.bgCard : ColorTheme.primary,
          color: isCheckingDomain ? ColorTheme.textSecondary : "#000",
          boxShadow: isCheckingDomain ? "none" : `0 4px 10px ${ColorTheme.primaryGlow}`,
        }}
        whileHover={{
          boxShadow: isCheckingDomain ? "none" : `0 6px 14px ${ColorTheme.primaryGlow}`,
          scale: isCheckingDomain ? 1 : 1.02,
        }}
        whileTap={{ scale: isCheckingDomain ? 1 : 0.98 }}
      >
        {isCheckingDomain ? (
          <>
            <div className="animate-spin">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            Connecting Domain...
          </>
        ) : (
          "Connect Domain"
        )}
      </motion.button>

      {showDomainInstructions && (
        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-lg border" style={{ borderColor: "rgba(75, 85, 99, 0.3)" }}>
            <h4 className="font-medium mb-3" style={{ color: ColorTheme.textPrimary }}>
              Domain Configuration Instructions
            </h4>
            <div className="space-y-4" style={{ color: ColorTheme.textSecondary }}>
              <div>
                <p className="font-medium mb-2">1. Add CNAME Records</p>
                <div className="space-y-3">
                  <div className="bg-[rgba(28,28,30,0.9)] p-4 rounded-lg border border-[rgba(75,85,99,0.3)]">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Type</p>
                        <div className="bg-[rgba(75,85,99,0.2)] px-3 py-2 rounded">CNAME</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Name</p>
                        <div className="bg-[rgba(75,85,99,0.2)] px-3 py-2 rounded">@</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Value</p>
                        <div className="bg-[rgba(75,85,99,0.2)] px-3 py-2 rounded">craftfolio.live</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[rgba(28,28,30,0.9)] p-4 rounded-lg border border-[rgba(75,85,99,0.3)]">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Type</p>
                        <div className="bg-[rgba(75,85,99,0.2)] px-3 py-2 rounded">CNAME</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Name</p>
                        <div className="bg-[rgba(75,85,99,0.2)] px-3 py-2 rounded">www</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Value</p>
                        <div className="bg-[rgba(75,85,99,0.2)] px-3 py-2 rounded">craftfolio.live</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">2. General Instructions</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Log in to your domain provider's website (e.g., GoDaddy, Namecheap, etc.)</li>
                  <li>Navigate to the DNS management section</li>
                  <li>Add the CNAME records as shown above</li>
                  <li>Wait for DNS propagation (can take up to 48 hours)</li>
                  <li>Click the "Check Again" button below after adding the records</li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">3. Common Domain Providers</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>GoDaddy: Go to DNS Management → Add Record</li>
                  <li>Namecheap: Go to Domain List → Manage → Advanced DNS</li>
                  <li>Google Domains: Go to DNS → Custom Records</li>
                  <li>Cloudflare: Go to DNS → Add Record</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: "rgba(75, 85, 99, 0.3)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {domainCheckStatus === 'checking' ? (
                  <>
                    <div className="animate-spin">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                    <p style={{ color: ColorTheme.textPrimary }}>Checking domain configuration...</p>
                  </>
                ) : domainCheckStatus === 'failed' ? (
                  <>
                    <div className="text-red-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: ColorTheme.textPrimary }}>Domain not configured correctly</p>
                  </>
                ) : null}
              </div>
              <motion.button
                onClick={handleDomainCheck}
                disabled={domainCheckStatus === 'checking'}
                className="px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: domainCheckStatus === 'checking' ? ColorTheme.bgCard : ColorTheme.primary,
                  color: domainCheckStatus === 'checking' ? ColorTheme.textSecondary : "#000",
                  boxShadow: domainCheckStatus === 'checking' ? "none" : `0 4px 10px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{
                  boxShadow: domainCheckStatus === 'checking' ? "none" : `0 6px 14px ${ColorTheme.primaryGlow}`,
                  scale: domainCheckStatus === 'checking' ? 1 : 1.02,
                }}
                whileTap={{ scale: domainCheckStatus === 'checking' ? 1 : 0.98 }}
              >
                {domainCheckStatus === 'checking' ? (
                  <>
                    <div className="animate-spin">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                    Checking...
                  </>
                ) : (
                  "Check Again"
                )}
              </motion.button>
            </div>
          </div>

          {isDomainConnected && (
            <motion.button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: isDeploying ? ColorTheme.bgCard : ColorTheme.primary,
                color: isDeploying ? ColorTheme.textSecondary : "#000",
                boxShadow: isDeploying ? "none" : `0 4px 10px ${ColorTheme.primaryGlow}`,
              }}
              whileHover={{
                boxShadow: isDeploying ? "none" : `0 6px 14px ${ColorTheme.primaryGlow}`,
                scale: isDeploying ? 1 : 1.02,
              }}
              whileTap={{ scale: isDeploying ? 1 : 0.98 }}
            >
              {isDeploying ? (
                <>
                  <div className="animate-spin">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Deploy Portfolio
                </>
              )}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDomainDeployment; 
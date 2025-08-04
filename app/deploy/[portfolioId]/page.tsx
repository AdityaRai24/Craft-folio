"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Rocket,
  Crown,
  CheckCircle,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  UserPlus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ColorTheme } from "@/lib/colorThemes";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { deployPortfolio, checkUserSubdomain, getThemeNameApi } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import MainNavbar from "@/components/MainNavbar";
import BgShapes from "@/components/BgShapes";
import CustomDomainDeployment from "../../components/CustomDomainDeployment";

interface DeploymentInfo {
  url: string;
  type: 'slug' | 'subdomain' | 'custom';
}

const DeployPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const portfolioId = params.portfolioId as string;
  const { user } = useUser();
  const [portfolioSlug, setPortfolioSlug] = useState("");
  const [portfolioSubdomain, setPortfolioSubdomain] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [activeTab, setActiveTab] = useState("slug");
  const [isDeploying, setIsDeploying] = useState(false);
  const [existingDeployments, setExistingDeployments] = useState<DeploymentInfo[]>([]);
  const [isLoadingDeployments, setIsLoadingDeployments] = useState(true);

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'custom') {
      setActiveTab('custom');
    }
  }, [searchParams]);

  useEffect(() => {
    const checkExistingDeployments = async () => {
      if (!user || !portfolioId) return;
      
      try {
        setIsLoadingDeployments(true);
        const result = await getThemeNameApi({ portfolioId });
        
        if (result.success && result.data?.PortfolioLink) {
          const deployments: DeploymentInfo[] = [];
          
          if (result.data.PortfolioLink.slug) {
            deployments.push({
              url: `https://craftfolio.live/p/${result.data.PortfolioLink.slug}`,
              type: 'slug'
            });
          }
          
          if (result.data.PortfolioLink.subdomain) {
            deployments.push({
              url: `https://${result.data.PortfolioLink.subdomain}.craftfolio.live`,
              type: 'subdomain'
            });
          }
          
          if (result.data.PortfolioLink.custom_domain) {
            deployments.push({
              url: `https://${result.data.PortfolioLink.custom_domain}`,
              type: 'custom'
            });
          }
          
          setExistingDeployments(deployments);
        }
      } catch (error) {
        console.error("Error checking deployments:", error);
        toast.error("Failed to load deployment information. Please refresh the page.");
      } finally {
        setIsLoadingDeployments(false);
      }
    };

    checkExistingDeployments();
  }, [user, portfolioId]);

  const getExistingDeployment = (type: 'slug' | 'subdomain' | 'custom') => {
    return existingDeployments.find(d => d.type === type);
  };

  const validatePortfolioSlug = (slug: string) => {
    if (slug.length < 3 || slug.length > 30) {
      toast.error("Portfolio slug must be between 3 and 30 characters");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error(
        "Portfolio slug can only contain lowercase letters, numbers, and hyphens"
      );
      return false;
    }
    if (slug.startsWith("-") || slug.endsWith("-")) {
      toast.error("Portfolio slug cannot start or end with a hyphen");
      return false;
    }
    return true;
  };

  const validateSubdomain = (subdomain: string) => {
    if (subdomain.length < 3 || subdomain.length > 30) {
      toast.error("Subdomain must be between 3 and 30 characters");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      toast.error(
        "Subdomain can only contain lowercase letters, numbers, and hyphens"
      );
      return false;
    }
    if (subdomain.startsWith("-") || subdomain.endsWith("-")) {
      toast.error("Subdomain cannot start or end with a hyphen");
      return false;
    }
    return true;
  };

  const handleDeploy = async () => {
    if (!user) {
      toast.error("Please sign in to deploy your portfolio");
      return;
    }

    const isSubdomain = activeTab === "subdomain";
    const value = isSubdomain ? portfolioSubdomain : portfolioSlug;

    if (!value) {
      toast.error(
        `Please enter a ${isSubdomain ? "subdomain" : "portfolio slug"}`
      );
      return;
    }

    if (isSubdomain && !validateSubdomain(value)) {
      return;
    } else if (!isSubdomain && !validatePortfolioSlug(value)) {
      return;
    }

    // Check for existing subdomain deployment if user is trying to deploy with subdomain
    if (isSubdomain) {
      try {
        setIsDeploying(true);
        const result = await checkUserSubdomain(user.id);
        if (!result.success) {
          toast.error("Failed to verify subdomain availability. Please try again.");
          return;
        }

        if (result.isPremium) {
          if (result.hasSubdomain) {
            toast.error(
              `You have reached the maximum limit of 10 subdomains for premium users. Please remove an existing subdomain first.`
            );
            return;
          }
          toast.success(
            `Premium user: ${
              10 - (result.currentCount || 0)
            } subdomains remaining.`
          );
        } else {
          if (result.hasSubdomain) {
            toast.error(
              "You have already deployed a portfolio with a subdomain. Free users can only have one subdomain deployment. Upgrade to premium to create up to 10 subdomains!"
            );
            return;
          }
        }
      } catch (error) {
        console.error("Error checking subdomain:", error);
        toast.error("Failed to verify subdomain availability. Please check your connection and try again.");
        return;
      } finally {
        setIsDeploying(false);
      }
    }

    setIsDeploying(true);

    try {
      const result = await deployPortfolio(
        user.id,
        portfolioId,
        value,
        isSubdomain
      );
      if (result.success && result.data) {
        setIsDeployed(true);
        setDeployedUrl(result.data.url);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
        toast.success("Portfolio deployed successfully!");
      } else {
        const errorMessage = result.error || "Failed to deploy portfolio";
        if (errorMessage.includes("already exists")) {
          toast.error("This slug/subdomain is already taken. Please choose a different one.");
        } else if (errorMessage.includes("invalid")) {
          toast.error("Invalid slug/subdomain format. Please check the requirements.");
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

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Portfolio URL copied to clipboard!");
  };

  const handleShare = (platform: string, url: string) => {
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

  if (isDeployed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: ColorTheme.bgMain }}
      >
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${ColorTheme.primary}20` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <CheckCircle
              className="w-8 h-8"
              style={{ color: ColorTheme.primary }}
            />
          </motion.div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: ColorTheme.textPrimary }}
          >
            Portfolio Deployed Successfully!
          </h3>
          <p className="mb-6" style={{ color: ColorTheme.textSecondary }}>
            Your portfolio is now live and accessible at:
            <br />
            <motion.a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] font-medium hover:underline inline-block mt-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {deployedUrl}
            </motion.a>
          </p>

          <motion.button
            className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer mb-6"
            style={{
              backgroundColor: ColorTheme.primary,
              color: "#000",
              boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
            }}
            whileHover={{
              boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (deployedUrl) {
                window.open(deployedUrl, "_blank");
              }
            }}
          >
            <Rocket className="h-4 w-4" />
            Visit Portfolio
          </motion.button>

          <div>
            <p
              className="text-sm font-medium mb-4"
              style={{ color: ColorTheme.textSecondary }}
            >
              Share your portfolio:
            </p>
            <div className="flex justify-center gap-2">
              <motion.button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  color: ColorTheme.textPrimary,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare("twitter", deployedUrl)}
              >
                <Twitter className="h-5 w-5" />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  color: ColorTheme.textPrimary,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare("linkedin", deployedUrl)}
              >
                <Linkedin className="h-5 w-5" />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  color: ColorTheme.textPrimary,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare("facebook", deployedUrl)}
              >
                <Facebook className="h-5 w-5" />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  color: ColorTheme.textPrimary,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopyUrl(deployedUrl)}
              >
                <Link2 className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className=" main-bg-noise  relative">
      <MainNavbar />

      <BgShapes />
      <div
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 50%)`,
        }}
      >
        <div className="container min-h-screen mx-auto max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl pt-16 sm:pt-20 md:pt-24 px-2 sm:px-4 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: ColorTheme.textPrimary }}
            >
              Deploy Your Portfolio
            </h2>

            <Tabs
              defaultValue="slug"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                className="w-full grid grid-cols-3 mb-6 h-full border rounded-lg "
                style={{
                  backgroundColor: ColorTheme.bgNav,
                  borderColor: "rgba(75, 85, 99, 0.3)",
                }}
              >
                <TabsTrigger
                  value="slug"
                  className="data-[state=active]:bg-gray-700 rounded-l-lg cursor-pointer py-3"
                  style={{
                    color: ColorTheme.textPrimary,
                    borderRight: "1px solid rgba(75, 85, 99, 0.3)",
                  }}
                >
                  Slug Deployment
                </TabsTrigger>
                <TabsTrigger
                  value="subdomain"
                  className="data-[state=active]:bg-gray-700 cursor-pointer py-4"
                  style={{
                    color: ColorTheme.textPrimary,
                    borderRight: "1px solid rgba(75, 85, 99, 0.3)",
                  }}
                >
                  Subdomain
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="data-[state=active]:bg-gray-700 rounded-r-lg cursor-pointer py-4"
                  style={{
                    color: ColorTheme.textPrimary,
                  }}
                >
                  <span className="flex items-center gap-2">
                    Custom Domain
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="slug">
                {isLoadingDeployments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  </div>
                ) : getExistingDeployment('slug') ? (
                  <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(75, 85, 99, 0.3)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>
                        Portfolio Already Deployed
                      </h3>
                    </div>
                    <p className="mb-4" style={{ color: ColorTheme.textSecondary }}>
                      Your portfolio is already deployed at:
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <code className="px-3 py-2 rounded bg-[rgba(28,28,30,0.9)]" style={{ color: ColorTheme.textPrimary }}>
                        {getExistingDeployment('slug')?.url}
                      </code>
                      <motion.button
                        onClick={() => handleCopyUrl(getExistingDeployment('slug')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link2 className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleShare("twitter", getExistingDeployment('slug')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Twitter className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare("linkedin", getExistingDeployment('slug')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare("facebook", getExistingDeployment('slug')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Facebook className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: ColorTheme.textPrimary }}
                      >
                        Choose your portfolio slug
                      </label>
                      <div className="relative mb-4 border border-[rgba(75,85,99,0.3)] rounded-lg overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full flex items-center px-4"
                          style={{
                            color: ColorTheme.primary,
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                          }}
                        >
                          craftfolio.live/p/
                        </div>
                        <input
                          type="text"
                          value={portfolioSlug}
                          onChange={(e) => setPortfolioSlug(e.target.value)}
                          placeholder="your-portfolio-slug"
                          className="w-full pl-[200px] pr-4 py-2 bg-[rgba(28,28,30,0.9)] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none transition-colors"
                        />
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: ColorTheme.textSecondary }}
                      >
                        Your portfolio will be available at:
                        https://craftfolio.live/p/
                        {portfolioSlug || "your-portfolio-slug"}
                      </p>
                      <div
                        className="text-xs space-y-1 my-2"
                        style={{ color: ColorTheme.textSecondary }}
                      >
                        <p className="font-medium">
                          Portfolio slug requirements:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li>
                            Use only lowercase letters, numbers, and hyphens
                          </li>
                          <li>Must be between 3-30 characters</li>
                          <li>Cannot start or end with a hyphen</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="subdomain">
                {isLoadingDeployments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  </div>
                ) : getExistingDeployment('subdomain') ? (
                  <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(75, 85, 99, 0.3)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>
                        Subdomain Already Deployed
                      </h3>
                    </div>
                    <p className="mb-4" style={{ color: ColorTheme.textSecondary }}>
                      Your portfolio is already deployed at:
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <code className="px-3 py-2 rounded bg-[rgba(28,28,30,0.9)]" style={{ color: ColorTheme.textPrimary }}>
                        {getExistingDeployment('subdomain')?.url}
                      </code>
                      <motion.button
                        onClick={() => handleCopyUrl(getExistingDeployment('subdomain')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link2 className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleShare("twitter", getExistingDeployment('subdomain')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Twitter className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare("linkedin", getExistingDeployment('subdomain')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare("facebook", getExistingDeployment('subdomain')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Facebook className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: ColorTheme.textPrimary }}
                      >
                        Choose your subdomain
                      </label>
                      <div className="relative mb-4 border border-[rgba(75,85,99,0.3)] rounded-lg overflow-hidden">
                        <div
                          className="absolute right-0 top-0 h-full flex items-center px-4"
                          style={{
                            color: ColorTheme.primary,
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                          }}
                        >
                          .craftfolio.live
                        </div>
                        <input
                          type="text"
                          value={portfolioSubdomain}
                          onChange={(e) => setPortfolioSubdomain(e.target.value)}
                          placeholder="your-name"
                          className="w-full pr-[180px] pl-4 py-2 bg-[rgba(28,28,30,0.9)] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none transition-colors"
                        />
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: ColorTheme.textSecondary }}
                      >
                        Your portfolio will be available at: https://
                        {portfolioSubdomain || "your-name"}.craftfolio.live
                      </p>
                      <div
                        className="text-xs space-y-1 my-2"
                        style={{ color: ColorTheme.textSecondary }}
                      >
                        <p className="font-medium">Subdomain requirements:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li>
                            Use only lowercase letters, numbers, and hyphens
                          </li>
                          <li>Must be between 3-30 characters</li>
                          <li>Cannot start or end with a hyphen</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom">
                {isLoadingDeployments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  </div>
                ) : getExistingDeployment('custom') ? (
                  <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(75, 85, 99, 0.3)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>
                        Custom Domain Already Connected
                      </h3>
                    </div>
                    <p className="mb-4" style={{ color: ColorTheme.textSecondary }}>
                      Your portfolio is already deployed at:
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <code className="px-3 py-2 rounded bg-[rgba(28,28,30,0.9)]" style={{ color: ColorTheme.textPrimary }}>
                        {getExistingDeployment('custom')?.url}
                      </code>
                      <motion.button
                        onClick={() => handleCopyUrl(getExistingDeployment('custom')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link2 className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleShare("twitter", getExistingDeployment('custom')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Twitter className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare("linkedin", getExistingDeployment('custom')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare("facebook", getExistingDeployment('custom')?.url || '')}
                        className="p-2 rounded-lg hover:bg-[rgba(28,28,30,0.9)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Facebook className="w-4 h-4" style={{ color: ColorTheme.textPrimary }} />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <CustomDomainDeployment
                    userId={user?.id || ""}
                    portfolioId={portfolioId}
                    onDeploySuccess={(url: string) => {
                      setIsDeployed(true);
                      setDeployedUrl(url);
                      setShowConfetti(true);
                      setTimeout(() => {
                        setShowConfetti(false);
                      }, 5000);
                    }}
                  />
                )}
              </TabsContent>
            </Tabs>

            {activeTab !== "custom" && !getExistingDeployment(activeTab as 'slug' | 'subdomain' | 'custom') && (
              user ? (
                <motion.button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer mt-6"
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
              ) : (
                <div className="mt-6 p-4 rounded-lg border" style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderColor: 'rgba(16, 185, 129, 0.2)' 
                }}>
                  <div className="flex items-start gap-3">
                    <UserPlus className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-400 mb-1">Sign Up to Deploy</h4>
                      <p className="text-sm mb-3" style={{ color: ColorTheme.textSecondary }}>
                        Create a free account to deploy your portfolio and get access to all features including custom domains, analytics, and more.
                      </p>
                      <SignInButton mode="modal">
                        <motion.button
                          className="px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
                          style={{
                            backgroundColor: ColorTheme.primary,
                            color: "#000",
                            boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                          }}
                          whileHover={{
                            boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                            scale: 1.02,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <UserPlus className="h-4 w-4" />
                          Sign Up to Deploy
                        </motion.button>
                      </SignInButton>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployPage;

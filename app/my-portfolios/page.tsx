"use client";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchPortfoliosByUserId } from "../actions/portfolio";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/Shared/MainNavbar";
import LoadingSpinner, { LoadingMessage } from "@/components/Shared/LoadingSpinner";
import { Palette, Layout, CheckCircle, Rocket } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DeployModal from "@/components/Modals/DeployModal";
import ExportButton from "@/components/ExportButton";

export default function MyPortfoliosPage() {
  const { user, isLoaded } = useUser();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      fetchPortfoliosByUserId(user.id)
        .then((res) => {
          if (res.success) {
            setPortfolios(res.data || []);
            setError(null);
          } else {
            setError(res.error || "Failed to fetch portfolios");
          }
        })
        .catch(() => setError("Failed to fetch portfolios"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!isLoaded) {
    const myPortfoliosMessages: LoadingMessage[] = [
      { text: "Loading your portfolios", icon: Palette },
      { text: "Fetching data", icon: Layout },
      { text: "Almost there", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={myPortfoliosMessages} />;
  }

  if (!user) {
    return (
      <div className="main-bg-noise">
        <MainNavbar />
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 50%)`,
          }}
          className="flex flex-col items-center justify-center min-h-screen pt-24 w-full px-2 sm:px-4"
        >
          <div
            className="w-full max-w-md p-6 rounded-xl bg-[var(--bg-card)] shadow-lg border"
            style={{ borderColor: "var(--border-light)" }}
          >
            <h1 className="text-2xl font-bold mb-4 text-center">
              My Portfolios
            </h1>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Sign in to view and manage your portfolios
            </p>
            <SignInButton mode="modal" fallbackRedirectUrl="/my-portfolios">
              <motion.button
                className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                style={{
                  backgroundColor: ColorTheme.primary,
                  color: "#000",
                  boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{
                  boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                }}
              >
                <Rocket className="h-5 w-5" />
                Sign in to Continue
              </motion.button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    const myPortfoliosMessages: LoadingMessage[] = [
      { text: "Loading your portfolios", icon: Palette },
      { text: "Fetching data", icon: Layout },
      { text: "Almost there", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={myPortfoliosMessages} />;
  }


  return (
    <div className="main-bg-noise">
      <MainNavbar />
      <div
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 50%)`,
        }}
        className="flex flex-col items-center justify-center min-h-screen pt-24 w-full px-2 sm:px-4"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 text-center font-bold">
          My Portfolios
        </h1>
        {portfolios.length === 0 ? (
          <div className="w-full max-w-md p-6 rounded-xl bg-[var(--bg-card)] shadow-lg border text-center" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-gray-500">No portfolios found. Create your first portfolio to get started!</p>
          </div>
        ) : (
          <ul className="w-full max-w-full sm:max-w-2xl space-y-3 sm:space-y-4">
            {portfolios.map((portfolio) => (
              <li
                key={portfolio.id}
                className="border rounded-xl p-3 sm:p-4 flex justify-between items-center bg-[var(--bg-card)] shadow-sm transition-all duration-200 hover:shadow-lg"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => router.push(`/p/${portfolio.id}`)}
                >
                  <span
                    className="font-semibold text-base sm:text-lg transition-colors"
                    style={{ color: "inherit" }}
                  >
                    Template:{" "}
                    <span className="transition-colors group-hover:text-[var(--primary)]">
                      {portfolio.templateName}
                    </span>
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    Created:{" "}
                    {portfolio.createdAt
                      ? new Date(portfolio.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                  {portfolio.PortfolioLink && (
                    <span className="text-green-500 text-xs sm:text-sm mt-1">
                      Deployed at:{" "}
                      <a
                        href={
                          portfolio.PortfolioLink.subdomain
                            ? `https://${portfolio.PortfolioLink.subdomain}.craftfolio.live`
                            : `https://craftfolio.live/p/${portfolio.PortfolioLink.slug}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {portfolio.PortfolioLink.subdomain
                          ? `${portfolio.PortfolioLink.subdomain}.craftfolio.live`
                          : `craftfolio.live/p/${portfolio.PortfolioLink.slug}`}
                      </a>
                    </span>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <ExportButton
                    portfolioUrl={
                      portfolio.PortfolioLink?.subdomain
                        ? `https://${portfolio.PortfolioLink.subdomain}.craftfolio.live`
                        : portfolio.PortfolioLink?.slug
                          ? `https://craftfolio.live/p/${portfolio.PortfolioLink.slug}`
                          : `https://craftfolio.live/p/${portfolio.id}`
                    }
                  />
                  <motion.button
                    onClick={() => window.open(`/p/${portfolio.id}`, '_blank', 'noopener,noreferrer')}
                    className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-light)",
                    }}
                    whileHover={{
                      backgroundColor: "var(--bg-hover)",
                    }}
                  >
                    <Layout className="h-4 w-4" />
                    Edit
                  </motion.button>
                  {portfolio.PortfolioLink ? (
                    <motion.div
                      className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        color: ColorTheme.primary,
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Deployed
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => {
                        window.open(`/deploy/${portfolio.id}`, '_blank');
                      }}
                      className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: ColorTheme.primary,
                        color: "#000",
                        boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                      }}
                      whileHover={{
                        boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                      }}
                    >
                      <Rocket className="h-4 w-4" />
                      Deploy
                    </motion.button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        portfolioId={selectedPortfolioId}
        portfolioData={portfolios.find((p) => p.id === selectedPortfolioId)}
      />
    </div>
  );
}

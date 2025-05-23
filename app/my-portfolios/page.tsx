"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchPortfoliosByUserId } from "../actions/portfolio";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/MainNavbar";
import LoadingSpinner, { LoadingMessage } from "@/components/LoadingSpinner";
import { Palette, Layout, CheckCircle, Rocket } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DeployModal from "@/components/DeployModal";

export default function MyPortfoliosPage() {
  const { user } = useUser();
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

  if (user === undefined || loading) {
    const myPortfoliosMessages: LoadingMessage[] = [
      { text: "Loading your portfolios", icon: Palette },
      { text: "Fetching data", icon: Layout },
      { text: "Almost there", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={myPortfoliosMessages} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
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
          <div>No portfolios found.</div>
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
                  {portfolio.PortfolioLinks && portfolio.PortfolioLinks.length > 0 && (
                    <span className="text-green-500 text-xs sm:text-sm mt-1">
                      Deployed at:{" "}
                      <a 
                        href={`https://craft-folio-three-vercel.app/p/${portfolio.PortfolioLinks[0].slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        craft-folio-three-vercel.app/p/{portfolio.PortfolioLinks[0].slug}
                      </a>
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  {portfolio.PortfolioLinks && portfolio.PortfolioLinks.length > 0 ? (
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
                        setSelectedPortfolioId(portfolio.id);
                        setIsDeployModalOpen(true);
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
        portfolioData={portfolios.find(p => p.id === selectedPortfolioId)}
      />
    </div>
  );
}

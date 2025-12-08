"use client";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchPortfoliosByUserId, updatePortfolioName } from "../actions/portfolio";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/Shared/MainNavbar";
import LoadingSpinner, { LoadingMessage } from "@/components/Shared/LoadingSpinner";
import { Palette, Layout, CheckCircle, Rocket, ExternalLink, Edit, Globe, Check, X, Pencil } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { motion, AnimatePresence } from "framer-motion";
import DeployModal from "@/components/Modals/DeployModal";
import ExportButton from "@/components/ExportButton";
import { toast } from "react-hot-toast";

export default function MyPortfoliosPage() {
  const { user, isLoaded } = useUser();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("");
  const router = useRouter();

  // Renaming state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const loadPortfolios = () => {
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
  }

  useEffect(() => {
    loadPortfolios();
  }, [user]);

  const startEditing = (portfolio: any) => {
    setEditingId(portfolio.id);
    setNewName(portfolio.name || portfolio.templateName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewName("");
  };

  const saveName = async (portfolioId: string) => {
    if (!newName.trim()) return;

    const toastId = toast.loading("Updating name...");
    try {
      const res = await updatePortfolioName({ portfolioId, name: newName });
      if (res.success) {
        toast.success("Portfolio name updated", { id: toastId });
        setPortfolios(portfolios.map(p => p.id === portfolioId ? { ...p, name: newName } : p));
        setEditingId(null);
      } else {
        toast.error("Failed to update name", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    }
  };

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
        <div className="flex flex-col items-center justify-center min-h-screen pt-24 w-full px-4">
          <div
            className="w-full max-w-md p-8 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border shadow-2xl"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Rocket className="h-8 w-8 text-[var(--primary)]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
              My Portfolios
            </h1>
            <p className="text-gray-500 mb-8 text-center leading-relaxed">
              Sign in to view, manage, and deploy your stunning portfolios.
            </p>
            <SignInButton mode="modal" fallbackRedirectUrl="/my-portfolios">
              <motion.button
                className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 text-white transition-all transform"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryLight})`,
                  boxShadow: `0 8px 16px -4px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{ scale: 1.02, boxShadow: `0 12px 20px -4px ${ColorTheme.primaryGlow}` }}
                whileTap={{ scale: 0.98 }}
              >
                Sign in to Continue
              </motion.button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-black">
        <div className="text-center">
          <p className="text-xl font-semibold">Oops! Something went wrong.</p>
          <p className="mt-2 text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] main-bg-noise selection:bg-primary/20 selection:text-primary">
      <MainNavbar />

      <main className="container mx-auto px-4 pt-32 pb-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              My Portfolios
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 text-lg">Manage and customize your personal websites</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/choose-templates')}
            className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--primary)] transition-all shadow-sm hover:shadow-md"
          >
            <Palette className="w-5 h-5" />
            <span>Create New</span>
          </motion.button>
        </div>

        {portfolios.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mx-auto p-12 rounded-3xl bg-[var(--bg-card)] border border-dashed border-[var(--border-light)] text-center shadow-sm"
          >
            <div className="w-20 h-20 mx-auto bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6">
              <Layout className="w-10 h-10 text-[var(--text-secondary)] opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
            <p className="text-[var(--text-secondary)] mb-8">
              Start by choosing a template and building your dream portfolio.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/choose-templates')}
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg mx-auto flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryLight})`,
                boxShadow: `0 4px 12px ${ColorTheme.primaryGlow}`,
              }}
            >
              Get Started
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {portfolios.map((portfolio, index) => {
                const displayName = portfolio.name || portfolio.templateName;

                return (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex flex-col bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                  >
                    <div className="p-6 flex flex-col h-full">
                      {/* Header with Title and Status */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="flex-1 min-w-0">
                          {editingId === portfolio.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] rounded px-2 py-1 text-lg font-bold focus:outline-none focus:border-[var(--primary)]"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveName(portfolio.id);
                                  if (e.key === 'Escape') cancelEditing();
                                }}
                              />
                              <button onClick={() => saveName(portfolio.id)} className="p-1 hover:text-green-500"><Check className="w-4 h-4" /></button>
                              <button onClick={cancelEditing} className="p-1 hover:text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="group/title flex items-center gap-2">
                              <h3
                                onClick={() => router.push(`/p/${portfolio.id}`)}
                                className="font-bold text-xl cursor-pointer hover:text-[var(--primary)] transition-colors truncate"
                              >
                                {displayName}
                              </h3>
                              <button
                                onClick={() => startEditing(portfolio)}
                                className="opacity-0 group-hover/title:opacity-100 transition-opacity text-[var(--text-secondary)] hover:text-[var(--primary)] p-1"
                                title="Rename Portfolio"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full border border-[var(--border-light)]">
                              {portfolio.templateName}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)]">
                              {portfolio.createdAt ? new Date(portfolio.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>

                        {portfolio.PortfolioLink ? (
                          <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-light)] shrink-0">
                            Draft
                          </div>
                        )}
                      </div>

                      {/* Spacer */}
                      <div className="flex-grow" />

                      {/* Deployment Link */}
                      {portfolio.PortfolioLink ? (
                        <div className="mb-6 p-3 rounded-xl bg-[var(--bg-secondary)]/30 border border-[var(--border-light)] flex items-center justify-between group/link hover:border-[var(--primary)]/30 transition-colors">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <Globe className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
                            <span className="text-sm text-[var(--text-secondary)] truncate font-mono">
                              {portfolio.PortfolioLink.subdomain
                                ? `${portfolio.PortfolioLink.subdomain}.craftfolio.live`
                                : `craftfolio.live/p/${portfolio.PortfolioLink.slug}`}
                            </span>
                          </div>
                          <a
                            href={
                              portfolio.PortfolioLink.subdomain
                                ? `https://${portfolio.PortfolioLink.subdomain}.craftfolio.live`
                                : `https://craftfolio.live/p/${portfolio.PortfolioLink.slug}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <div className="mb-6 p-3 rounded-xl border border-dashed border-[var(--border-light)] flex items-center gap-2.5 text-[var(--text-secondary)]/50 bg-[var(--bg-secondary)]/10">
                          <Globe className="w-4 h-4 opacity-50 flex-shrink-0" />
                          <span className="text-sm italic">Not deployed yet</span>
                        </div>
                      )}


                      {/* Actions Footer */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border-light)]">
                        {portfolio.PortfolioLink ? (
                          <button
                            onClick={() => window.open(`/p/${portfolio.id}`, '_blank')}
                            className="flex-1 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-light)] text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 group/btn"
                          >
                            <Edit className="w-4 h-4 group-hover/btn:text-[var(--primary)] transition-colors" />
                            Edit Site
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedPortfolioId(portfolio.id);
                              setIsDeployModalOpen(true);
                            }}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                              backgroundColor: ColorTheme.primary,
                              boxShadow: `0 4px 12px ${ColorTheme.primaryGlow}`,
                            }}
                          >
                            <Rocket className="w-4 h-4" />
                            Deploy Now
                          </button>
                        )}

                        <div className="flex gap-2">
                          <ExportButton
                            portfolioUrl={
                              portfolio.PortfolioLink?.subdomain
                                ? `https://${portfolio.PortfolioLink.subdomain}.craftfolio.live`
                                : portfolio.PortfolioLink?.slug
                                  ? `https://craftfolio.live/p/${portfolio.PortfolioLink.slug}`
                                  : `https://craftfolio.live/p/${portfolio.id}`
                            }
                            className="p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-light)] text-[var(--text-secondary)] transition-colors"
                            iconOnly={true}
                          />
                          {portfolio.PortfolioLink && (
                            <button
                              onClick={() => {
                                setSelectedPortfolioId(portfolio.id);
                                setIsDeployModalOpen(true);
                              }}
                              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-emerald-500 transition-colors"
                              title="Redeploy / Manage"
                            >
                              <Rocket className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        portfolioId={selectedPortfolioId}
        portfolioData={portfolios.find((p) => p.id === selectedPortfolioId)}
      />
    </div>
  );
}

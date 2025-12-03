"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortfolio, fetchThemesApi } from "../actions/portfolio";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import ThemeCard from "@/components/Shared/ThemeCard";
import { ColorTheme } from "@/lib/colorThemes";
import { fadeIn, staggerContainer } from "@/lib/animations";
import CreateMethodModal from "@/components/Modals/CreateMethodModal";
import LoadingSpinner, { LoadingMessage } from "@/components/Shared/LoadingSpinner";
import MainNavbar from "@/components/Shared/MainNavbar";
import BgShapes from "@/components/Shared/BgShapes";
import { Palette, Layout, CheckCircle, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const PortfolioThemePage = () => {
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMethod, setCreationMethod] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  const [selectedThemeName, setSelectedThemeName] = useState("");

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isSignedIn } = useUser();

  const [themes, setThemes] = useState<any>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchThemes();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchThemes = async () => {
    setIsLoadingThemes(true);
    setError(null);

    try {
      const response = await fetchThemesApi();

      if (response.success) {
        setThemes(response.data);
      } else {
        setError("Failed to fetch themes");
        toast.error("Failed to load themes");
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Network error - check connection");
        toast.error("Network error - please check your connection");
      } else {
        setError("An unexpected error occurred");
        toast.error("Failed to load themes");
      }
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const handleSelectTheme = (id: number, name: string) => {
    setSelectedThemeName(name);
    setSelectedTheme(id);
    setIsModalOpen(true);
  };

  const handleCreatePortfolio = async (customBodyResume: any) => {
    if (selectedTheme && creationMethod) {
      setIsCreating(true);
      try {
        const themeName = themes.find(
          (theme: any) => theme.id === selectedTheme
        )?.name;

        if (!themeName) {
          toast.error("Invalid template");
          return;
        }

        const result = await createPortfolio(
          isSignedIn ? user.id : "guest",
          themeName,
          creationMethod,
          customBodyResume
        );

        if (result.success) {
          const url = `/p/${result?.data?.id}`;
          if (!isSignedIn) {
            const guestIds = JSON.parse(sessionStorage.getItem('guestPortfolioIds') || '[]');
            guestIds.push(result?.data?.id);
            sessionStorage.setItem('guestPortfolioIds', JSON.stringify(guestIds));
          }
          window.open(url, '_blank');
        } else {
          toast.error("Failed to create portfolio");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setIsCreating(false);
        setIsModalOpen(false);
        setSelectedTheme(null);
        setSelectedThemeName("");
      }
    }
  };

  if (isLoadingThemes) {
    const chooseTemplatesMessages: LoadingMessage[] = [
      { text: "Loading themes", icon: Palette },
      { text: "Fetching templates", icon: Layout },
      { text: "Preparing your experience", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={chooseTemplatesMessages} />;
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
        <MainNavbar />
        <BgShapes />
        <div className="container mx-auto max-w-4xl pt-32 px-4 pb-24">
          <div className="text-center p-12 rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <h1 className="text-3xl font-bold mb-4 text-red-500">Error Loading Themes</h1>
            <p className="text-lg mb-8 text-gray-400">
              {error}
            </p>
            <button
              onClick={fetchThemes}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-emerald-500/30">
      <MainNavbar />
      <BgShapes />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <div className="container mx-auto max-w-[95%] pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 pb-16 sm:pb-20 md:pb-24 relative z-10">
        {/* Hero section */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-gray-300">Premium Collection</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            variants={fadeIn}
          >
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Portfolio</span> Theme
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn}
          >
            Choose a theme that reflects your unique style and professional
            identity. Each template is fully customizable to suit your needs.
          </motion.p>
        </motion.div>

        {/* Themes grid */}
        {themes.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {themes?.map((theme: any, index: number) => (
              <motion.div
                key={theme.id}
                className="w-full"
                variants={fadeIn}
                custom={index}
              >
                <ThemeCard
                  theme={theme}
                  handleSelectTheme={() =>
                    handleSelectTheme(theme.id, theme.name)
                  }
                  selectedTheme={selectedTheme}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-6">
              No themes available at the moment.
            </p>
            <button
              onClick={fetchThemes}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      <CreateMethodModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedTheme={selectedThemeName}
        isCreating={isCreating}
        setCreationMethod={setCreationMethod}
        handleCreatePortfolio={handleCreatePortfolio}
        creationMethod={creationMethod}
      />
    </div>
  );
};

export default PortfolioThemePage;
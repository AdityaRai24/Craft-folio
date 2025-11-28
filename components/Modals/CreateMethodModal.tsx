"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, PlusCircle, ArrowRight, ArrowLeft, Upload, Sparkles, Check, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fadeInScale,
  pulseAnimation,
  staggerContainer,
} from "@/lib/animations";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

const CreateMethodModal = ({
  isModalOpen,
  selectedTheme,
  setIsModalOpen,
  isCreating,
  setCreationMethod,
  creationMethod,
  handleCreatePortfolio,
}: {
  isModalOpen: boolean;
  isCreating: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedTheme: string;
  setCreationMethod: (creationMethod: string) => void;
  creationMethod: string;
  handleCreatePortfolio: (customBodyResume: any) => void;
}) => {
  const [showResumeImport, setShowResumeImport] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [base64Data, setBase64Data] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingResume, setProcessingResume] = useState(false);
  const [customBodyResume, setCustomBodyResume] = useState<any>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);

  const portfolioFacts = [
    "Recruiters spend an average of just 6 seconds scanning a resume, but up to 2 minutes on a portfolio website.",
    "Having a portfolio website makes you 65% more likely to be contacted by recruiters.",
    "82% of hiring managers view personal portfolios as important when evaluating candidates.",
    "Portfolios with case studies or detailed project breakdowns receive 3x more engagement.",
    "Professionals with visual portfolios earn up to 30% more than those without.",
    "93% of hiring managers check candidates' online presence before making a decision.",
    "A well-designed portfolio can set you apart from 90% of other applicants.",
    "Adding testimonials to your portfolio increases credibility by 70%.",
    "Portfolios containing video content receive 40% more engagement.",
    "Updating your portfolio regularly can increase your visibility by 50%.",
  ];

  const loadingMessages = [
    "Analyzing your resume...",
    "Extracting your skills and experiences...",
    "Building your portfolio framework...",
    "Organizing your professional journey...",
    "Crafting your digital presence...",
    "Adding the finishing touches...",
    "Polishing your professional narrative...",
    "Almost there! Just a few more seconds...",
    "Your impressive portfolio is coming together...",
    "Final optimizations in progress...",
  ];

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      await handleFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleFile = async (file: File): Promise<void> => {
    if (!file) return;
    setUploadingResume(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          const base64String = reader.result as string;
          setBase64Data(base64String);
          setResumeUploaded(true);
        }, 2000);
        // processPdfData(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.dismiss();
      toast.error("Error processing PDF");
      setUploadingResume(false);
    }
  };

  const handleMethodSelect = (method: string) => {
    setCreationMethod(method);
  };

  const handleButtonClick = () => {
    if (creationMethod === "scratch") {
      toast.loading("Creating your portfolio...");
      handleCreatePortfolio("");
    } else if (creationMethod === "import") {
      setShowResumeImport(true);
    }
  };

  const handleBackButton = () => {
    if (processingResume) {
      toast.dismiss();
      toast.error("Cannot go back while processing");
      return;
    }

    setShowResumeImport(false);
    setResumeUploaded(false);
    setShowPreview(false);
    setBase64Data("");
    setProgressValue(0);
    setCurrentFact(0);
    setCurrentMessage(0);
  };

  async function extractDetails(): Promise<void> {
    if (!base64Data) {
      toast.error("Please upload a resume first");
      return;
    }

    setIsLoading(true);
    toast.dismiss(); // Dismiss any existing toasts
    // Initialize the progress bar
    setProgressValue(0);
    setCurrentFact(0);
    setCurrentMessage(0);

    // Improved progress simulation with separate message and fact intervals
    const progressInterval = setInterval(() => {
      setProgressValue((prev) => {
        // Slower initial progress that speeds up later
        const increment =
          prev < 70 ? Math.random() * 1.5 + 0.8 : Math.random() * 3 + 1.5;
        return prev + increment < 95 ? prev + increment : 95; // Cap at 95% until complete
      });
    }, 1000);

    // Separate interval for facts to make them change at a more readable pace
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % portfolioFacts.length);
    }, 5000);

    // Separate interval for messages to make them change less frequently
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const newIndex = Math.min(
          Math.floor((progressValue / 100) * loadingMessages.length),
          loadingMessages.length - 1
        );
        // Only update if it's a new message
        return newIndex !== prev ? newIndex : prev;
      });
    }, 3000);

    let response;
    try {
      response = await fetch("api/extractreportgemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64: base64Data,
          selectedTheme,
        }),
      });

      // Don't clear intervals yet - let the animation complete

      if (response.ok) {
        const reportText = await response.text();
        setCustomBodyResume(reportText);

        // Animate to 100% smoothly over 2 seconds
        clearInterval(progressInterval);
        clearInterval(factInterval);
        clearInterval(messageInterval);

        // Smooth completion animation
        const completionAnimation = () => {
          setProgressValue((prev) => {
            const newValue = prev + 2;
            if (newValue >= 80) {
              setConfettiActive(true);
            }
            if (newValue >= 100) {
              clearInterval(completionInterval);
              setTimeout(() => {
                // Show ONLY ONE success toast when animation completes
                // Explicitly remove any existing toasts first
                toast.dismiss();
                toast.success("Portfolio Created Successfully", {
                  id: "portfolio-success", // Use consistent ID to prevent duplicates
                });

                // Activate confetti immediately

                // Gradually fade out confetti over time (we'll handle this in the component)
                setTimeout(() => {
                  setConfettiOpacity(0.8); // Start fading

                  // Continue fading out
                  const fadeInterval = setInterval(() => {
                    setConfettiOpacity((prev) => {
                      if (prev <= 0.1) {
                        clearInterval(fadeInterval);
                        // Only completely remove at the end of fade
                        setTimeout(() => setConfettiActive(false), 300);
                        return 0;
                      }
                      return prev - 0.1;
                    });
                  }, 400);
                }, 3000);

                setShowPreview(true);
                setIsLoading(false);
              }, 800);
              return 100;
            }
            return newValue;
          });
        };

        const completionInterval = setInterval(completionAnimation, 50);
      } else {
        clearInterval(progressInterval);
        clearInterval(factInterval);
        clearInterval(messageInterval);
        toast.error("Failed to process resume");
        setIsLoading(false);
      }
    } catch (error) {
      clearInterval(progressInterval);
      clearInterval(factInterval);
      clearInterval(messageInterval);
      toast.error("Error connecting to server");
      setIsLoading(false);
    } finally {
      // If there's an error, make sure to set loading to false
      // In success case, this will be handled by the completion animation
      if (!response || !response.ok) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      toast.dismiss();
    }

    return () => {
      toast.dismiss();
    };
  }, [isModalOpen]);

  const ColorTheme = {
    primary: "#10b981",
    primaryDark: "#059669",
    primaryGlow: "rgba(16, 185, 129, 0.25)",
    bgCard: "rgba(24, 24, 27, 0.8)",
    bgCardHover: "rgba(39, 39, 42, 0.8)",
    borderLight: "rgba(255, 255, 255, 0.1)",
    textPrimary: "#ffffff",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
  };

  return (
    <div>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open && (processingResume || isLoading)) {
            toast.error("Please wait until the process completes");
            return;
          }
          setIsModalOpen(open);
        }}
      >
        <DialogContent
          className="backdrop-blur-2xl rounded-2xl w-full max-w-[98vw] sm:max-w-4xl p-0 h-[95vh] sm:h-auto flex flex-col overflow-hidden border-none shadow-2xl"
          style={{
            background: "linear-gradient(145deg, rgba(20, 20, 22, 0.95), rgba(10, 10, 12, 0.98))",
            boxShadow: "0 0 50px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.1)",
            maxHeight: "95vh",
          }}
        >
          {confettiActive && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 9999999,
                pointerEvents: "none",
                opacity: confettiOpacity,
                transition: "opacity 0.5s ease",
              }}
            >
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={800}
                gravity={0.15}
                tweenDuration={10000}
                initialVelocityY={10}
                colors={[
                  "#10b981", "#34d399", "#6ee7b7", "#059669", "#047857",
                  "#f59e0b", "#fbbf24", "#fcd34d",
                ]}
              />
            </div>
          )}

          <div className="relative flex-1 flex flex-col p-6 sm:p-10 overflow-y-auto custom-scrollbar">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[100px]" />
              <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <AnimatePresence mode="wait">
              {!showResumeImport ? (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative z-10 flex flex-col h-full"
                >
                  <DialogHeader className="mb-8 text-center space-y-4">
                    <DialogTitle className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                      How would you like to build your{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                        portfolio
                      </span>
                      ?
                    </DialogTitle>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                      Choose the method that works best for you to get started quickly
                    </p>
                  </DialogHeader>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* From scratch option */}
                    <motion.div
                      className={`relative group p-1 rounded-2xl transition-all duration-300 ${creationMethod === "scratch" ? "ring-2 ring-emerald-500/50" : "hover:ring-1 hover:ring-gray-700"
                        }`}
                      variants={fadeInScale}
                      onClick={() => handleMethodSelect("scratch")}
                    >
                      <div className={`h-full p-6 sm:p-8 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center border ${creationMethod === "scratch"
                        ? "bg-emerald-900/10 border-emerald-500/30"
                        : "bg-zinc-900/50 border-white/5 hover:bg-zinc-800/50 hover:border-white/10"
                        }`}>
                        <div className={`p-4 rounded-full mb-6 transition-all duration-300 ${creationMethod === "scratch"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-zinc-800 text-gray-400 group-hover:bg-zinc-700 group-hover:text-gray-200"
                          }`}>
                          <PlusCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                          Edit a Pre-filled Template
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Start with a pre-filled template featuring dummy data that
                          you can easily edit. Perfect for building your portfolio
                          step by step.
                        </p>
                      </div>
                    </motion.div>

                    {/* Import from resume option */}
                    <motion.div
                      className={`relative group p-1 rounded-2xl transition-all duration-300 ${creationMethod === "import" ? "ring-2 ring-emerald-500/50" : "hover:ring-1 hover:ring-gray-700"
                        }`}
                      variants={fadeInScale}
                      onClick={() => handleMethodSelect("import")}
                    >
                      {/* Badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Recommended
                        </span>
                      </div>

                      <div className={`h-full p-6 sm:p-8 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center border ${creationMethod === "import"
                        ? "bg-emerald-900/10 border-emerald-500/30"
                        : "bg-zinc-900/50 border-white/5 hover:bg-zinc-800/50 hover:border-white/10"
                        }`}>
                        <div className={`p-4 rounded-full mb-6 transition-all duration-300 ${creationMethod === "import"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-zinc-800 text-gray-400 group-hover:bg-zinc-700 group-hover:text-gray-200"
                          }`}>
                          <Wand2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                          Import from Resume
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Upload your existing resume and we'll automatically populate
                          your portfolio. The fastest way to get your site live.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-10 flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      className={`
                        relative px-8 py-4 rounded-xl cursor-pointer font-bold text-lg flex items-center gap-3 transition-all duration-300
                        ${creationMethod
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}
                      `}
                      onClick={handleButtonClick}
                      disabled={!creationMethod || isCreating}
                      whileTap={creationMethod ? { scale: 0.98 } : {}}
                    >
                      {isCreating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {creationMethod === "scratch" ? "Start Building" : "Import Resume"}
                          </span>
                          <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${creationMethod ? "group-hover:translate-x-1" : ""}`} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="import"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative z-10 flex flex-col h-full"
                >
                  {/* Back button */}
                  <button
                    className="absolute top-0 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    onClick={handleBackButton}
                    disabled={processingResume || isLoading}
                  >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                      <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Back</span>
                  </button>

                  <div className="mt-12 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                    <motion.div
                      className="text-center mb-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI-Powered Import</span>
                      </motion.div>

                      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Magic</span> of Resume Import
                      </h2>
                      <p className="text-gray-400 text-lg">
                        Transform your existing resume into a stunning portfolio website with just one click
                      </p>
                    </motion.div>

                    <motion.div
                      className="w-full"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {!resumeUploaded ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              onChange={handleResumeUpload}
                              disabled={uploadingResume}
                            />
                            <div className={`
                              border-2 border-dashed rounded-xl p-10 transition-all duration-300 flex flex-col items-center justify-center
                              ${uploadingResume
                                ? "border-emerald-500/30 bg-emerald-500/5"
                                : "border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800/50"}
                            `}>
                              {uploadingResume ? (
                                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                </div>
                              )}
                              <p className="text-lg font-medium text-white mb-2">
                                {uploadingResume ? "Uploading..." : "Drop your resume here"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Supports PDF files up to 10MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {isLoading ? (
                              <div className="text-center space-y-6">
                                {/* Progress Bar */}
                                <div className="relative pt-4">
                                  <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                                    <span>Processing...</span>
                                    <span className="text-emerald-400">{Math.round(progressValue)}%</span>
                                  </div>
                                  <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative"
                                      initial={{ width: "0%" }}
                                      animate={{ width: `${progressValue}%` }}
                                    >
                                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </motion.div>
                                  </div>
                                </div>

                                {/* Loading Message */}
                                <div className="h-12 flex items-center justify-center">
                                  <AnimatePresence mode="wait">
                                    <motion.p
                                      key={loadingMessages[currentMessage]}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="text-emerald-400 font-medium"
                                    >
                                      {loadingMessages[currentMessage]}
                                    </motion.p>
                                  </AnimatePresence>
                                </div>

                                {/* Fact Card */}
                                <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/5 text-left">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Did you know?</span>
                                  </div>
                                  <AnimatePresence mode="wait">
                                    <motion.p
                                      key={portfolioFacts[currentFact]}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="text-sm text-gray-300 leading-relaxed"
                                    >
                                      {portfolioFacts[currentFact]}
                                    </motion.p>
                                  </AnimatePresence>
                                </div>
                              </div>
                            ) : showPreview ? (
                              <div className="text-center py-6">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                                >
                                  <Check className="w-10 h-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Portfolio Ready!</h3>
                                <p className="text-gray-400 mb-8">
                                  We've successfully extracted your details and built your site.
                                </p>
                                <motion.button
                                  className="px-8 py-3 cursor-pointer bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
                                  onClick={() => handleCreatePortfolio(customBodyResume)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  View My Portfolio
                                </motion.button>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <FileText className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Resume Uploaded</h3>
                                <p className="text-gray-400 mb-6">
                                  Ready to process your resume and build your portfolio?
                                </p>
                                <motion.button
                                  className="w-full py-4 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                  onClick={extractDetails}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Wand2 className="w-5 h-5" />
                                  Process Resume
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateMethodModal;

"use client";
import { motion } from "framer-motion";
import { FileText, PlusCircle, ArrowRight, ArrowLeft } from "lucide-react";
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
    primaryDark: "#047857",
    primaryGlow: "rgba(16, 185, 129, 0.15)",
    bgCard: "rgba(28, 28, 30, 0.9)",
    borderLight: "rgba(75, 85, 99, 0.3)",
    textPrimary: "#f3f4f6",
    textSecondary: "#d1d5db",
    textMuted: "#9ca3af",
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
          className="backdrop-blur-xl rounded-xl w-full max-w-[98vw] sm:max-w-4xl p-2 sm:p-6 md:p-12 h-[95vh] sm:h-auto flex flex-col"
          style={{
            backgroundColor: "rgba(18, 18, 18, 0.95)",
            border: "1px solid rgba(75, 85, 99, 0.3)",
            color: "#f3f4f6",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(16, 185, 129, 0.15)",
            maxHeight: "95vh",
            overflow: "hidden",
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
                  "#f44336",
                  "#e91e63",
                  "#9c27b0",
                  "#673ab7",
                  "#3f51b5",
                  "#2196f3",
                  "#03a9f4",
                  "#00bcd4",
                  "#009688",
                  "#4CAF50",
                  "#8BC34A",
                  "#FFEB3B",
                  "#FFC107",
                  "#FF9800",
                  "#FF5722",
                ]}
              />
            </div>
          )}
          {!showResumeImport ? (
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 sm:px-0 sm:py-0">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl sm:text-3xl text-center md:text-4xl font-bold">
                  How would you like to build your{" "}
                  <span
                    style={{
                      background: `linear-gradient(to right, #10b981, #047857)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    portfolio
                  </span>
                  ?
                </DialogTitle>
                <p className="text-center text-gray-400 mt-2 text-base sm:text-lg">
                  Choose the method that works best for you to get started
                  quickly
                </p>
              </DialogHeader>

              <motion.div
                className="flex flex-col gap-6 mt-6 md:flex-row md:gap-6"
                style={{ maxHeight: "calc(90vh - 200px)" }}
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {/* From scratch option */}
                <motion.div
                  className="flex-1 p-4 sm:p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center mb-2 md:mb-0"
                  variants={fadeInScale}
                  style={{
                    backgroundColor:
                      creationMethod === "scratch"
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(28, 28, 30, 0.8)",
                    borderColor:
                      creationMethod === "scratch"
                        ? "#10b981"
                        : "rgba(75, 85, 99, 0.3)",
                    boxShadow:
                      creationMethod === "scratch"
                        ? "0 4px 12px rgba(16, 185, 129, 0.15)"
                        : "none",
                  }}
                  whileHover={{
                    borderColor: "#10b981",
                    boxShadow: "0 6px 16px rgba(16, 185, 129, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("scratch")}
                >
                  <div
                    className="p-3 rounded-full mb-4"
                    style={{
                      background:
                        creationMethod === "scratch"
                          ? "#10b981"
                          : "rgba(38, 38, 42, 0.8)",
                    }}
                  >
                    <PlusCircle
                      className="h-7 w-7"
                      style={{
                        color:
                          creationMethod === "scratch" ? "#000" : "#f3f4f6",
                      }}
                    />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: "#f3f4f6" }}
                  >
                    Edit a Pre-filled Template
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">
                    Start with a pre-filled template featuring dummy data that
                    you can easily edit. Perfect for building your portfolio
                    step by step while maintaining full control over the content{" "}
                  </p>
                </motion.div>

                {/* Import from resume option */}
                <motion.div
                  className="flex-1 p-4 sm:p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
                  variants={fadeInScale}
                  style={{
                    backgroundColor:
                      creationMethod === "import"
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(28, 28, 30, 0.8)",
                    borderColor:
                      creationMethod === "import"
                        ? "#10b981"
                        : "rgba(75, 85, 99, 0.3)",
                    boxShadow:
                      creationMethod === "import"
                        ? "0 4px 12px rgba(16, 185, 129, 0.15)"
                        : "none",
                  }}
                  whileHover={{
                    borderColor: "#10b981",
                    boxShadow: "0 6px 16px rgba(16, 185, 129, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("import")}
                >
                  <div
                    className="p-3 rounded-full mb-4"
                    style={{
                      background:
                        creationMethod === "import"
                          ? "#10b981"
                          : "rgba(38, 38, 42, 0.8)",
                    }}
                  >
                    <FileText
                      className="h-7 w-7"
                      style={{
                        color: creationMethod === "import" ? "#000" : "#f3f4f6",
                      }}
                    />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: "#f3f4f6" }}
                  >
                    Import from Resume
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">
                    Upload your existing resume and we'll automatically populate
                    your portfolio. Save time by importing your skills,
                    experience, projects and education.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row justify-center mt-8 gap-3 sm:gap-0"
                style={{ maxHeight: "100px" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {creationMethod && (
                  <motion.button
                    className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-lg group transition-all flex items-center  justify-center"
                    style={{
                      background: "#10b981",
                      color: "#000",
                      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.15)",
                      cursor: !isCreating ? "pointer" : "not-allowed",
                      opacity: isCreating ? 0.7 : 1,
                    }}
                    whileHover={{
                      boxShadow: !isCreating
                        ? "0 8px 24px rgba(16, 185, 129, 0.2)"
                        : "none",
                    }}
                    whileTap={{ scale: !isCreating ? 0.97 : 1 }}
                    onClick={handleButtonClick}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <div className="flex items-center">
                        <span>
                          {creationMethod === "scratch"
                            ? "Start Building"
                            : "Import Resume"}
                        </span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:ml-5 transition-all duration-300 ease" />
                      </div>
                    )}
                  </motion.button>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="py-4 relative flex-1 overflow-y-auto overflow-x-hidden">
              {/* Back button */}
              <motion.button
                className="absolute top-0 left-0 flex items-center text-gray-400 hover:text-white transition-colors"
                onClick={handleBackButton}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                disabled={processingResume || isLoading}
                style={{
                  cursor:
                    processingResume || isLoading ? "not-allowed" : "pointer",
                  opacity: processingResume || isLoading ? 0.5 : 1,
                }}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to options
              </motion.button>

              {/* Background decoration */}
              <motion.div
                className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full opacity-10 -z-10"
                style={{
                  background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="mt-10">
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                    style={{
                      color: ColorTheme.primary,
                      backgroundColor: ColorTheme.primaryGlow,
                    }}
                  >
                    Revolutionary Feature
                  </motion.span>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    The{" "}
                    <span
                      style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Magic
                    </span>{" "}
                    of Resume Import
                  </h2>
                  <p
                    className=" max-w-3xl mx-auto"
                    style={{ color: ColorTheme.textSecondary }}
                  >
                    Transform your existing resume into a stunning portfolio
                    website with just one click
                  </p>
                </motion.div>

                <motion.div
                  className="max-w-lg mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Import Demo */}
                  <motion.div
                    className="rounded-xl overflow-hidden p-8"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      backdropFilter: "blur(16px)",
                      boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 6px 12px ${ColorTheme.primaryGlow}`,
                    }}
                    whileHover={{
                      boxShadow: `0 15px 40px rgba(0,0,0,0.4), 0 8px 20px ${ColorTheme.primaryGlow}`,
                    }}
                  >
                    <div className="text-center mb-4">
                      <div className="relative">
                        {!resumeUploaded ? (
                          <motion.div
                            className="border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer"
                            style={{
                              borderColor: ColorTheme.borderLight,
                              pointerEvents: uploadingResume ? "none" : "auto",
                              opacity: uploadingResume ? 0.7 : 1,
                            }}
                            whileHover={{
                              borderColor: uploadingResume
                                ? ColorTheme.borderLight
                                : ColorTheme.primary,
                              backgroundColor: uploadingResume
                                ? "transparent"
                                : "rgba(16, 185, 129, 0.05)",
                            }}
                            animate={uploadingResume ? {} : pulseAnimation}
                          >
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleResumeUpload}
                              disabled={uploadingResume}
                            />
                            {uploadingResume ? (
                              <div
                                className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
                                style={{
                                  borderColor: ColorTheme.primary,
                                  borderTopColor: "transparent",
                                }}
                              ></div>
                            ) : (
                              <svg
                                className="w-12 h-12 mx-auto mb-4"
                                style={{ color: ColorTheme.textMuted }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            )}
                            <p style={{ color: ColorTheme.textSecondary }}>
                              {uploadingResume
                                ? "Uploading..."
                                : "Drag & drop your resume here or click to browse"}
                            </p>
                            <p
                              style={{ color: ColorTheme.textMuted }}
                              className="text-sm mt-2"
                            >
                              Supports only PDF.
                            </p>
                          </motion.div>
                        ) : (
                          <div
                            className="rounded-lg p-6"
                            style={{ backgroundColor: "rgba(28, 28, 30, 0.9)" }}
                          >
                            {isLoading ? (
                              <div className="text-center">
                                {/* Progress Bar Section */}
                                <div className="w-full h-5 bg-gray-800 rounded-full overflow-hidden mb-6 p-0.5">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                      background: `linear-gradient(to right, ${ColorTheme.primaryDark}, ${ColorTheme.primary})`,
                                      boxShadow: `0 0 8px ${ColorTheme.primary}80`,
                                      width: `${progressValue}%`,
                                    }}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progressValue}%` }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>

                                {/* Loading Message */}
                                <motion.div
                                  key={loadingMessages[currentMessage]}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.5 }}
                                  className="min-h-12 flex items-center justify-center"
                                >
                                  <p
                                    style={{ color: ColorTheme.primary }}
                                    className="text-lg font-medium mb-4"
                                  >
                                    {loadingMessages[currentMessage]}
                                  </p>
                                </motion.div>

                                {/* Progress Percentage */}
                                <p
                                  className="text-xs mb-6"
                                  style={{ color: ColorTheme.textMuted }}
                                >
                                  <span
                                    className="font-medium"
                                    style={{ color: ColorTheme.primary }}
                                  >
                                    {Math.round(progressValue)}%
                                  </span>{" "}
                                  complete
                                </p>

                                {/* Portfolio Fact */}
                                <motion.div
                                  className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg mt-4 border border-gray-700"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  key={portfolioFacts[currentFact]}
                                  transition={{ duration: 0.5 }}
                                >
                                  <p
                                    className="text-sm"
                                    style={{ color: ColorTheme.textSecondary }}
                                  >
                                    <span
                                      className="block font-semibold mb-2 text-xs"
                                      style={{ color: ColorTheme.primary }}
                                    >
                                      DID YOU KNOW?
                                    </span>
                                    {portfolioFacts[currentFact]}
                                  </p>
                                </motion.div>
                              </div>
                            ) : showPreview ? (
                              <div className="text-center">
                                <motion.div
                                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                  style={{
                                    backgroundColor: `${ColorTheme.primary}20`,
                                  }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", duration: 0.6 }}
                                >
                                  <svg
                                    className="w-8 h-8"
                                    style={{ color: ColorTheme.primary }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </motion.div>
                                <p
                                  style={{ color: ColorTheme.textSecondary }}
                                  className="mb-4"
                                >
                                  Your portfolio is ready!
                                </p>
                                <motion.div
                                  className="flex justify-center gap-4"
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <motion.button
                                    className="px-4 py-2 cursor-pointer rounded-lg"
                                    style={{
                                      backgroundColor: ColorTheme.primary,
                                      color: "#000",
                                      boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                                    }}
                                    whileHover={{
                                      boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                                    }}
                                    onClick={() =>
                                      handleCreatePortfolio(customBodyResume)
                                    }
                                  >
                                    View Portfolio
                                  </motion.button>
                                </motion.div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <motion.div
                                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                  style={{
                                    backgroundColor: `${ColorTheme.primary}20`,
                                  }}
                                >
                                  <svg
                                    className="w-8 h-8"
                                    style={{ color: ColorTheme.primary }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </motion.div>
                                <p style={{ color: ColorTheme.textSecondary }}>
                                  Resume uploaded successfully!
                                </p>
                                <p
                                  style={{ color: ColorTheme.textMuted }}
                                  className="text-sm mt-2 mb-4"
                                >
                                  Click the button below to create your
                                  portfolio
                                </p>

                                <motion.button
                                  className="px-4 py-2 cursor-pointer rounded-lg"
                                  style={{
                                    backgroundColor: ColorTheme.primary,
                                    color: "#000",
                                    boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                                  }}
                                  whileHover={{
                                    boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                                  }}
                                  onClick={extractDetails}
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <div className="flex items-center">
                                      <svg
                                        className="animate-spin h-4 w-4 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Processing...
                                    </div>
                                  ) : (
                                    "Process Resume"
                                  )}
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Create Portfolio Button */}
                  {!resumeUploaded && !uploadingResume && (
                    <motion.div
                      className="mt-8 flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.button
                        className="inline-flex items-center cursor-pointer group gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                        style={{
                          background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                          color: "#000",
                          boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                        whileHover={{
                          boxShadow: isLoading
                            ? `0 4px 14px ${ColorTheme.primaryGlow}`
                            : `0 6px 20px ${ColorTheme.primaryGlow}`,
                        }}
                        onClick={() => {
                          toast.error("Please upload a resume first");
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Creating Portfolio...</span>
                          </>
                        ) : (
                          <>
                            Create Portfolio
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:ml-5 transition-all duration-300 ease" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateMethodModal;

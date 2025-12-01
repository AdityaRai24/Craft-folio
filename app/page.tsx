"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Head from "next/head";
import {
  fadeIn,
  fadeInScale,
  pulseAnimation,
  revealUpload,
  staggerContainer,
} from "@/lib/animations";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import MainNavbar from "@/components/Shared/MainNavbar";
// import ArrowLottie from "@/components/ArrowLottie";
import { ColorTheme } from "@/lib/colorThemes";
import BgShapes from "@/components/Shared/BgShapes";
import { testimonials, features, benefitsList } from "@/lib/data";
import ArrowLottie from "@/components/Shared/ArrowLottie";
import ResumeConversionAnimation from "@/components/Shared/ResumeConversionAnimation";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const router = useRouter();

  const handleResumeUpload = () => {
    setResumeUploaded(true);
    setTimeout(() => {
      setShowPreview(true);
    }, 2000);
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a minimal loading spinner
  }

  return (
    <div className="relative  scrollbar   custom-scrollbar">
      <BgShapes />



      <MainNavbar />

      <section className="pt-40 md:pt-40 main-bg-noise relative overflow-hidden">
        {/* Background base layer */}

        {/* Primary radial gradient - top center */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 70%)`,
          }}
          animate={{
            opacity: [1, 1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Secondary radial gradient - top left */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${ColorTheme.primary}66, transparent 60%)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {/* Third radial gradient - top right */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 10%, ${ColorTheme.primaryDark}4D, transparent 50%)`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />

        {/* Fourth radial gradient - center left */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(ellipse at 10% 50%, ${ColorTheme.primaryGlow}80, transparent 70%)`,
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />

        {/* Fifth radial gradient - center right */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(ellipse at 90% 60%, ${ColorTheme.primary}59, transparent 65%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.5,
          }}
        />

        {/* Sixth radial gradient - bottom center (subtle) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 90%, ${ColorTheme.primaryDark}40, transparent 80%)`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 3,
          }}
        />

        {/* Animated particles effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, ${ColorTheme.primaryGlow}33, transparent 40%), radial-gradient(circle at 70% 30%, ${ColorTheme.primary}26, transparent 35%)`,
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-6 relative">
          <motion.div
            className="text-center mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="max-w-4xl text-center mx-auto">
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                variants={fadeIn}
                style={{
                  textShadow: `0 0 20px ${ColorTheme.primaryGlow}40`,
                }}
              >
                From{" "}
                <span
                  style={{
                    background: `linear-gradient(15deg, ${ColorTheme.primary}, ${ColorTheme.primary}, ${ColorTheme.primaryGlow})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: `drop-shadow(0 0 10px ${ColorTheme.primaryGlow}50)`,
                  }}
                >
                  Resume
                </span>{" "}
                to Stunning Portfolio in Seconds
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto"
                style={{
                  color: ColorTheme.textSecondary,
                  textShadow: `0 0 10px ${ColorTheme.textSecondary}20`,
                }}
                variants={fadeIn}
              >
                Just upload your resume and get an instant professional
                portfolio website. Customize it or build from scratch - no
                coding required.
              </motion.p>

              {/* Portfolio Statistics */}
              <motion.div
                className="mb-10"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(28, 28, 30, 0.6)",
                    borderColor: ColorTheme.borderLight,
                    boxShadow: `0 2px 10px rgba(0,0,0,0.1)`,
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: ColorTheme.primary,
                    boxShadow: `0 4px 15px rgba(0,0,0,0.2), 0 0 20px ${ColorTheme.primary}20`,
                  }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ColorTheme.primary,
                      boxShadow: `0 0 10px ${ColorTheme.primaryGlow}`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: ColorTheme.textSecondary,
                    }}
                  >
                    <span
                      style={{
                        color: ColorTheme.primary,
                        fontWeight: "bold",
                      }}
                    >
                      500+
                    </span>{" "}
                    portfolios created
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
                variants={fadeIn}
              >
                <motion.div
                  onClick={() => router.push("/choose-templates")}
                  className="px-8 py-4 rounded-lg flex items-center justify-center cursor-pointer group font-medium transition-all relative overflow-hidden"
                  style={{
                    color: ColorTheme.textPrimary,
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                  whileHover={{
                    boxShadow: `0 8px 25px ${ColorTheme.primaryGlow}, 0 0 30px ${ColorTheme.primaryGlow}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button inner glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle at center, ${ColorTheme.primaryGlow}30, transparent 70%)`,
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10">
                    Build My Portfolio{" "}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:ml-5 transition-all duration-300 ease inline" />
                  </span>
                </motion.div>

                <motion.a
                  href="#features"
                  className="px-8 py-4 rounded-lg font-medium border transition-all relative overflow-hidden backdrop-blur-sm"
                  style={{
                    color: ColorTheme.textPrimary,
                    backgroundColor: "rgba(28, 28, 30, 0.6)",
                    borderColor: ColorTheme.borderLight,
                    boxShadow: `0 2px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(38, 38, 42, 0.8)",
                    borderColor: ColorTheme.primary,
                    boxShadow: `0 4px 15px rgba(0,0,0,0.2), 0 0 20px ${ColorTheme.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Secondary button glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle at center, ${ColorTheme.primary}10, transparent 80%)`,
                    }}
                    animate={{
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  <span className="relative z-10">Learn More</span>
                </motion.a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className=" "
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2 pb-8 cursor-pointer relative"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Scroll indicator glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${ColorTheme.primaryGlow}20, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.p
                className="text-sm font-medium relative z-10"
                style={{
                  color: ColorTheme.textSecondary,
                  textShadow: `0 0 10px ${ColorTheme.textSecondary}30`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Scroll to explore
              </motion.p>

              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: ColorTheme.textSecondary,
                    filter: `drop-shadow(0 0 5px ${ColorTheme.textSecondary}40)`,
                  }}
                >
                  <path
                    d="M12 5V19M12 19L5 12M12 19L19 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="main-bg-noise pt-16 px-4 pb-20 md:pb-28 relative overflow-hidden">
        <motion.div
          className="relative w-full max-w-7xl mx-auto rounded-xl overflow-hidden"

          variants={fadeInScale}
        >

          <section className="py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none" />

                {/* Window Controls */}
                <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-black/20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                <div className="p-8 md:p-12">
                  <ResumeConversionAnimation />
                </div>
              </motion.div>
            </div>
          </section>
        </motion.div>
        {/* Subtle wave decoration */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-auto opacity-10"
          >
            <path
              fill={ColorTheme.primary}
              fillOpacity="1"
              d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,122.7C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 main-bg-noise md:py-28 relative">
        {/* Background pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${ColorTheme.primary} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                color: ColorTheme.primary,
                backgroundColor: ColorTheme.primaryGlow,
              }}
              whileHover={{ scale: 1.05 }}
            >
              Powerful Toolkit
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need To{" "}
              <span
                style={{
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Stand Out
              </span>
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: ColorTheme.textSecondary }}
            >
              Powerful tools designed to showcase your work in the best possible
              light
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                className="p-8 rounded-xl backdrop-blur-sm border"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                }}
                variants={fadeInScale}
                whileHover={{
                  y: -10,
                  borderColor: ColorTheme.primary,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 5px 15px ${ColorTheme.primaryGlow}`,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    boxShadow: `0 5px 15px ${ColorTheme.primaryGlow}`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p style={{ color: ColorTheme.textSecondary }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section (New) */}
      {/* <section
        id="testimonials"
        className="py-20 md:pt-28 main-bg-noise relative overflow-hidden"
      >
        <motion.div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-full -z-10"
          style={{
            background: `linear-gradient(90deg, ${ColorTheme.primaryGlow}, transparent 30%, transparent 70%, ${ColorTheme.primaryGlow})`,
          }}
          animate={{
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                color: ColorTheme.primary,
                backgroundColor: ColorTheme.primaryGlow,
              }}
              whileHover={{ scale: 1.05 }}
            >
              Success Stories
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our{" "}
              <span
                style={{
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Users
              </span>{" "}
              Say
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: ColorTheme.textSecondary }}
            >
              Join thousands of professionals who have already transformed their
              online presence
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map(
              (testimonial: {
                id: number;
                name: string;
                role: string;
                image: string;
                content: string;
                rating: number;
              }) => (
                <motion.div
                  key={testimonial.id}
                  className="p-8 rounded-xl backdrop-blur-sm border relative"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                  }}
                  variants={fadeInScale}
                  whileHover={{
                    y: -8,
                    borderColor: ColorTheme.primary,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 5px 15px ${ColorTheme.primaryGlow}`,
                  }}
                >
                  <div
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xl font-serif"
                    style={{
                      backgroundColor: ColorTheme.primary,
                      color: ColorTheme.textPrimary,
                    }}
                  >
                    "
                  </div>

                  <div className="mb-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5"
                          style={{
                            color:
                              i < testimonial.rating
                                ? ColorTheme.primary
                                : ColorTheme.borderLight,
                          }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p
                      className="italic mb-6"
                      style={{ color: ColorTheme.textSecondary }}
                    >
                      "{testimonial.content}"
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2"
                      style={{ borderColor: ColorTheme.primary }}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p
                        className="text-sm"
                        style={{ color: ColorTheme.textMuted }}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-all"
              style={{
                background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                color: ColorTheme.textPrimary,
                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
              }}
            >
              Join Them Today
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-12 relative main-bg-noise overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundColor: "rgba(18, 18, 18, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        ></div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="min-w-[220px] max-w-[340px]">
              <motion.span
                className="text-2xl font-bold"
                style={{
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                whileHover={{ scale: 1.05 }}
              >
                CraftFolio
              </motion.span>
              <p
                className="mt-4 mb-6"
                style={{ color: ColorTheme.textSecondary }}
              >
                Build stunning portfolio websites without code. Import your
                resume and get an instant portfolio in seconds.
              </p>
            </div>

            <div className="flex flex-1 justify-end">
              <div className="min-w-[160px]">
                <h4 className="font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2">
                  <li>
                    <motion.a
                      href="#features"
                      style={{ color: ColorTheme.textSecondary }}
                      whileHover={{ color: ColorTheme.primary }}
                    >
                      Features
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href="/choose-templates"
                      style={{ color: ColorTheme.textSecondary }}
                      whileHover={{ color: ColorTheme.primary }}
                    >
                      Templates
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href="/my-portfolios"
                      style={{ color: ColorTheme.textSecondary }}
                      whileHover={{ color: ColorTheme.primary }}
                    >
                      My Portfolios
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href="/upgrade"
                      style={{ color: ColorTheme.textSecondary }}
                      whileHover={{ color: ColorTheme.primary }}
                    >
                      Upgrade
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href="https://github.com/AdityaRai24/Craft-folio"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: ColorTheme.textSecondary }}
                      whileHover={{ color: ColorTheme.primary }}
                    >
                      Star on GitHub
                    </motion.a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="border-t pt-8 mt-12 text-center"
            style={{ borderColor: ColorTheme.borderLight }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.a
                href="https://github.com/AdityaRai24/Craft-folio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: ColorTheme.bgCardHover,
                  color: ColorTheme.textSecondary,
                  border: `1px solid ${ColorTheme.borderLight}`,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.primary,
                  color: ColorTheme.primary,
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Star on GitHub
              </motion.a>
              <p style={{ color: ColorTheme.textMuted }}>
                © {new Date().getFullYear()} CraftFolio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

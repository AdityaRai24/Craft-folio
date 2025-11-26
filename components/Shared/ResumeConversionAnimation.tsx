"use client";
import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowRight, FileText, Globe, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ColorTheme } from '@/lib/colorThemes';

const ResumeConversionAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  const greenGlow = 'rgba(16, 185, 129, 0.4)';

  return (
    <div className="md:p-8" >
      <div className="max-w-[90%] md:max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center pt-6 md:pt-0 min-w-full mb-16">
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
            }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ color: ColorTheme.textPrimary }}>Resume to Portfolio{' '}
              <span
                style={{
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Magic
              </span>
            </span>
          </motion.h1>
          <motion.p
            className="text-base md:text-xl"
            style={{ color: ColorTheme.textSecondary }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Watch your resume transform into a stunning portfolio website
          </motion.p>
        </div>

        {/* Main Conversion Area */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
          {/* Resume Side */}
          <motion.div className="relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`w-64 h-80 md:w-80 md:h-96 lg:w-[20rem] lg:h-[26rem] rounded-2xl shadow-2xl transform transition-all duration-1000 ${isAnimating ? 'scale-105 rotate-2' : 'hover:scale-105'
                }`}
              style={{
                boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 5px 15px ${greenGlow}`,
              }}
            >
              <div className="relative h-full rounded-2xl overflow-hidden" style={{ backgroundColor: ColorTheme.bgCard }}>
                {/* Resume Preview */}
                <div className="p-6 h-full" style={{ background: `linear-gradient(to bottom, ${ColorTheme.bgCard}, ${ColorTheme.bgCardHover})` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6" style={{ color: ColorTheme.primary }} />
                    <span className="font-semibold" style={{ color: ColorTheme.textPrimary }}>Resume.pdf</span>
                  </div>

                  {/* Mock Resume Content */}
                  <div className="space-y-3">
                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: ColorTheme.textPrimary }}></div>
                    <div className="h-2 rounded w-1/2" style={{ backgroundColor: ColorTheme.textSecondary }}></div>
                    <div className="h-2 rounded w-2/3" style={{ backgroundColor: ColorTheme.textSecondary }}></div>

                    <div className="mt-6">
                      <div className="h-3 rounded w-1/3 mb-2" style={{ backgroundColor: ColorTheme.primary }}></div>
                      <div className="space-y-1">
                        <div className="h-2 rounded w-full" style={{ backgroundColor: ColorTheme.borderLight }}></div>
                        <div className="h-2 rounded w-5/6" style={{ backgroundColor: ColorTheme.borderLight }}></div>
                        <div className="h-2 rounded w-4/5" style={{ backgroundColor: ColorTheme.borderLight }}></div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="h-3 rounded w-1/4 mb-2" style={{ backgroundColor: ColorTheme.primaryDark }}></div>
                      <div className="space-y-1">
                        <div className="h-2 rounded w-full" style={{ backgroundColor: ColorTheme.borderLight }}></div>
                        <div className="h-2 rounded w-3/4" style={{ backgroundColor: ColorTheme.borderLight }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Icons */}
                {isAnimating && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkles className="absolute top-4 right-4 w-4 h-4 animate-pulse" style={{ color: ColorTheme.primaryGlow }} />
                    <Zap className="absolute bottom-8 left-4 w-5 h-5 animate-bounce" style={{ color: ColorTheme.primary }} />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pulsing Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-20 animate-pulse ${isAnimating ? 'animate-ping' : ''}`} style={{ backgroundColor: ColorTheme.primaryGlow }}></div>
          </motion.div>

          {/* Conversion Arrow */}
          <motion.div className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button
              onClick={startAnimation}
              className="group relative p-6 cursor-pointer rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                color: ColorTheme.textPrimary,
                boxShadow: `0 10px 30px ${ColorTheme.primaryGlow}`,
              }}
            >
              <ArrowRight className={`w-8 h-8 hidden md:block transition-transform duration-500 ${isAnimating ? 'translate-x-2' : ''}`} />
              <ArrowDown className={`w-8 h-8 block md:hidden transition-transform duration-500 ${isAnimating ? 'translate-x-2' : ''}`} />

              {/* Animated Particles */}
              {isAnimating && (
                <>
                  <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: ColorTheme.primaryGlow }}></div>
                  <div className="absolute -bottom-2 -right-2 w-2 h-2 rounded-full animate-ping animation-delay-300" style={{ backgroundColor: ColorTheme.primaryDark }}></div>
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full animate-ping animation-delay-700" style={{ backgroundColor: ColorTheme.primary }}></div>
                </>
              )}
            </button>

            {/* Conversion Text */}
            <div className="absolute md:-bottom-16 md:left-1/2 transform  w-full mb-7 md:-translate-x-1/2 text-center">
              <div className={`text-sm font-semibold w-full inline-block transition-all duration-500 ${isAnimating ? 'scale-110' : ''
                }`} style={{ color: isAnimating ? ColorTheme.primaryGlow : ColorTheme.textMuted }}>
                {isAnimating ? 'Converting...' : 'Click Here '}
              </div>
            </div>
          </motion.div>

          {/* Portfolio Side */}
          <motion.div className="relative group mt-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`w-64 h-80 md:w-80 md:h-96 lg:w-[20rem] lg:h-[26rem] rounded-2xl shadow-2xl transform transition-all duration-1000 ${isAnimating ? 'scale-105 -rotate-2' : 'hover:scale-105'
                }`}
              style={{
                boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 5px 15px ${greenGlow}`,
              }}
            >
              <div className="relative h-full rounded-2xl overflow-hidden" style={{ background: `linear-gradient(to br, ${ColorTheme.bgCard}, ${ColorTheme.bgMain})` }}>
                {/* Portfolio Preview */}
                <div className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6" style={{ color: ColorTheme.primary }} />
                    <span className="font-semibold" style={{ color: ColorTheme.textPrimary }}>Portfolio.web</span>
                  </div>

                  {/* Mock Portfolio Content */}
                  <div className="space-y-4">
                    {/* Hero Section */}
                    <div className="rounded-lg p-3" style={{ background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}>
                      <div className="h-3 rounded w-2/3 mb-1" style={{ backgroundColor: ColorTheme.textPrimary }}></div>
                      <div className="h-2 rounded w-1/2" style={{ backgroundColor: ColorTheme.textSecondary }}></div>
                    </div>

                    {/* Skills Section */}
                    <div className="flex gap-2">
                      <div className="rounded-full px-2 py-1" style={{ backgroundColor: `${ColorTheme.primary}40` }}></div>
                      <div className="rounded-full px-2 py-1" style={{ backgroundColor: `${ColorTheme.primaryDark}40` }}></div>
                      <div className="rounded-full px-2 py-1" style={{ backgroundColor: `${ColorTheme.primaryGlow}40` }}></div>
                    </div>

                    {/* Project Cards */}
                    <div className="space-y-2">
                      <div className="rounded-lg p-2" style={{ backgroundColor: ColorTheme.bgCardHover }}>
                        <div className="h-2 rounded w-3/4 mb-1" style={{ backgroundColor: ColorTheme.textPrimary }}></div>
                        <div className="h-1 rounded w-1/2" style={{ backgroundColor: ColorTheme.textSecondary }}></div>
                      </div>
                      <div className="rounded-lg p-2" style={{ backgroundColor: ColorTheme.bgCardHover }}>
                        <div className="h-2 rounded w-2/3 mb-1" style={{ backgroundColor: ColorTheme.textPrimary }}></div>
                        <div className="h-1 rounded w-3/5" style={{ backgroundColor: ColorTheme.textSecondary }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Elements */}
                {isAnimating && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 border-4 rounded-full animate-spin border-t-transparent" style={{ borderColor: ColorTheme.primary, borderTopColor: 'transparent' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Success Glow */}
            <div className={`absolute inset-0 rounded-2xl opacity-20 ${isAnimating ? 'animate-pulse' : ''}`} style={{ backgroundColor: ColorTheme.primaryGlow }}></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeConversionAnimation; 
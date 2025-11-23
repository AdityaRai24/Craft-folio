"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Home, Star, Share2, ArrowLeft, ArrowRight } from "lucide-react";

const SafariBrowser = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const isDark = theme === "dark";
  const [url, setUrl] = useState("craftfolio.dev");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const features = [
    {
      title: "Interactive Portfolio",
      description: "Explore my work in an immersive macOS experience",
      icon: "💻",
      color: "from-blue-50 to-blue-100",
    },
    {
      title: "Modern Design",
      description: "Built with cutting-edge technologies and best practices",
      icon: "🎨",
      color: "from-purple-50 to-purple-100",
    },
    {
      title: "Responsive & Fast",
      description: "Optimized for all devices and lightning-fast performance",
      icon: "⚡",
      color: "from-yellow-50 to-yellow-100",
    },
  ];

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? "bg-gray-800" : "bg-white"}`}>
      {/* Safari Toolbar */}
      <div className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border-b px-4 py-2.5 flex items-center gap-3`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center gap-2 flex-1 ml-2">
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors disabled:opacity-30" disabled>
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors disabled:opacity-30" disabled>
            <ArrowRight size={16} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Home size={16} className="text-gray-600" />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            onClick={() => setIsLoading(true)}
          >
            <RefreshCw 
              size={16} 
              className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
          <form onSubmit={handleNavigate} className="flex-1 flex items-center max-w-2xl">
            <div className={`flex items-center gap-2 ${isDark ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded-lg px-3 py-1.5 flex-1 shadow-sm hover:shadow-md transition-shadow`}>
              <Search size={14} className={isDark ? "text-gray-400" : "text-gray-400"} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none text-sm ${isDark ? "text-gray-200 placeholder-gray-400" : "text-gray-700"}`}
                placeholder="Search or enter website name"
              />
            </div>
          </form>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Share2 size={16} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Star size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className={`flex-1 overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={32} className="text-blue-500" />
            </motion.div>
          </div>
        ) : (
          <div className="p-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className={`text-4xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-3`}>
                Welcome to CraftFolio
              </h1>
              <p className={isDark ? "text-gray-300" : "text-gray-600"} style={{ fontSize: "1.125rem" }}>
                Your portfolio, reimagined as a macOS experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${feature.color} rounded-xl p-6 ${isDark ? "border-gray-600" : "border-gray-200"} border hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? "text-gray-300" : "text-gray-700"} style={{ fontSize: "0.875rem", lineHeight: "1.625" }}>{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-xl p-8 border`}
            >
              <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
                Experience the Future of Portfolios
              </h2>
              <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mb-6`} style={{ lineHeight: "1.625" }}>
                This macOS-themed portfolio showcases my work in an innovative and interactive way.
                Navigate through different sections using the dock icons, each opening a unique
                window experience. Explore projects, view my resume, check out my skills, and get in touch.
              </p>
              <div className="flex gap-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md">
                  Explore Projects
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg transition-colors text-sm font-medium">
                  View Resume
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafariBrowser;

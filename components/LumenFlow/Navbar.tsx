"use client"
import React, { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useLumenFlowTheme } from "./ThemeContext";
import { getThemeClasses } from "./ThemeContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { useCustomization } from "@/hooks/useCustomization";
import { defaultLumenFlowNavbarStyles } from "@/types/navbar/lumenflow";

const Navbar = ({
  onTabChange,
  activeTab,
  currentTheme,
  portfolioId,
}: {
  onTabChange: (tab: string) => void;
  activeTab: string;
  currentTheme: any;
  portfolioId?: string;
}) => {
  const { theme, toggleTheme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    customization,
    effectiveCustomization,
    visualEditorOpen,
    setVisualEditorOpen,
    openVisualEditor,
    updateDraftCustomization,
    saveDraftCustomization,
    resetCustomization,
    draftCustomization
  } = useCustomization("navbar", defaultLumenFlowNavbarStyles, portfolioId || "");

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const sectionNames: any = [];

  portfolioData?.map((item: any) => {
    if (
      item.type === "userInfo" ||
      item.type === "themes" ||
      item.type === "seo" ||
      item.type === "navbar"
    ) {
      return;
    } else {
      sectionNames.push(item.type);
    }
  });

  const name = portfolioData?.find((item: any) => item.type === "hero")?.data.name;
  const tabs = sectionNames.map((item: any) => ({
    id: item,
    label: item.charAt(0).toUpperCase() + item.slice(1),
  }));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when a tab is clicked
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between border backdrop-blur-md rounded-2xl shadow-xl px-4 sm:px-6 lg:px-8 py-2 md:py-4 mx-auto w-full transition-colors duration-300 ${theme === "light"
          ? "bg-white/80 border-gray-200"
          : themeClasses.bgSecondary
          }`}
        style={{
          background: theme === "light"
            ? "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.95))"
            : themeClasses.gradientHover
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            {/* <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-md"></div> */}
            {name
              ? name
                .split(' ')
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
              : ''}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-base cursor-pointer font-medium transition-all duration-300 relative ${activeTab === tab.id
                ? theme === "light"
                  ? "text-orange-600"
                  : themeClasses.accent
                : theme === "light"
                  ? "text-gray-700 hover:text-orange-600"
                  : themeClasses.textSecondary
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${theme === "light"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600"
                    : themeClasses.gradientPrimary
                    } rounded-full`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 ${theme === "dark"
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
          >
            {theme === "dark" ? (
              <Sun size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <Moon size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-full transition-colors duration-300 ${theme === "dark"
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
          >
            {isMobileMenuOpen ? (
              <X size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <Menu size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden mt-2 border backdrop-blur-md rounded-2xl shadow-xl mx-auto w-full transition-colors duration-300 ${theme === "light"
            ? "bg-white/80 border-gray-200"
            : themeClasses.bgSecondary
            }`}
          style={{
            background: theme === "light"
              ? "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.95))"
              : themeClasses.gradientHover
          }}
        >
          <div className="px-4 py-2 space-y-2">
            {tabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`block w-full text-left px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg ${activeTab === tab.id
                  ? theme === "light"
                    ? "text-orange-600 bg-orange-50"
                    : themeClasses.accent
                  : theme === "light"
                    ? "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                    : themeClasses.textSecondary
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

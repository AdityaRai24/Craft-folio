"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { ColorTheme } from "@/lib/colorThemes";
import { useRouter, usePathname } from "next/navigation";
import { Github } from "lucide-react";

const MainNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let navItemsToShow: { label: string; href: string }[] = [];
  if (user) {
    navItemsToShow = [
      ...(pathname === "/" ? [{ label: "Features", href: "#features" }] : []),
      { label: "Templates", href: "/choose-templates" },
      { label: "My Portfolios", href: "/my-portfolios" },
    ];
  } else {
    navItemsToShow = [
      ...(pathname === "/" ? [{ label: "Features", href: "#features" }] : []),
      { label: "Templates", href: "/choose-templates" },
      { label: "My Portfolios", href: "/my-portfolios" },
    ];
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-lg py-5" : "transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/craftfolioicon.png"
              alt="CraftFolio"
              onClick={() => router.push("/")}
              className="w-11 cursor-pointer"
            />
            <img
              src="/craftfolio.png"
              alt="CraftFolio"
              onClick={() => router.push("/")}
              className="w-40 cursor-pointer"
            />
            {/* </motion.span> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItemsToShow.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`relative hover:text-opacity-100 transition-colors text-lg${
                  pathname === item.href ? " font-bold text-emerald-400" : ""
                }`}
                style={{
                  color:
                    pathname === item.href
                      ? ColorTheme.primary
                      : ColorTheme.textSecondary,
                  borderBottom:
                    pathname === item.href &&
                    (pathname === "/choose-templates" ||
                      pathname === "/my-portfolios")
                      ? `2px solid ${ColorTheme.primary}`
                      : undefined,
                }}
                whileHover={{
                  color: ColorTheme.primary,
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                {item.label}
              </motion.a>
            ))}

            {/* Upgrade Button */}
            {user && (
              <motion.a
                href="/upgrade"
                className="px-4 py-1.5 rounded-md text-base font-medium transition-all ml-2"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  color: ColorTheme.textPrimary,
                  boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                }}
              >
                Upgrade
              </motion.a>
            )}

            {/* GitHub Star Button - styled as bordered button */}
            <motion.a
              href="https://github.com/AdityaRai24/Craft-folio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-md text-base font-medium transition-all ml-2 border"
              style={{
                background: "transparent",
                color: ColorTheme.primary,
                border: `2px solid ${ColorTheme.primary}`,
                boxShadow: "none",
              }}
              whileHover={{
                background: ColorTheme.primaryGlow,
                color: ColorTheme.textPrimary,
                scale: 1.05,
              }}
            >
              <span className="flex items-center gap-2">
                <Github className="h-5 w-5" /> Star on GitHub
              </span>
            </motion.a>

            {/* Authentication Section */}
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <motion.span
                  className="text-lg"
                  style={{ color: ColorTheme.textPrimary }}
                  whileHover={{ scale: 1.05 }}
                >
                  {user.firstName || user.username || "User"}
                </motion.span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              pathname === "/" && (
                <>
                  <motion.a
                    href="/sign-in"
                    className="px-6 py-2 rounded-md text-lg transition-all"
                    style={{
                      color: ColorTheme.textPrimary,
                      backgroundColor: "rgba(28, 28, 30, 0.7)",
                    }}
                    whileHover={{
                      backgroundColor: "rgba(38, 38, 42, 0.9)",
                      scale: 1.03,
                    }}
                  >
                    Log In
                  </motion.a>
                  <motion.a
                    href="/sign-up"
                    className="px-6 py-2 rounded-md text-lg transition-all"
                    style={{
                      color: ColorTheme.textPrimary,
                      background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                    }}
                  >
                    Sign Up Free
                  </motion.a>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="outline-none"
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: ColorTheme.textPrimary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 rounded-lg p-4"
            style={{
              backgroundColor: "rgba(13, 13, 18, 0.85)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItemsToShow.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`block py-3 hover:text-opacity-100 transition-colors${
                  pathname === item.href ? " font-bold text-emerald-400" : ""
                }`}
                style={{
                  color:
                    pathname === item.href
                      ? ColorTheme.primary
                      : ColorTheme.textSecondary,
                  borderBottom:
                    pathname === item.href &&
                    (pathname === "/choose-templates" ||
                      pathname === "/my-portfolios")
                      ? `2px solid ${ColorTheme.primary}`
                      : undefined,
                }}
                whileHover={{ color: ColorTheme.primary }}
              >
                {item.label}
              </motion.a>
            ))}

            {/* Upgrade Button */}
            {user && (
              <motion.a
                href="/upgrade"
                className="flex items-center justify-center gap-2 px-4 py-3 mt-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  color: ColorTheme.textPrimary,
                  boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{
                  boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                }}
              >
                Upgrade to Premium
              </motion.a>
            )}

            {!user && pathname === "/" && (
              <div className="mt-4 flex flex-col space-y-3">
                <motion.a
                  href="/sign-in"
                  className="px-4 py-3 text-center rounded-md transition-all"
                  style={{
                    backgroundColor: "rgba(38, 38, 42, 0.7)",
                    color: ColorTheme.textPrimary,
                  }}
                  whileHover={{ backgroundColor: "rgba(48, 48, 52, 0.9)" }}
                >
                  Log In
                </motion.a>
                <motion.a
                  href="/sign-up"
                  className="px-4 py-3 text-center rounded-md transition-all"
                  style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                    color: ColorTheme.textPrimary,
                  }}
                  whileHover={{
                    boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                  }}
                >
                  Sign Up Free
                </motion.a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default MainNavbar;

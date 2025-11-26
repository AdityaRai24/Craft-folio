import { motion } from "framer-motion";
import { ColorTheme } from "@/lib/colorThemes";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <img
              src="/craftfolioicon.png"
              alt="CraftFolio"
              className="w-10"
            />
            <img
              src="/craftfolio.png"
              alt="CraftFolio"
              className="w-36"
            />
          </div>

          {/* Description */}
          <p className="text-center max-w-2xl text-gray-400">
            Create beautiful, professional portfolios in minutes. Showcase your work with stunning templates and custom domains.
          </p>

          {/* GitHub Star Button */}
          <motion.a
            href="https://github.com/AdityaRai24/Craft-folio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: "rgba(28, 28, 30, 0.7)",
              color: ColorTheme.textPrimary,
              border: "1px solid rgba(75, 85, 99, 0.3)",
            }}
            whileHover={{
              backgroundColor: "rgba(38, 38, 42, 0.9)",
              scale: 1.05,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Github className="h-5 w-5" />
            <span>Star on GitHub</span>
          </motion.a>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <motion.a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Twitter className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Linkedin className="h-5 w-5" />
            </motion.a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CraftFolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
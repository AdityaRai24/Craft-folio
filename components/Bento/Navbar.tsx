"use client";

import { motion } from "framer-motion";
import { Home, User, Briefcase, Code, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
    { label: "Home", icon: Home, href: "#" },
    { label: "Projects", icon: Briefcase, href: "#projects" },
    { label: "Experience", icon: User, href: "#experience" },
    { label: "Tech", icon: Code, href: "#technologies" },
    { label: "Contact", icon: Mail, href: "#contact" },
];

const Navbar = ({ currentPortTheme, customCSS, portfolioId }: any) => {
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => item.href.substring(1)).filter(Boolean);
            let current = "";

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) {
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-2 px-4 py-3 bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 rounded-full shadow-lg shadow-black/50"
            >
                {navItems.map((item) => {
                    const isActive = activeSection === item.href.substring(1) || (item.href === "#" && !activeSection);

                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                if (item.href === "#") {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                } else {
                                    document.getElementById(item.href.substring(1))?.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className={`relative p-3 rounded-full transition-all duration-300 group ${isActive ? "text-blue-400 bg-blue-900/20" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"}`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {item.label}
                            </span>
                        </a>
                    );
                })}
            </motion.nav>
        </div>
    );
};

export default Navbar;

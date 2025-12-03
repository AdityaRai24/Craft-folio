"use client";

import React from "react";

interface FooterProps {
    copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({ copyrightText }) => {
    const year = new Date().getFullYear();
    return (
        <footer className="w-full py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 mt-20">
            <div className="max-w-5xl mx-auto px-4">
                <p>&copy; {year} {copyrightText || "All rights reserved."}</p>
                <p className="mt-2 text-xs opacity-60">Built with CraftFolio</p>
            </div>
        </footer>
    );
};

export default Footer;

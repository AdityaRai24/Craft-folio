"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Apple, 
  Wifi, 
  Battery, 
  Search, 
  Signal, 
  FileText, 
  Github, 
  Linkedin, 
  Mail,
  AppWindow,
  Download,
  Sun,
  Moon
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMacOSTheme } from "./ThemeContext";

// --- Helper: Date Formatter ---
const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
};

const formatFullDate = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dayName} ${dayNum}${getOrdinalSuffix(dayNum)} ${monthName} ${time}`;
};

// --- Configuration Types ---
interface DropdownItem {
  label: string;
  icon?: React.ElementType;
  action: () => void;
}

interface MenuItem {
  label: string;
  items?: DropdownItem[];
  action?: () => void;
}

const TopBar = ({
  currentPortTheme,
  customCSS,
  portfolioId,
}: {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId?: string;
}) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- Redux Integration (Preserved) ---
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  
  const topBarData = portfolioData?.find((item: any) => item.type === "topBar")?.data || {
    showTime: true,
    showControlCenter: true,
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Click outside listener for dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---
  const handleResume = () => {
    // Add your resume logic here (e.g., window.open('/resume.pdf'))
    console.log("Resume clicked");
    setActiveMenu(null);
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
    setActiveMenu(null);
  };

  // --- Menu Configuration ---
  const menuConfig: MenuItem[] = [
    { label: "Portfolio", action: () => {} }, // Main app menu
    { 
      label: "File", 
      items: [
        { label: "Resume", icon: FileText, action: handleResume }
      ]
    },
    { label: "View", action: () => {} },
    { label: "Window", action: () => {} },
    { 
      label: "Contact", 
      items: [
        { label: "GitHub", icon: Github, action: () => openLink("https://github.com") },
        { label: "LinkedIn", icon: Linkedin, action: () => openLink("https://linkedin.com") },
        { label: "Email", icon: Mail, action: () => window.location.href = "mailto:your@email.com" }
      ]
    },
  ];

  return (
    <div 
      ref={menuRef}
      className="fixed top-0 left-0 right-0 h-7 w-full bg-black/30 backdrop-blur-md text-white z-50 flex items-center justify-between px-4 border-b border-white/10 select-none"
      style={customCSS ? { style: customCSS } as React.CSSProperties : undefined}
    >
      {/* Left side - Apple logo and menu items */}
      <div className="flex items-center space-x-1 h-full">
        <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors mr-3">
          <Apple size={14} fill="currentColor" />
        </div>
        
        {/* Menu Loop */}
        {menuConfig.map((menu, index) => (
          <div key={index} className="relative h-full flex items-center">
            <button 
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              className={`
                px-2.5 h-[22px] cursor-pointer rounded text-sm transition-colors  flex items-center
                ${index === 0 ? "font-semibold" : "font-normal opacity-90 hover:opacity-100"}
                ${activeMenu === menu.label ? "bg-white/20" : "hover:bg-white/10"}
              `}
            >
              {menu.label}
            </button>

            {/* Dropdown (Shadcn-style) */}
            {activeMenu === menu.label && menu.items && (
              <div className="absolute top-full left-0 mt-1 w-48 p-1 bg-white/40 !text-black backdrop-blur-xl border border-white/10 rounded-md shadow-lg flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100">
                {menu.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-left text-black/90 cursor-pointer hover:text-white rounded-sm transition-colors"
                  >
                    {item.icon && <item.icon size={14} />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - Control Center icons and time */}
      {topBarData.showControlCenter !== false && (
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2 opacity-90">
            <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors">
              <Search size={14} strokeWidth={2.5} />
            </div>
            <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors">
              <Signal size={14} strokeWidth={2.5} />
            </div>
            <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors">
              <Wifi size={14} strokeWidth={2.5} />
            </div>
            <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors">
              <Battery size={16} />
            </div>
          </div>
          
          {topBarData.showTime !== false && (
            <div className="text-xs font-medium min-w-[130px] text-right cursor-default">
              {formatFullDate(time)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useMacOSTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon size={14} strokeWidth={2.5} />
      ) : (
        <Sun size={14} strokeWidth={2.5} />
      )}
    </button>
  );
};

export default TopBar;
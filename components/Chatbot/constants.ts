import { ColorTheme } from "@/lib/colorThemes";

export const CHATBOT_THEMES : any = {
    dark: {
      bgMain: ColorTheme.bgMain,
      bgNav: ColorTheme.bgNav,
      bgCard: ColorTheme.bgCard,
      bgCardHover: ColorTheme.bgCardHover,
      textPrimary: ColorTheme.textPrimary,
      textSecondary: ColorTheme.textSecondary,
      borderLight: ColorTheme.borderLight,
      primary: ColorTheme.primary,
      primaryGlow: ColorTheme.primaryGlow,
    },
    light: {
      bgMain: "#F9FAFB",
      bgNav: "#F3F4F6",
      bgCard: "#FFFFFF",
      bgCardHover: "#F3F4F6",
      textPrimary: "#18181B",
      textSecondary: "#52525B",
      borderLight: "#E5E7EB",
      primary: "#10B981",
      primaryGlow: "#10B98133",
    },
  };

  
  export const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  export const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  export const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  export const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

 export interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isSystemNotification?: boolean;
  }
  
 export interface ChatbotProps {
    portfolioData: any;
    portfolioId: string;
    themeOptions: any;
    currentPortTheme: any;
    currentFont: any;
    onOpenChange: (isOpen: boolean) => void;
    setCurrentFont: (font: string) => void;
    setCurrentPortTheme: (theme: string) => void;
    setCustomCSS: (css: string) => void;
    customCSSState: string;
    portfolioLink: string;
  }
  
  
  

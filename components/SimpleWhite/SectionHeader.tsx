import React from 'react';
import { Settings } from "lucide-react";
import EditButton from '@/components/EditButton';
import MagicWrite from "@/components/MagicWrite";
import { ColorTheme } from "@/lib/colorThemes";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SectionHeaderProps {
  sectionName: string;
  headerVisible: boolean;
  titleSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  titleColor: "gray-800" | "gray-900" | "black" | "white";
  titleAlignment: "left" | "center" | "right";
  descriptionSize: "sm" | "md" | "lg";
  descriptionColor: "gray-600" | "gray-700" | "gray-400" | "gray-800";
  descriptionVisible: boolean;
  title: string;
  description: string;
  onVisualEditorClick: () => void;
  headerClasses: {
    container: string;
    title: string;
    description: string;
  };
  currentPortTheme?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionName,
  headerVisible,
  titleSize,
  titleWeight,
  titleColor,
  titleAlignment,
  descriptionSize,
  descriptionColor,
  descriptionVisible,
  title,
  description,
  onVisualEditorClick,
  headerClasses,
  currentPortTheme
}) => {
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = currentPortTheme ? inTheme?.data?.[currentPortTheme] : undefined;

  const textPrimaryColor = theme?.colors?.text?.primary || "#1F2937";
  const textSecondaryColor = theme?.colors?.text?.secondary || "#6B7280";

  // Magic Write functionality
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: context || ""
        }),
      });

      if (!response.ok) {
        throw new Error('Magic Write API error');
      }

      const data = await response.json();
      return data.enhancedText || context || "";
    } catch (error) {
      console.error('Magic Write API error:', error);
      return context || "";
    }
  };

  if (!headerVisible) return null;

  return (
    <div className={headerClasses.container}>
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="flex-1">
          <h2 
            className={headerClasses.title}
            style={{ color: textPrimaryColor }}
          >
            {title}
          </h2>
          {descriptionVisible && (
            <div className="relative">
              <p 
                className={headerClasses.description}
                style={{ color: textSecondaryColor }}
              >
                {description}
              </p>
              
            </div>
          )}
        </div>
        
        <div className="flex absolute gap-2 sm:gap-3 right-2 sm:right-0 top-2 sm:top-0">
          <EditButton 
            sectionName={sectionName}
            styles="text-xs px-2 sm:px-3 py-1"
          />
          <button
            onClick={onVisualEditorClick}
            className="flex cursor-pointer items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
            }}  
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Visual Editor</span>
            <span className="sm:hidden">Editor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader; 
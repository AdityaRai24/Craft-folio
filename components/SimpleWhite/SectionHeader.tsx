import React from 'react';
import { Settings } from "lucide-react";
import EditButton from '@/components/EditButton';
import { ColorTheme } from "@/lib/colorThemes";

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
  headerClasses
}) => {
  if (!headerVisible) return null;

  return (
    <div className={headerClasses.container}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className={headerClasses.title}>
            {title}
          </h2>
          {descriptionVisible && (
            <p className={headerClasses.description}>
              {description}
            </p>
          )}
        </div>
        
        <div className="flex absolute right-0 ">
          <EditButton 
            sectionName={sectionName}
            styles="text-xs px-3 py-1"
          />
          <button
            onClick={onVisualEditorClick}
            className="flex cursor-pointer items-center gap-2 px-3 py-1 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
            }}
          >
            <Settings className="h-3 w-3" />
            Visual Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader; 
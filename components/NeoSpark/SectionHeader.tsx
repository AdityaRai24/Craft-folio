import React from "react";
import EditButton, { shouldShowEditButtons } from "../EditButton";
import { Settings } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useUser } from '@clerk/nextjs';

const SectionHeader = ({ 
  sectionName, 
  sectionTitle, 
  sectionDescription, 
  titleColor,
  onVisualEditorOpen 
}: { 
  sectionName: string, 
  sectionTitle: string, 
  sectionDescription: string, 
  titleColor: string,
  onVisualEditorOpen?: () => void
}) => {
  // Authentication check
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();
  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-xl block mx-auto">
        <h1
          className="text-4xl section-title font-bold mb-4 text-center"
          style={{ color: titleColor }}
        >
          {sectionTitle}
        </h1>
        <p className="text-xl section-description text-gray-300 text-center mb-16">
          {sectionDescription}
        </p>
        
        {/* Consistent Button Layout */}
      <div className="absolute top-4 right-4 z-20">
      <div className="flex items-center justify-center gap-2">
          <EditButton sectionName={sectionName} />
          {onVisualEditorOpen && shouldShowButton && (
            <button
              onClick={onVisualEditorOpen}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
              style={{
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
              }}
            >
              <Settings className="h-4 w-4" />
              Visual Editor
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default SectionHeader;

import React from "react";
import EditButton, { shouldShowEditButtons } from "@/components/Shared/EditButton";
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
  const { previewMode } = useSelector((state: RootState) => state.editMode);
  const { user, isLoaded } = useUser();
  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <div className=" block mx-auto  max-w-xl ">
        <h1
          className="text-2xl sm:text-3xl max-w-2xl md:text-4xl section-title font-bold mb-3 sm:mb-4 text-center"
          style={{ color: titleColor }}
        >
          {sectionTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl  section-description text-gray-300 text-center mb-8 sm:mb-12 md:mb-16">
          {sectionDescription}
        </p>

        {/* Consistent Button Layout */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <EditButton sectionName={sectionName} />
            {onVisualEditorOpen && shouldShowButton && !previewMode && (
              <button
                onClick={onVisualEditorOpen}
                className="md:flex hidden items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-white rounded-lg transition-colors text-xs sm:text-sm"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">Visual Editor</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;

"use client";

import React, { useState, useEffect } from "react";
import { Download, Edit2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { ResumeVisualEditor } from "@/components/VisualEditor/Resume/ResumeVisualEditor";
import { ColorTheme } from "@/lib/colorThemes";

const ResumeViewer = ({
  theme = "light",
  portfolioId,
}: {
  theme?: "light" | "dark";
  portfolioId?: string;
}) => {
  const isDark = theme === "dark";
  const { user, isLoaded } = useUser();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);

  const resumeData = portfolioData?.find((item: any) => item.type === "resume")?.data || {};
  const resumePath = resumeData.resumeLink || "";

  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  const handleDownload = async () => {
    if (!resumePath) return;

    try {
      setIsDownloading(true);

      // Fetch the PDF
      const response = await fetch(resumePath);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setIsDownloading(false);
      // Fallback to direct link
      const link = document.createElement("a");
      link.href = resumePath;
      link.download = "Resume.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? "bg-gray-800" : "bg-white"} relative`}>
      {/* Header Actions */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {showEdit && (
          <button
            onClick={() => setIsEditorOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white shadow-sm hover:shadow-md`}
            style={{
              background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
            }}
          >
            <Edit2 size={16} />
            <span>Edit Resume</span>
          </button>
        )}

        {resumePath && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`
              ${isDark
                ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 hover:text-white"
                : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
              } 
              border rounded-lg px-4 py-2 shadow-sm transition-all flex items-center gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title="Download Resume"
          >
            <Download size={18} className={isDownloading ? "animate-bounce" : ""} />
            <span className="text-sm font-medium">
              {isDownloading ? "Downloading..." : "Download"}
            </span>
          </button>
        )}
      </div>

      {/* PDF Viewer Content */}
      <div className="flex-1 overflow-hidden">
        {resumePath ? (
          <iframe
            src={`${resumePath}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-none"
            title="Resume PDF Viewer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-medium">No resume uploaded</p>
            {showEdit && (
              <button
                onClick={() => setIsEditorOpen(true)}
                className="mt-4 text-blue-500 hover:underline"
              >
                Upload a resume
              </button>
            )}
          </div>
        )}
      </div>

      {/* Visual Editor */}
      {portfolioId && (
        <ResumeVisualEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          resumeLink={resumePath}
          portfolioId={portfolioId}
          primaryColor={ColorTheme.primary}
          primaryDarkColor={ColorTheme.primaryDark}
        />
      )}
    </div>
  );
};

export default ResumeViewer;

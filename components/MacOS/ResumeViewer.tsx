"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

const ResumeViewer = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const isDark = theme === "dark";
  const resumePath = "https://res.cloudinary.com/dhanvyweu/image/upload/v1763815629/AdityaResume_pafhdi.pdf#toolbar=0&navpanes=0&scrollbar=0";
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
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
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`absolute top-4 right-4 z-10 ${isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200 hover:text-white" : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"} border rounded-lg px-4 py-2 shadow-sm transition-all flex items-center gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Download Resume"
      >
        <Download size={18} className={isDownloading ? "animate-bounce" : ""} />
        <span className="text-sm font-medium">
          {isDownloading ? "Downloading..." : "Download"}
        </span>
      </button>

      {/* PDF Viewer Content */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={resumePath}
          className="w-full h-full border-none"
          title="Resume PDF Viewer"
        />
      </div>
    </div>
  );
};

export default ResumeViewer;

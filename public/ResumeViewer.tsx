"use client";

import React from "react";
import { Download } from "lucide-react";

const ResumeViewer = () => {

  const resumePath = "https://res.cloudinary.com/dhanvyweu/image/upload/v1763815629/AdityaResume_pafhdi.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumePath;
    link.download = "Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white relative">
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-2 shadow-sm transition-colors flex items-center gap-2 text-gray-700 hover:text-gray-900"
        title="Download Resume"
      >
        <Download size={18} />
        <span className="text-sm">Download</span>
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


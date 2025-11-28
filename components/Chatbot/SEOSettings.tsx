"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import { Search, X, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { updateSection } from "@/app/actions/portfolio";

interface SEOSettingsProps {
  portfolioData: any;
  portfolioId: string;
  onClose: () => void;
  themeColors: any;
  onSave: () => void;
}

const SEOSettings = forwardRef<{ handleSaveSEOSettings: () => void }, SEOSettingsProps>(({
  portfolioData,
  portfolioId,
  onClose,
  themeColors,
  onSave,
}, ref) => {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const handleGenerateSEO = async () => {
    try {
      setIsGeneratingSEO(true);
      const response = await axios.post(
        `/api/seo-settings`,
        { portfolioData: portfolioData }
      );
      setSeoTitle(response.data.seoTitle);
      setSeoDescription(response.data.seoDescription);
      toast.success("SEO content generated successfully!");
    } catch (error) {
      console.error("Error generating SEO content:", error);
      toast.error("Failed to generate SEO content");
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    );

    try {
      setIsUploadingFavicon(true);
      toast.loading("Uploading favicon...", { id: "faviconUpload" });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Upload failed", { id: "faviconUpload" });
        return;
      }

      const data = await response.json();
      setFaviconUrl(data.secure_url);
      toast.success("Favicon uploaded successfully!", { id: "faviconUpload" });
    } catch (error) {
      toast.error("An error occurred during upload", { id: "faviconUpload" });
      console.error("Upload error:", error);
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const removeFavicon = () => {
    setFaviconUrl("");
  };

  const handleSaveSEOSettings = async () => {
    if (isSaving) {
      return; // Prevent multiple saves
    }

    try {
      setIsSaving(true);

      const result = await updateSection({
        sectionName: "seo",
        portfolioId,
        sectionContent: {
          title: seoTitle,
          description: seoDescription,
          favicon: faviconUrl,
        },
        sectionTitle: "SEO Settings",
        sectionDescription: "SEO settings for your portfolio",
      });


      if (result.success) {
        toast.success("SEO settings saved successfully! Refresh to see changes.");
        // Don't call onSave() here - let the parent handle it
      } else {
        console.error("Save failed:", result.error);
        toast.error(result.error || "Failed to save SEO settings");
      }
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast.error("Failed to save SEO settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Expose the save function to parent component
  useImperativeHandle(ref, () => ({
    handleSaveSEOSettings: () => handleSaveSEOSettings()
  }));

  // Fetch and prefill SEO settings when component mounts
  useEffect(() => {
    const fetchSEOSettings = async () => {
      try {
        const response = await axios.get(`/api/seo-settings?portfolioId=${portfolioId}`);
        if (response.data) {
          setSeoTitle(response.data.seoTitle || "");
          setSeoDescription(response.data.seoDescription || "");
          setFaviconUrl(response.data.favicon || "");
        }
      } catch (error) {
        console.error("Error fetching SEO settings:", error);
      }
    };

    fetchSEOSettings();
  }, [portfolioId]);

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: themeColors.bgCard }}
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Page Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border outline-none"
              style={{
                backgroundColor: themeColors.bgCardHover,
                borderColor: themeColors.borderLight,
                color: themeColors.textPrimary,
              }}
              placeholder="Enter page title..."
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Meta Description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-lg border outline-none resize-none"
              style={{
                backgroundColor: themeColors.bgCardHover,
                borderColor: themeColors.borderLight,
                color: themeColors.textPrimary,
              }}
              placeholder="Enter meta description..."
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Favicon
            </label>
            <div className="flex items-center gap-3">
              {faviconUrl && (
                <div className="relative">
                  <img
                    src={faviconUrl}
                    alt="Favicon"
                    className="w-8 h-8 rounded"
                  />
                  <button
                    onClick={removeFavicon}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  className="hidden"
                  disabled={isUploadingFavicon}
                />
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: themeColors.bgCardHover,
                    borderColor: themeColors.borderLight,
                    color: themeColors.textPrimary,
                  }}
                >
                  <Upload size={16} />
                  {isUploadingFavicon ? "Uploading..." : "Upload Favicon"}
                </motion.div>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleGenerateSEO}
              disabled={isGeneratingSEO}
              className="w-full py-2 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: themeColors.bgCard,
                borderColor: themeColors.borderLight,
                color: themeColors.textPrimary,
              }}
            >
              <Search size={16} />
              {isGeneratingSEO ? "Generating..." : "Generate SEO"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SEOSettings; 
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Home, Star, Share2, ArrowLeft, ArrowRight, Edit2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { shouldShowEditButtons } from "@/components/Shared/EditButton";
import SafariEditor from "./SafariEditor";
import { updatePortfolioData } from "@/slices/dataSlice";
import { updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useMacOSTheme } from "./ThemeContext";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultMacOSSafariStyles } from "@/types/safari/macos";

const SafariBrowser = ({ theme = "light", portfolioId, font }: { theme?: "light" | "dark"; portfolioId?: string; font?: string }) => {
  const isDark = theme === "dark";
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
  const { currentTheme } = useMacOSTheme();

  const safariData = portfolioData?.find((item: any) => item.type === "safari")?.data || {};
  const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  const {
    customization,
    effectiveCustomization,
    visualEditorOpen,
    setVisualEditorOpen,
    openVisualEditor,
    updateDraftCustomization,
    saveDraftCustomization,
    resetCustomization,
    draftCustomization
  } = useCustomization("safari", defaultMacOSSafariStyles, portfolioId || "");

  const [url, setUrl] = useState(effectiveCustomization.startUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setUrl(effectiveCustomization.startUrl);
  }, [effectiveCustomization.startUrl]);

  // Default welcome content if no data exists
  const defaultContent = `
    <div class="text-center mb-12">
      <h1 class="text-4xl font-semibold mb-3">Welcome to CraftFolio</h1>
      <p class="text-lg opacity-80">Your portfolio, reimagined as a macOS experience</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
        <div class="text-4xl mb-4">💻</div>
        <h3 class="text-xl font-semibold mb-2">Interactive Portfolio</h3>
        <p class="text-sm opacity-80">Explore my work in an immersive macOS experience</p>
      </div>
      <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
        <div class="text-4xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-2">Modern Design</h3>
        <p class="text-sm opacity-80">Built with cutting-edge technologies and best practices</p>
      </div>
      <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
        <div class="text-4xl mb-4">⚡</div>
        <h3 class="text-xl font-semibold mb-2">Responsive & Fast</h3>
        <p class="text-sm opacity-80">Optimized for all devices and lightning-fast performance</p>
      </div>
    </div>
    <div class="p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <h2 class="text-2xl font-semibold mb-4">Experience the Future of Portfolios</h2>
      <p class="mb-6 opacity-80">This macOS-themed portfolio showcases my work in an innovative and interactive way. Navigate through different sections using the dock icons, each opening a unique window experience.</p>
    </div>
  `;

  const content = safariData.content || defaultContent;

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleSave = async (newContent: string) => {
    if (!portfolioId) return;

    try {
      toast.loading("Saving content...", { id: "saveSafari" });

      // Update Redux
      dispatch(updatePortfolioData({
        sectionType: "safari",
        newData: { content: newContent },
        sectionTitle: "",
        sectionDescription: "",
      }));

      // Update Database
      const result = await updateSection({
        portfolioId,
        sectionName: "safari",
        sectionContent: { content: newContent },
        sectionTitle: "",
        sectionDescription: "",
      });

      if (result.success) {
        toast.success("Content saved successfully!", { id: "saveSafari" });
        setIsEditing(false);
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save content", { id: "saveSafari" });
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${font || ""} ${isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-900"}`}
    >
      {/* Safari Toolbar */}
      <div
        className={`border-b px-4 py-2.5 flex items-center gap-3 ${isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-gray-100 border-gray-200"}`}
      >
        {effectiveCustomization.showTrafficLights && (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        )}
        <div className="flex items-center gap-2 flex-1 ml-2">
          {effectiveCustomization.showNavigationButtons && (
            <>
              <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30" disabled>
                <ArrowLeft size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30" disabled>
                <ArrowRight size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
              </button>
            </>
          )}
          {effectiveCustomization.showHomeButton && (
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
              <Home size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
            </button>
          )}
          {effectiveCustomization.showReloadButton && (
            <button
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={() => setIsLoading(true)}
            >
              <RefreshCw
                size={16}
                className={`${isLoading ? 'animate-spin' : ''} ${isDark ? "text-gray-400" : "text-gray-500"}`}
              />
            </button>
          )}
          {effectiveCustomization.showUrlBar && (
            <form onSubmit={handleNavigate} className="flex-1 flex items-center max-w-2xl">
              <div
                className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 shadow-sm hover:shadow-md transition-shadow ${isDark ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"}`}
              >
                <Search size={14} className={isDark ? "text-gray-400" : "text-gray-500"} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`flex-1 bg-transparent border-none outline-none text-sm ${isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                  placeholder="Search or enter website name"
                />
              </div>
            </form>
          )}

          {showEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`backdrop-blur cursor-pointer flex flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 items-center justify-center gap-3 bg-white/80 tracking-wider dark:bg-black/60 border border-dashed border-gray-400 dark:border-gray-600 shadow-md text-gray-900 dark:text-gray-100 hover:bg-white/90 dark:hover:bg-black/80 transition-all px-4 py-2 text-sm font-medium `}
              title="Edit Content"
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
          )}

        </div>
      </div>

      {/* Browser Content */}
      <div className={`flex-1 overflow-hidden ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={32} style={{ color: currentTheme.primary }} />
            </motion.div>
          </div>
        ) : isEditing ? (
          <SafariEditor
            initialContent={content}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            isDark={isDark}
            font={font}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="p-8 max-w-5xl mx-auto">
              {safariData.content ? (
                <ReadOnlyContent content={safariData.content} isDark={isDark} font={font} />
              ) : (
                <div
                  className={`prose max-w-none ${font || ""} ${isDark ? "prose-invert prose-headings:text-white prose-p:text-gray-300 text-gray-300" : "prose-headings:text-gray-900 prose-p:text-gray-900 text-gray-900"} prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-500 hover:prose-a:text-blue-600`}
                  dangerouslySetInnerHTML={{ __html: defaultContent }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReadOnlyContent = ({ content, isDark, font }: { content: string; isDark: boolean; font?: string }) => {
  const editor = useCreateBlockNote();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (editor && content) {
        const blocks = await editor.tryParseHTMLToBlocks(content);
        editor.replaceBlocks(editor.document, blocks);
      }
      setLoading(false);
    }
    load();
  }, [editor, content]);

  if (loading) return null;

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={isDark ? "dark" : "light"}
      className={`bg-transparent ${font || ""}`}
    />
  );
};

export default SafariBrowser;

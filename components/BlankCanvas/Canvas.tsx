"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useUser } from "@clerk/nextjs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { updatePortfolioData } from "@/slices/dataSlice";
import { updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { useDebounce } from "@/hooks/useDebounce";
import { useCustomization } from "@/hooks/useCustomization";
import { CanvasCustomization, defaultCanvasCustomization } from "@/types/canvas";
import CanvasVisualEditor from "@/components/VisualEditor/Canvas/CanvasVisualEditor";
import EditButton from "@/components/Shared/EditButton";
import { Settings } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";


interface CanvasProps {
    portfolioId: string;
    currentPortTheme?: string;
    customCSS?: string;
    font?: string;
}

import { BlankCanvasThemeProvider, useBlankCanvasTheme } from "./ThemeContext";

const CanvasContent: React.FC<CanvasProps> = ({ portfolioId, currentPortTheme, customCSS, font }) => {
    const { user, isLoaded } = useUser();
    const dispatch = useDispatch();
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
    const { theme } = useBlankCanvasTheme();

    // Get data from "canvas" section or "hero" (as fallback for name/socials)
    const canvasSection = portfolioData?.find((item: any) => item.type === "canvas");
    const heroSection = portfolioData?.find((item: any) => item.type === "hero");
    const userInfoSection = portfolioData?.find((item: any) => item.type === "userInfo");

    const initialContent = canvasSection?.data?.content || "";
    const logoText = heroSection?.data?.name || "Portfolio";
    const socialLinks = userInfoSection?.data || {};

    const canEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);
    const {
        customization,
        effectiveCustomization,
        visualEditorOpen,
        setVisualEditorOpen,
        openVisualEditor,
        updateDraftCustomization,
        saveDraftCustomization,
        resetCustomization
    } = useCustomization<CanvasCustomization>("canvas", defaultCanvasCustomization, portfolioId);

    const { previewMode } = useSelector((state: RootState) => state.editMode);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize Editor
    const editor = useCreateBlockNote();
    const [htmlContent, setHtmlContent] = useState<string | null>(null);

    // Load initial content
    useEffect(() => {
        async function loadContent() {
            if (editor && initialContent && !htmlContent) {
                const blocks = await editor.tryParseHTMLToBlocks(initialContent);
                editor.replaceBlocks(editor.document, blocks);
                setHtmlContent(initialContent); // Mark as loaded
            }
        }
        loadContent();
    }, [editor, initialContent]);

    // Handle Auto-Save
    const handleSave = useCallback(async (content: string) => {
        if (!portfolioId || !canEdit) return;

        setIsSaving(true);
        try {
            // Update Redux
            dispatch(updatePortfolioData({
                sectionType: "canvas",
                newData: { content },
                sectionTitle: "",
                sectionDescription: "",
            }));

            // Update Database
            await updateSection({
                portfolioId,
                sectionName: "canvas",
                sectionContent: { content },
                sectionTitle: "",
                sectionDescription: "",
            });

        } catch (error) {
            console.error("Failed to save canvas:", error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    }, [portfolioId, canEdit, dispatch]);

    const debouncedSave = useDebounce(handleSave, 1000);

    const onEditorChange = async () => {
        if (editor && canEdit) {
            const html = await editor.blocksToHTMLLossy(editor.document);
            debouncedSave(html);
        }
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col ${font || "font-sans"}`}>
            <style>{customCSS}</style>
            <style jsx global>{`
                .bn-editor {
                    background-color: transparent !important;
                }
                .dark .bn-editor {
                    background-color: transparent !important;
                }
                /* Target the specific element that might have the background */
                .bn-block-content {
                    background-color: transparent !important;
                }
                [data-theme="dark"] .bn-editor,
                [data-theme="dark"] .mantine-Paper-root {
                    background-color: transparent !important;
                }
            `}</style>

            {/* Admin Controls */}
            {canEdit && !previewMode && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md p-2 rounded-full border border-zinc-800 shadow-xl">
                    <EditButton
                        sectionName="canvas"
                        styles="rounded-full !bg-zinc-800 !text-white !border-zinc-700 hover:!bg-zinc-700 !dark:bg-zinc-800 !dark:text-white !dark:border-zinc-700"
                    />

                    <button
                        onClick={openVisualEditor}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-full transition-colors shadow-lg hover:shadow-xl hover:brightness-110"
                        style={{
                            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                            boxShadow: `0 4px 14px 0 ${ColorTheme.primaryGlow}`
                        }}
                    >
                        <Settings size={16} />
                        Visual Editor
                    </button>
                </div>
            )}

            {effectiveCustomization.navbarVisible && (
                <Navbar
                    socialLinks={socialLinks}
                    logoText={logoText}
                    canEdit={canEdit}
                    isPreview={previewMode}
                />
            )}

            <main className="flex-1 w-full mx-auto px-4 md:px-8 py-12 transition-all duration-300" style={{ maxWidth: effectiveCustomization.maxWidth }}>
                <div className="relative min-h-[50vh]">
                    {/* Saving Indicator */}
                    {isSaving && (
                        <div className="absolute -top-8 right-0 flex items-center gap-2 text-xs text-zinc-400 animate-pulse">
                            <Loader2 size={12} className="animate-spin" />
                            Saving...
                        </div>
                    )}

                    <BlockNoteView
                        editor={editor}
                        onChange={onEditorChange}
                        editable={canEdit && !previewMode}
                        theme={theme === "dark" ? "dark" : "light"}
                        className="min-h-[50vh]"
                    />
                </div>
            </main>

            <Footer copyrightText={logoText} />

            {/* Visual Editor */}
            <CanvasVisualEditor
                isOpen={visualEditorOpen}
                onClose={() => setVisualEditorOpen(false)}
                customization={effectiveCustomization}
                onUpdate={updateDraftCustomization}
                onSave={saveDraftCustomization}
                onReset={resetCustomization}
            />
        </div>
    );
};

const Canvas: React.FC<CanvasProps> = (props) => {
    return (
        <BlankCanvasThemeProvider currentPortTheme={props.currentPortTheme}>
            <CanvasContent {...props} />
        </BlankCanvasThemeProvider>
    );
};

export default Canvas;

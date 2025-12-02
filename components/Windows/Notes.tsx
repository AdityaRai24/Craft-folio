"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Folder, Search, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { shouldShowEditButtons } from "@/components/Shared/EditButton";
import NotesEditor from "./NotesEditor";
import { updatePortfolioData } from "@/slices/dataSlice";
import { updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useWindowsTheme } from "./ThemeContext";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultWindowsNotesStyles } from "@/types/windows/notes";

const Notes = ({ theme = "light", portfolioId, font }: { theme?: "light" | "dark"; portfolioId?: string; font?: string }) => {
    const isDark = theme === "dark";
    const dispatch = useDispatch();
    const { user, isLoaded } = useUser();
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
    const { currentTheme } = useWindowsTheme();

    // Use "notes" section type
    const notesData = portfolioData?.find((item: any) => item.type === "notes")?.data || {};
    const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);

    const {
        customization,
        effectiveCustomization,
    } = useCustomization("notes", defaultWindowsNotesStyles, portfolioId || "");

    const [isEditing, setIsEditing] = useState(false);

    // Default welcome content if no data exists
    const defaultContent = `
    <h1>Welcome to Notes</h1>
    <p>This is a place to keep your thoughts, ideas, and lists.</p>
    <ul>
        <li>Organize your work</li>
        <li>Capture ideas</li>
        <li>Keep track of tasks</li>
    </ul>
  `;

    const content = notesData.content || defaultContent;

    const handleSave = async (newContent: string) => {
        if (!portfolioId) return;

        try {
            toast.loading("Saving notes...", { id: "saveNotes" });

            // Update Redux
            dispatch(updatePortfolioData({
                sectionType: "notes",
                newData: { content: newContent },
                sectionTitle: "",
                sectionDescription: "",
            }));

            // Update Database
            const result = await updateSection({
                portfolioId,
                sectionName: "notes",
                sectionContent: { content: newContent },
                sectionTitle: "",
                sectionDescription: "",
            });

            if (result.success) {
                toast.success("Notes saved successfully!", { id: "saveNotes" });
                setIsEditing(false);
            } else {
                throw new Error("Failed to save to database");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save notes", { id: "saveNotes" });
        }
    };

    return (
        <div
            className={`w-full h-full flex flex-col relative ${font || ""} ${isDark ? "bg-[#202020] text-white" : "bg-white text-gray-900"}`}
        >
            {/* Edit Button (Creator Only) */}
            {showEdit && !isEditing && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`p-2 rounded-full shadow-lg transition-all duration-200 ${isDark
                                ? "bg-[#333] hover:bg-[#444] text-white"
                                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                            }`}
                        title="Edit Notes"
                    >
                        <Edit2 size={18} />
                    </button>
                </div>
            )}

            {/* Editor/Content */}
            <div className={`flex-1 overflow-hidden ${isDark ? "bg-[#202020]" : "bg-white"}`}>
                {isEditing ? (
                    <NotesEditor
                        initialContent={content}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                        isDark={isDark}
                        font={font}
                    />
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="p-8 max-w-3xl mx-auto">
                            {notesData.content ? (
                                <ReadOnlyContent content={notesData.content} isDark={isDark} font={font} />
                            ) : (
                                <div
                                    className={`prose max-w-none ${font || ""} ${isDark ? "prose-invert" : ""}`}
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

export default Notes;

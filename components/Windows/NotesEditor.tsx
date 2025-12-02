"use client";

import React, { useEffect, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { X, Save } from "lucide-react";
import SectionLoading from "../Shared/SectionLoading";

interface NotesEditorProps {
    initialContent: string;
    onSave: (content: string) => void;
    onCancel: () => void;
    isDark: boolean;
    font?: string;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
    initialContent,
    onSave,
    onCancel,
    isDark,
    font,
}) => {
    // Create the editor instance
    const editor = useCreateBlockNote();
    const [isLoading, setIsLoading] = useState(true);

    // Load initial content
    useEffect(() => {
        async function loadContent() {
            if (editor && initialContent) {
                const blocks = await editor.tryParseHTMLToBlocks(initialContent);
                editor.replaceBlocks(editor.document, blocks);
            }
            setIsLoading(false);
        }
        loadContent();
    }, [editor, initialContent]);

    const handleSave = async () => {
        if (editor) {
            const html = await editor.blocksToHTMLLossy(editor.document);
            onSave(html);
        }
    };

    if (isLoading) return <SectionLoading />

    return (
        <div className={`flex flex-col h-full ${font || ""}`}>
            {/* Toolbar / Header */}
            <div className={`flex justify-between items-center p-2 border-b ${isDark ? "border-neutral-700 bg-neutral-800" : "border-neutral-200 bg-neutral-50"}`}>
                <span className={`text-sm font-medium ml-2 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                    Editing Mode
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${isDark
                            ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                            : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300"
                            }`}
                    >
                        <X size={14} />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        <Save size={14} />
                        Save
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className={`flex-1 overflow-y-auto ${isDark ? "bg-neutral-900" : "bg-white"}`}>
                <div className="max-w-4xl mx-auto py-8 px-4">
                    <BlockNoteView
                        editor={editor}
                        theme={isDark ? "dark" : "light"}
                        className={`min-h-[300px] ${font || ""}`}

                    />
                </div>
            </div>
        </div>
    );
};

export default NotesEditor;

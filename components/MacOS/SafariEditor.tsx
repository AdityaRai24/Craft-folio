"use client";

import React, { useEffect, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { X, Save } from "lucide-react";

interface SafariEditorProps {
    initialContent: string;
    onSave: (content: string) => void;
    onCancel: () => void;
    isDark: boolean;
}

const SafariEditor: React.FC<SafariEditorProps> = ({
    initialContent,
    onSave,
    onCancel,
    isDark,
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

    if (isLoading) {
        return <div className="p-4">Loading editor...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar / Header */}
            <div className={`flex justify-between items-center p-2 border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                <span className={`text-sm font-medium ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Editing Mode
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDark
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                            }`}
                    >
                        <X size={14} />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                        <Save size={14} />
                        Save
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className={`flex-1 overflow-y-auto ${isDark ? "bg-gray-900" : "bg-white"}`}>
                <div className="max-w-4xl mx-auto py-8 px-4">
                    <BlockNoteView
                        editor={editor}
                        theme={isDark ? "dark" : "light"}
                        className="min-h-[300px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default SafariEditor;

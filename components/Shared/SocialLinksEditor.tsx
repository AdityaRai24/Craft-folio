import React, { useState } from "react";
import {
    Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Dribbble,
    Mail, Globe, Plus, Trash2, GripVertical
} from "lucide-react";
import { SocialLink, SocialPlatform } from "@/types/canvas";
import { Reorder, useDragControls } from "framer-motion";

interface SocialLinksEditorProps {
    links: SocialLink[];
    onChange: (links: SocialLink[]) => void;
}

const PLATFORMS: { value: SocialPlatform; label: string; icon: any }[] = [
    { value: "github", label: "GitHub", icon: Github },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "twitter", label: "Twitter / X", icon: Twitter },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "dribbble", label: "Dribbble", icon: Dribbble },
    { value: "email", label: "Email", icon: Mail },
    { value: "website", label: "Website", icon: Globe },
];

const SocialLinkItem = ({
    link,
    index,
    updateLink,
    removeLink,
    getIcon
}: {
    link: SocialLink;
    index: number;
    updateLink: (index: number, url: string) => void;
    removeLink: (index: number) => void;
    getIcon: (platform: SocialPlatform) => any;
}) => {
    const controls = useDragControls();
    const Icon = getIcon(link.platform);

    return (
        <Reorder.Item
            value={link}
            dragListener={false}
            dragControls={controls}
            className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-md group relative"
        >
            <div
                className="text-gray-400 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => controls.start(e)}
            >
                <GripVertical size={14} />
            </div>
            <div className="text-gray-300">
                <Icon size={16} />
            </div>
            <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(index, e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 px-2 placeholder-gray-600"
                placeholder="URL"
            />
            <button
                onClick={() => removeLink(index)}
                className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
            >
                <Trash2 size={14} />
            </button>
        </Reorder.Item>
    );
};

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ links, onChange }) => {
    const [newPlatform, setNewPlatform] = useState<SocialPlatform>("github");
    const [newUrl, setNewUrl] = useState("");

    const handleAddLink = () => {
        if (!newUrl) return;

        const newLink: SocialLink = {
            id: crypto.randomUUID(),
            platform: newPlatform,
            url: newUrl,
        };

        onChange([...links, newLink]);
        setNewUrl(""); // Reset input
    };

    const handleRemoveLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        onChange(updatedLinks);
    };

    const handleUpdateLink = (index: number, url: string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = { ...updatedLinks[index], url };
        onChange(updatedLinks);
    };

    const getIcon = (platform: SocialPlatform) => {
        const found = PLATFORMS.find(p => p.value === platform);
        return found ? found.icon : Globe;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-200">Social Links</h3>

            {/* List of existing links */}
            <Reorder.Group axis="y" values={links} onReorder={onChange} className="space-y-2">
                {links.map((link, index) => (
                    <SocialLinkItem
                        key={link.id}
                        link={link}
                        index={index}
                        updateLink={handleUpdateLink}
                        removeLink={handleRemoveLink}
                        getIcon={getIcon}
                    />
                ))}
            </Reorder.Group>

            {/* Add new link form */}
            <div className="flex flex-col gap-2 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                <span className="text-xs text-gray-400 font-medium">Add New Link</span>
                <div className="flex flex-col gap-2">
                    <select
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
                        className="w-full bg-zinc-800 text-white text-sm rounded-md border border-zinc-600 px-2 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                        {PLATFORMS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-zinc-800 text-white text-sm rounded-md border border-zinc-600 px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder-zinc-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    />
                </div>
                <button
                    onClick={handleAddLink}
                    disabled={!newUrl}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium py-1.5 rounded-md transition-colors mt-1"
                >
                    <Plus size={14} />
                    Add Link
                </button>
            </div>
        </div>
    );
};

export default SocialLinksEditor;

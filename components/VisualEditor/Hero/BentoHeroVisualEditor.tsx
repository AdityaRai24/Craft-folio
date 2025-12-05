"use client";

import React, { useState } from "react";
import { X, RotateCcw, Layout, Palette, GripVertical, Eye, EyeOff, Settings } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { BentoHeroCustomization, BentoHeroBlock } from "@/types/bento";
import { ColorTheme } from "@/lib/colorThemes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SliderControl from "../Shared/SliderControl";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import CardStyleSelector from "../Shared/CardStyleSelector";
import { HTML5Backend } from "react-dnd-html5-backend";

interface BentoHeroVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: BentoHeroCustomization;
    draftCustomization: BentoHeroCustomization | null;
    onUpdateDraft: (key: keyof BentoHeroCustomization, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const OptionButton = ({
    selected,
    onClick,
    label,
    preview
}: {
    selected: boolean;
    onClick: () => void;
    label: string;
    preview?: React.ReactNode
}) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 gap-2 ${selected
            ? "border-white bg-zinc-700"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-800"
            }`}
    >
        {preview}
        <span className="text-xs font-medium text-white">{label}</span>
    </button>
);

// Draggable Block Item
const DraggableBlockItem = ({
    block,
    index,
    moveBlock,
    onEdit
}: {
    block: BentoHeroBlock;
    index: number;
    moveBlock: (dragIndex: number, hoverIndex: number) => void;
    onEdit: (block: BentoHeroBlock) => void;
}) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: "BLOCK",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            moveBlock(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "BLOCK",
        item: () => ({ id: block.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            className={`flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            <div className="flex items-center gap-3">
                <div className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300">
                    <GripVertical size={16} />
                </div>
                <span className="text-sm font-medium text-white capitalize">{block.type}</span>
                {!block.visible && <span className="text-xs text-red-400">(Hidden)</span>}
            </div>
            <button
                onClick={() => onEdit(block)}
                className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors"
            >
                <Settings size={16} />
            </button>
        </div>
    );
};

const BentoHeroVisualEditor: React.FC<BentoHeroVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = useState<"layout" | "style">("layout");
    const [editingBlock, setEditingBlock] = useState<BentoHeroBlock | null>(null);

    if (!isOpen) return null;

    const currentSettings = draftCustomization || customization;

    const moveBlock = (dragIndex: number, hoverIndex: number) => {
        const newSlots = [...currentSettings.slots];
        const [draggedBlock] = newSlots.splice(dragIndex, 1);
        newSlots.splice(hoverIndex, 0, draggedBlock);

        // Update order property
        const updatedSlots = newSlots.map((slot, idx) => ({ ...slot, order: idx }));
        onUpdateDraft("slots", updatedSlots);
    };

    const updateBlock = (updatedBlock: BentoHeroBlock) => {
        const newSlots = currentSettings.slots.map(b =>
            b.id === updatedBlock.id ? updatedBlock : b
        );
        onUpdateDraft("slots", newSlots);
        setEditingBlock(updatedBlock); // Keep editing state in sync
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <>
                <div
                    ref={dragRef}
                    className="fixed bg-zinc-900 shadow-2xl rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
                    style={{
                        left: `${windowPosition.x}px`,
                        top: `${windowPosition.y}px`,
                        cursor: isDragging ? "grabbing" : "grab",
                        zIndex: 99999999,
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
                        onMouseDown={handleMouseDown}
                    >
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            {editingBlock ? `Edit ${editingBlock.type}` : "Hero Editor"}
                        </h3>
                        <div className="flex items-center gap-2">
                            {editingBlock && (
                                <button
                                    onClick={() => setEditingBlock(null)}
                                    className="text-xs text-zinc-400 hover:text-white underline mr-2"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation (Hidden when editing a block) */}
                    {!editingBlock && (
                        <div className="flex border-b border-zinc-700">
                            <button
                                onClick={() => setActiveTab("layout")}
                                className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === "layout" ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                                style={{
                                    background: activeTab === "layout" ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                                }}
                            >
                                <Layout className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                                Layout
                            </button>
                            <button
                                onClick={() => setActiveTab("style")}
                                className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === "style" ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                                style={{
                                    background: activeTab === "style" ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                                }}
                            >
                                <Palette className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                                Style
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {editingBlock ? (
                            // Block Configuration Mode
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-white">Visible</Label>
                                    <Switch
                                        checked={editingBlock.visible}
                                        onCheckedChange={(checked) => updateBlock({ ...editingBlock, visible: checked })}
                                    />
                                </div>

                                <SliderControl
                                    label="Column Span (Width)"
                                    value={editingBlock.colSpan}
                                    min={1}
                                    max={4}
                                    step={1}
                                    onChange={(val) => updateBlock({ ...editingBlock, colSpan: val })}
                                />

                                <SliderControl
                                    label="Row Span (Height)"
                                    value={editingBlock.rowSpan}
                                    min={1}
                                    max={4}
                                    step={1}
                                    onChange={(val) => updateBlock({ ...editingBlock, rowSpan: val })}
                                />

                                {editingBlock.type === 'stats' && (
                                    <div className="pt-4 border-t border-zinc-700">
                                        <p className="text-xs text-zinc-400">Edit stats values in the Sidebar.</p>
                                    </div>
                                )}

                                {editingBlock.type === 'services' && (
                                    <div className="pt-4 border-t border-zinc-700">
                                        <p className="text-xs text-zinc-400">Edit services list in the Sidebar.</p>
                                    </div>
                                )}

                                {editingBlock.type === 'quote' && (
                                    <div className="pt-4 border-t border-zinc-700">
                                        <p className="text-xs text-zinc-400">Edit quote text in the Sidebar.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Main Editor Mode
                            <>
                                {activeTab === "layout" && (
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="text-white mb-2 block">Blocks (Drag to Reorder)</Label>
                                            <div className="space-y-1">
                                                {currentSettings.slots.map((block, index) => (
                                                    <DraggableBlockItem
                                                        key={block.id}
                                                        block={block}
                                                        index={index}
                                                        moveBlock={moveBlock}
                                                        onEdit={setEditingBlock}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <SliderControl
                                            label="Grid Gap"
                                            value={currentSettings.gap}
                                            min={8}
                                            max={48}
                                            step={4}
                                            onChange={(val) => onUpdateDraft("gap", val)}
                                        />

                                        <SliderControl
                                            label="Card Padding"
                                            value={currentSettings.cardPadding}
                                            min={8}
                                            max={48}
                                            step={4}
                                            onChange={(val) => onUpdateDraft("cardPadding", val)}
                                        />
                                    </div>
                                )}

                                {activeTab === "style" && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-white">Card Style</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['glass', 'solid', 'neon', 'gradient', 'minimal'].map((style) => (
                                                    <OptionButton
                                                        key={style}
                                                        selected={currentSettings.cardStyle === style}
                                                        onClick={() => onUpdateDraft("cardStyle", style)}
                                                        label={style.charAt(0).toUpperCase() + style.slice(1)}
                                                        preview={<div className={`w-full h-8 rounded ${style === 'glass' ? 'bg-zinc-800/50 border border-white/10' :
                                                            style === 'solid' ? 'bg-zinc-800 border border-zinc-700' :
                                                                style === 'neon' ? 'bg-black border border-purple-500 shadow-purple-500/50' :
                                                                    style === 'gradient' ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' :
                                                                        'border border-zinc-800'
                                                            }`} />}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <SliderControl
                                            label="Card Radius"
                                            value={currentSettings.cardBorderRadius}
                                            min={0}
                                            max={48}
                                            step={4}
                                            onChange={(val) => onUpdateDraft("cardBorderRadius", val)}
                                        />

                                        {currentSettings.cardStyle === 'solid' && (
                                            <div className="space-y-3">
                                                <Label className="text-white">Background Color</Label>
                                                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-600 shadow-sm">
                                                        <input
                                                            type="color"
                                                            value={currentSettings.cardBackground.startsWith('#') ? currentSettings.cardBackground : '#18181b'}
                                                            onChange={(e) => onUpdateDraft("cardBackground", e.target.value)}
                                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-zinc-400">Hex Code</span>
                                                        <span className="text-sm font-mono text-white uppercase">
                                                            {currentSettings.cardBackground.startsWith('#') ? currentSettings.cardBackground : 'Default'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <Label className="text-white">Glow Color</Label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {['purple', 'blue', 'green', 'orange', 'none'].map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => onUpdateDraft("glowColor", color)}
                                                        className={`h-8 rounded-full border-2 transition-all ${currentSettings.glowColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                                                            }`}
                                                        style={{
                                                            backgroundColor: color === 'none' ? '#333' : color
                                                        }}
                                                        title={color}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <SliderControl
                                            label="Name Size"
                                            value={currentSettings.nameSize}
                                            min={24}
                                            max={72}
                                            step={2}
                                            onChange={(val) => onUpdateDraft("nameSize", val)}
                                        />

                                        <SliderControl
                                            label="Title Size"
                                            value={currentSettings.titleSize}
                                            min={14}
                                            max={32}
                                            step={1}
                                            onChange={(val) => onUpdateDraft("titleSize", val)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 sm:p-4 border-t border-zinc-700 bg-zinc-800">
                        <div className="flex gap-2">
                            <button
                                onClick={onReset}
                                className="flex items-center gap-1 flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset
                            </button>
                            <button
                                onClick={onSave}
                                className="flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm text-white rounded transition-colors"
                                style={{
                                    background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                                }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={onClose}
                />
            </>
        </DndProvider>
    );
};

export default BentoHeroVisualEditor;

"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { updateSection, saveComponentCustomization } from '@/app/actions/portfolio';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePortfolioData, setComponentCustomizations } from '@/slices/dataSlice';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { ColorTheme } from '@/lib/colorThemes';
import { BentoContactCustomization, defaultBentoContactStyles, BentoContactButton } from '@/types/bento';
import { Reorder, useDragControls } from "framer-motion";

const ButtonItem = ({
    button,
    index,
    updateButton,
    removeButton,
}: {
    button: BentoContactButton;
    index: number;
    updateButton: (index: number, field: keyof BentoContactButton, value: string) => void;
    removeButton: (index: number) => void;
}) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={button}
            dragListener={false}
            dragControls={controls}
            className="flex flex-col gap-2 bg-zinc-800/50 p-3 rounded-md group relative border border-zinc-700/50"
        >
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="text-gray-400 cursor-grab active:cursor-grabbing touch-none"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <GripVertical size={14} />
                </div>
                <span className="text-xs font-medium text-gray-400">Button {index + 1}</span>
                <button
                    onClick={() => removeButton(index)}
                    className="ml-auto text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Input
                    value={button.label}
                    onChange={(e) => updateButton(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-8"
                />
                <select
                    value={button.style}
                    onChange={(e) => updateButton(index, 'style', e.target.value as any)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-8 rounded-md px-2 border w-full"
                >
                    <option value="solid">Solid</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                </select>
            </div>
            <Input
                value={button.url}
                onChange={(e) => updateButton(index, 'url', e.target.value)}
                placeholder="URL (e.g., mailto:me@example.com)"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-8"
            />
        </Reorder.Item>
    );
};

const BentoContactSidebar = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const portfolioId = params.portfolioId as string;
    const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
    const contactSection = portfolioData?.find((section: any) => section.type === "contact");

    // Merge saved customization with defaults
    // Prioritize componentCustomizations, then contactSection.customization (legacy), then defaults
    const savedCustomization = componentCustomizations?.["contact"] || contactSection?.customization || {};
    const initialCustomization: BentoContactCustomization = {
        ...defaultBentoContactStyles,
        ...savedCustomization,
        buttons: savedCustomization.buttons || defaultBentoContactStyles.buttons
    };

    const [customization, setCustomization] = useState<BentoContactCustomization>(initialCustomization);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(true);
    }, [customization]);

    const handleUpdate = (key: keyof BentoContactCustomization, value: any) => {
        setCustomization((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);

            // Update Redux
            dispatch(setComponentCustomizations({
                ...componentCustomizations,
                "contact": customization
            }));

            // Update Backend
            await saveComponentCustomization({
                portfolioId,
                componentType: "contact",
                settings: customization
            });

            // Also update section to ensure it exists in portfolioData (optional but good for consistency)
            await updateSection({
                portfolioId,
                sectionName: "contact",
                sectionContent: { customization }, // Store in data just in case
                sectionTitle: customization.title,
                sectionDescription: customization.description
            } as any);

            setHasChanges(false);
            toast.success("Contact section updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddButton = () => {
        const newButton: BentoContactButton = {
            id: Date.now().toString(),
            label: 'New Button',
            url: '',
            style: 'solid'
        };
        handleUpdate('buttons', [...customization.buttons, newButton]);
    };

    const handleRemoveButton = (index: number) => {
        const newButtons = customization.buttons.filter((_, i) => i !== index);
        handleUpdate('buttons', newButtons);
    };

    const handleUpdateButton = (index: number, field: keyof BentoContactButton, value: string) => {
        const newButtons = [...customization.buttons];
        newButtons[index] = { ...newButtons[index], [field]: value };
        handleUpdate('buttons', newButtons);
    };

    const handleReorderButtons = (newButtons: BentoContactButton[]) => {
        handleUpdate('buttons', newButtons);
    };

    return (
        <div className="flex-1 custom-scrollbar">
            <Card className="border-gray-700 min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain }}>
                <CardHeader>
                    <CardTitle style={{ color: ColorTheme.textPrimary }}>Bento Contact</CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>Customize your contact section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="space-y-2">
                        <Label style={{ color: ColorTheme.textPrimary }}>Title</Label>
                        <Input
                            value={customization.title}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label style={{ color: ColorTheme.textPrimary }}>Description</Label>
                        <Textarea
                            value={customization.description}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white h-24"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label style={{ color: ColorTheme.textPrimary }}>Buttons</Label>
                            <Button
                                onClick={handleAddButton}
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                            >
                                <Plus size={12} className="mr-1" /> Add
                            </Button>
                        </div>

                        <Reorder.Group axis="y" values={customization.buttons} onReorder={handleReorderButtons} className="space-y-2">
                            {customization.buttons.map((button, index) => (
                                <ButtonItem
                                    key={button.id}
                                    button={button}
                                    index={index}
                                    updateButton={handleUpdateButton}
                                    removeButton={handleRemoveButton}
                                />
                            ))}
                        </Reorder.Group>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full"
                        style={{ backgroundColor: ColorTheme.primary }}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default BentoContactSidebar;

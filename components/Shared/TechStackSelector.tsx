import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, ArrowLeft } from 'lucide-react';
import { techList } from '@/lib/techlist';
import { ColorTheme } from '@/lib/colorThemes';
import { Technology } from '@/types/interfaces/ProjectsCustomizationState';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

interface TechStackSelectorProps {
    selectedTech: Technology[];
    onChange: (tech: Technology[]) => void;
}

const TechStackSelector: React.FC<TechStackSelectorProps> = ({ selectedTech, onChange }) => {
    const [techSearchValue, setTechSearchValue] = useState<string>("");
    const [techSuggestions, setTechSuggestions] = useState<Technology[]>([]);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    // Custom Tech State
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customTechName, setCustomTechName] = useState("");
    const [customTechIcon, setCustomTechIcon] = useState("");

    const handleTechSearch = (value: string): void => {
        setTechSearchValue(value);
        setHasSearched(value.trim() !== "");

        if (value.trim() === "") {
            setTechSuggestions([]);
        } else {
            const results = techList.filter((item: Technology) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setTechSuggestions(results.slice(0, 6));
        }
    };

    const addTechToStack = (item: Technology): void => {
        if (!selectedTech.some(tech => tech.name === item.name)) {
            onChange([...selectedTech, item]);
        }
        setTechSearchValue("");
        setTechSuggestions([]);
        setHasSearched(false);
    };

    const handleAddCustomTech = () => {
        if (!customTechName.trim()) {
            toast.error("Please enter a technology name");
            return;
        }

        const newTech: Technology = {
            name: customTechName.trim(),
            logo: customTechIcon || `https://placehold.co/100x100?text=${customTechName.trim()}&font=montserrat&fontsize=18`
        };

        addTechToStack(newTech);

        // Reset custom state
        setIsAddingCustom(false);
        setCustomTechName("");
        setCustomTechIcon("");
        toast.success("Custom technology added!");
    };

    const removeTechItem = (name: string) => {
        const updatedTechStack = selectedTech.filter(tech => tech.name !== name);
        onChange(updatedTechStack);
    };

    if (isAddingCustom) {
        return (
            <div className="space-y-4 p-4 rounded-lg border border-dashed" style={{ borderColor: ColorTheme.borderLight }}>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Add Custom Technology</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingCustom(false)}
                        className="h-8 w-8 p-0"
                    >
                        <X size={16} />
                    </Button>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label className="text-xs" style={{ color: ColorTheme.textSecondary }}>Name</Label>
                        <Input
                            value={customTechName}
                            onChange={(e) => setCustomTechName(e.target.value)}
                            placeholder="e.g. MyCustomTool"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary
                            }}
                        />
                    </div>

                    <div className="space-y-1">
                        <ImageUpload
                            label="Icon (Optional)"
                            value={customTechIcon}
                            onChange={setCustomTechIcon}
                            className="w-full"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={() => setIsAddingCustom(false)}
                            variant="outline"
                            className="flex-1"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCustomTech}
                            className="flex-1"
                            style={{
                                backgroundColor: ColorTheme.primary,
                                color: ColorTheme.textPrimary
                            }}
                        >
                            Add Technology
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Tech Stack</Label>
            <div className='flex flex-col items-center justify-between gap-4 mb-4'>
                <Input
                    type='text'
                    value={techSearchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTechSearch(e.target.value)}
                    placeholder='Search Technologies...'
                    style={{
                        backgroundColor: ColorTheme.bgCard,
                        borderColor: ColorTheme.borderLight,
                        color: ColorTheme.textPrimary
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' && techSuggestions.length > 0) {
                            addTechToStack(techSuggestions[0]);
                        }
                    }}
                />
                <Button
                    onClick={() => {
                        setCustomTechName(techSearchValue);
                        setIsAddingCustom(true);
                    }}
                    style={{
                        backgroundColor: ColorTheme.primary,
                        color: ColorTheme.textPrimary,
                        boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                    }}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Custom Tech instead
                </Button>
            </div>

            {techSuggestions.length > 0 ? (
                <div className='mb-6'>
                    <h3 className='text-sm font-medium mb-2' style={{ color: ColorTheme.textPrimary }}>Suggestions</h3>
                    <div>
                        {techSuggestions.map((item: Technology) => (
                            <div
                                onClick={() => addTechToStack(item)}
                                key={item.name}
                                className='flex px-4 mt-2 rounded-lg items-center justify-between gap-4 py-2 cursor-pointer transition-colors'
                                style={{
                                    backgroundColor: ColorTheme.bgCard,
                                    borderColor: ColorTheme.borderLight,
                                    color: ColorTheme.textPrimary
                                }}
                            >
                                <span className='text-sm'>{item.name}</span>
                                <img src={item.logo} alt={item.name} width={25} height={25} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                hasSearched && (
                    <div className='rounded-lg p-4 text-center mb-6'
                        style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight
                        }}
                    >
                        <p className='text-sm' style={{ color: ColorTheme.textSecondary }}>No technologies found matching "{techSearchValue}"</p>
                        <Button
                            variant="link"
                            onClick={() => {
                                setCustomTechName(techSearchValue);
                                setIsAddingCustom(true);
                            }}
                            className="text-xs mt-1 h-auto p-0"
                            style={{ color: ColorTheme.primary }}
                        >
                            Create "{techSearchValue}" as custom tech
                        </Button>
                    </div>
                )
            )}

            {selectedTech && selectedTech.length > 0 ? (
                <div>
                    <h3 className='text-sm font-medium mb-2' style={{ color: ColorTheme.textPrimary }}>Selected Technologies</h3>
                    <div>
                        {selectedTech.map((item: Technology) => (
                            <div
                                key={item.name}
                                className='flex px-4 mt-2 rounded-lg items-center justify-between py-2'
                                style={{
                                    backgroundColor: ColorTheme.bgCard,
                                    borderColor: ColorTheme.borderLight
                                }}
                            >
                                <div className='flex items-center gap-4'>
                                    <img src={item.logo} alt={item.name} width={25} height={25} className="object-contain" />
                                    <span className='text-sm' style={{ color: ColorTheme.textPrimary }}>{item.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTechItem(item.name)}
                                    className='p-1 h-auto'
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: ColorTheme.textSecondary
                                    }}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='rounded-lg p-4 text-center mb-2'
                    style={{
                        backgroundColor: ColorTheme.bgCard,
                        borderColor: ColorTheme.borderLight
                    }}
                >
                    <p className='text-sm' style={{ color: ColorTheme.textSecondary }}>No technologies selected</p>
                </div>
            )}
        </div>
    );
};

export default TechStackSelector;

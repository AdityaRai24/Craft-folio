"use client";
import { RootState } from '@/store/store'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateSection } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { ColorTheme } from '@/lib/colorThemes'

const TerminalSidebar = () => {
    interface TerminalCommand {
        command: string;
        description: string;
        output: string;
    }

    const emptyCommand: TerminalCommand = {
        command: "",
        description: "",
        output: ""
    }

    const { portfolioData } = useSelector((state: RootState) => state.data)
    const terminalSection = portfolioData?.find((item: any) => item.type === "terminal");
    const terminalData = terminalSection?.data || {};

    const [commands, setCommands] = useState<TerminalCommand[]>([]);
    const [currentCommand, setCurrentCommand] = useState<TerminalCommand>(emptyCommand);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const params = useParams();
    const portfolioId = params.portfolioId as string;

    const dispatch = useDispatch();

    useEffect(() => {
        if (terminalData && terminalData.commands && terminalData.commands.length > 0) {
            setCommands(terminalData.commands);
        }
    }, [terminalData]);

    const handleSaveCommand = async () => {
        if (!currentCommand.command || !currentCommand.output) {
            toast.error("Command and Output are required");
            return;
        }

        const originalCommands = [...commands];

        try {
            let updatedCommands = [...commands];
            if (editingIndex !== null) {
                updatedCommands[editingIndex] = currentCommand;
                setEditingIndex(null);
            } else {
                // Check for duplicate command names
                if (updatedCommands.some(c => c.command.toLowerCase() === currentCommand.command.toLowerCase())) {
                    toast.error(`Command '${currentCommand.command}' already exists`);
                    return;
                }
                updatedCommands = [...commands, currentCommand];
            }

            const newData = { ...terminalData, commands: updatedCommands };

            dispatch(updatePortfolioData({
                sectionType: "terminal",
                newData: newData,
                sectionTitle: terminalSection?.sectionTitle || "Terminal",
                sectionDescription: terminalSection?.sectionDescription || "Custom terminal commands"
            }));

            const result = await updateSection({
                portfolioId: portfolioId,
                sectionName: "terminal",
                sectionContent: newData,
                sectionTitle: terminalSection?.sectionTitle || "Terminal",
                sectionDescription: terminalSection?.sectionDescription || "Custom terminal commands"
            });

            if (!result.success) {
                dispatch(updatePortfolioData({
                    sectionType: "terminal",
                    newData: { ...terminalData, commands: originalCommands },
                    sectionTitle: terminalSection?.sectionTitle,
                    sectionDescription: terminalSection?.sectionDescription
                }));
                throw new Error("Database update failed");
            }

            setCommands(updatedCommands);
            setCurrentCommand(emptyCommand);
            toast.success(editingIndex !== null ? 'Command updated!' : 'Command added!');
        } catch (error) {
            console.error(error);
            setCommands(originalCommands);
            toast.error("Failed to update command. Changes have been reverted.");
        }
    }

    const editCommand = (index: number) => {
        setCurrentCommand(commands[index]);
        setEditingIndex(index);
    }

    const deleteCommand = async (index: number) => {
        const originalCommands = [...commands];
        const updatedCommands = [...commands];
        updatedCommands.splice(index, 1);

        try {
            const newData = { ...terminalData, commands: updatedCommands };

            dispatch(updatePortfolioData({
                sectionType: "terminal",
                newData: newData,
                sectionTitle: terminalSection?.sectionTitle,
                sectionDescription: terminalSection?.sectionDescription
            }));

            const result = await updateSection({
                portfolioId: portfolioId,
                sectionName: "terminal",
                sectionContent: newData,
                sectionTitle: terminalSection?.sectionTitle,
                sectionDescription: terminalSection?.sectionDescription
            });

            if (!result.success) {
                dispatch(updatePortfolioData({
                    sectionType: "terminal",
                    newData: { ...terminalData, commands: originalCommands },
                    sectionTitle: terminalSection?.sectionTitle,
                    sectionDescription: terminalSection?.sectionDescription
                }));
                throw new Error("Database update failed");
            }

            setCommands(updatedCommands);
            toast.success("Command deleted");
        } catch (error) {
            console.error(error);
            setCommands(originalCommands);
            toast.error("Failed to delete command");
        }
    }

    return (
        <div className="custom-scrollbar h-full">
            <Card className="border-gray-700 min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain }}>
                <CardHeader>
                    <CardTitle style={{ color: ColorTheme.textPrimary }}>Terminal Commands</CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage custom terminal commands</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="command" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Command</Label>
                            <Input
                                id="command"
                                value={currentCommand.command}
                                onChange={(e) => setCurrentCommand({ ...currentCommand, command: e.target.value.replace(/\s+/g, '') })}
                                placeholder="e.g., mycommand"
                                style={{
                                    backgroundColor: ColorTheme.bgCard,
                                    borderColor: ColorTheme.borderLight,
                                    color: ColorTheme.textPrimary
                                }}
                            />
                            <p className="text-xs" style={{ color: ColorTheme.textMuted }}>Single word, no spaces</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Description</Label>
                            <Input
                                id="description"
                                value={currentCommand.description}
                                onChange={(e) => setCurrentCommand({ ...currentCommand, description: e.target.value })}
                                placeholder="What does this command do?"
                                style={{
                                    backgroundColor: ColorTheme.bgCard,
                                    borderColor: ColorTheme.borderLight,
                                    color: ColorTheme.textPrimary
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Output</Label>
                            <Textarea
                                id="output"
                                value={currentCommand.output}
                                onChange={(e) => setCurrentCommand({ ...currentCommand, output: e.target.value })}
                                placeholder="The result shown when command is run"
                                className="resize-none h-32 font-mono"
                                style={{
                                    backgroundColor: ColorTheme.bgCard,
                                    borderColor: ColorTheme.borderLight,
                                    color: ColorTheme.textPrimary
                                }}
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleSaveCommand}
                            className="w-full"
                            style={{
                                backgroundColor: ColorTheme.primary,
                                color: ColorTheme.textPrimary,
                                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                            }}
                        >
                            {editingIndex !== null ? 'Update Command' : 'Add Command'}
                        </Button>
                    </div>

                    {commands.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>Custom Commands</h3>
                            <div className="space-y-4">
                                {commands.map((cmd, index) => (
                                    <div key={index} className="p-4 rounded-lg border"
                                        style={{
                                            backgroundColor: ColorTheme.bgCard,
                                            borderColor: ColorTheme.borderLight
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm px-2 py-1 rounded bg-gray-800 text-green-400">{cmd.command}</span>
                                                    <span className="text-sm" style={{ color: ColorTheme.textSecondary }}>- {cmd.description}</span>
                                                </div>
                                                <div className="mt-2 text-xs font-mono p-2 rounded bg-black/20 whitespace-pre-wrap" style={{ color: ColorTheme.textMuted }}>
                                                    {cmd.output.substring(0, 50)}{cmd.output.length > 50 ? '...' : ''}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => editCommand(index)}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        color: ColorTheme.textSecondary
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteCommand(index)}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        color: ColorTheme.textSecondary
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default TerminalSidebar

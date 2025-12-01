"use client";
import { RootState } from '@/store/store'
import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash, RotateCcw, EyeOff } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateSection } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { ColorTheme } from '@/lib/colorThemes'

const EMPTY_OBJECT = {};
const EMPTY_ARRAY: any[] = [];

const TerminalSidebar = () => {
    interface TerminalCommand {
        command: string;
        description: string;
        output: string;
        isDefault?: boolean;
        isHidden?: boolean;
    }

    const emptyCommand: TerminalCommand = {
        command: "",
        description: "",
        output: ""
    }

    const { portfolioData } = useSelector((state: RootState) => state.data)

    const terminalSection = useMemo(() => portfolioData?.find((item: any) => item.type === "terminal"), [portfolioData]);
    const terminalData = useMemo(() => terminalSection?.data || EMPTY_OBJECT, [terminalSection]);

    // Data for default command generation
    const heroData = useMemo(() => portfolioData?.find((item: any) => item.type === "hero")?.data || EMPTY_OBJECT, [portfolioData]);
    const userInfoData = useMemo(() => portfolioData?.find((item: any) => item.type === "userInfo")?.data || EMPTY_OBJECT, [portfolioData]);

    // Fix: Correctly extract projects array whether it's direct or wrapped in an object
    const projectsData = useMemo(() => {
        const projectsSection = portfolioData?.find((item: any) => item.type === "projects")?.data;
        if (Array.isArray(projectsSection)) return projectsSection;
        if (projectsSection?.projects && Array.isArray(projectsSection.projects)) return projectsSection.projects;
        return EMPTY_ARRAY;
    }, [portfolioData]);

    const experienceData = useMemo(() => portfolioData?.find((item: any) => item.type === "experience")?.data || EMPTY_ARRAY, [portfolioData]);
    const technologiesData = useMemo(() => portfolioData?.find((item: any) => item.type === "technologies")?.data || EMPTY_ARRAY, [portfolioData]);

    const [commands, setCommands] = useState<TerminalCommand[]>([]);
    const [currentCommand, setCurrentCommand] = useState<TerminalCommand>(emptyCommand);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // Index in the COMBINED list

    const params = useParams();
    const portfolioId = params.portfolioId as string;

    const dispatch = useDispatch();

    // Helper to extract skill name
    const getSkillName = (skill: any) => {
        if (typeof skill === 'string') return skill;
        return skill.name || "";
    };

    // Generate default commands
    const getDefaultCommands = (): TerminalCommand[] => {
        // Generate skills output
        const getSkillsOutput = () => {
            const allSkills = new Set<string>();

            // 1. Add skills from Technologies section
            if (technologiesData) {
                if (technologiesData.categories) {
                    technologiesData.categories.forEach((cat: any) => {
                        if (cat.technologies) {
                            cat.technologies.forEach((t: any) => allSkills.add(getSkillName(t)));
                        }
                    });
                } else if (Array.isArray(technologiesData)) {
                    technologiesData.forEach((t: any) => allSkills.add(getSkillName(t)));
                }
            }

            // 2. Add skills from Projects
            if (projectsData && Array.isArray(projectsData)) {
                projectsData.forEach((project: any) => {
                    if (project.techStack && Array.isArray(project.techStack)) {
                        project.techStack.forEach((t: any) => allSkills.add(getSkillName(t)));
                    }
                });
            }

            // 3. Add skills from Experience
            if (experienceData && Array.isArray(experienceData)) {
                experienceData.forEach((exp: any) => {
                    if (exp.techStack && Array.isArray(exp.techStack)) {
                        exp.techStack.forEach((t: any) => allSkills.add(getSkillName(t)));
                    }
                });
            }

            const uniqueSkills = Array.from(allSkills).filter(Boolean).sort();

            if (uniqueSkills.length > 0) {
                const skillList = uniqueSkills.map(s => `  • ${s}`).join("\n");
                return `Technologies I work with (aggregated from all sections):\n${skillList}`;
            }

            return `Technologies I work with:
  • JavaScript/TypeScript
  • React/Next.js
  • Node.js
  • Python
  • And more...`;
        };

        return [
            {
                command: "about",
                description: "About me",
                output: `Name: ${heroData.name || "Developer"}\nTitle: ${heroData.title || "Software Developer"}\n${heroData.summary || "Passionate about building amazing software."}`,
                isDefault: true
            },
            {
                command: "skills",
                description: "My skills",
                output: getSkillsOutput(),
                isDefault: true
            },
            {
                command: "contact",
                description: "Contact information",
                output: `Get in touch:\n  Email: ${userInfoData.email || "your.email@example.com"}\n  GitHub: ${userInfoData.github || "github.com/username"}\n  LinkedIn: ${userInfoData.linkedin || "linkedin.com/in/username"}`,
                isDefault: true
            },
            {
                command: "projects",
                description: "List my projects",
                output: projectsData.length > 0
                    ? `My Projects:\n${projectsData.slice(0, 5).map((project: any, idx: number) => {
                        const title = project.projectName || project.projectTitle || `Project ${idx + 1}`;
                        const desc = project.projectDescription ? `\n    ${project.projectDescription}` : "";
                        return `${idx + 1}. ${title}${desc}`;
                    }).join("\n\n")}\n\nTotal: ${projectsData.length} projects`
                    : "No projects found.",
                isDefault: true
            },
            {
                command: "experience",
                description: "My work experience",
                output: experienceData.length > 0
                    ? `Work Experience:\n${experienceData.slice(0, 5).map((exp: any, idx: number) => {
                        const role = exp.role || "Role";
                        const company = exp.companyName || "Company";
                        const desc = exp.description ? `\n    ${exp.description}` : "";
                        return `${idx + 1}. ${role} at ${company}${desc}`;
                    }).join("\n\n")}\n\nTotal: ${experienceData.length} positions`
                    : "No experience found.",
                isDefault: true
            }
        ];
    };

    useEffect(() => {
        const defaults = getDefaultCommands();
        const customCommands = terminalData.commands || [];
        const hiddenCommands = terminalData.hiddenCommands || [];

        // Merge logic:
        // 1. Start with defaults
        // 2. If a custom command exists with same name, it overrides default (replace it)
        // 3. If a command is in hiddenCommands, mark it as hidden

        const mergedCommands: TerminalCommand[] = [];
        const processedCommands = new Set<string>();

        // Add defaults (or their overrides)
        defaults.forEach(def => {
            const custom = customCommands.find((c: any) => c.command.toLowerCase() === def.command.toLowerCase());
            const isHidden = hiddenCommands.includes(def.command.toLowerCase());

            if (custom) {
                mergedCommands.push({ ...custom, isDefault: true, isHidden }); // It's a default that has been overridden
            } else {
                mergedCommands.push({ ...def, isHidden });
            }
            processedCommands.add(def.command.toLowerCase());
        });

        // Add remaining custom commands
        customCommands.forEach((custom: any) => {
            if (!processedCommands.has(custom.command.toLowerCase())) {
                mergedCommands.push(custom);
            }
        });

        setCommands(mergedCommands);
    }, [terminalData, heroData, userInfoData, projectsData, experienceData, technologiesData]); // Re-run when data changes

    const updateDB = async (newCommands: any[], newHiddenCommands: string[]) => {
        const newData = {
            ...terminalData,
            commands: newCommands,
            hiddenCommands: newHiddenCommands
        };

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
            throw new Error("Database update failed");
        }
    };

    const handleSaveCommand = async () => {
        if (!currentCommand.command || !currentCommand.output) {
            toast.error("Command and Output are required");
            return;
        }

        try {
            const customCommands = [...(terminalData.commands || [])];
            const hiddenCommands = [...(terminalData.hiddenCommands || [])];

            // Check if we are updating an existing custom command or overriding a default
            const existingIndex = customCommands.findIndex((c: any) => c.command.toLowerCase() === currentCommand.command.toLowerCase());

            if (existingIndex >= 0) {
                customCommands[existingIndex] = {
                    command: currentCommand.command,
                    description: currentCommand.description,
                    output: currentCommand.output
                };
            } else {
                customCommands.push({
                    command: currentCommand.command,
                    description: currentCommand.description,
                    output: currentCommand.output
                });
            }

            // If it was hidden, unhide it
            const hiddenIndex = hiddenCommands.indexOf(currentCommand.command.toLowerCase());
            if (hiddenIndex >= 0) {
                hiddenCommands.splice(hiddenIndex, 1);
            }

            await updateDB(customCommands, hiddenCommands);

            setCurrentCommand(emptyCommand);
            setEditingIndex(null);
            toast.success('Command saved!');
        } catch (error) {
            console.error(error);
            toast.error("Failed to save command.");
        }
    }

    const editCommand = (cmd: TerminalCommand, index: number) => {
        setCurrentCommand(cmd);
        setEditingIndex(index);
    }

    const deleteCommand = async (cmd: TerminalCommand) => {
        try {
            let customCommands = [...(terminalData.commands || [])];
            let hiddenCommands = [...(terminalData.hiddenCommands || [])];

            if (cmd.isDefault) {
                // If it's a default command
                // 1. Remove any custom override
                customCommands = customCommands.filter((c: any) => c.command.toLowerCase() !== cmd.command.toLowerCase());
                // 2. Add to hidden list
                if (!hiddenCommands.includes(cmd.command.toLowerCase())) {
                    hiddenCommands.push(cmd.command.toLowerCase());
                }
            } else {
                // Pure custom command - just remove it
                customCommands = customCommands.filter((c: any) => c.command.toLowerCase() !== cmd.command.toLowerCase());
            }

            await updateDB(customCommands, hiddenCommands);
            toast.success("Command deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete command");
        }
    }

    const restoreCommand = async (cmd: TerminalCommand) => {
        try {
            let customCommands = [...(terminalData.commands || [])];
            let hiddenCommands = [...(terminalData.hiddenCommands || [])];

            // Remove from hidden list
            hiddenCommands = hiddenCommands.filter(c => c !== cmd.command.toLowerCase());

            // Remove custom override if user wants to reset to original default? 
            // The user might want to just "unhide" the overridden version.
            // But "Restore" usually implies "Reset to default".
            // Let's assume Restore = Reset to Default AND Unhide.
            customCommands = customCommands.filter((c: any) => c.command.toLowerCase() !== cmd.command.toLowerCase());

            await updateDB(customCommands, hiddenCommands);
            toast.success("Command restored to default");
        } catch (error) {
            console.error(error);
            toast.error("Failed to restore command");
        }
    }

    return (
        <div className="custom-scrollbar h-full">
            <Card className="border-gray-700 min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain }}>
                <CardHeader>
                    <CardTitle style={{ color: ColorTheme.textPrimary }}>Terminal Commands</CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage terminal commands. Default commands can be overridden or hidden.</CardDescription>
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
                                disabled={editingIndex !== null && currentCommand.isDefault} // Cannot change name of default command when editing
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

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={handleSaveCommand}
                                className="flex-1"
                                style={{
                                    backgroundColor: ColorTheme.primary,
                                    color: ColorTheme.textPrimary,
                                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                                }}
                            >
                                {editingIndex !== null ? 'Update Command' : 'Add Command'}
                            </Button>
                            {editingIndex !== null && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setCurrentCommand(emptyCommand);
                                        setEditingIndex(null);
                                    }}
                                    variant="outline"
                                    style={{
                                        borderColor: ColorTheme.borderLight,
                                        color: ColorTheme.textPrimary
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>

                    {commands.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>All Commands</h3>
                            <div className="space-y-4">
                                {commands.map((cmd, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${cmd.isHidden ? 'opacity-50' : ''}`}
                                        style={{
                                            backgroundColor: ColorTheme.bgCard,
                                            borderColor: ColorTheme.borderLight
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-mono text-sm px-2 py-1 rounded bg-gray-800 text-green-400">{cmd.command}</span>
                                                        {cmd.isDefault && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Default</span>}
                                                        {cmd.isHidden && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">Hidden</span>}
                                                    </div>
                                                    <span className="text-sm" style={{ color: ColorTheme.textSecondary }}>{cmd.description}</span>
                                                </div>
                                                <div className="mt-2 text-xs font-mono p-2 rounded bg-black/20 whitespace-pre-wrap" style={{ color: ColorTheme.textMuted }}>
                                                    {cmd.output.substring(0, 50)}{cmd.output.length > 50 ? '...' : ''}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-2">
                                                {!cmd.isHidden && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => editCommand(cmd, index)}
                                                        title="Edit"
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            color: ColorTheme.textSecondary
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {cmd.isDefault && (cmd.isHidden || terminalData.commands?.some((c: any) => c.command.toLowerCase() === cmd.command.toLowerCase())) ? (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => restoreCommand(cmd)}
                                                        title="Restore Default"
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            color: ColorTheme.textSecondary
                                                        }}
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                ) : null}

                                                {!cmd.isHidden && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteCommand(cmd)}
                                                        title={cmd.isDefault ? "Hide Command" : "Delete Command"}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            color: ColorTheme.textSecondary
                                                        }}
                                                    >
                                                        {cmd.isDefault ? <EyeOff className="h-4 w-4" /> : <Trash className="h-4 w-4" />}
                                                    </Button>
                                                )}
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

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Edit2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { shouldShowEditButtons } from "@/components/Shared/EditButton";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { useWindowsTheme } from "./ThemeContext";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultMacOSTerminalStyles } from "@/types/terminal/macos"; // Reusing types

const Terminal = ({ theme = "light", portfolioId, font }: { theme?: "light" | "dark"; portfolioId?: string; font?: string }) => {
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const heroData = portfolioData?.find((item: any) => item.type === "hero")?.data || {};
    const userInfoData = portfolioData?.find((item: any) => item.type === "userInfo")?.data || {};

    // Fix: Correctly extract projects array whether it's direct or wrapped in an object
    const projectsSection = portfolioData?.find((item: any) => item.type === "projects")?.data;
    const projectsData = Array.isArray(projectsSection) ? projectsSection : (projectsSection?.projects || []);

    const experienceData = portfolioData?.find((item: any) => item.type === "experience")?.data || [];
    const technologiesData = portfolioData?.find((item: any) => item.type === "technologies")?.data || [];
    const terminalData = portfolioData?.find((item: any) => item.type === "terminal")?.data || {};
    const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
    const { user, isLoaded } = useUser();
    const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);
    const currentlyEditing = useSelector((state: RootState) => state.editMode.currentlyEditing);
    const dispatch = useDispatch();
    const isEditing = currentlyEditing === "terminal";
    const { currentTheme } = useWindowsTheme();

    const {
        customization,
        effectiveCustomization,
        visualEditorOpen,
        setVisualEditorOpen,
        openVisualEditor,
        updateDraftCustomization,
        saveDraftCustomization,
        resetCustomization,
        draftCustomization
    } = useCustomization("terminal", defaultMacOSTerminalStyles, portfolioId || "");

    const [commandHistory, setCommandHistory] = useState<string[]>([
        effectiveCustomization.startMessage,
        "",
    ]);
    const [currentCommand, setCurrentCommand] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const isDark = theme === "dark";

    // Helper to extract skill name
    const getSkillName = (skill: any) => {
        if (typeof skill === 'string') return skill;
        return skill.name || "";
    };

    // Keep only key commands
    const commands: Record<string, (args?: string) => string> = {
        help: () => `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  about         - About me
  skills        - My skills
  contact       - Contact information
  projects      - List my projects
  experience    - My work experience
${terminalData.commands?.map((cmd: any) => `  ${cmd.command.padEnd(12)} - ${cmd.description}`).join("\n") || ""}`,
        clear: () => {
            setCommandHistory([""]);
            return "";
        },
        about: () => {
            const name = heroData.name || "Developer";
            const title = heroData.title || "Software Developer";
            const summary = heroData.summary || "Passionate about building amazing software.";
            return `Name: ${name}
Title: ${title}
${summary}`;
        },
        skills: () => {
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
        },
        contact: () => {
            const email = userInfoData.email || "your.email@example.com";
            const github = userInfoData.github || "github.com/username";
            const linkedin = userInfoData.linkedin || "linkedin.com/in/username";
            return `Get in touch:
  Email: ${email}
  GitHub: ${github}
  LinkedIn: ${linkedin}`;
        },
        projects: () => {
            if (projectsData && projectsData.length > 0) {
                const projectList = projectsData
                    .slice(0, 5)
                    .map((project: any, idx: number) => {
                        const title = project.projectName || project.projectTitle || `Project ${idx + 1}`;
                        const desc = project.projectDescription ? `\n    ${project.projectDescription}` : "";
                        return `${idx + 1}. ${title}${desc}`;
                    })
                    .join("\n\n");
                return `My Projects:\n${projectList}\n\nTotal: ${projectsData.length} projects`;
            }
            return "No projects found.";
        },
        experience: () => {
            if (experienceData && experienceData.length > 0) {
                const expList = experienceData
                    .slice(0, 5)
                    .map((exp: any, idx: number) => {
                        const role = exp.role || "Role";
                        const company = exp.companyName || "Company";
                        const desc = exp.description ? `\n    ${exp.description}` : "";
                        return `${idx + 1}. ${role} at ${company}${desc}`;
                    })
                    .join("\n\n");
                return `Work Experience:\n${expList}\n\nTotal: ${experienceData.length} positions`;
            }
            return "No experience found.";
        },
    };

    // Add custom commands
    if (terminalData.commands) {
        terminalData.commands.forEach((cmd: any) => {
            commands[cmd.command.toLowerCase()] = () => cmd.output;
        });
    }

    // Remove hidden commands
    if (terminalData.hiddenCommands) {
        terminalData.hiddenCommands.forEach((cmd: string) => {
            delete commands[cmd.toLowerCase()];
        });
    }

    const executeCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return "";

        const [command] = trimmedCmd.split(" ");

        // Handle clear command separately
        if (command.toLowerCase() === "clear") {
            setCommandHistory([""]);
            return "";
        }

        const handler = commands[command.toLowerCase()];
        if (handler) {
            return handler();
        }

        return `Command not found: ${command}. Type 'help' for available commands.`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCommand.trim()) return;

        const cmd = currentCommand.trim();

        // Handle clear command separately
        if (cmd.toLowerCase() === "clear") {
            setCommandHistory([""]);
            setCurrentCommand("");
            return;
        }

        const newHistory = [...commandHistory];
        newHistory.push(`${effectiveCustomization.promptString} ${cmd}`);

        const output = executeCommand(cmd);
        if (output) {
            newHistory.push(output);
        }
        newHistory.push("");

        setCommandHistory(newHistory);
        setCurrentCommand("");
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [commandHistory]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Extract command keywords for highlighting
    const highlightCommand = (line: string) => {
        if (!line.startsWith(`${effectiveCustomization.promptString} `)) return line;

        const parts = line.split(" ");
        if (parts.length < 2) return line;

        const command = parts[1];
        const rest = parts.slice(2).join(" ");

        return (
            <>
                <span style={{ color: currentTheme.primary }}>{effectiveCustomization.promptString}</span>{" "}
                <span style={{ color: currentTheme.primaryHover }}>{command}</span>
                {rest && <span> {rest}</span>}
            </>
        );
    };

    return (
        <div
            className={`w-full h-full flex flex-col font-mono text-sm relative ${font || ""} ${isDark ? "bg-[#0c0c0c] text-white" : "bg-white text-gray-900"}`}
        >
            {showEdit && !isEditing && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => dispatch(setCurrentEdit("terminal"))}
                        className={`flex items-center cursor-pointer justify-center gap-3 rounded-lg border-dashed backdrop-blur bg-white/80 tracking-wider dark:bg-black/60 border border-dashed border-gray-400 dark:border-gray-600 shadow-md text-gray-900 dark:text-gray-100 hover:bg-white/90 dark:hover:bg-black/80 transition-all px-4 py-2 text-sm font-medium`}
                        title="Edit Commands"
                    >
                        <Edit2 size={14} />
                        <span>Edit</span>
                    </button>
                </div>
            )}
            <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto p-5 space-y-1"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: isDark ? "#4b5563 transparent" : "#d1d5db transparent",
                    fontFamily: effectiveCustomization.fontFamily,
                    fontSize: `${effectiveCustomization.fontSize}px`,
                    lineHeight: effectiveCustomization.lineHeight,
                    opacity: effectiveCustomization.opacity
                }}
            >
                {commandHistory.map((line, index) => {
                    const isCommand = line.startsWith(`${effectiveCustomization.promptString} `);
                    const isError = line.includes("Command not found");

                    return (
                        <div
                            key={index}
                            className="whitespace-pre-wrap break-words leading-relaxed"
                            style={{
                                color: isCommand
                                    ? (isDark ? "#4ade80" : "#16a34a") // Green for commands
                                    : isError
                                        ? "#f48771"
                                        : (isDark ? "#e5e7eb" : "#1f2937") // Standard text color
                            }}
                        >
                            {isCommand ? highlightCommand(line) : line}
                        </div>
                    );
                })}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
                    <span style={{ color: isDark ? "#4ade80" : "#16a34a" }} className="font-semibold">{effectiveCustomization.promptString}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        className={`flex-1 bg-transparent border-none outline-none ${isDark ? "text-white caret-white" : "text-gray-900 caret-gray-900"}`}
                        style={{
                            fontFamily: "inherit",
                        }}
                        autoFocus
                        autoComplete="off"
                    />
                </form>
            </div>
        </div>
    );
};

export default Terminal;

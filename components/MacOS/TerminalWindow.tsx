"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const TerminalWindow = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const heroData = portfolioData?.find((item: any) => item.type === "hero")?.data || {};
  const userInfoData = portfolioData?.find((item: any) => item.type === "userInfo")?.data || {};
  const projectsData = portfolioData?.find((item: any) => item.type === "projects")?.data || [];
  const experienceData = portfolioData?.find((item: any) => item.type === "experience")?.data || [];
  const technologiesData = portfolioData?.find((item: any) => item.type === "technologies")?.data || [];

  const [commandHistory, setCommandHistory] = useState<string[]>([
    "Welcome to Terminal",
    "Type 'help' for available commands",
    "",
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

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
  ls            - List files
  pwd           - Print working directory
  whoami        - Show username`,
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
      if (technologiesData && technologiesData.length > 0) {
        const techList = technologiesData.map((tech: any) => `  • ${tech.name || tech}`).join("\n");
        return `Technologies I work with:\n${techList}`;
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
          .map((project: any, idx: number) => `${idx + 1}. ${project.projectName || project.projectTitle || `Project ${idx + 1}`}`)
          .join("\n");
        return `My Projects:\n${projectList}\n\nTotal: ${projectsData.length} projects`;
      }
      return "No projects found.";
    },
    experience: () => {
      if (experienceData && experienceData.length > 0) {
        const expList = experienceData
          .slice(0, 5)
          .map((exp: any, idx: number) => `${idx + 1}. ${exp.role || "Role"} at ${exp.companyName || "Company"}`)
          .join("\n");
        return `Work Experience:\n${expList}\n\nTotal: ${experienceData.length} positions`;
      }
      return "No experience found.";
    },
    ls: () => `portfolio/
  projects/
  experience/
  contact.md
  resume.pdf
  README.md`,
    pwd: () => `/Users/${heroData.name?.toLowerCase().replace(/\s+/g, "") || "portfolio"}`,
    whoami: () => heroData.name?.toLowerCase().replace(/\s+/g, "") || "portfolio-user",
  };

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
    newHistory.push(`$ ${cmd}`);
    
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
    if (!line.startsWith("$ ")) return line;
    
    const parts = line.split(" ");
    if (parts.length < 2) return line;
    
    const command = parts[1];
    const rest = parts.slice(2).join(" ");
    
    return (
      <>
        <span style={{ color: "#4ec9b0" }}>$</span>{" "}
        <span style={{ color: "#dcdcaa" }}>{command}</span>
        {rest && <span> {rest}</span>}
      </>
    );
  };

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]"} font-mono text-sm`}>
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-5 space-y-1"
        style={{ 
          scrollbarWidth: "thin", 
          scrollbarColor: isDark ? "rgba(100, 100, 100, 0.3) transparent" : "rgba(0, 0, 0, 0.2) transparent",
          fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace"
        }}
      >
        {commandHistory.map((line, index) => {
          const isCommand = line.startsWith("$ ");
          const isError = line.includes("Command not found");
          
          return (
            <div 
              key={index} 
              className="whitespace-pre-wrap break-words leading-relaxed"
              style={{ 
                color: isCommand 
                  ? (isDark ? "#4ec9b0" : "#059669")
                  : isError 
                    ? (isDark ? "#f48771" : "#dc2626")
                    : (isDark ? "#d4d4d4" : "#1f2937")
              }}
            >
              {isCommand ? highlightCommand(line) : line}
            </div>
          );
        })}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
          <span style={{ color: isDark ? "#4ec9b0" : "#059669" }} className="font-semibold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className={`flex-1 bg-transparent border-none outline-none ${isDark ? "text-[#d4d4d4]" : "text-[#1f2937]"}`}
            style={{ 
              fontFamily: "inherit",
              caretColor: isDark ? "#4ec9b0" : "#059669"
            }}
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalWindow;

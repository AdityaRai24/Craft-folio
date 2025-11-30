import { TerminalCustomizationState } from "./portfolio";

export const defaultMacOSTerminalStyles: TerminalCustomizationState = {
    fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
    fontSize: 14,
    lineHeight: 1.5,
    cursorStyle: "block",
    showTrafficLights: true,
    opacity: 0.95,
    promptString: "$",
    startMessage: "Welcome to Terminal. Type 'help' for available commands.",
};

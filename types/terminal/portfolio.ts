export interface TerminalCustomizationState {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    cursorStyle: "block" | "underline" | "bar";
    showTrafficLights: boolean;
    opacity: number;
    promptString: string;
    startMessage: string;
}

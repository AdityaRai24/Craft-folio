export interface WindowsWidgetCustomizationState {
    isVisible: boolean;
    showTime: boolean;
    showDate: boolean;
    showGreeting: boolean;
    position: "top-right" | "top-left" | "center" | "bottom-right" | "bottom-left";
    style: "modern" | "classic" | "minimal" | "glass" | "neumorphic";
    customGreeting: string;
}

export const defaultWindowsWidgetStyles: WindowsWidgetCustomizationState = {
    isVisible: true,
    showTime: true,
    showDate: true,
    showGreeting: true,
    position: "top-right",
    style: "minimal",
    customGreeting: "",
};

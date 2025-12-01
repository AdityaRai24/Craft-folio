export interface MacOSWidgetCustomizationState {
    isVisible: boolean;
    showTime: boolean;
    showDate: boolean;
    showGreeting: boolean;
    position: "top-left" | "center" | "top-right" | "bottom-left" | "center-bottom" | "bottom-right";
    style: "modern" | "classic" | "minimal" | "glass" | "neumorphic";
    customGreeting: string;
}

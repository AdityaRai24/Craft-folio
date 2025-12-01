export interface SafariCustomizationState {
    toolbarStyle: "default" | "glass" | "solid";
    showTrafficLights: boolean;
    showNavigationButtons: boolean;
    showHomeButton: boolean;
    showReloadButton: boolean;
    showUrlBar: boolean;
    urlBarText: string;
    animationSpeed: number;
    startUrl: string;
    font: string;
}

export interface NavbarCustomizationState {
    layout: "fixed" | "sticky" | "floating";
    style: "glass" | "solid" | "transparent" | "gradient";
    showLogo: boolean;
    logoSize: number;
    showLinks: boolean;
    linkSpacing: number;
    showThemeToggle: boolean;
    showMobileMenu: boolean;
    maxWidth: "full" | "boxed" | "wide";
    backgroundColor: string;
    textColor: string;
    activeLinkColor: string;
    height: number;
    blurIntensity: number;
    borderVisible: boolean;
    shadowVisible: boolean;
}

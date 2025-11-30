import { NavbarCustomizationState } from "./portfolio";

export const defaultNeoSparkNavbarStyles: NavbarCustomizationState = {
    layout: "sticky",
    style: "glass",
    showLogo: true,
    logoSize: 32,
    showLinks: true,
    linkSpacing: 32,
    showThemeToggle: false, // NeoSpark handles theme differently
    showMobileMenu: true,
    maxWidth: "boxed",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    textColor: "#ffffff",
    activeLinkColor: "#4ade80",
    height: 64,
    blurIntensity: 16,
    borderVisible: true,
    shadowVisible: false,
};

import { NavbarCustomizationState } from "@/types/interfaces/NavbarCustomizationState";

export const defaultSimpleWhiteNavbarStyles: NavbarCustomizationState = {
    layout: "fixed",
    style: "solid",
    showLogo: true,
    logoSize: 36,
    showLinks: true,
    linkSpacing: 24,
    showThemeToggle: false,
    showMobileMenu: true,
    maxWidth: "full",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    activeLinkColor: "#2563eb",
    height: 80,
    blurIntensity: 0,
    borderVisible: false,
    shadowVisible: true,
};

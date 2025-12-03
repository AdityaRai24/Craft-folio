export interface SidebarCustomizationState {
    width: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    showProfileImage: boolean;
    profileImageSize: number;
    showName: boolean;
    showTitle: boolean;
    showSocialLinks: boolean;
    showDownloadButton: boolean;
    showFooter: boolean;
    layout: "fixed" | "collapsible";
    alignment: "left" | "right";
}

export type SocialPlatform =
    | "github"
    | "linkedin"
    | "twitter"
    | "instagram"
    | "youtube"
    | "facebook"
    | "dribbble"
    | "behance"
    | "email"
    | "website"
    | "location"
    | "other";

export interface SocialLink {
    id: string;
    platform: SocialPlatform;
    url: string;
    label?: string; // Optional custom label
}

export interface CanvasCustomization {
    navbarVisible: boolean;
    maxWidth: string;
}

export const defaultCanvasCustomization: CanvasCustomization = {
    navbarVisible: true,
    maxWidth: "75%",
};

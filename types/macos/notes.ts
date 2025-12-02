export interface NotesCustomizationState {
    sidebarVisible: boolean;
    sidebarWidth: number;
    font: string;
}

export const defaultMacOSNotesStyles: NotesCustomizationState = {
    sidebarVisible: true,
    sidebarWidth: 250,
    font: "Inter",
};

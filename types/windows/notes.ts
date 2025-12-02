export interface NotesCustomizationState {
    sidebarVisible: boolean;
    sidebarWidth: number;
    font: string;
}

export const defaultWindowsNotesStyles: NotesCustomizationState = {
    sidebarVisible: true,
    sidebarWidth: 250,
    font: "Segoe UI",
};

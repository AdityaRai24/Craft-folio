import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setComponentCustomizations } from "@/slices/dataSlice";
import {
    getComponentCustomization,
    saveComponentCustomization,
    deleteComponentCustomization
} from "@/app/actions/portfolio";
import toast from "react-hot-toast";

/**
 * Centralized hook for component customization logic
 * Eliminates 50-70 lines of duplicate code from every customizable component
 * 
 * @param componentType - The type of component (e.g., "project", "experience", "hero")
 * @param defaultStyles - Default customization values for this component
 * @returns Object with customization state and handlers
 */
export function useCustomization<T extends Record<string, any>>(
    componentType: string,
    defaultStyles: T,
    portfolioId: string
) {
    const dispatch = useDispatch();
    const { componentCustomizations } = useSelector((state: RootState) => state.data);

    // Main customization state (from DB or default)
    const [customization, setCustomization] = useState<T>(defaultStyles);

    // Local draft state for visual editor
    const [draftCustomization, setDraftCustomization] = useState<T | null>(null);

    // Visual editor open state
    const [visualEditorOpen, setVisualEditorOpen] = useState(false);

    const { previewMode } = useSelector((state: RootState) => state.editMode);

    // Close visual editor when preview mode is active
    useEffect(() => {
        if (previewMode) {
            setVisualEditorOpen(false);
        }
    }, [previewMode]);

    // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
    const effectiveCustomization = visualEditorOpen && draftCustomization
        ? draftCustomization
        : customization;

    // Load customizations from Redux or fetch from DB
    useEffect(() => {
        const loadCustomizations = async () => {
            try {
                if (componentCustomizations && componentCustomizations[componentType]) {
                    // Use from Redux if available
                    setCustomization({
                        ...defaultStyles,
                        ...componentCustomizations[componentType],
                    });
                } else {
                    // Fetch from database
                    const result = await getComponentCustomization({
                        portfolioId,
                        componentType,
                    });
                    if (result.success && result.data) {
                        setCustomization({
                            ...defaultStyles,
                            ...(result.data as T),
                        });
                    } else {
                        setCustomization(defaultStyles);
                    }
                }
            } catch (error) {
                setCustomization(defaultStyles);
            }
        };
        if (portfolioId) loadCustomizations();
    }, [portfolioId, componentCustomizations, componentType, defaultStyles, dispatch]);

    // When opening the editor, copy customization to draft
    const openVisualEditor = () => {
        setDraftCustomization({ ...customization });
        setVisualEditorOpen(true);
    };

    // All visual editor controls update draftCustomization
    const updateDraftCustomization = (key: keyof T, value: any) => {
        if (!draftCustomization) return;
        setDraftCustomization({ ...draftCustomization, [key]: value });
    };

    // When 'Done' is clicked, save draft to DB and update main state
    const saveDraftCustomization = async () => {
        if (!draftCustomization) return;
        setCustomization(draftCustomization);
        setVisualEditorOpen(false);
        try {
            const result = await saveComponentCustomization({
                portfolioId,
                componentType,
                settings: draftCustomization,
            });
            if (result.success) {
                // Update Redux state
                dispatch(setComponentCustomizations({
                    ...componentCustomizations,
                    [componentType]: draftCustomization
                }));
                toast.success("Customization saved successfully");
            } else {
                toast.error("Failed to save customization");
            }
        } catch (error) {
            toast.error("Failed to save customization");
        }
    };

    // On reset, delete from DB, set both states to default, and close editor
    const resetCustomization = async () => {
        try {
            await deleteComponentCustomization({
                portfolioId,
                componentType,
            });
            setCustomization(defaultStyles);
            setDraftCustomization(defaultStyles);
            setVisualEditorOpen(false);
            // Update Redux state
            const updatedCustomizations = { ...componentCustomizations };
            delete updatedCustomizations[componentType];
            dispatch(setComponentCustomizations(updatedCustomizations));
            toast.success("Customization reset successfully");
        } catch (error) {
            toast.error("Failed to reset customization");
        }
    };

    return {
        // State
        customization,
        draftCustomization,
        effectiveCustomization,
        visualEditorOpen,

        // Setters
        setCustomization,
        setDraftCustomization,
        setVisualEditorOpen,

        // Actions
        openVisualEditor,
        updateDraftCustomization,
        saveDraftCustomization,
        resetCustomization,
    };
}

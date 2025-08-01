import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";

export const useComponentCustomization = <T extends object>(
  portfolioId: string,
  componentType: string,
  defaultCustomization: T
) => {
  const loadCustomizations = async (setCustomization: (customization: T) => void) => {
    try {
      const result = await getComponentCustomization({
        portfolioId,
        componentType,
      });
      
      if (result.success && result.data) {
        // Load saved customization from database
        const savedData = result.data as T;
        setCustomization(savedData);
      } else {
        // No customization found, use default styles
        setCustomization(defaultCustomization);
      }
    } catch (error) {
      console.error("Error loading customizations:", error);
      // Fallback to default styles on error
      setCustomization(defaultCustomization);
    }
  };

  const updateCustomization = async (
    key: keyof T,
    value: any,
    customization: T,
    setCustomization: (customization: T) => void
  ) => {
    const newCustomization = { ...customization, [key]: value };
    setCustomization(newCustomization);
    
    // Save to database
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType,
        settings: newCustomization,
      });
      
      if (!result.success) {
        toast.error("Failed to save customization");
      }
    } catch (error) {
      console.error("Error saving customization:", error);
      toast.error("Failed to save customization");
    }
  };

  const resetCustomization = async (
    setCustomization: (customization: T) => void
  ) => {
    try {
      // Delete the customization record from database
      const result = await deleteComponentCustomization({
        portfolioId,
        componentType,
      });
      
      if (result.success) {
        // Reset to default styles
        setCustomization(defaultCustomization);
        toast.success("Customization reset successfully");
      } else {
        toast.error("Failed to reset customization");
      }
    } catch (error) {
      console.error("Error resetting customization:", error);
      toast.error("Failed to reset customization");
    }
  };

  return {
    loadCustomizations,
    updateCustomization,
    resetCustomization,
  };
}; 
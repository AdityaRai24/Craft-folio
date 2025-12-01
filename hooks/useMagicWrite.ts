import toast from "react-hot-toast";
import { updateSection } from "@/app/actions/portfolio";
interface UseMagicWriteProps {
    portfolioId: string;
    sectionName: string; // "hero", "projects", "experience", etc.
    sectionTitle?: string;
    sectionDescription?: string;
}
export const useMagicWrite = ({
    portfolioId,
    sectionName,
    sectionTitle = "",
    sectionDescription = ""
}: UseMagicWriteProps) => {
    /**
     * Generic Magic Write API call
     * @param prompt - User's enhancement request
     * @param context - Original text to enhance
     * @param enhancementType - Optional: "hero", "project", "experience" for specialized prompts
     */
    const handleMagicWrite = async (
        prompt: string,
        context?: string,
        enhancementType?: string
    ): Promise<string> => {
        try {
            // Build context-aware prompt
            let finalPrompt = prompt;
            if (enhancementType) {
                const promptTemplates = {
                    hero: `Enhance this hero description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
                    project: `Enhance this project description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
                    experience: `Enhance this experience description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
                };
                finalPrompt = promptTemplates[enhancementType as keyof typeof promptTemplates] || prompt;
            }
            const response = await fetch('/api/magicwrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: finalPrompt,
                    context: context || "",
                    section: `${sectionName}-description`
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to enhance description');
            }
            const data = await response.json();
            return data.response || data.content || data.result || context || "";
        } catch (error) {
            console.error('Magic Write API error:', error);
            toast.error('Failed to enhance text');
            return context || "";
        }
    };
    /**
     * Save enhanced content to database
     * @param updatedData - New data to save
     */
    const saveEnhancedContent = async (updatedData: any) => {
        try {
            const result = await updateSection({
                sectionName,
                portfolioId,
                sectionContent: updatedData,
                sectionTitle: sectionTitle || sectionName,
                sectionDescription: sectionDescription || `${sectionName} section`
            });
            if (result.success) {
                toast.success("Content enhanced and saved successfully!");
                return true;
            } else {
                toast.error("Failed to save changes to database");
                return false;
            }
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save changes to database");
            return false;
        }
    };
    return {
        handleMagicWrite,
        saveEnhancedContent
    };
};

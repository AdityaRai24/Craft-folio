import { useState } from 'react';
import { updateSection } from "@/app/actions/portfolio";
import toast from "react-hot-toast";
import { Project } from '@/types/projects/portfolio';

interface UseProjectActionsProps {
  portfolioId: string;
  projectsData: Project[];
  setProjectsData: (data: Project[]) => void;
}

export const useProjectActions = ({ portfolioId, projectsData, setProjectsData }: UseProjectActionsProps) => {
  
  const handleMagicWrite = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/magicwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this project description: "${context}" with the following request: ${prompt}. Return only the enhanced description without any explanations.`,
          context: context || "",
          section: "project-description"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance description');
      }

      const data = await response.json();
      const enhancedDescription = data.response || data.content || data.result;
      
      return enhancedDescription;
    } catch (error) {
      console.error('Magic Write API error:', error);
      throw error;
    }
  };

  const handleDescriptionUpdate = async (projectIndex: number, newDescription: string) => {
    try {
      const updatedProjects = [...projectsData];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        projectDescription: newDescription
      };
      setProjectsData(updatedProjects);
      
      // Save to database
      const result = await updateSection({
        sectionName: "projects",
        portfolioId,
        sectionContent: updatedProjects,
        sectionTitle: "Projects",
        sectionDescription: "Projects section"
      });
      
      if (result.success) {
        toast.success("Project description enhanced and saved successfully!");
      } else {
        toast.error("Failed to save changes to database");
      }
    } catch (error) {
      console.error("Error saving project description:", error);
      toast.error("Failed to save changes to database");
    }
  };

  return {
    handleMagicWrite,
    handleDescriptionUpdate
  };
};

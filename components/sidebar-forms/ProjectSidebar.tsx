"use client";
import { RootState } from '@/store/store'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash, Upload, Cloud, Check } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateSection } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { techList } from '@/lib/techlist'
import { ColorTheme } from '@/lib/colorThemes'

const ProjectSidebar = () => {
  interface Technology {
    name: string;
    logo: string;
  }

  interface Project {
    projectTitle?: string;
    projectName?: string;
    projectDescription?: string;
    projectImage?: string;
    techStack?: Technology[];
    githubLink?: string;
    liveLink?: string;
    year?: string;
  }

  const emptyProject: Project = {
    projectName: "",
    projectTitle: "",
    projectDescription: "",
    projectImage: "",
    techStack: [],
    githubLink: "",
    liveLink: "",
    year: ""
  }

  const { portfolioData } = useSelector((state: RootState) => state.data)
  const projectsData = portfolioData?.find((item: any) => item.type === "projects")?.data || [];
  const projectsSection = portfolioData?.find((item: any) => item.type === "projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>(emptyProject);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState(projectsSection?.sectionTitle || "");
  const [sectionDescription, setSectionDescription] = useState(projectsSection?.sectionDescription || "");
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);

  // Tech search state
  const [techSearchValue, setTechSearchValue] = useState<string>("");
  const [techSuggestions, setTechSuggestions] = useState<Technology[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const dispatch = useDispatch();

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (projectsSection?.sectionTitle || "") ||
      sectionDescription !== (projectsSection?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, projectsSection]);

  const handleSaveHeader = async () => {
    try {
      dispatch(updatePortfolioData({
        sectionType: "projects",
        newData: projects,
        sectionTitle,
        sectionDescription
      }));
      await updateSection({
        portfolioId: portfolioId,
        sectionName: "projects",
        sectionContent: projects,
        sectionTitle,
        sectionDescription
      });
      setHasHeaderChanges(false);
      toast.success("Section header updated successfully");
    } catch (error) {
      console.error("Error saving section header:", error);
      toast.error("Failed to update section header");
    }
  };

  useEffect(() => {
    if (currentProject.projectImage === "") {
      setIsUploaded(false);
    }
  }, [currentProject.projectImage]);

  const handleTechSearch = (value: string): void => {
    setTechSearchValue(value)
    setHasSearched(value.trim() !== "")

    if (value.trim() === "") {
      setTechSuggestions([])
    } else {
      const results = techList.filter((item: Technology) =>
        item.name.toLowerCase().includes(value.toLowerCase()))
      setTechSuggestions(results.slice(0, 6))
    }
  }

  const addTechToProject = (item: Technology): void => {
    if (!currentProject.techStack?.some(tech => tech.name === item.name)) {
      setCurrentProject({
        ...currentProject,
        techStack: [...(currentProject.techStack || []), item]
      });
    }
    setTechSearchValue("")
    setTechSuggestions([])
    setHasSearched(false)
  }

  const addCustomTech = (): void => {
    if (techSearchValue.trim() !== "") {
      const customTech: Technology = {
        name: techSearchValue,
        logo: `https://placehold.co/100x100?text=${techSearchValue}&font=montserrat&fontsize=18`
      }
      addTechToProject(customTech)
    }
  }

  const removeTechItem = (name: string) => {
    const updatedTechStack = currentProject.techStack?.filter(tech => tech.name !== name) || [];
    setCurrentProject({
      ...currentProject,
      techStack: updatedTechStack
    });
  }

  const handleSaveProject = async () => {
    const originalProjects = [...projects];
    const originalCurrentProject = { ...currentProject };

    try {
      if (editingIndex !== null) {
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = currentProject;

        dispatch(updatePortfolioData({
          sectionType: "projects",
          newData: updatedProjects,
          sectionTitle,
          sectionDescription
        }));

        const result = await updateSection({
          portfolioId: portfolioId,
          sectionName: "projects",
          sectionContent: updatedProjects,
          sectionTitle,
          sectionDescription
        });

        if (!result.success) {
          dispatch(updatePortfolioData({
            sectionType: "projects",
            newData: originalProjects,
            sectionTitle,
            sectionDescription
          }));
          throw new Error("Database update failed");
        }

        setProjects(updatedProjects);
        setEditingIndex(null);
      } else {
        const updatedProjects = [...projects, currentProject];

        dispatch(updatePortfolioData({
          sectionType: "projects",
          newData: updatedProjects,
          sectionTitle,
          sectionDescription
        }));

        const result = await updateSection({
          portfolioId: portfolioId,
          sectionName: "projects",
          sectionContent: updatedProjects,
          sectionTitle,
          sectionDescription
        });

        if (!result.success) {
          dispatch(updatePortfolioData({
            sectionType: "projects",
            newData: originalProjects,
            sectionTitle,
            sectionDescription
          }));
          throw new Error("Database update failed");
        }

        setProjects(updatedProjects);
      }
      setCurrentProject(emptyProject);
      setIsUploaded(false);
      toast.success(editingIndex !== null ? 'Project updated!' : 'Project added!');
    } catch (error) {
      console.error(error);
      setProjects(originalProjects);
      setCurrentProject(originalCurrentProject);
      toast.error("Failed to update project. Changes have been reverted.");
    }
  }

  const editProject = (index: number) => {
    const projectToEdit = projects[index];
    setCurrentProject(projectToEdit);
    // Check if the image is from Cloudinary
    setIsUploaded(projectToEdit.projectImage?.includes('cloudinary.com') || false);
    setEditingIndex(index);
  }

  const deleteProject = async (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    dispatch(updatePortfolioData({
      sectionType: "projects",
      newData: updatedProjects,
      sectionTitle,
      sectionDescription
    }));
    await updateSection({
      portfolioId: portfolioId,
      sectionName: "projects",
      sectionContent: updatedProjects,
      sectionTitle,
      sectionDescription
    });
    setProjects(updatedProjects);
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    );

    try {
      toast.loading("Uploading image...", { id: "imageUpload" });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Upload failed", { id: "imageUpload" });
        return;
      }

      const data = await response.json();
      setCurrentProject({ ...currentProject, projectImage: data.secure_url });
      setIsUploaded(true);
      toast.success("Image uploaded successfully!", { id: "imageUpload" });
    } catch (error) {
      toast.error("An error occurred during upload", { id: "imageUpload" });
      console.error("Upload error:", error);
    }
  }

  const removeImage = () => {
    setCurrentProject({ ...currentProject, projectImage: "" });
    setIsUploaded(false);
  }

  return (
    <div className="custom-scrollbar">
      <Card className="border-gray-700 min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain }}>
        <CardHeader>
          <CardTitle style={{ color: ColorTheme.textPrimary }}>Projects</CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage your portfolio projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {projectsSection?.sectionTitle && (
              <div className="space-y-2">
                <Label htmlFor="sectionTitle" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Section Title</Label>
                <Input
                  id="sectionTitle"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Enter section title"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary
                  }}
                />
              </div>
            )}

            {projectsSection?.sectionDescription && (
              <div className="space-y-2">
                <Label htmlFor="sectionDescription" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Section Description</Label>
                <Textarea
                  id="sectionDescription"
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                  placeholder="Enter section description"
                  className="resize-none h-20"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary
                  }}
                />
              </div>
            )}

            {hasHeaderChanges && (
              <Button
                onClick={handleSaveHeader}
                className="w-full"
                style={{
                  backgroundColor: ColorTheme.primary,
                  color: ColorTheme.textPrimary,
                  boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                }}
              >
                Save Section Header
              </Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Project Name</Label>
              <Input
                id="projectName"
                value={currentProject.projectName || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, projectName: e.target.value })}
                placeholder="Enter project name"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTitle" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Project Title</Label>
              <Input
                id="projectTitle"
                value={currentProject.projectTitle || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, projectTitle: e.target.value })}
                placeholder="Project title"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Project Description</Label>
              <Textarea
                id="projectDescription"
                value={currentProject.projectDescription || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, projectDescription: e.target.value })}
                placeholder="Enter project description"
                className="resize-none h-32"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Project Image</Label>

              <div className="mt-1 flex flex-col items-center">
                {currentProject.projectImage ? (
                  <div className="relative w-full">
                    <img
                      src={currentProject.projectImage}
                      alt="Project Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      style={{
                        backgroundColor: ColorTheme.bgCard,
                        color: ColorTheme.textPrimary
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 transition-colors"
                      style={{
                        borderColor: ColorTheme.borderLight,
                        color: ColorTheme.textSecondary
                      }}
                    >
                      <Cloud className="h-12 w-12" style={{ color: ColorTheme.textSecondary }} />
                      <p className="mt-2 text-sm">Upload project image</p>
                      <p className="mt-1 text-xs" style={{ color: ColorTheme.textMuted }}>PNG, JPG, GIF up to 10MB</p>
                      <input
                        type="file"
                        id="projectImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                )}
              </div>

              {!isUploaded && !currentProject.projectImage && (
                <div className="mt-2">
                  <Label htmlFor="projectImageUrl" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Or paste image URL</Label>
                  <Input
                    id="projectImageUrl"
                    value={currentProject.projectImage || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, projectImage: e.target.value })}
                    placeholder="Enter image URL"
                    className="mt-1"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Tech Stack</Label>
              <div className='flex items-center justify-between gap-4 mb-4'>
                <Input
                  type='text'
                  value={techSearchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTechSearch(e.target.value)}
                  placeholder='Search Technologies...'
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && techSuggestions.length > 0) {
                      addTechToProject(techSuggestions[0])
                    } else if (e.key === 'Enter' && techSearchValue.trim() !== "") {
                      addCustomTech();
                    }
                  }}
                />
                <Button
                  onClick={addCustomTech}
                  style={{
                    backgroundColor: ColorTheme.primary,
                    color: ColorTheme.textPrimary,
                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                  }}
                >
                  Add
                </Button>
              </div>

              {techSuggestions.length > 0 ? (
                <div className='mb-6'>
                  <h3 className='text-sm font-medium mb-2' style={{ color: ColorTheme.textPrimary }}>Suggestions</h3>
                  <div>
                    {techSuggestions.map((item: Technology) => (
                      <div
                        onClick={() => addTechToProject(item)}
                        key={item.name}
                        className='flex px-4 mt-2 rounded-lg items-center justify-between gap-4 py-2 cursor-pointer transition-colors'
                        style={{
                          backgroundColor: ColorTheme.bgCard,
                          borderColor: ColorTheme.borderLight,
                          color: ColorTheme.textPrimary
                        }}
                      >
                        <span className='text-sm'>{item.name}</span>
                        <img src={item.logo} alt={item.name} width={25} height={25} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                hasSearched && (
                  <div className='rounded-lg p-4 text-center mb-6'
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight
                    }}
                  >
                    <p className='text-sm' style={{ color: ColorTheme.textSecondary }}>No technologies found matching "{techSearchValue}"</p>
                    <p className='text-xs mt-1' style={{ color: ColorTheme.textMuted }}>Use the Add button to add it as a custom technology</p>
                  </div>
                )
              )}

              {currentProject.techStack && currentProject.techStack.length > 0 ? (
                <div>
                  <h3 className='text-sm font-medium mb-2' style={{ color: ColorTheme.textPrimary }}>Selected Technologies</h3>
                  <div>
                    {currentProject.techStack.map((item: Technology) => (
                      <div
                        key={item.name}
                        className='flex px-4 mt-2 rounded-lg items-center justify-between py-2'
                        style={{
                          backgroundColor: ColorTheme.bgCard,
                          borderColor: ColorTheme.borderLight
                        }}
                      >
                        <div className='flex items-center gap-4'>
                          <img src={item.logo} alt={item.name} width={25} height={25} />
                          <span className='text-sm' style={{ color: ColorTheme.textPrimary }}>{item.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTechItem(item.name)}
                          className='p-1 h-auto'
                          style={{
                            backgroundColor: 'transparent',
                            color: ColorTheme.textSecondary
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='rounded-lg p-4 text-center mb-2'
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight
                  }}
                >
                  <p className='text-sm' style={{ color: ColorTheme.textSecondary }}>No technologies selected</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubLink" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>GitHub Link</Label>
              <Input
                id="githubLink"
                value={currentProject.githubLink || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, githubLink: e.target.value })}
                placeholder="Enter GitHub URL"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveLink" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Live Link</Label>
              <Input
                id="liveLink"
                value={currentProject.liveLink || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, liveLink: e.target.value })}
                placeholder="Enter live project URL"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Year</Label>
              <Input
                id="year"
                value={currentProject.year || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, year: e.target.value })}
                placeholder="Year completed"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <Button
              type="button"
              onClick={handleSaveProject}
              className="w-full"
              style={{
                backgroundColor: ColorTheme.primary,
                color: ColorTheme.textPrimary,
                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
              }}
            >
              {editingIndex !== null ? 'Update Project' : 'Add Project'}
            </Button>
          </div>

          {projects.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>Saved Projects</h3>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium" style={{ color: ColorTheme.textPrimary }}>{project.projectName}</h4>
                        <p className="text-sm mt-1" style={{ color: ColorTheme.textSecondary }}>{project.projectDescription?.substring(0, 20)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editProject(index)}
                          style={{
                            backgroundColor: 'transparent',
                            color: ColorTheme.textSecondary
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProject(index)}
                          style={{
                            backgroundColor: 'transparent',
                            color: ColorTheme.textSecondary
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectSidebar
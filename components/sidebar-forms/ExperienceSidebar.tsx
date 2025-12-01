"use client";
import { RootState } from '@/store/store';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, X, Edit, Trash } from 'lucide-react';
import { updatePortfolioData } from '@/slices/dataSlice';
import { useParams } from 'next/navigation';
import { updateSection } from '@/app/actions/portfolio';
import toast from 'react-hot-toast';
import { techList } from '@/lib/techlist';
import { ColorTheme } from '@/lib/colorThemes';
import { Experience, Technology } from '@/types/experience/shared';

const ExperienceSidebar = () => {


  const emptyExperience: Experience = {
    role: "",
    companyName: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    techStack: []
  }

  const { portfolioData } = useSelector((state: RootState) => state.data)
  const experienceData = portfolioData?.find((item: any) => item.type === "experience")?.data || [];
  const experienceSection = portfolioData?.find((item: any) => item.type === "experience");

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<Experience>(emptyExperience);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [techInput, setTechInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Technology[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState(experienceSection?.sectionTitle || "");
  const [sectionDescription, setSectionDescription] = useState(experienceSection?.sectionDescription || "");
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const dispatch = useDispatch();

  useEffect(() => {
    if (experienceData && experienceData.length > 0) {
      setExperiences(experienceData);
    }
  }, [experienceData]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (experienceSection?.sectionTitle || "") ||
      sectionDescription !== (experienceSection?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, experienceSection]);

  const handleTechInputChange = (value: string) => {
    setTechInput(value);
    setHasSearched(value.trim() !== "");

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const results = techList.filter((item: Technology) =>
        item.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(results.slice(0, 4));
    }
  }

  const addTechItem = (tech: Technology) => {
    if (!currentExperience.techStack?.some(item => item.name === tech.name)) {
      setCurrentExperience({
        ...currentExperience,
        techStack: [...(currentExperience.techStack || []), tech]
      });
    }
    setTechInput("");
    setSuggestions([]);
    setHasSearched(false);
  }

  const addCustomTech = () => {
    if (techInput.trim() !== "") {
      const customTech: Technology = {
        name: techInput.trim(),
        logo: `https://placehold.co/100x100?text=${techInput.trim()}&font=montserrat&fontsize=18`
      };
      addTechItem(customTech);
    }
  }

  const removeTechItem = (index: number) => {
    const updatedTechStack = [...(currentExperience.techStack || [])];
    updatedTechStack.splice(index, 1);
    setCurrentExperience({
      ...currentExperience,
      techStack: updatedTechStack
    });
  }

  const handleSaveExperience = async () => {
    const originalExperiences = [...experiences];
    const originalCurrentExperience = { ...currentExperience };

    try {
      if (editingIndex !== null) {
        const updatedExperiences = [...experiences];
        updatedExperiences[editingIndex] = currentExperience;

        dispatch(updatePortfolioData({
          sectionType: "experience",
          newData: updatedExperiences,
          sectionTitle,
          sectionDescription
        }));

        const result = await updateSection({
          portfolioId: portfolioId,
          sectionName: "experience",
          sectionContent: updatedExperiences,
          sectionTitle,
          sectionDescription
        });

        if (!result.success) {
          dispatch(updatePortfolioData({
            sectionType: "experience",
            newData: originalExperiences,
            sectionTitle,
            sectionDescription
          }));
          throw new Error("Database update failed");
        }

        setExperiences(updatedExperiences);
        setEditingIndex(null);
      } else {
        const updatedExperiences = [...experiences, currentExperience];

        dispatch(updatePortfolioData({
          sectionType: "experience",
          newData: updatedExperiences,
          sectionTitle,
          sectionDescription
        }));

        const result = await updateSection({
          portfolioId: portfolioId,
          sectionName: "experience",
          sectionContent: updatedExperiences,
          sectionTitle,
          sectionDescription
        });

        if (!result.success) {
          dispatch(updatePortfolioData({
            sectionType: "experience",
            newData: originalExperiences,
            sectionTitle,
            sectionDescription
          }));
          throw new Error("Database update failed");
        }

        setExperiences(updatedExperiences);
      }
      setCurrentExperience(emptyExperience);
      toast.success(editingIndex !== null ? 'Experience updated!' : 'Experience added!');
    } catch (error) {
      console.error(error);
      setExperiences(originalExperiences);
      setCurrentExperience(originalCurrentExperience);
      toast.error("Failed to update experience. Changes have been reverted.");
    }
  }

  const editExperience = (index: number) => {
    const experienceToEdit = experiences[index];
    setCurrentExperience(experienceToEdit);
    setEditingIndex(index);
  }

  const deleteExperience = async (index: number) => {
    const originalExperiences = [...experiences];

    try {
      const updatedExperiences = [...experiences];
      updatedExperiences.splice(index, 1);

      dispatch(updatePortfolioData({
        sectionType: "experience",
        newData: updatedExperiences,
        sectionTitle,
        sectionDescription
      }));

      const result = await updateSection({
        portfolioId: portfolioId,
        sectionName: "experience",
        sectionContent: updatedExperiences,
        sectionTitle,
        sectionDescription
      });

      if (!result.success) {
        dispatch(updatePortfolioData({
          sectionType: "experience",
          newData: originalExperiences,
          sectionTitle,
          sectionDescription
        }));
        throw new Error("Database update failed");
      }

      setExperiences(updatedExperiences);
      toast.success('Experience deleted!');
    } catch (error) {
      console.error(error);
      setExperiences(originalExperiences);
      toast.error("Failed to delete experience. Changes have been reverted.");
    }
  }

  const handleSaveHeader = async () => {
    try {
      dispatch(updatePortfolioData({
        sectionType: "experience",
        newData: experiences,
        sectionTitle,
        sectionDescription
      }));
      await updateSection({
        portfolioId: portfolioId,
        sectionName: "experience",
        sectionContent: experiences,
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

  return (
    <div className="custom-scrollbar">
      <Card className='min-h-screen rounded-none' style={{ backgroundColor: ColorTheme.bgMain, borderColor: ColorTheme.borderLight }}>
        <CardHeader>
          <CardTitle style={{ color: ColorTheme.textPrimary }}>Experience</CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage your work experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {experienceSection?.sectionTitle && (
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

            {experienceSection?.sectionDescription && (
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
              <Label htmlFor="company" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Company</Label>
              <Input
                id="company"
                value={currentExperience.companyName || ""}
                onChange={(e) => setCurrentExperience({ ...currentExperience, companyName: e.target.value })}
                placeholder="Enter company name"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Position</Label>
              <Input
                id="position"
                value={currentExperience.role || ""}
                onChange={(e) => setCurrentExperience({ ...currentExperience, role: e.target.value })}
                placeholder="Enter your position"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Description</Label>
              <Textarea
                id="description"
                value={currentExperience.description || ""}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                placeholder="Enter job description"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
                className="resize-none h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Location</Label>
              <Input
                id="location"
                value={currentExperience.location || ""}
                onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                placeholder="City, Country or Remote"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Start Date</Label>
                <Input
                  id="startDate"
                  value={currentExperience.startDate || ""}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                  placeholder="MM/YYYY"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>End Date</Label>
                <Input
                  id="endDate"
                  value={currentExperience.endDate || ""}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                  placeholder="MM/YYYY or Present"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col justify-between items-start">
                <Label className="text-sm font-medium mb-2" style={{ color: ColorTheme.textPrimary }}>Tech Stack / Skills</Label>
                <div className="flex gap-2 w-full">
                  <Input
                    value={techInput}
                    onChange={(e) => handleTechInputChange(e.target.value)}
                    placeholder="Search technologies..."
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && suggestions.length > 0) {
                        addTechItem(suggestions[0]);
                      } else if (e.key === 'Enter' && techInput.trim() !== "") {
                        addCustomTech();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomTech}
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="mb-4 mt-1">
                  {suggestions.map((tech) => (
                    <div
                      key={tech.name}
                      onClick={() => addTechItem(tech)}
                      style={{
                        backgroundColor: ColorTheme.bgCardHover,
                        borderColor: ColorTheme.borderLight,
                        color: ColorTheme.textPrimary
                      }}
                      className="flex border px-3 py-2 mt-1 rounded-lg items-center justify-between gap-2 cursor-pointer hover:bg-opacity-50 transition-colors"
                    >
                      <span className="text-sm">{tech.name}</span>
                      <img src={tech.logo} alt={tech.name} width={20} height={20} />
                    </div>
                  ))}
                </div>
              )}

              {hasSearched && suggestions.length === 0 && (
                <div style={{
                  backgroundColor: ColorTheme.bgCardHover,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textSecondary
                }} className="border rounded-lg p-3 text-center my-2">
                  <p className="text-sm">No technologies found matching "{techInput}"</p>
                  <p className="text-xs mt-1" style={{ color: ColorTheme.textMuted }}>Click Add to create it as a custom technology</p>
                </div>
              )}

              {currentExperience.techStack && currentExperience.techStack.length > 0 && (
                <div className="mt-3">
                  <Label className="text-xs font-medium mb-1" style={{ color: ColorTheme.textSecondary }}>Selected Technologies</Label>
                  <div className="space-y-2 mt-2">
                    {currentExperience.techStack.map((tech, index) => (
                      <div key={index} style={{
                        backgroundColor: ColorTheme.bgCard,
                        color: ColorTheme.textPrimary
                      }} className="flex items-center justify-between rounded-md px-3 py-2">
                        <div className="flex items-center gap-2">
                          <img src={tech.logo} alt={tech.name} className="w-5 h-5" />
                          <span className="text-sm">{tech.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTechItem(index)}
                          style={{
                            color: ColorTheme.textSecondary,
                            backgroundColor: 'transparent'
                          }}
                          className="h-6 w-6 p-0 hover:bg-opacity-50 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSaveExperience}
              style={{
                backgroundColor: ColorTheme.primary,
                color: ColorTheme.textPrimary,
                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
              }}
              className="w-full"
            >
              {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
            </Button>
          </div>

          {experiences.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>Saved Experiences</h3>
              <div className="space-y-4">
                {experiences.map((experience, index) => (
                  <div key={index} style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight
                  }} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium" style={{ color: ColorTheme.textPrimary }}>{experience.role}</h4>
                        <p className="text-sm" style={{ color: ColorTheme.textSecondary }}>{experience.companyName} • {experience.location}</p>
                        <p className="text-xs mt-1" style={{ color: ColorTheme.textMuted }}>
                          {experience.startDate} - {experience.endDate}
                        </p>
                        {experience.techStack && experience.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {experience.techStack.map((tech, techIndex) => (
                              <div key={techIndex} style={{
                                backgroundColor: ColorTheme.bgCardHover,
                                color: ColorTheme.textSecondary
                              }} className="text-xs px-2 py-1 rounded">
                                {tech.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editExperience(index)}
                          style={{
                            color: ColorTheme.textSecondary,
                            backgroundColor: 'transparent'
                          }}
                          className="h-8 w-8 p-0 hover:bg-opacity-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExperience(index)}
                          style={{
                            color: ColorTheme.textSecondary,
                            backgroundColor: 'transparent'
                          }}
                          className="h-8 w-8 p-0 hover:bg-opacity-50"
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

export default ExperienceSidebar

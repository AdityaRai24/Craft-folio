"use client";
import { RootState } from '@/store/store'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, X, Edit, Trash } from 'lucide-react'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateSection } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { ColorTheme } from '@/lib/colorThemes'

const EducationSidebar = () => {
  interface Education {
    degree?: string;
    institution?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    gpa?: string;
    achievements?: string[];
  }

  const emptyEducation: Education = {
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    gpa: "",
    achievements: []
  }

  const { portfolioData } = useSelector((state: RootState) => state.data)
  const educationData = portfolioData?.find((item: any) => item.type === "education")?.data || [];
  const educationSection = portfolioData?.find((item: any) => item.type === "education");

  const [educations, setEducations] = useState<Education[]>([]);
  const [currentEducation, setCurrentEducation] = useState<Education>(emptyEducation);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [achievementInput, setAchievementInput] = useState<string>("");
  const [sectionTitle, setSectionTitle] = useState(educationSection?.sectionTitle || "");
  const [sectionDescription, setSectionDescription] = useState(educationSection?.sectionDescription || "");
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const dispatch = useDispatch();

  useEffect(() => {
    if (educationData && educationData.length > 0) {
      setEducations(educationData);
    }
  }, [educationData]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (educationSection?.sectionTitle || "") ||
      sectionDescription !== (educationSection?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, educationSection]);

  const addAchievement = () => {
    if (achievementInput.trim() !== "") {
      setCurrentEducation({
        ...currentEducation,
        achievements: [...(currentEducation.achievements || []), achievementInput.trim()]
      });
      setAchievementInput("");
    }
  }

  const removeAchievement = (index: number) => {
    const updatedAchievements = [...(currentEducation.achievements || [])];
    updatedAchievements.splice(index, 1);
    setCurrentEducation({
      ...currentEducation,
      achievements: updatedAchievements
    });
  }

  const handleSaveEducation = async () => {
    const originalEducations = [...educations];
    const originalCurrentEducation = { ...currentEducation };

    try {
      if (editingIndex !== null) {
        const updatedEducations = [...educations];
        updatedEducations[editingIndex] = currentEducation;

        dispatch(updatePortfolioData({
          sectionType: "education",
          newData: updatedEducations,
          sectionTitle,
          sectionDescription
        }));

        const result = await updateSection({
          portfolioId: portfolioId,
          sectionName: "education",
          sectionContent: updatedEducations,
          sectionTitle,
          sectionDescription
        });

        if (!result.success) {
          dispatch(updatePortfolioData({
            sectionType: "education",
            newData: originalEducations,
            sectionTitle,
            sectionDescription
          }));
          throw new Error("Database update failed");
        }

        setEducations(updatedEducations);
        setEditingIndex(null);
      } else {
        const updatedEducations = [...educations, currentEducation];

        dispatch(updatePortfolioData({
          sectionType: "education",
          newData: updatedEducations,
          sectionTitle,
          sectionDescription
        }));

        const result = await updateSection({
          portfolioId: portfolioId,
          sectionName: "education",
          sectionContent: updatedEducations,
          sectionTitle,
          sectionDescription
        });

        if (!result.success) {
          dispatch(updatePortfolioData({
            sectionType: "education",
            newData: originalEducations,
            sectionTitle,
            sectionDescription
          }));
          throw new Error("Database update failed");
        }

        setEducations(updatedEducations);
      }
      setCurrentEducation(emptyEducation);
      toast.success(editingIndex !== null ? 'Education updated!' : 'Education added!');
    } catch (error) {
      console.error(error);
      setEducations(originalEducations);
      setCurrentEducation(originalCurrentEducation);
      toast.error("Failed to update education. Changes have been reverted.");
    }
  }

  const editEducation = (index: number) => {
    const educationToEdit = educations[index];
    setCurrentEducation(educationToEdit);
    setEditingIndex(index);
  }

  const deleteEducation = async (index: number) => {
    const originalEducations = [...educations];

    try {
      const updatedEducations = [...educations];
      updatedEducations.splice(index, 1);

      dispatch(updatePortfolioData({
        sectionType: "education",
        newData: updatedEducations,
        sectionTitle,
        sectionDescription
      }));

      const result = await updateSection({
        portfolioId: portfolioId,
        sectionName: "education",
        sectionContent: updatedEducations,
        sectionTitle,
        sectionDescription
      });

      if (!result.success) {
        dispatch(updatePortfolioData({
          sectionType: "education",
          newData: originalEducations,
          sectionTitle,
          sectionDescription
        }));
        throw new Error("Database update failed");
      }

      setEducations(updatedEducations);
      toast.success('Education deleted!');
    } catch (error) {
      console.error(error);
      setEducations(originalEducations);
      toast.error("Failed to delete education. Changes have been reverted.");
    }
  }

  const handleSaveHeader = async () => {
    try {
      dispatch(updatePortfolioData({
        sectionType: "education",
        newData: educations,
        sectionTitle,
        sectionDescription
      }));
      await updateSection({
        portfolioId: portfolioId,
        sectionName: "education",
        sectionContent: educations,
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
          <CardTitle style={{ color: ColorTheme.textPrimary }}>Education</CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage your educational background.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {educationSection?.sectionTitle && (
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

            {educationSection?.sectionDescription && (
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
              <Label htmlFor="institution" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Institution</Label>
              <Input
                id="institution"
                value={currentEducation.institution || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                placeholder="Enter institution name"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Degree</Label>
              <Input
                id="degree"
                value={currentEducation.degree || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                placeholder="Enter your degree"
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
                value={currentEducation.description || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
                placeholder="Enter education description"
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
                value={currentEducation.location || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, location: e.target.value })}
                placeholder="City, Country"
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
                  value={currentEducation.startDate || ""}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, startDate: e.target.value })}
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
                  value={currentEducation.endDate || ""}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, endDate: e.target.value })}
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
              <Label htmlFor="gpa" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>GPA</Label>
              <Input
                id="gpa"
                value={currentEducation.gpa || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, gpa: e.target.value })}
                placeholder="Enter your GPA (optional)"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col justify-between items-start">
                <Label className="text-sm font-medium mb-2" style={{ color: ColorTheme.textPrimary }}>Achievements</Label>
                <div className="flex gap-2 w-full">
                  <Input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    placeholder="Add an achievement..."
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && achievementInput.trim() !== "") {
                        addAchievement();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAchievement}
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

              {currentEducation.achievements && currentEducation.achievements.length > 0 && (
                <div className="mt-3">
                  <Label className="text-xs font-medium mb-1" style={{ color: ColorTheme.textSecondary }}>Added Achievements</Label>
                  <div className="space-y-2 mt-2">
                    {currentEducation.achievements.map((achievement, index) => (
                      <div key={index} style={{
                        backgroundColor: ColorTheme.bgCard,
                        color: ColorTheme.textPrimary
                      }} className="flex items-center justify-between rounded-md px-3 py-2">
                        <span className="text-sm">{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
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
              onClick={handleSaveEducation}
              style={{
                backgroundColor: ColorTheme.primary,
                color: ColorTheme.textPrimary,
                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
              }}
              className="w-full"
            >
              {editingIndex !== null ? 'Update Education' : 'Add Education'}
            </Button>
          </div>

          {educations.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium" style={{ color: ColorTheme.textPrimary }}>Saved Education</h3>
              <div className="space-y-4">
                {educations.map((education, index) => (
                  <div key={index} style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight
                  }} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium" style={{ color: ColorTheme.textPrimary }}>{education.degree}</h4>
                        <p className="text-sm" style={{ color: ColorTheme.textSecondary }}>{education.institution} • {education.location}</p>
                        <p className="text-xs mt-1" style={{ color: ColorTheme.textMuted }}>
                          {education.startDate} - {education.endDate}
                        </p>
                        {education.gpa && (
                          <p className="text-xs mt-1" style={{ color: ColorTheme.textMuted }}>
                            GPA: {education.gpa}
                          </p>
                        )}
                        {education.achievements && education.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {education.achievements.map((achievement, achievementIndex) => (
                              <div key={achievementIndex} style={{
                                backgroundColor: ColorTheme.bgCardHover,
                                color: ColorTheme.textSecondary
                              }} className="text-xs px-2 py-1 rounded">
                                {achievement}
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
                          onClick={() => editEducation(index)}
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
                          onClick={() => deleteEducation(index)}
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

export default EducationSidebar
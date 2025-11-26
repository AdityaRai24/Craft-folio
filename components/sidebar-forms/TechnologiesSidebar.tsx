"use client";
import React, { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card'
import { techList } from '@/lib/techlist'
import { X, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { updatePortfolioData } from '@/slices/dataSlice'
import { useParams } from 'next/navigation'
import { updateSection } from '@/app/actions/portfolio'
import toast from 'react-hot-toast'
import { Label } from '../ui/label'
import { ColorTheme } from '@/lib/colorThemes'
import { Textarea } from '../ui/textarea'

interface Technology {
  name: string;
  logo: string;
}

const TechnologiesSidebar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [suggestions, setSuggestions] = useState<Technology[]>([])
  const [selected, setSelected] = useState<Technology[]>([])
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [originalSelected, setOriginalSelected] = useState<Technology[]>([])
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const technologiesData = portfolioData?.find((item: any) => item.type === "technologies")?.data || [];
  const technologiesSection = portfolioData?.find((item: any) => item.type === "technologies");
  const [sectionTitle, setSectionTitle] = useState(technologiesSection?.sectionTitle || "");
  const [sectionDescription, setSectionDescription] = useState(technologiesSection?.sectionDescription || "");
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);

  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  useEffect(() => {
    if (portfolioData) {
      const techSectionData = portfolioData.find((section: any) => section.type === "technologies")?.data;
      if (techSectionData && Array.isArray(techSectionData)) {
        setSelected(techSectionData);
        setOriginalSelected(JSON.parse(JSON.stringify(techSectionData)));
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (technologiesSection?.sectionTitle || "") ||
      sectionDescription !== (technologiesSection?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, technologiesSection]);

  // Track changes
  useEffect(() => {
    setHasChanges(JSON.stringify(selected) !== JSON.stringify(originalSelected));
  }, [selected, originalSelected]);

  const handleChange = (value: string): void => {
    setSearchValue(value)
    setHasSearched(value.trim() !== "")

    if (value.trim() === "") {
      setSuggestions([])
    } else {
      const results = techList.filter((item: Technology) =>
        item.name.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(results.slice(0, 6))
    }
  }

  const addSuggestion = (item: Technology): void => {
    if (!selected.some(tech => tech.name === item.name)) {
      setSelected([...selected, item])
    }
    setSearchValue("")
    setSuggestions([])
    setHasSearched(false)
  }

  const removeTech = (itemToRemove: Technology): void => {
    setSelected(selected.filter(item => item.name !== itemToRemove.name))
  }

  const handleAddCustomTech = (): void => {
    if (searchValue.trim() !== "") {
      const customTech: Technology = {
        name: searchValue,
        logo: `https://res.cloudinary.com/dhanvyweu/image/upload/v1750396348/pencil_1_k79iv9.png`
      }
      addSuggestion(customTech)
    }
  }

  const handleSaveChanges = async () => {
    const originalSelected = [...selected];

    try {
      setIsLoading(true);
      dispatch(updatePortfolioData({
        sectionType: "technologies",
        newData: selected,
        sectionTitle,
        sectionDescription
      }));

      const result = await updateSection({
        portfolioId: portfolioId,
        sectionName: "technologies",
        sectionContent: selected,
        sectionTitle,
        sectionDescription
      });

      if (!result.success) {
        dispatch(updatePortfolioData({
          sectionType: "technologies",
          newData: originalSelected,
          sectionTitle,
          sectionDescription
        }));
        throw new Error("Database update failed");
      }

      setOriginalSelected(JSON.parse(JSON.stringify(selected)));
      setHasChanges(false);
      toast.success("Technologies updated successfully");
    } catch (error) {
      console.error("Error saving technologies:", error);
      setSelected(originalSelected);
      toast.error("Failed to update technologies. Changes have been reverted.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    setSelected(JSON.parse(JSON.stringify(originalSelected)));
    setHasChanges(false);
    toast.success("Changes reset");
  };

  const handleSaveHeader = async () => {
    try {
      dispatch(updatePortfolioData({
        sectionType: "technologies",
        newData: selected,
        sectionTitle,
        sectionDescription
      }));
      await updateSection({
        portfolioId: portfolioId,
        sectionName: "technologies",
        sectionContent: selected,
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
          <CardTitle style={{ color: ColorTheme.textPrimary }}>Technologies</CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage your skills and technologies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {technologiesSection?.sectionTitle && (
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

            {technologiesSection?.sectionDescription && (
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
              <Label htmlFor="techSearch" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Add Technology</Label>
              <div className="flex gap-2">
                <Input
                  id="techSearch"
                  value={searchValue}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Search technologies..."
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && suggestions.length > 0) {
                      addSuggestion(suggestions[0]);
                    } else if (e.key === 'Enter' && searchValue.trim() !== "") {
                      handleAddCustomTech();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddCustomTech()}
                  disabled={!searchValue.trim()}
                  style={{
                    backgroundColor: ColorTheme.primary,
                    color: ColorTheme.textPrimary,
                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                  }}
                >
                  Add
                </Button>
              </div>
              {suggestions.length > 0 && (
                <div className="mt-2 rounded-md overflow-hidden" style={{ backgroundColor: ColorTheme.bgCard, borderColor: ColorTheme.borderLight }}>
                  {suggestions.map((tech, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-opacity-50 cursor-pointer"
                      style={{
                        backgroundColor: ColorTheme.bgCardHover,
                        color: ColorTheme.textPrimary
                      }}
                      onClick={() => addSuggestion(tech)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{tech.name}</span>
                        <img src={tech.logo} alt={tech.name} width={20} height={20} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Your Technologies</Label>
              <div className="flex flex-wrap gap-2">
                {selected.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-md px-2 py-1"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight
                    }}
                  >
                    <span style={{ color: ColorTheme.textPrimary }}>{tech.name}</span>
                    <button
                      onClick={() => removeTech(tech)}
                      style={{ color: ColorTheme.textSecondary }}
                      className="hover:text-opacity-80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className='pt-4 pb-6'>
          <div className="flex w-full space-x-2">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  color: ColorTheme.textPrimary
                }}
                className="flex-1"
              >
                Reset
              </Button>
            )}
            <Button
              className={`${hasChanges ? "flex-1" : "w-full"}`}
              onClick={handleSaveChanges}
              disabled={isLoading || !hasChanges}
              style={{
                backgroundColor: ColorTheme.primary,
                color: ColorTheme.textPrimary,
                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TechnologiesSidebar
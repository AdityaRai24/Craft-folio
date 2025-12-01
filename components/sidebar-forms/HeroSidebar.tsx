"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { updateSection } from '@/app/actions/portfolio';
import { redirect, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePortfolioData } from '@/slices/dataSlice';
import { Plus, Minus, X, Save, Undo } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import React from 'react';
import { templateConfig } from '@/lib/templateConfig';
import { ColorTheme } from '@/lib/colorThemes';
import { setCurrentEdit } from '@/slices/editModeSlice';

const HeroSidebar = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const portfolioId = params.portfolioId as string;
  const { portfolioData, templateName } = useSelector((state: RootState) => state.data);
  const heroSectionData = portfolioData?.find((section: any) => section.type === "hero");
  const heroData = heroSectionData?.data || {};
  const [sectionTitle, setSectionTitle] = useState(heroSectionData?.sectionTitle || "");
  const [sectionDescription, setSectionDescription] = useState(heroSectionData?.sectionDescription || "");
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);
  const emptyContent = {
    titlePrefix: "",
    name: "",
    summary: "",
    title: "",
    shortSummary: "",
    longSummary: "",
    titleSuffixOptions: [""],
    badge: {
      isVisible: true,
      texts: [""]
    },
    actions: [
      { label: "", url: "", type: "button", style: "primary" }
    ]
  };

  const fields = templateConfig[templateName as keyof typeof templateConfig].hero!;
  const [content, setContent] = useState(emptyContent);
  const [isLoading, setIsLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (heroData && Object.keys(heroData).length > 0) {
      setContent({
        titlePrefix: heroData.titlePrefix || "",
        name: heroData.name || "",
        summary: heroData.summary || "",
        shortSummary: heroData.shortSummary || "",
        titleSuffixOptions: heroData.titleSuffixOptions || [""],
        title: heroData.title || "",
        longSummary: heroData.longSummary || "",
        badge: {
          isVisible: heroData.badge?.isVisible ?? true,
          texts: heroData.badge?.texts || [""]
        },
        actions: heroData.actions || [
          { label: "", url: "", type: "button", style: "primary" }
        ]
      });
      setOriginalContent(heroData);
    }
  }, [heroData]);

  useEffect(() => {
    setHasChanges(JSON.stringify(content) !== JSON.stringify(originalContent));
  }, [content, originalContent]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (heroSectionData?.sectionTitle || "") ||
      sectionDescription !== (heroSectionData?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, heroSectionData]);

  if (!portfolioId) {
    return redirect("/choose-templates");
  }

  const handleSubmit = async () => {
    const originalContent = { ...content };

    try {
      setIsLoading(true);
      dispatch(updatePortfolioData({
        sectionType: "hero",
        sectionTitle: "Hero Section",
        sectionDescription: "Manage your hero section.",
        newData: content
      }));

      const result = await updateSection({
        portfolioId: portfolioId,
        sectionName: "hero",
        sectionTitle: "Hero Section",
        sectionDescription: "Manage your hero section.",
        sectionContent: content
      });

      if (!result.success) {
        dispatch(updatePortfolioData({
          sectionType: "hero",
          sectionTitle: "Hero Section",
          sectionDescription: "Manage your hero section.",
          newData: originalContent
        }));
        throw new Error("Database update failed");
      }

      setOriginalContent(content);
      setHasChanges(false);
      toast.success("Hero section updated successfully");
    } catch (error) {
      console.error(error);
      setContent(originalContent);
      toast.error("Failed to update hero section. Changes have been reverted.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHeader = async () => {
    try {
      dispatch(updatePortfolioData({
        sectionType: "hero",
        newData: content,
        sectionTitle,
        sectionDescription
      }));
      await updateSection({
        portfolioId: portfolioId,
        sectionName: "hero",
        sectionContent: content,
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

  const addBadgeText = () => {
    setContent({
      ...content,
      badge: {
        ...content.badge,
        texts: [...content.badge.texts, ""]
      }
    });
  };

  const removeBadgeText = (index: number) => {
    const newTexts = [...content.badge.texts];
    newTexts.splice(index, 1);
    setContent({
      ...content,
      badge: {
        ...content.badge,
        texts: newTexts
      }
    });
  };

  const updateBadgeText = (index: number, value: string) => {
    const newTexts = [...content.badge.texts];
    newTexts[index] = value;
    setContent({
      ...content,
      badge: {
        ...content.badge,
        texts: newTexts
      }
    });
  };

  const addTitleSuffix = () => {
    setContent({
      ...content,
      titleSuffixOptions: [...content.titleSuffixOptions, ""]
    });
  };

  const removeTitleSuffix = (index: number) => {
    const newSuffixes = [...content.titleSuffixOptions];
    newSuffixes.splice(index, 1);
    setContent({
      ...content,
      titleSuffixOptions: newSuffixes
    });
  };

  const updateTitleSuffix = (index: number, value: string) => {
    const newSuffixes = [...content.titleSuffixOptions];
    newSuffixes[index] = value;
    setContent({
      ...content,
      titleSuffixOptions: newSuffixes
    });
  };

  const addAction = () => {
    setContent({
      ...content,
      actions: [...content.actions, { label: "", url: "", type: "button", style: "primary" }]
    });
  };

  const removeAction = (index: number) => {
    const newActions = [...content.actions];
    newActions.splice(index, 1);
    setContent({
      ...content,
      actions: newActions
    });
  };

  const updateAction = (index: number, field: string, value: string) => {
    const newActions = [...content.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setContent({
      ...content,
      actions: newActions
    });
  };

  const styleOptions = [
    { value: "primary", label: "Primary" },
    { value: "outline", label: "Outline" },
    { value: "link", label: "Link" },
    { value: "ghost", label: "Ghost" }
  ];

  console.log(fields);
  // Determine which tabs to show based on fields
  const showBasicTab = fields.includes("name") || fields.includes("titlePrefix") ||
    fields.includes("titleSuffixOptions") || fields.includes("summary");
  const showBadgeTab = fields.includes("badge");
  const showActionsTab = fields.includes("actions");

  // Default tab to show
  let defaultTab = "basic";
  if (!showBasicTab && showBadgeTab) defaultTab = "badge";
  else if (!showBasicTab && !showBadgeTab && showActionsTab) defaultTab = "actions";

  return (
    <div className="flex-1 custom-scrollbar">
      <Card className="border-gray-700 min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain }}>
        <CardHeader className="relative">
          <CardTitle style={{ color: ColorTheme.textPrimary }}>Hero Section</CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage your hero section.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            <Tabs defaultValue={defaultTab} className="mt-4">
              <TabsList style={{ backgroundColor: ColorTheme.bgNav, borderColor: ColorTheme.borderLight }}>
                {showBasicTab && (
                  <TabsTrigger value="basic" className="data-[state=active]:bg-gray-700 cursor-pointer" style={{ color: ColorTheme.textPrimary }}>Basic Info</TabsTrigger>
                )}
                {showBadgeTab && (
                  <TabsTrigger value="badge" className="data-[state=active]:bg-gray-700 cursor-pointer" style={{ color: ColorTheme.textPrimary }}>Badge</TabsTrigger>
                )}
                {showActionsTab && (
                  <TabsTrigger value="actions" className="data-[state=active]:bg-gray-700 cursor-pointer" style={{ color: ColorTheme.textPrimary }}>Actions</TabsTrigger>
                )}
              </TabsList>

              {showBasicTab && (
                <TabsContent value="basic" className="mt-4">
                  <CardContent className="p-0 space-y-5">
                    {fields.includes("name") && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Name</Label>
                        <Input
                          id="name"
                          value={content.name}
                          onChange={(e) => setContent({ ...content, name: e.target.value })}
                          placeholder="Enter your name"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        />
                      </div>
                    )}

                    {fields.includes("titlePrefix") && templateName === "NeoSpark" && (
                      <div className="space-y-2">
                        <Label htmlFor="titlePrefix" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Title Prefix</Label>
                        <Input
                          id="titlePrefix"
                          value={content.titlePrefix}
                          onChange={(e) => setContent({ ...content, titlePrefix: e.target.value })}
                          placeholder="e.g. Aspiring Software"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        />
                      </div>
                    )}

                    {fields.includes("title") && (
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Title</Label>
                        <Input
                          id="title"
                          value={content.title}
                          onChange={(e) => setContent({ ...content, title: e.target.value })}
                          placeholder="e.g. Full Stack Developer"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        />
                      </div>
                    )}

                    {fields.includes("titleSuffixOptions") && templateName === "NeoSpark" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Title Suffixes</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTitleSuffix}
                            style={{
                              backgroundColor: ColorTheme.bgCard,
                              borderColor: ColorTheme.borderLight,
                              color: ColorTheme.textPrimary
                            }}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {content.titleSuffixOptions.map((suffix, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={suffix}
                                onChange={(e) => updateTitleSuffix(index, e.target.value)}
                                placeholder={`Title suffix ${index + 1}`}
                                style={{
                                  backgroundColor: ColorTheme.bgCard,
                                  borderColor: ColorTheme.borderLight,
                                  color: ColorTheme.textPrimary
                                }}
                              />
                              {content.titleSuffixOptions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTitleSuffix(index)}
                                  style={{
                                    color: ColorTheme.textSecondary,
                                    backgroundColor: 'transparent'
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {fields.includes("summary") && (
                      <div className="space-y-2">
                        <Label htmlFor="summary" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Summary</Label>
                        <Textarea
                          id="summary"
                          value={content.summary}
                          onChange={(e) => setContent({ ...content, summary: e.target.value })}
                          placeholder="Enter a brief description about yourself"
                          className="resize-none custom-scrollbar h-32"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        />
                        <p className="text-xs" style={{ color: ColorTheme.textSecondary }}>Use new lines to create multiple paragraphs</p>
                      </div>
                    )}

                    {fields.includes("shortSummary") && (
                      <div className="space-y-2">
                        <Label htmlFor="shortSummary" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Short Summary</Label>
                        <Textarea
                          id="shortSummary"
                          value={content.shortSummary}
                          onChange={(e) => setContent({ ...content, shortSummary: e.target.value })}
                          placeholder="Enter a short summary about yourself"
                          className="resize-none custom-scrollbar h-32"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        />
                        <p className="text-xs" style={{ color: ColorTheme.textSecondary }}>Use new lines to create multiple paragraphs</p>
                      </div>
                    )}

                    {fields.includes("longSummary") && (
                      <div className="space-y-2">
                        <Label htmlFor="longSummary" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Long Summary</Label>
                        <Textarea
                          id="longSummary"
                          value={content.longSummary}
                          onChange={(e) => setContent({ ...content, longSummary: e.target.value })}
                          placeholder="Enter a detailed summary about yourself"
                          className="resize-none custom-scrollbar h-48"
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        />
                        <p className="text-xs" style={{ color: ColorTheme.textSecondary }}>Use new lines to create multiple paragraphs</p>
                      </div>
                    )}

                  </CardContent>
                </TabsContent>
              )}

              {showBadgeTab && (
                <TabsContent value="badge" className="mt-4">
                  <CardContent className="p-0 space-y-5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="badgeVisible" className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Show Badge</Label>
                      <Switch
                        id="badgeVisible"
                        checked={content.badge.isVisible}
                        onCheckedChange={(checked) => setContent({
                          ...content,
                          badge: { ...content.badge, isVisible: checked }
                        })}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Badge Texts</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBadgeText}
                          style={{
                            backgroundColor: ColorTheme.bgCard,
                            borderColor: ColorTheme.borderLight,
                            color: ColorTheme.textPrimary
                          }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {content.badge.texts.map((text, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={text}
                              onChange={(e) => updateBadgeText(index, e.target.value)}
                              placeholder={`Badge text ${index + 1}`}
                              style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary
                              }}
                            />
                            {content.badge.texts.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBadgeText(index)}
                                style={{
                                  color: ColorTheme.textSecondary,
                                  backgroundColor: 'transparent'
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              )}

              {showActionsTab && (
                <TabsContent value="actions" className="mt-4">
                  <CardContent className="p-0 space-y-5">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Action Buttons</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAction}
                        style={{
                          backgroundColor: ColorTheme.bgCard,
                          borderColor: ColorTheme.borderLight,
                          color: ColorTheme.textPrimary
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {content.actions.map((action, index) => (
                        <div key={index} className="space-y-3 pt-3 border-t" style={{ borderColor: ColorTheme.borderLight }}>
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>Button {index + 1}</h4>
                            {content.actions.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(index)}
                                style={{
                                  color: ColorTheme.textSecondary,
                                  backgroundColor: 'transparent'
                                }}
                              >
                                <Minus className="h-3.5 w-3.5 mr-1" /> Remove
                              </Button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`action-label-${index}`} className="text-xs font-medium" style={{ color: ColorTheme.textSecondary }}>Label</Label>
                              <Input
                                id={`action-label-${index}`}
                                value={action.label}
                                onChange={(e) => updateAction(index, 'label', e.target.value)}
                                placeholder="e.g. View Projects"
                                style={{
                                  backgroundColor: ColorTheme.bgCard,
                                  borderColor: ColorTheme.borderLight,
                                  color: ColorTheme.textPrimary
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`action-url-${index}`} className="text-xs font-medium" style={{ color: ColorTheme.textSecondary }}>URL</Label>
                              <Input
                                id={`action-url-${index}`}
                                value={action.url}
                                onChange={(e) => updateAction(index, 'url', e.target.value)}
                                placeholder="e.g. #projects"
                                style={{
                                  backgroundColor: ColorTheme.bgCard,
                                  borderColor: ColorTheme.borderLight,
                                  color: ColorTheme.textPrimary
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`action-style-${index}`} className="text-xs font-medium" style={{ color: ColorTheme.textSecondary }}>Style</Label>
                              <select
                                id={`action-style-${index}`}
                                value={action.style}
                                onChange={(e) => updateAction(index, 'style', e.target.value)}
                                style={{
                                  backgroundColor: ColorTheme.bgCard,
                                  borderColor: ColorTheme.borderLight,
                                  color: ColorTheme.textPrimary
                                }}
                              >
                                {styleOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </CardContent>

        <CardFooter className='pt-4 pb-6'>
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={isLoading || !hasChanges}
            style={{
              backgroundColor: ColorTheme.primary,
              color: ColorTheme.textPrimary,
              boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
            }}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HeroSidebar;

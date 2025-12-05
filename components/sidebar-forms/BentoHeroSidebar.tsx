"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { updateSection, saveComponentCustomization } from '@/app/actions/portfolio';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePortfolioData, setComponentCustomizations } from '@/slices/dataSlice';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ColorTheme } from '@/lib/colorThemes';
import { BentoHeroCustomization, defaultBentoHeroStyles } from '@/types/bento';
import ImageUpload from '../Shared/ImageUpload';
import SocialLinksEditor from '../Shared/SocialLinksEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BentoHeroSidebar = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const portfolioId = params.portfolioId as string;
    const { portfolioData, componentCustomizations } = useSelector((state: RootState) => state.data);
    const heroSection = portfolioData?.find((section: any) => section.type === "hero");
    const heroData = heroSection?.data || {};

    // Merge saved customization with defaults
    // Prioritize componentCustomizations (new system), fallback to heroSection.customization (legacy)
    const savedCustomization = componentCustomizations?.["hero"] || heroSection?.customization || {};

    const initialCustomization: BentoHeroCustomization = {
        ...defaultBentoHeroStyles,
        ...savedCustomization,
        stats: savedCustomization.stats || defaultBentoHeroStyles.stats,
        services: savedCustomization.services || defaultBentoHeroStyles.services,
        quote: savedCustomization.quote || defaultBentoHeroStyles.quote,
        // Ensure socials exist and are array if possible, or default to empty array
        socials: Array.isArray(savedCustomization.socials) ? savedCustomization.socials : [],
        heroImage: savedCustomization.heroImage || undefined
    };

    const [customization, setCustomization] = useState<BentoHeroCustomization>(initialCustomization);
    const [profile, setProfile] = useState({
        name: heroData.name || '',
        title: heroData.title || '',
        summary: heroData.summary || ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Basic change detection
        setHasChanges(true); // Simplified for now, enable save button on any interaction
    }, [customization, profile]);

    const handleUpdate = (key: keyof BentoHeroCustomization, value: any) => {
        setCustomization((prev) => ({ ...prev, [key]: value }));
    };

    const handleProfileUpdate = (key: string, value: string) => {
        setProfile((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);

            // 1. Save Profile Data (Legacy/Section Data)
            dispatch(updatePortfolioData({
                sectionType: "hero",
                newData: profile,
                sectionTitle: heroSection?.sectionTitle || "",
                sectionDescription: heroSection?.sectionDescription || ""
            }));

            await updateSection({
                portfolioId,
                sectionName: "hero",
                sectionContent: profile,
                customization: customization // Saving here too just in case
            } as any);

            // 2. Save Customization Data (New System)
            dispatch(setComponentCustomizations({
                ...componentCustomizations,
                "hero": customization
            }));

            await saveComponentCustomization({
                portfolioId,
                componentType: "hero",
                settings: customization
            });

            setHasChanges(false);
            toast.success("Hero updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to update stats
    const updateStat = (index: number, field: 'label' | 'value', value: string) => {
        const newStats = [...customization.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        handleUpdate('stats', newStats);
    };

    // Helper to update services
    const updateServices = (value: string) => {
        const services = value.split(',').map(s => s.trim()).filter(s => s);
        handleUpdate('services', services);
    };

    return (
        <div className="flex-1 custom-scrollbar">
            <Card className="border-gray-700 min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain }}>
                <CardHeader>
                    <CardTitle style={{ color: ColorTheme.textPrimary }}>Bento Hero</CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>Customize your Bento Hero content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="socials">Socials</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label style={{ color: ColorTheme.textPrimary }}>Name</Label>
                                <Input
                                    value={profile.name}
                                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label style={{ color: ColorTheme.textPrimary }}>Title</Label>
                                <Input
                                    value={profile.title}
                                    onChange={(e) => handleProfileUpdate('title', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label style={{ color: ColorTheme.textPrimary }}>Summary</Label>
                                <Textarea
                                    value={profile.summary}
                                    onChange={(e) => handleProfileUpdate('summary', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white h-32"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label style={{ color: ColorTheme.textPrimary }}>Hero Image</Label>
                                <ImageUpload
                                    value={customization.heroImage || ''}
                                    onChange={(url) => handleUpdate('heroImage', url)}
                                />
                                <p className="text-xs text-zinc-500">Leave empty to use your profile picture.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="content" className="space-y-6 mt-4">
                            {/* Quote */}
                            <div className="space-y-2">
                                <Label style={{ color: ColorTheme.textPrimary }}>Quote</Label>
                                <Textarea
                                    value={customization.quote}
                                    onChange={(e) => handleUpdate('quote', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    placeholder="Your favorite quote..."
                                />
                            </div>

                            {/* Services */}
                            <div className="space-y-2">
                                <Label style={{ color: ColorTheme.textPrimary }}>Services (Comma separated)</Label>
                                <Textarea
                                    value={customization.services.join(', ')}
                                    onChange={(e) => updateServices(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    placeholder="Web Design, Development, SEO..."
                                />
                            </div>

                            {/* Stats */}
                            <div className="space-y-4">
                                <Label style={{ color: ColorTheme.textPrimary }}>Stats</Label>
                                {customization.stats.map((stat: any, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={stat.label}
                                            onChange={(e) => updateStat(index, 'label', e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 text-white"
                                            placeholder="Label"
                                        />
                                        <Input
                                            value={stat.value}
                                            onChange={(e) => updateStat(index, 'value', e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 text-white w-24"
                                            placeholder="Value"
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="socials" className="space-y-4 mt-4">
                            <SocialLinksEditor
                                links={customization.socials || []}
                                onChange={(links) => handleUpdate('socials', links)}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full"
                        style={{ backgroundColor: ColorTheme.primary }}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default BentoHeroSidebar;

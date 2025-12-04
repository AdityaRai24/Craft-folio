"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { updateSection } from "@/app/actions/portfolio";
import { redirect, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePortfolioData } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { ColorTheme } from "@/lib/colorThemes";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import SocialLinksEditor from "../Shared/SocialLinksEditor";
import ResumeUpload from "../Shared/ResumeUpload";
import ImageUpload from "../Shared/ImageUpload";
import { SocialLink } from "@/types/canvas";

interface ContentType {
  github: string;
  linkedin: string;
  resumeLink: string;
  shortSummary: string;
  name: string;
  title: string;
  email: string;
  location: string;
  profileImage?: string;
}

const ContactSidebar = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const portfolioId = params.portfolioId as string;
  const { portfolioData, templateName } = useSelector((state: RootState) => state.data);
  const contactSectionData = portfolioData?.find(
    (section: any) => section.type === "userInfo"
  );
  const contactData = contactSectionData?.data || {};
  const [sectionTitle, setSectionTitle] = useState(
    contactSectionData?.sectionTitle || ""
  );
  const [sectionDescription, setSectionDescription] = useState(
    contactSectionData?.sectionDescription || ""
  );
  const [hasHeaderChanges, setHasHeaderChanges] = useState(false);


  const emptyContent: ContentType = {
    github: "",
    linkedin: "",
    resumeLink: "",
    shortSummary: "",
    name: "",
    title: "",
    email: "",
    location: "",
  };

  const [content, setContent] = useState<ContentType>(emptyContent);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [navbarSocials, setNavbarSocials] = useState<SocialLink[]>([]);
  const [profileImage, setProfileImage] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState({});

  useEffect(() => {
    if (contactData && Object.keys(contactData).length > 0) {
      // Create base content
      const baseContent = {
        github: contactData.github || "",
        linkedin: contactData.linkedin || "",
        resumeLink: contactData.resumeLink || "",
        shortSummary: contactData.shortSummary || "",
        name: contactData.name || "",
        title: contactData.title || "",
        email: contactData.email || "",
        location: contactData.location || "",
      };

      // Handle Profile Image
      if ("profileImage" in contactData) {
        setProfileImage(contactData.profileImage || "");
      }

      // Handle Resume Link
      setResumeLink(contactData.resumeLink || "");

      // Handle Social Links
      if (contactData.socials && Array.isArray(contactData.socials)) {
        setSocialLinks(contactData.socials);
      } else {
        // Migration: Convert individual fields to social links
        const newLinks: SocialLink[] = [];
        if (contactData.email) newLinks.push({ id: crypto.randomUUID(), platform: "email", url: contactData.email });
        if (contactData.linkedin) newLinks.push({ id: crypto.randomUUID(), platform: "linkedin", url: contactData.linkedin });
        if (contactData.github) newLinks.push({ id: crypto.randomUUID(), platform: "github", url: contactData.github });
        if (contactData.location) newLinks.push({ id: crypto.randomUUID(), platform: "location", url: contactData.location });

        setSocialLinks(newLinks);
      }

      // Handle Navbar Socials (NeoSpark specific)
      if (contactData.navbarSocials && Array.isArray(contactData.navbarSocials)) {
        setNavbarSocials(contactData.navbarSocials);
      } else {
        setNavbarSocials([]);
      }

      setContent(baseContent);
      setOriginalContent(contactData);
    } else {
      setContent(emptyContent);
      setSocialLinks([]);
      setNavbarSocials([]);
      setProfileImage("");
      setResumeLink("");
      setOriginalContent({});
    }
  }, [contactData]);

  useEffect(() => {
    setHasHeaderChanges(
      sectionTitle !== (contactSectionData?.sectionTitle || "") ||
      sectionDescription !== (contactSectionData?.sectionDescription || "")
    );
  }, [sectionTitle, sectionDescription, contactSectionData]);

  if (!portfolioId) {
    return redirect("/choose-templates");
  }

  const handleSubmit = async () => {
    const originalContentState = { ...content };
    const originalSectionTitle = sectionTitle;
    const originalSectionDescription = sectionDescription;

    try {
      setIsLoading(true);

      // Extract individual fields from socialLinks for backward compatibility
      const email = socialLinks.find(l => l.platform === "email")?.url || "";
      const linkedin = socialLinks.find(l => l.platform === "linkedin")?.url || "";
      const github = socialLinks.find(l => l.platform === "github")?.url || "";
      const location = socialLinks.find(l => l.platform === "location")?.url || "";

      const newData = {
        ...content,
        email,
        linkedin,
        github,
        location,
        resumeLink,
        profileImage,
        socials: socialLinks,
        navbarSocials: navbarSocials
      };

      dispatch(
        updatePortfolioData({
          sectionType: "userInfo",
          newData: newData,
          sectionTitle,
          sectionDescription,
        })
      );

      const result = await updateSection({
        sectionName: "userInfo",
        portfolioId: portfolioId,
        sectionContent: newData,
        sectionTitle,
        sectionDescription,
      });

      if (!result.success) {
        dispatch(
          updatePortfolioData({
            sectionType: "userInfo",
            newData: originalContent,
            sectionTitle: originalSectionTitle,
            sectionDescription: originalSectionDescription,
          })
        );
        throw new Error("Database update failed");
      }

      setOriginalContent(newData);
      toast.success("Contact information updated successfully");
    } catch (error) {
      console.error(error);
      setContent(originalContentState);
      setSectionTitle(originalSectionTitle);
      setSectionDescription(originalSectionDescription);
      toast.error(
        "Failed to update contact information. Changes have been reverted."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHeader = async () => {
    const originalContentState = { ...content };
    const originalSectionTitle = sectionTitle;
    const originalSectionDescription = sectionDescription;

    try {
      dispatch(
        updatePortfolioData({
          sectionType: "userInfo",
          newData: content,
          sectionTitle,
          sectionDescription,
        })
      );

      const result = await updateSection({
        portfolioId: portfolioId,
        sectionName: "userInfo",
        sectionContent: content,
        sectionTitle,
        sectionDescription,
      });

      if (!result.success) {
        dispatch(
          updatePortfolioData({
            sectionType: "userInfo",
            newData: originalContent,
            sectionTitle: originalSectionTitle,
            sectionDescription: originalSectionDescription,
          })
        );
        throw new Error("Database update failed");
      }

      setHasHeaderChanges(false);
      toast.success("Section header updated successfully");
    } catch (error) {
      console.error("Error saving section header:", error);
      setContent(originalContentState);
      setSectionTitle(originalSectionTitle);
      setSectionDescription(originalSectionDescription);
      toast.error(
        "Failed to update section header. Changes have been reverted."
      );
    }
  };



  return (
    <div className="flex-1 custom-scrollbar h-full">
      <Card
        className="min-h-screen rounded-none"
        style={{
          backgroundColor: ColorTheme.bgMain,
          borderColor: ColorTheme.borderLight,
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: ColorTheme.textPrimary }}>
            Contact Information
          </CardTitle>
          <CardDescription style={{ color: ColorTheme.textSecondary }}>
            Manage your contact information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CardContent className="p-0 space-y-5">

            {/* Profile Image Field */}
            {profileImage && (
              <ImageUpload
                label="Profile Image"
                value={profileImage}
                onChange={setProfileImage}
              />
            )}

            {contactSectionData?.sectionTitle && (
              <div className="space-y-2">
                <Label
                  htmlFor="sectionTitle"
                  className="text-sm font-medium"
                  style={{ color: ColorTheme.textPrimary }}
                >
                  Section Title
                </Label>
                <Input
                  id="sectionTitle"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Enter section title"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary,
                  }}
                />
              </div>
            )}

            {contactSectionData?.sectionDescription && (
              <div className="space-y-2">
                <Label
                  htmlFor="sectionDescription"
                  className="text-sm font-medium"
                  style={{ color: ColorTheme.textPrimary }}
                >
                  Section Description
                </Label>
                <Textarea
                  id="sectionDescription"
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                  placeholder="Enter section description"
                  className="resize-none h-20"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                    color: ColorTheme.textPrimary,
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
                  boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                }}
              >
                Save Section Header
              </Button>
            )}

            <ResumeUpload
              value={resumeLink}
              onChange={setResumeLink}
            />

            {templateName === "NeoSpark" ? (
              <Tabs defaultValue="contact" className="w-full">
                <style jsx global>{`
                  .custom-tab[data-state="active"] {
                    background-color: ${ColorTheme.primary} !important;
                    color: ${ColorTheme.textPrimary} !important;
                  }
                `}</style>
                <TabsList className="w-full grid grid-cols-2" style={{ backgroundColor: ColorTheme.bgNav, borderColor: ColorTheme.borderLight }}>
                  <TabsTrigger
                    value="contact"
                    className="custom-tab"
                    style={{ color: ColorTheme.textPrimary }}
                  >
                    Contact Page
                  </TabsTrigger>
                  <TabsTrigger
                    value="navbar"
                    className="custom-tab"
                    style={{ color: ColorTheme.textPrimary }}
                  >
                    Navbar Links
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="contact" className="mt-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Links shown in the Contact section</Label>
                    <SocialLinksEditor
                      links={socialLinks}
                      onChange={setSocialLinks}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="navbar" className="mt-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Links shown in the Navbar</Label>
                    <SocialLinksEditor
                      links={navbarSocials}
                      onChange={setNavbarSocials}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <SocialLinksEditor
                links={socialLinks}
                onChange={setSocialLinks}
              />
            )}
          </CardContent>
        </CardContent>

        <CardFooter className="pt-4 pb-6">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              backgroundColor: ColorTheme.primary,
              color: ColorTheme.textPrimary,
              boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
            }}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactSidebar;

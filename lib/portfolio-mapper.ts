import { themeContent } from "@/lib/themeContent";

export function convertToPortfolioFormat(
  resumeData: any,
  titleInfo: any,
  summaryInfo: any,
  shortSummaryInfo: any,
  longSummaryInfo: any,
  config: any,
  categorizedSkills: any,
  safariContent: any,
  finalTheme: string
) {
  const sections = [];
  const themePrompts = config.features;

  sections.push({
    type: "theme",
    data: themeContent[finalTheme],
  });

  // User Info with dynamic shortSummary
  if (resumeData.personalInfo) {
    const userInfoData: any = {
      github: resumeData.personalInfo.github || "",
      linkedin: resumeData.personalInfo.linkedin || "",
      email: resumeData.personalInfo.email || "",
      location: resumeData.personalInfo.location || "",
      resumeLink: resumeData.personalInfo.resumeLink || "",
      name: resumeData.personalInfo.name || "Alex Morgan",
    };

    // Add profile image only if enabled
    if (themePrompts.profileImage) {
      userInfoData.profileImage = config.defaults.userInfo?.profileImage || "https://placehold.co/400x400?text=Profile+Image";
    }

    // Add title/role to userInfo
    if (themePrompts?.titlePrefixSuffix) {
      userInfoData.title = `${titleInfo?.titlePrefix || "Software"} ${titleInfo?.titleSuffixOptions?.[0] || "Engineer"}`;
    } else if (themePrompts?.title) {
      userInfoData.title = titleInfo?.title || "Software Developer";
    } else {
      // Fallback to first experience role or default
      userInfoData.title = resumeData.experience?.[0]?.role || "Software Developer";
    }

    sections.push({
      type: "userInfo",
      data: userInfoData,
    });
  }

  // Hero Section - Always include, with fallbacks for all required fields
  const name = resumeData.personalInfo?.name || "Developer";

  // Use generated summary lines or fall back to alternatives
  let summaryLines;
  if (summaryInfo && summaryInfo.summaryLines && summaryInfo.summaryLines.length > 0) {
    summaryLines = summaryInfo.summaryLines.join("\n");
  } else if (resumeData.summary) {
    summaryLines = resumeData.summary.split(". ").slice(0, 3).join(".\n");
  } else {
    // Generate fallback summary based on skills
    const skillNames = resumeData.skills
      ? resumeData.skills.map((s: any) => s.name).slice(0, 3)
      : [];
    const primarySkill = skillNames[0] || "Software";
    summaryLines = `Passionate ${primarySkill} developer.\nEnthusiastic about creating innovative solutions.\nDedicated to continuous learning and growth.`;
  }

  // Use generated title info or fallback based on template type
  let heroData: any = {
    name: name,
    summary: summaryLines,
    ...config.defaults.hero // Merge defaults like wallpaper
  };

  // Add title based on template configuration
  if (themePrompts?.titlePrefixSuffix) {
    heroData.titlePrefix = titleInfo?.titlePrefix || "Software";
    heroData.titleSuffixOptions = titleInfo?.titleSuffixOptions || ["Engineer", "Developer"];
  } else if (themePrompts?.title) {
    heroData.title = titleInfo?.title || "Software Developer";
  }

  // Add short summary if template needs it
  if (themePrompts?.shortSummary) {
    let shortSummary =
      "I build exceptional and accessible digital experiences for the web."; // Default fallback
    if (shortSummaryInfo && shortSummaryInfo.shortSummary) {
      shortSummary = shortSummaryInfo.shortSummary;
    } else if (resumeData.summary) {
      const firstSentence = resumeData.summary.split(".")[0] + ".";
      if (firstSentence.length <= 100) {
        shortSummary = firstSentence;
      }
    }
    heroData.shortSummary = shortSummary;
  }

  // Add long summary if template needs it
  if (themePrompts?.longSummary) {
    let longSummary =
      "I'm a passionate Full Stack Developer with 4+ years of experience building modern web applications. I specialize in React, Node.js, and cloud technologies, with a strong focus on creating intuitive user experiences and scalable backend systems. My journey in tech started during my Computer Science studies, and I've been continuously learning and adapting to new technologies ever since. When I'm not coding, you'll find me contributing to open-source projects, writing technical blogs, or exploring the latest in AI and machine learning. I believe in the power of technology to solve real-world problems and am always excited to take on new challenges that push the boundaries of what's possible on the web.";
    if (longSummaryInfo && longSummaryInfo.longSummary) {
      longSummary = longSummaryInfo.longSummary;
    }
    heroData.longSummary = longSummary;
  }

  // Add badge only if template has badge enabled
  if (themePrompts?.badge) {
    heroData.badge = config.defaults.hero?.badge || {
      texts: [
        "Open to work",
        "Available for freelance",
        "Let's Collaborate!",
      ],
      color: "green",
      isVisible: true,
    };
  }

  // Add actions only if template has actions enabled
  if (themePrompts?.actions) {
    heroData.actions = config.defaults.hero?.actions || [
      {
        type: "button",
        label: "View Projects",
        url: "#projects",
        style: "primary",
      },
      {
        type: "button",
        label: "Contact Me",
        url: "#contact",
        style: "outline",
      },
    ];
  }

  // Always include hero section with robust fallbacks
  sections.push({
    type: "hero",
    data: heroData,
  });

  // Projects Section
  if (resumeData.projects && resumeData.projects.length > 0) {
    const formattedProjects = resumeData.projects.map((project: any) => ({
      projectName: project.projectName,
      projectTitle:
        project.projectTitle ||
        project.projectName ||
        "Project Title",
      projectDescription:
        project.projectDescription || "No description available.",
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      techStack: project.techStack || [],
    }));

    sections.push({
      type: "projects",
      data: {
        projects: formattedProjects,
      },
    });
  }

  // Experience Section
  if (resumeData.experience && resumeData.experience.length > 0) {
    const formattedExperience = resumeData.experience.map((exp: any) => ({
      role: exp.role,
      companyName: exp.companyName,
      location: exp.location || "",
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      techStack: exp.techStack || [],
    }));

    sections.push({
      type: "experience",
      data: formattedExperience,
    });
  }

  // Skills Section
  if (resumeData.skills && resumeData.skills.length > 0) {
    let skillsData: any;

    if (config.features.categorizedSkills && categorizedSkills?.categories) {
      // Use categorized skills for templates that support it (e.g. NeoSpark)
      skillsData = {
        categories: categorizedSkills.categories
      };
    } else {
      // Use flat list for other templates
      skillsData = {
        skills: resumeData.skills.map((skill: any) => ({
          name: skill.name,
          logo: skill.logo,
        })),
      };
    }

    sections.push({
      type: "skills",
      data: skillsData,
    });
  }

  // Education Section
  if (resumeData.education && resumeData.education.length > 0) {
    const formattedEducation = resumeData.education.map((edu: any) => ({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location || "",
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description || "",
    }));

    sections.push({
      type: "education",
      data: formattedEducation,
    });
  }

  // Safari/About Section (MacOS specific)
  if (config.features.safari && safariContent) {
    sections.push({
      type: "safari",
      data: {
        content: safariContent.content
      }
    });
  }

  return { sections };
}

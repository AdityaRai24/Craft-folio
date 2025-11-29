import { techList } from "@/lib/techlist";
import { themeContent } from "@/lib/themeContent";

export function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
        imageData.indexOf(":") + 1,
        imageData.lastIndexOf(";")
      ),
    },
  };
}

export function cleanJsonOutput(text: string): string {
  if (!text || text.trim() === "") {
    throw new Error("Empty response from model");
  }

  // Remove markdown code blocks
  let cleaned = text.replace(/```json\n?|\n?```|```\n?/g, "");

  // Find the first '{' or '['
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  let start = -1;
  let end = -1;

  // Determine which comes first
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    // Object
    start = firstBrace;
    let balance = 0;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === '{') balance++;
      else if (cleaned[i] === '}') balance--;

      if (balance === 0) {
        end = i + 1;
        break;
      }
    }
  } else if (firstBracket !== -1) {
    // Array
    start = firstBracket;
    let balance = 0;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === '[') balance++;
      else if (cleaned[i] === ']') balance--;

      if (balance === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end);
  } else if (start !== -1) {
    // If we found a start but no end, try to take the rest of the string
    // This might happen if the response is truncated
    cleaned = cleaned.substring(start);
    
    // Attempt to close truncated JSON
    // This is a basic heuristic and might not work for all cases
    const lastChar = cleaned.trim().slice(-1);
    if (lastChar !== '}' && lastChar !== ']') {
       // If it looks like a string was cut off
       if (cleaned.lastIndexOf('"') > cleaned.lastIndexOf('}')) {
          cleaned += '"';
       }
       // Close the object/array
       if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
          cleaned += '}';
       } else {
          cleaned += ']';
       }
    }
  }

  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();

  // Attempt to fix common JSON errors
  // 1. Fix unquoted keys: { key: "value" } -> { "key": "value" }
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');

  // 2. Fix trailing commas: { "key": "value", } -> { "key": "value" }
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  return cleaned;
}

// --- Helper Functions for Tech Mapping ---

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.\s-]/g, "") // Remove dots, spaces, hyphens
    .replace(/\.js$/, "") // Remove .js suffix
    .replace(/^(react|vue|angular)$/, "$1js"); // Add js to common frameworks if missing
}

function findBestMatch(techName: string) {
  const techMap = new Map();
  techList.forEach((tech: any) => {
    const normalizedName = normalizeString(tech.name);
    techMap.set(normalizedName, tech);
  });

  const normalized = normalizeString(techName);

  // Exact match
  if (techMap.has(normalized)) {
    return techMap.get(normalized);
  }

  // Partial match
  for (const [key, tech] of techMap.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return tech;
    }
  }

  // Special case matches
  const specialCases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    reactjs: "react",
    nextjs: "next.js",
    expressjs: "express.js",
    nodejs: "node.js",
    tailwind: "tailwindcss",
    postgres: "postgresql",
    openai: "openai",
    gemini: "google gemini",
    langchainjs: "langchain",
    "langchain js": "langchain",
    shadcnui: "shadcn ui",
    "c#": "c#",
    csharp: "c#",
    "c++": "c++",
    cpp: "c++",
    cplusplus: "c++",
    golang: "go",
    "vue.js": "vue.js",
    vuejs: "vue.js",
    vue: "vue.js",
    "angular.js": "angular",
    angularjs: "angular",
    "react native": "react native",
    reactnative: "react native",
    mongo: "mongodb",
    "ms sql": "mssql",
    mssql: "mssql",
    aws: "aws",
    "amazon web services": "aws",
    gcp: "gcp",
    "google cloud": "gcp",
    "google cloud platform": "gcp",
    azure: "azure",
    "microsoft azure": "azure",
    flutter: "flutter",
    dart: "dart",
    kotlin: "kotlin",
    swift: "swift",
    rust: "rust",
    ruby: "ruby",
    rails: "ruby on rails",
    "ruby on rails": "ruby on rails",
    spring: "spring boot",
    springboot: "spring boot",
    "spring boot": "spring boot",
    laravel: "laravel",
    django: "django",
    flask: "flask",
    fastify: "fastify",
    nestjs: "nestjs",
    "nest.js": "nestjs",
    docker: "docker",
    kubernetes: "kubernetes",
    k8s: "kubernetes",
    jenkins: "jenkins",
    git: "git",
    github: "github",
    gitlab: "gitlab",
    terraform: "terraform",
    ansible: "ansible",
    linux: "linux",
    redis: "redis",
    mysql: "mysql",
    sqlite: "sqlite",
    mariadb: "mariadb",
    oracle: "oracle",
    cassandra: "cassandra",
    neo4j: "neo4j",
    firebase: "firebase",
    supabase: "supabase",
    jest: "jest",
    cypress: "cypress",
    playwright: "playwright",
    selenium: "selenium",
    figma: "figma",
    photoshop: "photoshop",
    illustrator: "illustrator",
    blender: "blender",
    unity: "unity",
    unreal: "unreal engine",
    "unreal engine": "unreal engine",
    tensorflow: "tensorflow",
    pytorch: "pytorch",
    pandas: "pandas",
    numpy: "numpy",
    scikit: "scikit-learn",
    sklearn: "scikit-learn",
    "scikit-learn": "scikit-learn",
    opencv: "opencv",
    huggingface: "hugging face",
    "hugging face": "hugging face",
  };

  const specialMatch = specialCases[normalized];
  if (specialMatch && techMap.has(normalizeString(specialMatch))) {
    return techMap.get(normalizeString(specialMatch));
  }

  return null;
}

export function getTechLogo(techName: string): string {
  const matchedTech = findBestMatch(techName);
  if (matchedTech) {
    return matchedTech.logo;
  }
  // Fallback to UI Avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(techName)}&background=random&color=fff&size=128`;
}

export function mapTechStackWithTechList(resumeData: any) {
  // Helper function to update tech stack items
  const updateTechStack = (techItems: any[]) => {
    if (!techItems || !Array.isArray(techItems)) return [];

    // Map items to their matched logo or a fallback
    return techItems
      .map((tech) => {
        if (!tech.name) return null;

        const techName = tech.name;
        // Use the global helper function
        const logo = getTechLogo(techName);

        return {
          name: techName,
          logo: logo,
        };
      })
      .filter((item) => item !== null);
  };

  // Update skills
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    resumeData.skills = updateTechStack(resumeData.skills);
  }

  // Update experience tech stacks
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp: any) => {
      if (exp.techStack && Array.isArray(exp.techStack)) {
        exp.techStack = updateTechStack(exp.techStack);
      }
    });
  }

  // Update project tech stacks
  if (resumeData.projects && Array.isArray(resumeData.projects)) {
    resumeData.projects.forEach((project: any) => {
      if (project.techStack && Array.isArray(project.techStack)) {
        project.techStack = updateTechStack(project.techStack);
      }
    });
  }

  return resumeData;
}

// convert data to proper format
export function convertToPortfolioFormat(
  resumeData: any,
  titleInfo: any,
  summaryInfo: any,
  shortSummaryInfo: any,
  longSummaryInfo: any,
  themePrompts: any,
  finalTheme: string,
  categorizedSkills?: any,
  safariContent?: any
) {
  const sections = [];

  sections.push({
    type: "theme",
    data: themeContent[finalTheme],
  });

  // User Info
  if (resumeData.personalInfo) {
    const userInfoData: any = {
      github: resumeData.personalInfo.github || "",
      linkedin: resumeData.personalInfo.linkedin || "",
      email: resumeData.personalInfo.email || "",
      location: resumeData.personalInfo.location || "",
      resumeLink: resumeData.personalInfo.resumeLink || "",
      name: resumeData.personalInfo.name || "Alex Morgan",
    };

    if (finalTheme === "LumenFlow") {
      userInfoData.profileImage = "https://placehold.co/400x400?text=Profile+Image";
    }

    if (themePrompts?.titlePrefixSuffix) {
      userInfoData.title = `${titleInfo?.titlePrefix || "Software"} ${titleInfo?.titleSuffixOptions?.[0] || "Engineer"}`;
    } else if (themePrompts?.title) {
      userInfoData.title = titleInfo?.title || "Software Developer";
    } else {
      userInfoData.title = resumeData.experience?.[0]?.role || "Software Developer";
    }

    sections.push({
      type: "userInfo",
      data: userInfoData,
    });
  }

  // Hero Section
  const name = resumeData.personalInfo?.name || "Developer";

  let summaryLines;
  if (summaryInfo && summaryInfo.summaryLines && summaryInfo.summaryLines.length > 0) {
    summaryLines = summaryInfo.summaryLines.join("\n");
  } else if (resumeData.summary) {
    summaryLines = resumeData.summary.split(". ").slice(0, 3).join(".\n");
  } else {
    const skillNames = resumeData.skills
      ? resumeData.skills.map((s: any) => s.name).slice(0, 3)
      : [];
    const primarySkill = skillNames[0] || "Software";
    summaryLines = `Passionate ${primarySkill} developer.\nEnthusiastic about creating innovative solutions.\nDedicated to continuous learning and growth.`;
  }

  let heroData: any = {
    name: name,
    summary: summaryLines,
  };

  if (themePrompts?.titlePrefixSuffix) {
    heroData.titlePrefix = titleInfo?.titlePrefix || "Software";
    heroData.titleSuffixOptions = titleInfo?.titleSuffixOptions || ["Engineer", "Developer"];
  } else if (themePrompts?.title) {
    heroData.title = titleInfo?.title || "Software Developer";
  }

  if (themePrompts?.shortSummaryPrompt) {
    let shortSummary =
      "I build exceptional and accessible digital experiences for the web.";
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

  if (themePrompts?.longSummaryPrompt) {
    let longSummary =
      "I'm a passionate Full Stack Developer with 4+ years of experience building modern web applications. I specialize in React, Node.js, and cloud technologies, with a strong focus on creating intuitive user experiences and scalable backend systems. My journey in tech started during my Computer Science studies, and I've been continuously learning and adapting to new technologies ever since. When I'm not coding, you'll find me contributing to open-source projects, writing technical blogs, or exploring the latest in AI and machine learning. I believe in the power of technology to solve real-world problems and am always excited to take on new challenges that push the boundaries of what's possible on the web.";
    if (longSummaryInfo && longSummaryInfo.longSummary) {
      longSummary = longSummaryInfo.longSummary;
    }
    heroData.longSummary = longSummary;
  }

  if (themePrompts?.badge) {
    heroData.badge = {
      texts: [
        "Open to work",
        "Available for freelance",
        "Let's Collaborate!",
      ],
      color: "green",
      isVisible: true,
    };
  }

  if (themePrompts?.actions) {
    heroData.actions = [
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
        `${project.projectName.split(" ").slice(0, 3).join(" ")}`,
      projectDescription: project.projectDescription,
      githubLink: project.githubLink || "https://github.com/user/project",
      liveLink: project.liveLink || "https://project-demo.vercel.app",
      projectImage: "https://placehold.co/600x400?text=Project+Image",
      techStack: project.techStack || [],
    }));

    sections.push({
      type: "projects",
      data: formattedProjects,
    });
  }

  // Experience Section
  if (resumeData.experience && resumeData.experience.length > 0) {
    const formattedExperience = resumeData.experience.map((exp: any) => ({
      role: exp.role,
      companyName: exp.companyName,
      location: exp.location || "Remote",
      startDate: exp.startDate || "01/2023",
      endDate: exp.endDate || "Present",
      description: exp.description,
      techStack: exp.techStack || [],
    }));

    sections.push({
      type: "experience",
      data: formattedExperience,
    });
  }

  // Technologies Section
  if (resumeData.skills && resumeData.skills.length > 0) {
    let techStack = resumeData.skills;

    // If categorized skills are available, use them
    if (categorizedSkills && categorizedSkills.categories) {
      // Merge categorized skills with logos from techList
      const categories = categorizedSkills.categories.map((cat: any) => ({
        ...cat,
        technologies: cat.technologies.map((tech: any) => {
          // Use the global helper function
          const logo = getTechLogo(tech.name);
          return {
            ...tech,
            logo: logo
          };
        })
      }));

      techStack = {
        ...techStack,
        categories: categories
      };

      techStack = Object.assign(techStack, resumeData.skills);
    }

    sections.push({
      type: "technologies",
      data: techStack,
    });
  }

  // Education Section
  if (resumeData.education && resumeData.education.length > 0) {
    sections.push({
      type: "education",
      data: resumeData.education,
    });
  }

  // Safari Section (MacOS only)
  if (safariContent && safariContent.content) {
    sections.push({
      type: "safari",
      data: {
        content: safariContent.content
      }
    });
  }

  // Resume Section (MacOS only)
  if (resumeData.personalInfo && resumeData.personalInfo.resumeLink) {
    sections.push({
      type: "resume",
      data: {
        resumeLink: resumeData.personalInfo.resumeLink
      }
    });
  }

  // Contact Section
  sections.push({
    type: "contact",
    data: {
      title: "Get in Touch",
      description: "Let's connect and discuss your next project"
    }
  });

  return { sections };
}

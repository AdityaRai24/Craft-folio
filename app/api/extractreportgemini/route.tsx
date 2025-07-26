import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { techList } from "@/lib/techlist";
import { themeContent } from "@/lib/themeContent";
import { prompts } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const parsingTemplate = PromptTemplate.fromTemplate(`
You are a professional resume parser. Given an image of a resume, extract the relevant information into a structured JSON format.
Pay attention to all sections: personal information, summary, experience, education, skills, projects, and certifications.
For dates, use MM/YYYY format when possible.

For tech stack item refer to the provided tech list. ${techList} This list contains most of the possible tech stacks. 
If the project uses any of these tech stacks then use the same name and image present in this array else use name present in resume. 
Handle slightly different names like a resume may contain React and the array may contain React.js so use what is there in the array with its image.
If image not present use any dummy image.

For description projects, experience or any other kind of description summarize it in 3-4 lines at max. A user may have explained about the project in 10-12 lines so summarize it in around 3-4 lines.

For education section, if description is not available, generate a 1-2 line description based on the degree name. For example:
- For Computer Science: "Focused on software development, algorithms, and data structures. Gained hands-on experience in programming and system design."
- For Business Administration: "Studied core business principles, management strategies, and market analysis. Developed strong leadership and analytical skills."
- For Engineering: "Specialized in technical problem-solving and project management. Acquired practical knowledge in core engineering principles."

Return ONLY valid JSON, without any markdown code blocks, backticks, or explanatory text. The response should be directly parseable as JSON.

Use this exact schema:
{{
  "personalInfo": {{
    "name": string,
    "email": string,
    "phone": string,
    "linkedin": string,
    "github": string (optional),
    "website": string (optional),
    "location": string (optional)
  }},
  "summary": string (optional),
  "experience": [
    {{
      "role": string,
      "companyName": string,
      "location": string (optional),
      "startDate": string,
      "endDate": string,
      "description": string,
      "techStack": [
        {{
          "name": string,
          "logo": string
        }}
      ]
    }}
  ],
  "education": [
    {{
      "degree": string,
      "institution": string,
      "location": string ,
      "startDate": string ,
      "endDate": string ,
      "description": string 
    }}
  ],
  "skills": [
    {{
      "name": string,
      "logo": string
    }}
  ],
  "projects": [
    {{
      "projectName": string,
      "projectTitle": string (optional),
      "projectDescription": string,
      "githubLink": string (optional),
      "liveLink": string (optional),
      "techStack": [
        {{
          "name": string,
          "logo": string
        }}
      ]
    }}
  ],
}}

Resume content:
{resume_content}
`);

const titleGeneratorTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate a professional title prefix and title suffix options.
Extract the most prominent expertise area for the title prefix (e.g., "Frontend", "Full Stack", "Machine Learning").
Generate 2-3 suffix options (e.g., "Engineer", "Developer", "Architect").

Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "titlePrefix": string,
  "titleSuffixOptions": string[]
}}
`);

const onlyTitleTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate a single professional title that best represents the person's role and expertise.
The title should be concise but comprehensive, combining their main expertise area with their role.

Examples:
- "Full Stack Developer"
- "Frontend Engineer"
- "Machine Learning Engineer"
- "DevOps Specialist"
- "UI/UX Designer"

Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "title": string
}}
`);

const summaryGeneratorTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate 1 concise and professional summary line.
Each line should be a separate sentence highlighting key strengths, skills, or career objectives.
Make it personal and engaging, representing the individual's professional identity.

Eg 1: Enthusiastic and results-driven web developer passionate about building innovative and scalable web applications using modern technologies like React.js, Node.js, and the MERN stack.
Eg 2 : Craving to build innovative solutions that make an impact. Enthusiastic problem solver, always curious about new technologies. Committed to continuous learning and growth.

Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "summaryLines": string[]
}}
`);

const shortSummaryTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate a single short professional summary line (maximum 15-20 words).
This should be a concise tagline that captures the person's professional identity and key strength.

Examples:
- "I build exceptional and accessible digital experiences for the web."
- "Crafting innovative mobile solutions with cutting-edge technology."
- "Transforming ideas into scalable software solutions."
- "Building intelligent systems that solve real-world problems."

Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "shortSummary": string
}}
`);

const longSummaryTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate a comprehensive professional summary paragraph (60-90 words).
Include their role, years of experience, key technologies, specializations, educational background, interests, and career philosophy.
Make it personal, engaging, and unique to their background. Avoid generic statements.

Structure should flow naturally and include:
- Professional identity and experience level
- Key technical skills and specializations
- Educational background or career journey
- Personal interests or side projects
- Career philosophy or goals

Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "longSummary": string
}}
`);

let finalTheme = "";

export async function POST(req: Request) {
  try {
    const { base64, selectedTheme } = await req.json();
    finalTheme = selectedTheme;

    const filePart = fileToGenerativePart(base64);

    // Extract text content from resume image
    const extractionPrompt = "Extract all text content from this resume image.";
    const extractedContent = await model.generateContent([
      extractionPrompt,
      filePart,
    ]);
    const resumeContent = extractedContent.response.text();

    // Use a direct approach with Gemini instead of template if issues persist
    const formattedPrompt = await parsingTemplate.format({
      resume_content: resumeContent,
    });

    const parsingResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    });

    const parsedText = parsingResponse.response.text();

    // Clean the output to ensure it's valid JSON
    const cleanedJson = cleanJsonOutput(parsedText);

    // Validate and parse the JSON
    let resumeData;
    try {
      resumeData = JSON.parse(cleanedJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to parse resume data",
          raw: cleanedJson,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const themePrompts = prompts[finalTheme];
    let titleInfo;
    let summaryInfo;
    let shortSummaryInfo;
    let longSummaryInfo;

    // Generate title based on template configuration
    if (themePrompts?.titlePrefixSuffix) {
      const titlePrompt = await titleGeneratorTemplate.format({
        resume_data: JSON.stringify(resumeData),
      });
      
      const titleResponse = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: titlePrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });
      
      const titleData = titleResponse.response.text();
      titleInfo = JSON.parse(cleanJsonOutput(titleData));
    } else if (themePrompts?.title) {
      const titlePrompt = await onlyTitleTemplate.format({
        resume_data: JSON.stringify(resumeData),
      });
      
      const titleResponse = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: titlePrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      });
      
      const titleData = titleResponse.response.text();
      titleInfo = JSON.parse(cleanJsonOutput(titleData));
    }

    // Generate summary lines
    if (themePrompts?.summaryPrompt) {
      const summaryPrompt = await summaryGeneratorTemplate.format({
        resume_data: JSON.stringify(resumeData),
      });
      const summaryResponse = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });
      const summaryData = summaryResponse.response.text();
      summaryInfo = JSON.parse(cleanJsonOutput(summaryData));
    }

    // Generate short summary
    if (themePrompts?.shortSummaryPrompt) {
      const shortSummaryPrompt = await shortSummaryTemplate.format({
        resume_data: JSON.stringify(resumeData),
      });
      const shortSummaryResponse = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: shortSummaryPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      });
      const shortSummaryData = shortSummaryResponse.response.text();
      shortSummaryInfo = JSON.parse(cleanJsonOutput(shortSummaryData));
    }

    // Generate long summary
    if (themePrompts?.longSummaryPrompt) {
      const longSummaryPrompt = await longSummaryTemplate.format({
        resume_data: JSON.stringify(resumeData),
      });
      const longSummaryResponse = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: longSummaryPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });
      const longSummaryData = longSummaryResponse.response.text();
      longSummaryInfo = JSON.parse(cleanJsonOutput(longSummaryData));
    }

    // Process and map tech stack with techList
    resumeData = mapTechStackWithTechList(resumeData);

    // Convert to portfolio format with enhanced data
    const portfolioData = convertToPortfolioFormat(
      resumeData,
      titleInfo,
      summaryInfo,
      shortSummaryInfo,
      longSummaryInfo,
      themePrompts
    );
    console.log(titleInfo, summaryInfo, shortSummaryInfo, longSummaryInfo);
    return new Response(JSON.stringify(portfolioData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process resume",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function fileToGenerativePart(imageData: string) {
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

function cleanJsonOutput(text: string): string {
  let cleaned = text.replace(/```json\n|\n```|```\n|\n```/g, "");
  const jsonPattern = /\{[\s\S]*\}/;
  const matches = cleaned.match(jsonPattern);

  if (matches && matches[0]) {
    return matches[0];
  }

  return cleaned;
}

function mapTechStackWithTechList(resumeData: any) {
  const techMap = new Map();
  // Normalize tech names for better matching
  techList.forEach((tech: any) => {
    // Store with normalized name (lowercase, remove punctuation)
    const normalizedName = normalizeString(tech.name);
    techMap.set(normalizedName, tech);
  });

  // Helper function to normalize strings for better matching
  function normalizeString(str: string): string {
    return str
      .toLowerCase()
      .replace(/[.\s-]/g, "") // Remove dots, spaces, hyphens
      .replace(/\.js$/, "") // Remove .js suffix
      .replace(/^(react|vue|angular)$/, "$1js"); // Add js to common frameworks if missing
  }

  // Helper function to find the best match from techList
  function findBestMatch(techName: string) {
    const normalized = normalizeString(techName);

    // Exact match
    if (techMap.has(normalized)) {
      return techMap.get(normalized);
    }

    // Partial match - find the tech where normalized names include each other
    for (const [key, tech] of techMap.entries()) {
      if (key.includes(normalized) || normalized.includes(key)) {
        return tech;
      }
    }

    // Special case matches (common abbreviations or alternative names)
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
    };

    const specialMatch = specialCases[normalized];
    if (specialMatch && techMap.has(normalizeString(specialMatch))) {
      return techMap.get(normalizeString(specialMatch));
    }

    return null;
  }

  // Helper function to update tech stack items
  const updateTechStack = (techItems: any[]) => {
    if (!techItems || !Array.isArray(techItems)) return [];

    // Filter out items that don't have matches in techList
    return techItems
      .map((tech) => {
        if (!tech.name) return null;

        const techName = tech.name;
        const matchedTech = findBestMatch(techName);

        if (matchedTech) {
          return {
            name: techName, // Keep original name to preserve user's naming preference
            logo: matchedTech.logo,
          };
        }

        // Return null for items without matches
        return null;
      })
      .filter((item) => item !== null); // Remove null entries
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
// Modified part of your code to ensure hero section is always included
function convertToPortfolioFormat(
  resumeData: any,
  titleInfo: any,
  summaryInfo: any,
  shortSummaryInfo: any,
  longSummaryInfo: any,
  themePrompts: any
) {
  const sections = [];

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

    // Add profile image only for LumenFlow template
    if (finalTheme === "LumenFlow") {
      userInfoData.profileImage = "https://placehold.co/400x400?text=Profile+Image";
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
  };

  // Add title based on template configuration
  if (themePrompts?.titlePrefixSuffix) {
    heroData.titlePrefix = titleInfo?.titlePrefix || "Software";
    heroData.titleSuffixOptions = titleInfo?.titleSuffixOptions || ["Engineer", "Developer"];
  } else if (themePrompts?.title) {
    heroData.title = titleInfo?.title || "Software Developer";
  }

  // Add short summary if template needs it
  if (themePrompts?.shortSummaryPrompt) {
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
  if (themePrompts?.longSummaryPrompt) {
    let longSummary =
      "I'm a passionate Full Stack Developer with 4+ years of experience building modern web applications. I specialize in React, Node.js, and cloud technologies, with a strong focus on creating intuitive user experiences and scalable backend systems. My journey in tech started during my Computer Science studies, and I've been continuously learning and adapting to new technologies ever since. When I'm not coding, you'll find me contributing to open-source projects, writing technical blogs, or exploring the latest in AI and machine learning. I believe in the power of technology to solve real-world problems and am always excited to take on new challenges that push the boundaries of what's possible on the web.";
    if (longSummaryInfo && longSummaryInfo.longSummary) {
      longSummary = longSummaryInfo.longSummary;
    }
    heroData.longSummary = longSummary;
  }

  // Add badge only if template has badge enabled
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

  // Add actions only if template has actions enabled
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
    const techStack = resumeData.skills;

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

  return { sections };
}

import { techList } from "@/lib/techlist";

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

  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();

  // Try to find JSON object or array
  const jsonObjectPattern = /\{[\s\S]*\}/;
  const jsonArrayPattern = /\[[\s\S]*\]/;

  let matches = cleaned.match(jsonObjectPattern);
  if (!matches) {
    matches = cleaned.match(jsonArrayPattern);
  }

  if (matches && matches[0]) {
    return matches[0].trim();
  }

  // If no match found but string looks like JSON, return it
  if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
    return cleaned;
  }

  throw new Error("No valid JSON found in response");
}

export function mapTechStackWithTechList(resumeData: any) {
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

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompts } from "@/lib/prompts";
import {
  fileToGenerativePart,
  cleanJsonOutput,
  mapTechStackWithTechList,
  convertToPortfolioFormat,
} from "@/lib/resume-helpers";
import {
  parsingTemplate,
  titleGeneratorTemplate,
  onlyTitleTemplate,
  summaryGeneratorTemplate,
  shortSummaryTemplate,
  longSummaryTemplate,
  categorizationTemplate,
  safariContentTemplate,
} from "@/lib/resume-prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

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

    // Parse resume with enhanced generation config
    const formattedPrompt = await parsingTemplate.format({
      resume_content: resumeContent,
    });

    const parsingResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const parsedText = parsingResponse.response.text();

    // Clean and validate JSON
    let resumeData;
    try {
      const cleanedJson = cleanJsonOutput(parsedText);
      resumeData = JSON.parse(cleanedJson);
    } catch (error) {
      console.error("Error parsing resume JSON:", error);
      console.error("Raw response:", parsedText);
      return new Response(
        JSON.stringify({
          error: "Failed to parse resume data",
          details: error instanceof Error ? error.message : String(error),
          raw: parsedText.substring(0, 500),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const themePrompts = prompts[finalTheme];

    // Helper function to safely parse AI responses
    async function safeAIGeneration(
      template: any,
      data: any,
      temperature: number = 0.7,
      maxTokens: number = 1024
    ) {
      try {
        const prompt = await template.format(data);
        const response = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            responseMimeType: "application/json",
          },
        });

        const responseText = response.response.text();

        if (!responseText || responseText.trim() === "") {
          console.warn("Empty response from model");
          return null;
        }

        const cleaned = cleanJsonOutput(responseText);
        return JSON.parse(cleaned);
      } catch (error) {
        console.error("Error in AI generation:", error);
        return null;
      }
    }

    // Generate Safari Content (Only for MacOS)
    const isMacOS = finalTheme === "MacOS" || finalTheme === "Sonoma" || finalTheme === "Ventura" || finalTheme === "Monterey";

    // Parallelize AI generation tasks
    const [
      titleInfo,
      summaryInfo,
      shortSummaryInfo,
      longSummaryInfo,
      safariContent,
      categorizedSkills
    ] = await Promise.all([
      // Title Generation
      (async () => {
        if (themePrompts?.titlePrefixSuffix) {
          const result = await safeAIGeneration(
            titleGeneratorTemplate,
            { resume_data: JSON.stringify(resumeData) },
            0.7,
            1024
          );
          return result || {
            titlePrefix: "Software",
            titleSuffixOptions: ["Engineer", "Developer", "Architect"]
          };
        } else if (themePrompts?.title) {
          const result = await safeAIGeneration(
            onlyTitleTemplate,
            { resume_data: JSON.stringify(resumeData) },
            0.7,
            1024
          );
          return result || {
            title: resumeData.experience?.[0]?.role || "Software Developer"
          };
        }
        return null;
      })(),

      // Summary Generation
      (async () => {
        if (themePrompts?.summaryPrompt) {
          const result = await safeAIGeneration(
            summaryGeneratorTemplate,
            { resume_data: JSON.stringify(resumeData) },
            0.7,
            1024
          );
          return result || {
            summaryLines: [
              "Passionate developer focused on creating innovative solutions.",
              "Enthusiastic about learning new technologies and best practices.",
              "Committed to delivering high-quality, scalable applications."
            ]
          };
        }
        return null;
      })(),

      // Short Summary Generation
      (async () => {
        if (themePrompts?.shortSummaryPrompt) {
          const result = await safeAIGeneration(
            shortSummaryTemplate,
            { resume_data: JSON.stringify(resumeData) },
            0.7,
            1024
          );
          return result || {
            shortSummary: "Building exceptional digital experiences with modern technology."
          };
        }
        return null;
      })(),

      // Long Summary Generation
      (async () => {
        if (themePrompts?.longSummaryPrompt) {
          const result = await safeAIGeneration(
            longSummaryTemplate,
            { resume_data: JSON.stringify(resumeData) },
            0.7,
            2048
          );
          if (!result) {
            const skills = resumeData.skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "various technologies";
            return {
              longSummary: `I'm a passionate developer with experience in ${skills}. I focus on creating intuitive user experiences and building scalable solutions. My journey in tech has been driven by continuous learning and adapting to new technologies. I believe in the power of technology to solve real-world problems and am always excited to take on new challenges.`
            };
          }
          return result;
        }
        return null;
      })(),

      // Safari Content Generation (MacOS only)
      (async () => {
        if (isMacOS) {
          return await safeAIGeneration(
            safariContentTemplate,
            { resume_data: JSON.stringify(resumeData) },
            0.7,
            8192
          );
        }
        return null;
      })(),

      // Categorized Skills Generation
      (async () => {
        if (resumeData.skills && resumeData.skills.length > 0) {
          return await safeAIGeneration(
            categorizationTemplate,
            { skills: JSON.stringify(resumeData.skills) },
            0.3,
            2048
          );
        }
        return null;
      })()
    ]);

    // Upload Resume to Cloudinary (Only for MacOS)
    let resumeUrl = "";
    if (isMacOS && base64) {
      try {
        const formData = new FormData();
        formData.append("file", base64);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          resumeUrl = uploadData.secure_url;

          if (!resumeData.personalInfo) resumeData.personalInfo = {};
          resumeData.personalInfo.resumeLink = resumeUrl;
        } else {
          console.error("Failed to upload resume to Cloudinary");
        }
      } catch (error) {
        console.error("Error uploading resume to Cloudinary:", error);
      }
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
      themePrompts,
      finalTheme,
      categorizedSkills,
      safariContent
    );

    console.log("Generated data:", { titleInfo, summaryInfo, shortSummaryInfo, longSummaryInfo });

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
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

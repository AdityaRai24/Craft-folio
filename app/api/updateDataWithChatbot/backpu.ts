import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { techList } from "@/lib/techlist";

interface MessageMemory {
  text: string;
  timestamp: Date;
}

// Dummy response templates based on intent and section
const generateDummyResponse = (changes: any[], inputValue: string): string => {
  if (changes.length === 0) {
    return "I couldn't identify any specific changes to make. Could you please be more specific about what you'd like to update in your portfolio?";
  }

  const responseTemplates = {
    add: {
      projects:
        "Added a new project to your portfolio with the details you provided.",
      experience: "Added new work experience to your professional background.",
      skills: "Added new skills to your technical expertise.",
      education: "Added educational background to your profile.",
      default: "Added the requested information to your portfolio.",
    },
    update: {
      summary: "Updated your professional summary with fresh content.",
      shortSummary: "Refreshed your brief introduction.",
      name: "Updated your name in the portfolio.",
      title: "Changed your professional title.",
      email: "Updated your contact email address.",
      phone: "Updated your phone number.",
      location: "Updated your location information.",
      linkedin: "Updated your LinkedIn profile link.",
      github: "Updated your GitHub profile link.",
      website: "Updated your personal website link.",
      projects: "Updated project details as requested.",
      experience: "Modified your work experience information.",
      skills: "Updated your skills and technical expertise.",
      education: "Updated your educational background.",
      default: "Updated the requested section in your portfolio.",
    },
    change: {
      summary:
        "Modified your professional summary to better reflect your experience.",
      projects: "Changed the project details as requested.",
      experience: "Modified your work experience information.",
      skills: "Updated your technical skills list.",
      default: "Made the requested changes to your portfolio.",
    },
    remove: {
      projects: "Removed the specified project from your portfolio.",
      experience: "Removed the work experience entry.",
      skills: "Removed the specified skills from your list.",
      default: "Removed the requested item from your portfolio.",
    },
    delete: {
      projects: "Deleted the specified project from your portfolio.",
      experience: "Deleted the work experience entry.",
      skills: "Deleted the specified skills.",
      default: "Deleted the requested content from your portfolio.",
    },
  };

  // Generate response based on the first change (most common case)
  const primaryChange = changes[0];
  const intent = primaryChange.intent.toLowerCase();
  const section = primaryChange.sectionName.toLowerCase();

  let response = "";

  if (responseTemplates[intent as keyof typeof responseTemplates]) {
    const intentTemplates =
      responseTemplates[intent as keyof typeof responseTemplates];
    response =
      intentTemplates[section as keyof typeof intentTemplates] ||
      intentTemplates.default;
  } else {
    response = "Made the requested changes to your portfolio.";
  }

  // Handle multiple changes
  if (changes.length > 1) {
    const additionalChanges = changes.length - 1;
    response += ` I also made ${additionalChanges} other ${
      additionalChanges === 1 ? "change" : "changes"
    } as requested.`;
  }

  // Add contextual responses for common patterns
  if (
    inputValue.toLowerCase().includes("shorter") ||
    inputValue.toLowerCase().includes("brief")
  ) {
    response =
      "Made your content more concise while keeping the key information.";
  } else if (
    inputValue.toLowerCase().includes("longer") ||
    inputValue.toLowerCase().includes("detailed")
  ) {
    response = "Expanded your content with more detailed information.";
  } else if (
    inputValue.toLowerCase().includes("professional") ||
    inputValue.toLowerCase().includes("formal")
  ) {
    response = "Updated your content with a more professional tone.";
  } else if (
    inputValue.toLowerCase().includes("casual") ||
    inputValue.toLowerCase().includes("friendly")
  ) {
    response = "Adjusted your content to have a more approachable tone.";
  }

  return response;
};

export async function POST(req: NextRequest) {
  try {
    const { portfolioData, inputValue, messageMemory } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const sections = portfolioData.map((item : any) => item.type);
    // Schema for the complete response
    const outputSchema = z.object({
      changes: z
        .array(
          z.object({
            intent: z
              .string()
              .describe(
                "The specific action being requested (add, update, delete, change)"
              ),
            sectionName: z
              .string()
              .describe("The specific section of the portfolio being modified"),
            value: z.string().describe("The exact new value to be applied"),
            isNewRequest: z
              .boolean()
              .describe(
                "Whether this is a new request or a reference to a previous message"
              ),
          })
        )
        .describe("Array of distinct changes requested by the user"),
      updatedPortfolio: z
        .object({})
        .passthrough()
        .describe("The complete updated portfolio JSON data"),
    });

    const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);
    const formatInstructions = outputParser.getFormatInstructions();

    // Format message memory for context - only include the last 3 messages for efficiency
    const recentMemory =
      messageMemory?.length > 0
        ? messageMemory
            .slice(-3)
            .map(
              (msg: MessageMemory, index: number) =>
                `Message ${index + 1}: ${msg.text}`
            )
            .join("\n")
        : "";

    // Single comprehensive prompt that handles everything
    const comprehensivePrompt = PromptTemplate.fromTemplate(`
      You are a portfolio customization assistant that analyzes requests and updates portfolio data in a single step.
      
      # CONTEXT
      Previous messages (only consider these if directly referenced):
      ${recentMemory}
      
      # CURRENT REQUEST
      "{input_value}"

      # CURRENT PORTFOLIO DATA
      {portfolioData}

      # AVAILABLE TECHNOLOGIES (for tech stack only)
      {tech_list}

      # TASK
      1. Analyze the user request and identify specific changes needed
      2. Generate appropriate content for vague requests (e.g., "improve my summary")
      3. Apply ALL changes to the portfolio data
      4. Return both the changes made and the complete updated portfolio

      # INSTRUCTIONS FOR ANALYSIS
      - Identify ONLY the specific changes requested in the CURRENT message
      - For each change, determine if it's a new request or refers to a previous message
      - Do NOT repeat actions from previous messages unless explicitly requested again
      - If user says "make it shorter" or similar, mark isNewRequest as false

      # INSTRUCTIONS FOR CONTENT GENERATION
      - For specific values (e.g., "change name to John Smith"), use the provided value
      - For vague requests (e.g., "improve my summary"), generate appropriate professional content
      - Be professional and authentic - never use placeholders like "[Your text here]"
      - Match the style and tone of existing content in the portfolio
      - Be concise but complete
      - For tech stack, ONLY use technologies from the provided list
      - Generate distinct content for summary (2-3 lines) and shortSummary (1 line) fields

      # INSTRUCTIONS FOR PORTFOLIO UPDATES
      - Apply changes to the portfolio data systematically
      - Preserve all other data exactly as is
      - For projects or experience, use this image URL: https://placehold.co/600x400?text=Project+Image
      - Ensure JSON structure remains valid
      - Handle arrays (projects, experience, skills) appropriately

      # PARSING RULES
      - Extract specific values when provided
      - Each change must have a precise intent (add, update, remove, change) and clear sectionName
      - Do NOT infer additional changes beyond what's explicitly requested
      - If user mentions multiple sections, create separate change objects for each

      # RESPONSE REQUIREMENTS
      - Return valid JSON that matches the schema
      - Include both the changes array and the complete updated portfolio
      - Ensure updatedPortfolio contains the full portfolio structure with all modifications applied

      {format_instructions}

      IMPORTANT: 
      - Return a valid JSON object with exactly these fields: "changes" and "updatedPortfolio"
      - Ensure all JSON syntax is correct (no trailing commas, proper quotes, etc.)
      - The "changes" field must be an array of objects
      - The "updatedPortfolio" field must contain the complete modified portfolio data
      - Do not include any explanations or markdown formatting, just the raw JSON
    `);

    const finalPrompt = await comprehensivePrompt.format({
      input_value: inputValue,
      portfolioData: JSON.stringify(portfolioData, null, 2),
      tech_list: JSON.stringify(techList),
      format_instructions: formatInstructions,
    });

    // Single API call to handle everything
    const start = Date.now();
    const response = await model.generateContent(finalPrompt);
    const endLLM = Date.now();
    const responseText = response.response.text();

    // Parse the response with robust error handling
    let parsedOutput;
    try {
      // First, try to extract JSON from the response
      let jsonContent = responseText.trim();

      // Remove markdown code blocks if present
      const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const codeBlockMatch = jsonContent.match(codeBlockRegex);
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1].trim();
      }

      // Try to find JSON object in the response
      const jsonObjectRegex = /\{[\s\S]*\}/;
      const jsonMatch = jsonContent.match(jsonObjectRegex);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }

      // First try direct JSON parsing
      let rawParsed;
      try {
        rawParsed = JSON.parse(jsonContent);
      } catch (jsonError) {
        console.error("Direct JSON parsing failed:", jsonError);

        // Fallback: try to clean common JSON issues
        let cleanedJson = jsonContent
          .replace(/,\s*}/g, "}") // Remove trailing commas
          .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
          .replace(/[\r\n\t]/g, " ") // Replace newlines and tabs with spaces
          .replace(/\s+/g, " ") // Collapse multiple spaces
          .trim();

        rawParsed = JSON.parse(cleanedJson);
      }

      // Validate and structure the output
      if (!rawParsed.changes) {
        rawParsed.changes = [];
      }

      if (!rawParsed.updatedPortfolio) {
        // If updatedPortfolio is missing, use the original data
        rawParsed.updatedPortfolio = portfolioData;
      }

      // Ensure changes is an array
      if (!Array.isArray(rawParsed.changes)) {
        rawParsed.changes = [];
      }

      // Validate each change object
      rawParsed.changes = rawParsed.changes.filter(
        (change: any) =>
          change &&
          typeof change === "object" &&
          change.intent &&
          change.sectionName &&
          typeof change.isNewRequest === "boolean"
      );

      parsedOutput = rawParsed;
    } catch (error) {
      console.error("Parsing error:", error);
      console.error("Response text:", responseText);

      // Return a fallback response with no changes
      return NextResponse.json({
        originalData: portfolioData,
        updatedData: portfolioData,
        changes: [],
        userReply:
          "I encountered an issue processing your request. Could you please try rephrasing your request more specifically?",
        error: "Parsing failed",
        details: error instanceof Error ? error.message : String(error),
      });
    }
    const endParsing = Date.now();

    // Filter out invalid changes
    const validChanges = parsedOutput.changes.filter(
      (change: any) =>
        change.intent &&
        change.sectionName &&
        (change.isNewRequest || (change.value && change.value.trim() !== ""))
    );

    // Generate dummy response based on applied changes
    const userResponse = generateDummyResponse(validChanges, inputValue);
    
    return NextResponse.json({
      originalData: portfolioData,
      updatedData: parsedOutput.updatedPortfolio,
      changes: validChanges,
      userReply: userResponse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred during portfolio customization",
        details: error instanceof Error ? error.message : String(error),
        userReply:
          "I couldn't process your request due to a technical issue. Please try again with more specific instructions about what you'd like to change in your portfolio.",
      },
      { status: 500 }
    );
  }
}

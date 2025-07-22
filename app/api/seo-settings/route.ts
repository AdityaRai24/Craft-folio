import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { portfolioData } = await req.json();
    console.log("Received portfolio data:", portfolioData);

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Sanitize portfolio data to prevent JSON parsing issues
    const sanitizedData = JSON.stringify(portfolioData, null, 2)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const prompt = `You are an SEO expert. Generate an SEO title and description for a portfolio website.

Portfolio Data: ${sanitizedData}

Requirements:
- Title: 50-60 characters, include main keywords
- Description: 150-160 characters, compelling and descriptive
- Focus on skills, profession, and unique value

Respond ONLY with valid JSON in this exact format (no additional text, no markdown, no explanations):
{
  "seoTitle": "Professional Portfolio Title Here",
  "seoDescription": "Compelling description that includes key skills and value proposition for better search visibility."
}`;

    console.log("Sending prompt to Gemini");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Raw response from Gemini:", text);

    // Clean the response text
    text = text.trim();

    // Remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/```json\n?/, "").replace(/\n?```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/```\n?/, "").replace(/\n?```$/, "");
    }

    // Remove any leading/trailing whitespace again
    text = text.trim();

    // Find JSON object in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    console.log("Cleaned response:", text);

    let seoData;
    try {
      seoData = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error("Text that failed to parse:", text);

      // Fallback: try to extract title and description with regex
      const titleMatch = text.match(/"seoTitle":\s*"([^"]+)"/);
      const descMatch = text.match(/"seoDescription":\s*"([^"]+)"/);

      if (titleMatch && descMatch) {
        seoData = {
          seoTitle: titleMatch[1],
          seoDescription: descMatch[1],
        };
      } else {
        // Ultimate fallback
        seoData = {
          seoTitle: "Professional Portfolio - Skills & Experience",
          seoDescription:
            "Discover my professional portfolio showcasing skills, projects, and experience. View my work and get in touch for opportunities.",
        };
      }
    }

    // Validate the parsed data
    if (!seoData.seoTitle || !seoData.seoDescription) {
      throw new Error("Invalid response format from AI model");
    }

    // Ensure character limits
    if (seoData.seoTitle.length > 60) {
      seoData.seoTitle = seoData.seoTitle.substring(0, 57) + "...";
    }

    if (seoData.seoDescription.length > 160) {
      seoData.seoDescription = seoData.seoDescription.substring(0, 157) + "...";
    }

    console.log("Final SEO data:", seoData);
    return NextResponse.json(seoData);
  } catch (error) {
    console.error("Error in SEO generation:", error);

    // Return structured error response
    return NextResponse.json(
      {
        error: "Failed to generate SEO data",
        message: error instanceof Error ? error.message : "Unknown error",
        fallback: {
          seoTitle: "Professional Portfolio",
          seoDescription:
            "Professional portfolio showcasing skills, projects, and experience. View my work and connect for opportunities.",
        },
      },
      { status: 500 }
    );
  }
}

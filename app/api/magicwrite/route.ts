import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let originalContext = "";
  
  try {
    const body = await request.json();
    const { context, input, prompt: promptParam } = body;
    originalContext = context || "";
    
    const userInput = input || promptParam || "";

    if (typeof context !== 'string' || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `You are an expert content writer and editor specializing in professional portfolio content, technical writing, and career development. Your task is to enhance the given content based on the user's specific request.

ORIGINAL CONTENT:
"${context}"

USER'S ENHANCEMENT REQUEST:
"${userInput}"

CONTENT ENHANCEMENT GUIDELINES:

1. **PROJECT DESCRIPTIONS**: If enhancing a project description:
   - Include all technologies mentioned in the user's request
   - Highlight technical challenges and solutions
   - Emphasize impact and outcomes
   - Add specific technical details and methodologies
   - Make it compelling for potential employers or clients
   - Include any specific frameworks, libraries, or tools requested

2. **EXPERIENCE DESCRIPTIONS**: If enhancing work experience:
   - Focus on achievements and measurable results
   - Include specific responsibilities and technologies
   - Highlight leadership, problem-solving, and technical skills
   - Add quantifiable metrics where possible
   - Emphasize career progression and growth

3. **PERSONAL SUMMARIES**: If enhancing a personal summary:
   - Make it engaging and professional
   - Highlight unique value proposition
   - Include relevant skills and expertise
   - Keep it concise but impactful
   - Focus on career goals and aspirations

4. **GENERAL ENHANCEMENT RULES**:
   - ALWAYS incorporate the user's specific request into the enhanced content
   - Maintain the original tone and style while improving clarity
   - Add relevant technical details, frameworks, or methodologies as requested
   - Make the content more engaging and professional
   - Ensure all user-specified technologies, tools, or concepts are included
   - Keep the enhanced version concise but comprehensive
   - Maintain the same context and purpose as the original

5. **TECHNICAL ACCURACY**:
   - If the user mentions specific technologies (like FastAPI, React, Python, etc.), ensure they are prominently featured
   - Include technical stack details as requested
   - Add relevant technical context and methodologies
   - Ensure all mentioned tools and frameworks are properly integrated into the description

6. **QUALITY STANDARDS**:
   - Write in clear, professional language
   - Use active voice where appropriate
   - Avoid jargon unless it's industry-standard
   - Make the content compelling and memorable
   - Ensure it reads naturally and flows well

IMPORTANT: Your response should be a direct enhancement of the original content that incorporates ALL elements from the user's request. Do not add explanations, markdown formatting, or quotes around the content. Return ONLY the enhanced content as a clean, professional description.

ENHANCED CONTENT:`;

    console.log("Sending prompt to Gemini for content enhancement");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Raw response from Gemini:", text);

    text = text.trim();

    // Remove markdown code blocks if present
    if (text.startsWith("```")) {
      text = text.replace(/```\n?/, "").replace(/\n?```$/, "");
    }

    // Remove any leading/trailing quotes
    text = text.replace(/^["']|["']$/g, "");

    // Remove any leading/trailing whitespace again
    text = text.trim();

    console.log("Cleaned enhanced content:", text);

    // Validate the response
    if (!text || text.length < 10) {
      throw new Error("Invalid response from AI model");
    }

    // Print to server console for debugging
    console.log('Magic Write Enhanced Content:', text);

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error in Magic Write generation:", error);

    // Return structured error response
    return NextResponse.json(
      {
        error: "Failed to enhance content",
        message: error instanceof Error ? error.message : "Unknown error",
        fallback: originalContext || "Original content unavailable", // Return original content as fallback
      },
      { status: 500 }
    );
  }
} 
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

interface MessageMemory {
  text: string;
  timestamp: Date;
}

export async function POST(req: NextRequest) {
  try {
    const totalStart = Date.now();
    const { portfolioData, inputValue, messageMemory } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const sections = portfolioData.map((item : any) => item.type);
    const sectionDetectionPrompt = `
      You are an assistant for a portfolio editing tool.\n\nAvailable sections: ${JSON.stringify(sections)}\nUser request: "${inputValue}"\nPrevious messages: ${messageMemory && messageMemory.length > 0 ? messageMemory.map((msg: MessageMemory, idx: number) => `Message ${idx + 1}: ${msg.text}`).join(' ') : ''}\n\nWhich single section should be updated? Return ONLY the most relevant section name as a plain string, e.g. "projects". Do not explain, do not return an array.`;
    const sectionDetectionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const sectionDetectionResponse = await sectionDetectionModel.generateContent(sectionDetectionPrompt);
    const sectionDetectionText = sectionDetectionResponse.response.text().trim();
    let detectedSection = "";
    try {
      detectedSection = sectionDetectionText.replace(/^"|"$/g, '');
    } catch (e) {
      console.error("Failed to parse detected section from LLM:", sectionDetectionText, e);
    }
    let detectedSectionData = null;
    if (detectedSection) {
      detectedSectionData = portfolioData.find((item: any) => item.type === detectedSection);
    }

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

    const sectionEditPrompt = `
      You are a portfolio editing assistant.\n\n
      # CONTEXT\n
      Previous messages (only consider these if directly referenced):\n${recentMemory}\n\n
      # USER REQUEST\n
      "${inputValue}"\n\n
      # SECTION DATA TO UPDATE\n
      ${JSON.stringify(detectedSectionData, null, 2)}\n\n
      # INSTRUCTIONS\n
      - Update ONLY the provided section data according to the user request.\n
      - Do NOT change the schema, structure, or field names.\n
      - If adding, modifying, or removing items, do so within the provided structure.\n
      - If you are creating something new and it requires a description, write a description for it based on the style and length of other descriptions in this section, unless the user specifically requests a long or short description.\n
      - Return ONLY the updated section data as valid JSON, matching the original format exactly.\n
      - Do NOT include any explanations, markdown, or extra text.\n
      - If the request is unclear, make a reasonable professional update.\n    `;

    const sectionEditModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const sectionEditResponse = await sectionEditModel.generateContent(sectionEditPrompt);
    const sectionEditText = sectionEditResponse.response.text().trim();
    let updatedSectionData = null;
    try {
      const jsonObjectMatch = sectionEditText.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        updatedSectionData = JSON.parse(jsonObjectMatch[0]);
      } else {
        updatedSectionData = JSON.parse(sectionEditText);
      }
    } catch (e) {
      console.error("Failed to parse updated section data from Gemini:", sectionEditText, e);
    }
    let updatedPortfolioData = Array.isArray(portfolioData)
      ? portfolioData.map((item: any) => {
          if (item.type === detectedSection && updatedSectionData) {
            return { ...item, data: updatedSectionData.data };
          }
          return item;
        })
      : portfolioData;
    const totalEnd = Date.now();
    return NextResponse.json({
      originalData: portfolioData,
      updatedData: updatedPortfolioData,
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

// return NextResponse.json({
  // originalData: portfolioData,
//   updatedData: parsedOutput.updatedPortfolio,
//   changes: validChanges,
  // userReply: userResponse,
// });
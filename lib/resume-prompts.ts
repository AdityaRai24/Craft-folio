import { PromptTemplate } from "@langchain/core/prompts";

export const parsingTemplate = PromptTemplate.fromTemplate(`
You are a professional resume parser. Given an image of a resume, extract the relevant information into a structured JSON format.
Pay attention to all sections: personal information, summary, experience, education, skills, projects, and certifications.
For dates, use MM/YYYY format when possible.

For tech stack item, extract the name exactly as it appears in the resume.

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
          "logo": string (optional)
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
      "logo": string (optional)
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
          "logo": string (optional)
        }}
      ]
    }}
  ],
}}

Resume content:
{resume_content}
`);

export const titleGeneratorTemplate = PromptTemplate.fromTemplate(`
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

export const onlyTitleTemplate = PromptTemplate.fromTemplate(`
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

export const summaryGeneratorTemplate = PromptTemplate.fromTemplate(`
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

export const shortSummaryTemplate = PromptTemplate.fromTemplate(`
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

export const longSummaryTemplate = PromptTemplate.fromTemplate(`
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

export const categorizationTemplate = PromptTemplate.fromTemplate(`
Based on the list of skills below, categorize them into "Frontend", "Backend", and "DevOps & Tools".
Return a JSON object with a "categories" array.

Skills:
{skills}

Return ONLY valid JSON in this format:
{{
  "categories": [
    {{
      "category": string, // "Frontend", "Backend", or "DevOps & Tools"
      "technologies": [
        {{
          "name": string,
          "proficiency": number // Estimate proficiency 0-100 based on context or default to 80
        }}
      ]
    }}
  ]
}}
`);

export const safariContentTemplate = PromptTemplate.fromTemplate(`
Generate rich HTML content for a personal portfolio "About Me" page based on the resume data.
The content should be styled with Tailwind CSS classes.
IMPORTANT: Write in the FIRST PERSON ("I am...", "My journey...").
Focus entirely on the candidate's skills, background, experience, and professional identity.
DO NOT mention "template", "MacOS", "portfolio features", or "interactive elements" unless they are specific skills of the candidate.
The goal is to create a genuine "About Me" page for the person.

Include:
1. A welcoming header (e.g., "Hi, I'm [Name]").
2. A grid of 3 cards highlighting key strengths/features (use emojis).
3. A section describing the person's background and journey.
4. A "Key Skills" or "What I Do" section.

Use the following style for cards: "p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20".
Use standard Tailwind colors and spacing.

Resume Data:
{resume_data}

Return ONLY valid JSON in this format:
{{
  "content": string // The HTML string
}}
`);

export const blankCanvasHTMLTemplate = new PromptTemplate({
  template: `
    You are an expert portfolio builder. Your task is to convert the provided resume content into a professional, well-structured HTML document suitable for a developer portfolio.

    The HTML will be used in a rich text editor, so use standard HTML tags like <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <br>.
    
    Do NOT include <html>, <head>, or <body> tags.
    Do NOT use any classes or inline styles.
    
    Structure the content as follows:
    1.  **Hero Section**:
        *   <h1>Name</h1>
        *   <h2>Title/Role</h2>
        *   <p>Professional Summary</p>
        <hr>
    
    2.  **About Me**:
        *   <h2>About Me</h2>
        *   <p>A detailed bio based on the resume summary and experience.</p>
        <hr>
    
    3.  **Work Experience**:
        *   <h2>Work Experience</h2>
        *   <ul>
        *     <li><strong>Role @ Company</strong> (Date)<br>Description of responsibilities and achievements.</li>
        *   </ul>
        <hr>
    
    4.  **Projects** (if available):
        *   <h2>Projects</h2>
        *   <ul>
        *     <li><strong>Project Name</strong> - Description.</li>
        *   </ul>
        <hr>
    
    5.  **Education**:
        *   <h2>Education</h2>
        *   <ul>
        *     <li><strong>Degree</strong>, Institution (Date)</li>
        *   </ul>
        <hr>
    
    6.  **Skills**:
        *   <h2>Skills</h2>
        *   <p>List of skills, separated by commas or categorized.</p>
        <hr>
    
    7.  **Contact**:
        *   <h2>Contact</h2>
        *   <p>Email, LinkedIn, GitHub, etc.</p>

    Resume Content:
    {resume_content}

    Return ONLY valid JSON in this format:
    {{
      "content": string // The HTML string
    }}
  `,
  inputVariables: ["resume_content"],
});

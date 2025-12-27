import { GoogleGenAI, Type } from "@google/genai";

export interface AnalysisResult {
  summary: string;
  decisions: string[];
  actionItems: {
    task: string;
    owner: string;
    priority: "High" | "Medium" | "Low";
  }[];
  topics: string[];
}

export const analyzeMeetingText = async (
  text: string, 
  apiKey: string
): Promise<AnalysisResult> => {
  // Use the provided key or fall back to env var (though env var likely empty in this context, good for structure)
  const key = apiKey || process.env.API_KEY || "";
  
  if (!key) {
    throw new Error("API Key is missing. Please add your Google Gemini API Key in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey: key });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025', // High speed, good reasoning
      contents: `Analyze this meeting transcript and extract: 
      1) A concise summary (2-3 sentences)
      2) Key decisions made (bullet points)
      3) Action items with owners if mentioned (or 'Unassigned') and priority level (High/Medium/Low)
      4) Important topics discussed (1-2 words each)
      
      Here is the transcript:
      ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            decisions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["task", "owner", "priority"]
              }
            },
            topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "decisions", "actionItems", "topics"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
};
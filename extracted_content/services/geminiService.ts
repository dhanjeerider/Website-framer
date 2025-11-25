import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSiteDescription = async (url: string): Promise<GeneratedContent> => {
  try {
    const prompt = `Analyze this domain name: "${url}". 
    Create a short, catchy, modern marketing headline (max 6 words), a brief description (max 20 words) suitable for a design portfolio, and 3 keyword tags.
    If the URL is generic or empty, just generate generic "Web Design" related text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["headline", "description", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback content if API fails or key is missing
    return {
      headline: "Stunning Web Experience",
      description: "A showcase of responsive design across all devices.",
      tags: ["UI/UX", "Responsive", "Design"]
    };
  }
};
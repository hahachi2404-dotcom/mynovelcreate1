import { GoogleGenAI, Type } from "@google/genai";
import { NovelConfig, OutlineItem } from "../types";

// Initialize Gemini Client Lazily
// This prevents the app from crashing on startup if the API key is missing or during build time.
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing. Please check your environment variables.");
      throw new Error("API Key is not configured.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

// We use the requested Gemini 3 Pro Preview model for complex creative writing
const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Generates a novel outline (list of chapters) based on user configuration.
 */
export const generateNovelOutline = async (config: NovelConfig): Promise<OutlineItem[]> => {
  const prompt = `
    You are a best-selling novelist and creative writing architect writing in Simplified Chinese. 
    Create a detailed outline for a novel with the following specificaitons:
    
    Title Idea: ${config.title}
    Genre: ${config.genre}
    Writing Style: ${config.style}
    Key Themes/Keywords: ${config.keywords}
    Target Audience: ${config.targetAudience}

    Please generate a structure of approximately 5 to 10 chapters.
    For each chapter, provide a compelling title and a short summary of the plot points.
    All output (titles and summaries) must be in Simplified Chinese (简体中文).
    
    Return the response strictly as a JSON array of objects.
  `;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The title of the chapter in Chinese" },
              summary: { type: Type.STRING, description: "A brief summary of what happens in this chapter in Chinese" }
            },
            required: ["title", "summary"]
          }
        },
        // Using thinking budget to ensure high quality plot coherence
        thinkingConfig: { thinkingBudget: 2048 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated from Gemini.");
    
    return JSON.parse(text) as OutlineItem[];
  } catch (error) {
    console.error("Error generating outline:", error);
    throw error;
  }
};

/**
 * Generates the full content of a specific chapter using streaming.
 */
export const generateChapterContentStream = async (
  chapterTitle: string,
  chapterSummary: string,
  config: NovelConfig,
  previousContext?: string
) => {
  const prompt = `
    Write the full content for the following chapter of a novel in Simplified Chinese (简体中文).
    
    Novel Information:
    Title: ${config.title}
    Genre: ${config.genre}
    Style: ${config.style}
    
    Current Chapter:
    Title: ${chapterTitle}
    Plot Summary: ${chapterSummary}
    
    ${previousContext ? `Context from previous chapter: ${previousContext}` : ''}
    
    Write the chapter in a flowing, engaging narrative style. 
    Focus on "show, don't tell", vivid imagery, and character development.
    Use Markdown formatting for emphasis where appropriate.
    The content MUST be in Simplified Chinese.
  `;

  try {
    const client = getAiClient();
    const stream = await client.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // Higher thinking budget for the actual prose generation to ensure creativity
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return stream;
  } catch (error) {
    console.error("Error creating chapter stream:", error);
    throw error;
  }
};
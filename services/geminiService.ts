
import { GoogleGenAI } from "@google/genai";
import { APP_MODELS } from "../constants";

export const generateVisionaryImage = async (
  prompt: string,
  aspectRatio: "1:1" | "16:9" | "9:16" = "16:9",
  useHighQuality: boolean = false
): Promise<string> => {
  const modelName = useHighQuality ? APP_MODELS.PRO : APP_MODELS.FLASH;
  
  // Create a new instance right before use as per instructions for API key selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: useHighQuality ? "1K" : undefined,
        }
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from model");
    }

    return imageUrl;
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_RESET_REQUIRED");
    }
    throw error;
  }
};

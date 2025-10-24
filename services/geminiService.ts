

import { GoogleGenAI } from "@google/genai";
import type { GeminiAnswer, Source, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAnswerFromGemini = async (query: string): Promise<GeminiAnswer> => {
  try {
    const enhancedQuery = `${query}\n\nIMPORTANT: After the answer, provide a list of 3-5 related search queries. Format this list under a markdown heading "### Related Searches".`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedQuery,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text;
    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // FIX: Correctly filter and map grounding chunks to handle optional `uri` and `title` properties.
    const sources: Source[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title?: string } => !!web?.uri)
      .map(web => ({
        uri: web.uri,
        title: web.title || web.uri,
      }));

    if (!responseText) {
      throw new Error("Received an empty response from the AI.");
    }
      
    // Parse the response to separate the main answer from related searches
    let text = responseText;
    let relatedSearches: string[] = [];
    const separator = '### Related Searches';

    if (responseText.includes(separator)) {
      const parts = responseText.split(separator);
      text = parts[0].trim();
      const searchesPart = parts[1];
      if (searchesPart) {
        relatedSearches = searchesPart
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('* ') || line.startsWith('- '))
          .map(line => line.substring(2).trim())
          .filter(Boolean); // Filter out any empty strings
      }
    }

    return { text, sources, relatedSearches };

  } catch (error) {
    console.error("Error fetching answer from Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get answer: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the answer.");
  }
};
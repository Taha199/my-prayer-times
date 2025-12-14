import { GoogleGenAI, Type } from "@google/genai";
import { PrayerDay } from '../types';

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the Data-URI prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface ExtractionResult {
  days: PrayerDay[];
  metadata: {
    isOutdated: boolean;
    detectedMonth: string;
  };
}

/**
 * Sends the image to Gemini to extract prayer times.
 */
export const extractPrayerTimes = async (imageFile: File): Promise<ExtractionResult> => {
  const model = "gemini-2.5-flash"; // Efficient for vision tasks
  
  const imagePart = await fileToGenerativePart(imageFile);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
    Analyze this image of a prayer times schedule (Salah times).
    
    1. Identify the Month and Year written on the schedule (Hijri or Gregorian).
    2. Compare it with today's date: "${today}".
    3. If the schedule is for a MONTH that has already passed (e.g., today is May and schedule is April), mark 'isOutdated' as true. If it is the current month or a future month, 'isOutdated' is false.
    4. Extract the data row by row for the entire month.
    
    Return a JSON object with 'metadata' and 'days'.
    
    Map the columns in 'days' to these exact keys:
    - dayLabel: The date or day number shown.
    - fajr: Fajr time.
    - sunrise: Sunrise (Shuruq) time.
    - dhuhr: Dhuhr time.
    - asr: Asr time.
    - maghrib: Maghrib time.
    - isha: Isha time.
    
    Ensure times are strings in "HH:MM" format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metadata: {
              type: Type.OBJECT,
              properties: {
                isOutdated: { type: Type.BOOLEAN, description: "True if the schedule is from a past month." },
                detectedMonth: { type: Type.STRING, description: "The name of the month detected in the image." }
              },
              required: ["isOutdated", "detectedMonth"]
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayLabel: { type: Type.STRING },
                  fajr: { type: Type.STRING },
                  sunrise: { type: Type.STRING },
                  dhuhr: { type: Type.STRING },
                  asr: { type: Type.STRING },
                  maghrib: { type: Type.STRING },
                  isha: { type: Type.STRING },
                },
                required: ["dayLabel", "fajr", "maghrib"], 
              },
            }
          },
          required: ["metadata", "days"]
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    const result: ExtractionResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error extracting prayer times:", error);
    throw error;
  }
};
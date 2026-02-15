
import { GoogleGenAI, Type } from "@google/genai";
import { SensorData, RiskAssessment } from "../types";
import { GLOF_SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeRisk(sensorData: SensorData, satelliteSnippet: string): Promise<RiskAssessment> {
    const prompt = `
      CURRENT SENSOR STATE:
      - Lake: ${sensorData.lakeName}
      - Water Level: ${sensorData.waterLevel}m
      - Ice Movement: ${sensorData.iceMovement}mm/day
      - Air Temperature: ${sensorData.temperature}°C
      - Humidity: ${sensorData.humidity}%

      SATELLITE & TEMPORAL ANALYSIS:
      ${satelliteSnippet}

      Provide a GLOF risk assessment in JSON format.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: GLOF_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Risk score from 0-100" },
              status: { type: Type.STRING, description: "SAFE, WATCH, WARNING, or CRITICAL" },
              prediction: { type: Type.STRING, description: "Short-term hazard forecast" },
              recommendedActions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Actionable steps for locals and authorities"
              }
            },
            required: ["score", "status", "prediction", "recommendedActions"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        ...result,
        lastSatelliteUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error("AI Analysis failed:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

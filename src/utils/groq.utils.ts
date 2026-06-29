import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const generateGroqCompletion = async (
  prompt: string,
  model: string = DEFAULT_MODEL,
): Promise<string> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await axios.post(
    GROQ_API_URL,
    {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from Groq AI");
  }

  return content.trim();
};

export const parseJsonFromAI = <T>(text: string): T => {
  let cleanedText = text.trim();

  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/```\n?/g, "");
  }

  return JSON.parse(cleanedText) as T;
};

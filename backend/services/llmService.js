import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generateResponse = async ({ disease, query, papers, trials }) => {

  const prompt = `
You are a medical AI assistant.

Disease: ${disease || "Not specified"}
Query: ${query}

Give response in JSON:
{
  "overview": "...",
  "insights": ["..."],
  "clinical_trials_summary": ["..."],
  "sources": ["..."]
}
`;

  try {
    const res = await hf.textGeneration({
      model: "HuggingFaceH4/zephyr-7b-beta",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300
      }
    });

    return {
      overview: res.generated_text,
      insights: [],
      clinical_trials_summary: [],
      sources: papers.slice(0, 5)
    };

  } catch (error) {
    console.error("❌ HF ERROR:", error);

    return {
      overview: "AI service failed. Check API key or model.",
      insights: [],
      clinical_trials_summary: [],
      sources: []
    };
  }
};
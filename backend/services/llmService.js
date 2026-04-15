import { HfInference } from "@huggingface/inference";


const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generateResponse = async ({ disease, query, papers, trials }) => {

  const prompt = `
You are a medical AI assistant.

Disease: ${disease || "Not specified"}
Query: ${query}

Research Papers:
${papers.map(p => "- " + p.title).join("\n")}

Clinical Trials:
${trials.map(t => "- " + t.title).join("\n")}

Respond ONLY in JSON format:

{
  "overview": "...",
  "insights": ["..."],
  "clinical_trials_summary": ["..."],
  "sources": ["..."]
}
`;

  try {
    const res = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 400,
        temperature: 0.7
      }
    });

    const text = res.generated_text;

    
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch {
      return {
        overview: text,
        insights: [],
        clinical_trials_summary: [],
        sources: papers.slice(0, 5)
      };
    }

  } catch (error) {
    console.error("❌ HF ERROR:", error);

    return {
      overview: "AI service failed. Try again.",
      insights: [],
      clinical_trials_summary: [],
      sources: []
    };
  }
};
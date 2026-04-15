import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generateResponse = async ({ disease, query, papers, trials }) => {

  const prompt = `
Disease: ${disease}
Query: ${query}

Research:
${papers.map(p => p.title).join("\n")}

Trials:
${trials.map(t => t.title).join("\n")}

Give structured JSON:
overview, insights, clinical_trials_summary, sources
`;

  try {
    const res = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: { max_new_tokens: 500 }
    });

    return {
      overview: res.generated_text,
      insights: [],
      clinical_trials_summary: [],
      sources: papers.slice(0, 5)
    };

  } catch (error) {
    console.error(error);
    return { overview: "Error", insights: [], clinical_trials_summary: [], sources: [] };
  }
};

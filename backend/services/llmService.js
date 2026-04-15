import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    const prompt = `
You are a medical AI assistant.

Disease: ${disease || "Not specified"}
Query: ${query}

Give response in JSON format:
{
  "overview": "...",
  "insights": ["..."],
  "clinical_trials_summary": ["..."],
  "sources": ["..."]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    return {
      overview: text,
      insights: [],
      clinical_trials_summary: [],
      sources: papers.slice(0, 5)
    };

  } catch (error) {
    console.error("GROQ ERROR:", error);

    return {
      overview: "AI service temporarily unavailable",
      insights: [],
      clinical_trials_summary: [],
      sources: []
    };
  }
};
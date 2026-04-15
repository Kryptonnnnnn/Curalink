export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ API Key");
    }

    const topPapers = papers.slice(0, 5);

    const prompt = `
Explain "${query}" for ${disease} in simple medical terms.

Give:
- short overview
- 3 key insights
- mention any clinical relevance
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await res.json();

    const text =
      data?.choices?.[0]?.message?.content ||
      "No response generated";

    return {
      overview: text,
      insights: [],
      clinical_trials_summary: [],
      sources: topPapers.map(p => ({
        title: p.title,
        year: p.year,
        url: p.url,
      })),
    };

  } catch (error) {
    console.error("LLM ERROR:", error);

    return {
      overview: "Unable to generate AI response. Please try again.",
      insights: [],
      clinical_trials_summary: [],
      sources: [],
    };
  }
};
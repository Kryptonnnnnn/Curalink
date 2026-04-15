export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    const rankedPapers = papers
      .filter(p => p.title)
      .sort((a, b) => (b.year || 0) - (a.year || 0))
      .slice(0, 8);

    const rankedTrials = trials
      .filter(t => t.title)
      .slice(0, 5);

    const papersText = rankedPapers
      .map(
        (p, i) =>
          `${i + 1}. ${p.title} (${p.year || "N/A"}) - ${p.abstract || "No abstract"}`
      )
      .join("\n");

    const trialsText = rankedTrials
      .map(
        (t, i) =>
          `${i + 1}. ${t.title} | Status: ${t.status || "N/A"} | Location: ${t.location || "N/A"}`
      )
      .join("\n");

    const prompt = `
You are an advanced medical research assistant.

Patient Condition: ${disease}
User Query: ${query}

Research Papers:
${papersText}

Clinical Trials:
${trialsText}

Instructions:
- Use the research papers and trials to generate accurate insights
- Do NOT hallucinate
- Keep answers factual and medical-focused
- Return ONLY valid JSON

Format:
{
  "overview": "clear explanation",
  "insights": ["point 1", "point 2", "point 3"],
  "clinical_trials_summary": ["trial insight 1", "trial insight 2"],
  "sources": [
    {
      "title": "",
      "year": "",
      "url": ""
    }
  ]
}
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Groq failed");
    }

    let text = data.choices[0].message.content;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.log("JSON PARSE FAILED, using fallback");

      parsed = {
        overview: text,
        insights: [],
        clinical_trials_summary: [],
        sources: [],
      };
    }

    return {
      overview: parsed.overview || "No overview available",
      insights: parsed.insights || [],
      clinical_trials_summary: parsed.clinical_trials_summary || [],
      sources:
        parsed.sources?.length > 0
          ? parsed.sources
          : rankedPapers.map(p => ({
              title: p.title,
              year: p.year,
              url: p.url,
            })),
    };
  } catch (error) {
    console.error("LLM ERROR:", error);

    return {
      overview: "AI service temporarily unavailable",
      insights: [],
      clinical_trials_summary: [],
      sources: [],
    };
  }
};
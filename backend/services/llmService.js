export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    const rankedPapers = papers
      .filter(p => p.title)
      .sort((a, b) => (b.year || 0) - (a.year || 0))
      .slice(0, 6);

    const rankedTrials = trials
      .filter(t => t.title)
      .slice(0, 3);

    const papersText = rankedPapers
      .map(
        (p, i) =>
          `${i + 1}. ${p.title} (${p.year || "N/A"})`
      )
      .join("\n");

    const trialsText = rankedTrials
      .map(
        (t, i) =>
          `${i + 1}. ${t.title} (${t.status || "N/A"})`
      )
      .join("\n");

    const prompt = `
Return ONLY JSON.

{
  "overview": "",
  "insights": [],
  "clinical_trials_summary": [],
  "sources": []
}

Disease: ${disease}
Query: ${query}

Papers:
${papersText}

Trials:
${trialsText}
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let data;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Groq failed");
      }

    } catch (err) {
      console.log("⚠️ Primary model failed, switching fallback...");

      const fallbackRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      data = await fallbackRes.json();
    }

    let text = data?.choices?.[0]?.message?.content || "";

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        overview: text || "Generated response",
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
    console.error("FINAL LLM ERROR:", error);

    return {
      overview: "System working but AI response failed. Please retry.",
      insights: [],
      clinical_trials_summary: [],
      sources: [],
    };
  }
};
export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ API Key");
    }

    const topPapers = papers.slice(0, 5);
    const topTrials = trials.slice(0, 3);

    const papersText = topPapers
      .map((p, i) => `${i + 1}. ${p.title} (${p.year || "N/A"})`)
      .join("\n");

    const trialsText =
      topTrials.length > 0
        ? topTrials
            .map(
              (t, i) =>
                `${i + 1}. ${t.title} | Status: ${t.status || "N/A"}`
            )
            .join("\n")
        : "No significant trials found";

    const prompt = `
You are a medical research assistant.

Task:
Answer the query using the research data.

Return in EXACT format:

OVERVIEW:
(short explanation)

INSIGHTS:
- point 1
- point 2
- point 3

CLINICAL_TRIALS:
- trial insight 1
- trial insight 2

Disease: ${disease}
Query: ${query}

Papers:
${papersText}

Trials:
${trialsText}
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await res.json();

    const text =
      data?.choices?.[0]?.message?.content ||
      "No response generated";

    // 🧠 SIMPLE PARSER (SAFE)
    let overview = text;
    let insights = [];
    let clinical_trials_summary = [];

    if (text.includes("OVERVIEW:")) {
      const parts = text.split("INSIGHTS:");
      overview = parts[0]?.replace("OVERVIEW:", "").trim();

      if (parts[1]) {
        const insightsPart = parts[1].split("CLINICAL_TRIALS:");
        insights = insightsPart[0]
          ?.split("\n")
          .filter(line => line.startsWith("-"))
          .map(line => line.replace("-", "").trim());

        if (insightsPart[1]) {
          clinical_trials_summary = insightsPart[1]
            .split("\n")
            .filter(line => line.startsWith("-"))
            .map(line => line.replace("-", "").trim());
        }
      }
    }

    return {
      overview,
      insights,
      clinical_trials_summary,
      sources: topPapers.map(p => ({
        title: p.title,
        year: p.year,
        url: p.url,
      })),
    };

  } catch (error) {
    console.error("LLM ERROR:", error);

    return {
      overview: "AI response failed. Please try again.",
      insights: [],
      clinical_trials_summary: [],
      sources: [],
    };
  }
};
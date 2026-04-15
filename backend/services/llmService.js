export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("❌ GROQ_API_KEY missing");
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `Explain ${query} for ${disease}`,
          },
        ],
      }),
    });

    const data = await res.json();

    console.log("GROQ STATUS:", res.status);
    console.log("GROQ DATA:", data);

    if (!res.ok) {
      throw new Error(data.error?.message || "Groq failed");
    }

    return {
      overview: data.choices[0].message.content,
      insights: [],
      clinical_trials_summary: [],
      sources: papers.slice(0, 5),
    };

  } catch (error) {
    console.error("❌ GROQ FINAL ERROR:", error);

    return {
      overview: error.message,
      insights: [],
      clinical_trials_summary: [],
      sources: [],
    };
  }
};
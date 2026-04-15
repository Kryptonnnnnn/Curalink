export const generateResponse = async ({ disease, query, papers, trials }) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Explain briefly: ${query} ${disease || ""}`
        })
      }
    );

    const data = await response.json();

    return {
      overview: data?.[0]?.generated_text || "No response",
      insights: [],
      clinical_trials_summary: [],
      sources: papers.slice(0, 5)
    };

  } catch (error) {
    return {
      overview: "AI service failed",
      insights: [],
      clinical_trials_summary: [],
      sources: []
    };
  }
};
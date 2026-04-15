import { fetchPubMed } from "../services/pubmedService.js";
import { fetchOpenAlex } from "../services/openalexService.js";
import { fetchTrials } from "../services/trialsService.js";
import { rankResults } from "../services/rankingService.js";
import { generateResponse } from "../services/llmService.js";
import Chat from "../models/chatModel.js";

export const handleQuery = async (req, res) => {
  try {
    const { disease, query, userId = "default-user" } = req.body;

    const existingChat = await Chat.findOne({ userId });

    let finalDisease = disease;

    if (!disease && existingChat?.messages?.length > 0) {
      const last = existingChat.messages[existingChat.messages.length - 1];
      finalDisease = last.disease;
    }

    const expandedQuery = `${query} ${finalDisease || ""}`;

    const [pubmed, openalex, trials] = await Promise.all([
      fetchPubMed(expandedQuery),
      fetchOpenAlex(expandedQuery),
      fetchTrials(finalDisease)
    ]);

    const combined = [...pubmed, ...openalex];

    const ranked = rankResults(combined, expandedQuery);

    const finalResponse = await generateResponse({
      disease: finalDisease,
      query,
      papers: ranked.slice(0, 5),
      trials: trials.slice(0, 3)
    });

    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: {
            disease: finalDisease,
            query,
            response: finalResponse
          }
        }
      },
      { upsert: true }
    );

    res.json(finalResponse);

  } catch (error) {
    res.status(500).json({
      overview: "Server error",
      insights: [],
      clinical_trials_summary: [],
      sources: []
    });
  }
};
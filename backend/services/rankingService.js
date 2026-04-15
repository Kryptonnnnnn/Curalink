export const rankResults = (papers, query) => {
  return papers.map((paper) => {
    let score = 0;

    const text = `${paper.title} ${paper.abstract}`.toLowerCase();
    const queryWords = query.toLowerCase().split(" ");

    // 🔹 Keyword match score
    queryWords.forEach(word => {
      if (text.includes(word)) score += 2;
    });

    // 🔹 Recency score
    const year = parseInt(paper.year) || 2000;
    const currentYear = new Date().getFullYear();
    score += (currentYear - year < 5) ? 3 : 1;

    // 🔹 Source credibility
    if (paper.source === "PubMed") score += 3;
    if (paper.source === "OpenAlex") score += 2;

    return { ...paper, score };
  })
  .sort((a, b) => b.score - a.score);
};
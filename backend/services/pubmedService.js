import axios from "axios";
import xml2js from "xml2js";

export const fetchPubMed = async (query) => {
  try {
    // STEP 1: Get IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmax=20&retmode=json`;

    const searchRes = await axios.get(searchUrl);
    const ids = searchRes.data.esearchresult.idlist;

    if (!ids.length) return [];

    // STEP 2: Fetch details (XML)
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`;

    const fetchRes = await axios.get(fetchUrl);

    // STEP 3: Convert XML → JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(fetchRes.data);

    let articles = result?.PubmedArticleSet?.PubmedArticle || [];

    // 🔥 Ensure always array
    if (!Array.isArray(articles)) {
      articles = [articles];
    }

    const formatted = articles.map((article) => {
      const medline = article.MedlineCitation;
      const articleData = medline.Article;

      // 🔥 FIX AUTHORS
      let authorsRaw = articleData.AuthorList?.Author || [];

      if (!Array.isArray(authorsRaw)) {
        authorsRaw = [authorsRaw];
      }

      const authors = authorsRaw.map(
        (a) => `${a.ForeName || ""} ${a.LastName || ""}`.trim()
      );

      return {
        title: articleData.ArticleTitle || "No title",
        abstract:
          typeof articleData.Abstract?.AbstractText === "object"
            ? Object.values(articleData.Abstract.AbstractText).join(" ")
            : articleData.Abstract?.AbstractText || "No abstract available",
        authors,
        year:
          articleData.Journal?.JournalIssue?.PubDate?.Year || "Unknown",
        source: "PubMed",
        url: `https://pubmed.ncbi.nlm.nih.gov/${medline.PMID._}/`,
      };
    });

    return formatted;

  } catch (error) {
    console.error("PubMed Error:", error.message);
    return [];
  }
};
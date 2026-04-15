import axios from "axios";

export const fetchOpenAlex = async (query) => {
  try {
    const url = `https://api.openalex.org/works?search=${query}&per-page=20`;

    const res = await axios.get(url);

    return res.data.results.map((item) => ({
      title: item.title,
      abstract: item.abstract_inverted_index
        ? Object.keys(item.abstract_inverted_index).join(" ")
        : "No abstract",
      authors: item.authorships?.map(a => a.author.display_name) || [],
      year: item.publication_year,
      source: "OpenAlex",
      url: item.id
    }));

  } catch (error) {
    console.error("OpenAlex Error:", error.message);
    return [];
  }
};
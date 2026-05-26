const BASE_URL = "https://openlibrary.org/search.json";

const FALLBACK_BOOKS = [
  {
    key: "FALLBACK-1",
    title: "Offline sample book",
    author_name: ["Local Library"],
    cover_i: null,
  },
  {
    key: "FALLBACK-2",
    title: "Saved favorites guide",
    author_name: ["Book Explorer"],
    cover_i: null,
  },
  {
    key: "FALLBACK-3",
    title: "JavaScript for Everyone",
    author_name: ["Community"],
    cover_i: null,
  },
];

export async function fetchBooks(searchTerm = "javascript") {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const fallbackSearch = (term) => {
    return FALLBACK_BOOKS.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const authors = (book.author_name || []).join(" ").toLowerCase();
      return title.includes(term) || authors.includes(term);
    });
  };

  if (!navigator.onLine) {
    return fallbackSearch(normalizedSearch);
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(searchTerm)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();

    return data.docs.slice(0, 20);
  } catch (error) {
    console.error("Book fetch failed:", error);
    return fallbackSearch(normalizedSearch);
  }
}

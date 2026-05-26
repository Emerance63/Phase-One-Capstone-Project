import { fetchBooks } from "./fetchbooks.js";
import { createBookCard } from "./ui.js";
import { getFavorites } from "./favorates.js";
const booksContainer = document.getElementById("book-container");
const favoritesContainer = document.getElementById("favorites-container");
const messageContainer = document.getElementById("message");

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const categoryButtons = document.querySelectorAll(".category-btn");

let allBooks = [];
let activeCategory = null;

const favCountEl = document.getElementById("fav-count");

function updateFavCount(count) {
  if (!favCountEl) return;
  const n = typeof count === "number" ? count : getFavorites().length;
  favCountEl.textContent = String(n);
}

function showMessage(text) {
  if (!messageContainer) return;
  messageContainer.textContent = text;
}

function getCombinedQuery() {
  const searchText = searchInput?.value.trim();

  if (activeCategory && searchText) {
    return `${activeCategory} ${searchText}`;
  }

  return activeCategory || searchText || "programming";
}

function setActiveCategory(button) {
  if (!button) return;

  const category = button.textContent.trim();
  // toggle
  if (activeCategory === category) {
    activeCategory = null;
    // reset button styles
    button.classList.remove("bg-orange-500", "text-white");
    button.classList.add("bg-white/10");
    // clear search input when category cleared
    if (searchInput) searchInput.value = "";
    return;
  }

  categoryButtons.forEach((btn) => {
    btn.classList.remove("bg-orange-500", "text-white");
    btn.classList.add("bg-white/10");
  });

  button.classList.add("bg-orange-500", "text-white");
  button.classList.remove("bg-white/10");
  activeCategory = category;

  // move category text into the search input per requirement
  if (searchInput) searchInput.value = category;
}

function renderBooks(books) {
  if (!booksContainer) return;
  booksContainer.innerHTML = "";

  if (!books || books.length === 0) {
    booksContainer.innerHTML = `
      <p>No results found. Check your connection or try a different term.</p>
    `;
    return;
  }

  books.forEach((book) => {
    const card = createBookCard(book);
    booksContainer.appendChild(card);
  });
}

function filterLocal(query) {
  const term = (query || "").toLowerCase().trim();
  if (!term) return allBooks.slice(0, 20);

  // exact contains match on title or authors
  const direct = allBooks.filter((book) => {
    const title = (book.title || "").toLowerCase();
    const authors = (book.author_name || []).join(" ").toLowerCase();
    return title.includes(term) || authors.includes(term);
  });

  if (direct.length > 0) return direct;

  // fallback: similarity by shared words
  const words = term.split(/\s+/).filter(Boolean);
  const scored = allBooks
    .map((book) => {
      const hay = (
        (book.title || "") +
        " " +
        (book.author_name || []).join(" ")
      ).toLowerCase();
      let score = 0;
      words.forEach((w) => {
        if (hay.includes(w)) score += 1;
      });
      return { book, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.book);

  return scored.slice(0, 20);
}

async function loadBooks(search = "programming") {
  if (!booksContainer) return;

  messageContainer && showMessage("Loading books...");
  booksContainer.innerHTML = `
    <div class="loading">Loading books...</div>
  `;

  const books = await fetchBooks(search);
  allBooks = books || [];

  showMessage("");
  renderBooks(allBooks);
}

function loadFavorites() {
  if (!favoritesContainer) return;

  const favorites = getFavorites();

  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favorite books yet.</p>";
    return;
  }
  favorites.forEach((book) => {
    const card = createBookCard(book, true);
    favoritesContainer.appendChild(card);
  });
}

// initial load
loadBooks(getCombinedQuery());
loadFavorites();

// initialize favorites count and listen for updates
updateFavCount(getFavorites().length);
window.addEventListener("favorites-updated", (e) => {
  updateFavCount(e?.detail);
});

function applyCombinedFilter() {
  const query = getCombinedQuery();
  // if we already have local books, try client-side filter first
  if (allBooks && allBooks.length > 0) {
    const filtered = filterLocal(query);
    if (filtered && filtered.length > 0) {
      renderBooks(filtered);
      return;
    }
    // no good local matches — fetch fresh data for the combined query
  }

  // fetch from API (or fallback) and render results
  loadBooks(query);
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    applyCombinedFilter();
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCombinedFilter();
    }
  });
}

if (categoryButtons.length) {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveCategory(button);
      applyCombinedFilter();
    });
  });
}

const FAVORITES_KEY = "favoriteBooks";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function addFavorite(book) {
  const favorites = getFavorites();

  const exists = favorites.find((item) => item.key === book.key);

  if (!exists) {
    favorites.push(book);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    // notify UI that favorites changed
    try {
      window.dispatchEvent(
        new CustomEvent("favorites-updated", { detail: favorites.length }),
      );
    } catch (e) {}
  }
}

export function removeFavorite(bookKey) {
  const favorites = getFavorites().filter((book) => book.key !== bookKey);

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  try {
    window.dispatchEvent(
      new CustomEvent("favorites-updated", { detail: favorites.length }),
    );
  } catch (e) {}
}

export function isFavorite(bookKey) {
  return getFavorites().some((book) => book.key === bookKey);
}

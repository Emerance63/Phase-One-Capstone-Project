import { addFavorite, removeFavorite, isFavorite } from "./favorates.js";

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 2000);
}

export function createBookCard(book, favoritePage = false) {
  const card = document.createElement("div");
  card.classList.add("book-card");

  const image = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/150x220?text=No+Cover";

  let btnLabel = "Add to favorite";
  if (favoritePage) btnLabel = "Remove";
  else if (isFavorite(book.key)) btnLabel = "Remove";

  card.innerHTML = `
    <img src="${image}" alt="${book.title}" />
    <h3>${book.title}</h3>
    <p>${book.author_name?.[0] || "Unknown Author"}</p>
    <button class="fav-btn">${btnLabel}</button>
  `;

  const button = card.querySelector(".fav-btn");

  function updateButtonState() {
    const fav = isFavorite(book.key);
    if (favoritePage) {
      button.textContent = "Delete";
      button.classList.add("remove");
    } else {
      button.textContent = fav ? "Remove Favorite" : "Add to Favorites";
      button.classList.toggle("remove", fav);
    }
  }

  button.addEventListener("click", () => {
    const fav = isFavorite(book.key);
    if (fav) {
      removeFavorite(book.key);
      updateButtonState();
      showToast("Removed from favorites");
      if (favoritePage) {
        card.remove();
        const emptyState = document.getElementById("emptyState");
        const favContainer = document.getElementById("favorites-container");
        if (emptyState && favContainer && favContainer.children.length === 0) {
          emptyState.style.display = "block";
        }
      }
    } else {
      addFavorite(book);
      updateButtonState();
      showToast("Added to favorites");
    }
  });

  return card;
}

const BASE_URL = 'https://openlibrary.org/search.json?q=';

export async function fetchBooks(query = 'javascript') {
  try {
    const response = await fetch(`${BASE_URL}${query}`);

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();

    return data.docs.slice(0, 20);
  } catch (error) {
    console.error(error);
    return [];
  }
}


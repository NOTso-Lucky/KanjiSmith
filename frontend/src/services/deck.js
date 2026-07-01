import { api } from "./api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function listDecks() {
  return api("/decks", {
    method: "GET",
    headers: authHeader(),
  });
}

export async function addFlashcardToDeck(deckId, flashcardId) {
  return api(`/decks/${deckId}/flashcards`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ flashcard_id: flashcardId }),
  });
}
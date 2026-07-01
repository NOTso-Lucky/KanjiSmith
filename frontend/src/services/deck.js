import { api } from "./api";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export async function listDecks() {
  return api("/decks", {
    method: "GET",
    headers: authHeader(),
  });
}

export async function createDeck(title, description = null) {
  const body = { title };
  if (description) body.description = description;

  return api("/decks", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
}

export async function updateDeck(deckId, title, description = null) {
  const body = { title };
  if (description !== null) body.description = description;

  return api(`/decks/${deckId}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
}

export async function deleteDeck(deckId) {
  return api(`/decks/${deckId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export async function getDeckFlashcards(deckId) {
  return api(`/decks/${deckId}/flashcards`, {
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

export async function removeFlashcardFromDeck(deckId, flashcardId) {
  return api(`/decks/${deckId}/flashcards/${flashcardId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}
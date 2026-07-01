import { api } from "./api";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export async function getFlashcard(flashcardId) {
  return api(`/flashcards/${flashcardId}`, {
    method: "GET",
    headers: authHeader(),
  });
}
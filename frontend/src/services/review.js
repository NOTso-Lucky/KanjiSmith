import { api } from "./api";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export async function getQueue(deckId = null, limit = 20) {
  const params = new URLSearchParams({ limit });
  if (deckId) params.append("deck_id", deckId);

  return api(`/reviews/queue?${params.toString()}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export async function submitReview(flashcardId, rating, responseTimeMs = null) {
  const body = { rating };
  if (responseTimeMs !== null) body.response_time_ms = Math.round(responseTimeMs);

  return api(`/reviews/${flashcardId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function getDueCount(deckId = null) {
  const params = deckId ? `?deck_id=${deckId}` : "";
  return api(`/reviews/due-count${params}`, {
    method: "GET",
    headers: authHeader(),
  });
}
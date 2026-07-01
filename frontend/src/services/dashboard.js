import { api } from "./api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function getSummary() {
  return api("/dashboard/summary", {
    method: "GET",
    headers: authHeader(),
  });
}

export async function getDecks() {
  return api("/dashboard/decks", {
    method: "GET",
    headers: authHeader(),
  });
}

export async function getDueCount() {
  return api("/reviews/due-count", {
    method: "GET",
    headers: authHeader(),
  });
}
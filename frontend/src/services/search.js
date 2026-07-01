import { api } from "./api";

export async function searchWord(query) {
  return api(`/words/search?query=${encodeURIComponent(query)}`, {
    method: "GET",
  });
}
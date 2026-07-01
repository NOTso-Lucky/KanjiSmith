const API_BASE_URL = "http://127.0.0.1:8000";

export async function api(endpoint, options = {}) {
  const { headers: extraHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    if (!response.ok) throw new Error("Something went wrong");
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}
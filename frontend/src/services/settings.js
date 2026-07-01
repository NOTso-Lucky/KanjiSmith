import { api } from "./api";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export async function getSettings() {
  return api("/settings", {
    method: "GET",
    headers: authHeader(),
  });
}

export async function updateStudySettings(dailyGoal, newCardsPerDay) {
  const body = {};
  if (dailyGoal !== null) body.daily_goal = dailyGoal;
  if (newCardsPerDay !== null) body.new_cards_per_day = newCardsPerDay;

  return api("/settings", {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
}

export async function updateAccount(username, email, currentPassword) {
  const body = { current_password: currentPassword };
  if (username) body.username = username;
  if (email) body.email = email;

  return api("/settings/account", {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
}

export async function updatePassword(currentPassword, newPassword) {
  return api("/settings/password", {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}
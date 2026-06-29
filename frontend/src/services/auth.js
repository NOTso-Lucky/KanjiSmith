import { api } from "./api";

export async function register(userData) {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function login(credentials) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
export async function getCurrentUser(token){
    return api("/users/me",{
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
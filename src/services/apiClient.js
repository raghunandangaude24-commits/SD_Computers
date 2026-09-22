/**
 * Minimal fetch wrapper around the Express backend.
 *
 * - Reads the base URL from VITE_API_URL (defaults to the local backend).
 * - Automatically attaches the stored JWT (unless auth: false).
 * - Normalizes errors so pages can show backend messages directly.
 */

export const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:5000/api";

const TOKEN_KEY = "sd_token";
const USER_KEY = "sd_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth !== false) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    const error = new Error(
      "Cannot reach the server. Make sure the backend is running."
    );
    error.status = 0;
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* no JSON body */
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiGet = (path, options) =>
  request(path, { method: "GET", ...options });

export const apiPost = (path, body, options) =>
  request(path, { method: "POST", body, ...options });
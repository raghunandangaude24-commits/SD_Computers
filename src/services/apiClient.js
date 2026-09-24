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

// "Remember me" unchecked sessions live in sessionStorage instead, so
// they survive reloads but end when the tab/browser is closed.
const SESSION_TOKEN_KEY = "sd_session_token";
const SESSION_USER_KEY = "sd_session_user";

export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(SESSION_TOKEN_KEY) ||
    null
  );
}

export function getUser() {
  const raw =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(SESSION_USER_KEY);
  try {
    return JSON.parse(raw) || null;
  } catch {
    return null;
  }
}

export function setSession(token, user, { persistent = true } = {}) {
  clearSession();
  if (persistent) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
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

export const apiPut = (path, body, options) =>
  request(path, { method: "PUT", body, ...options });

export const apiPatch = (path, body, options) =>
  request(path, { method: "PATCH", body, ...options });

export const apiDelete = (path, options) =>
  request(path, { method: "DELETE", ...options });
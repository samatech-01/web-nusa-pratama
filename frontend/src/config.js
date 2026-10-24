export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

export const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/api/")) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
};

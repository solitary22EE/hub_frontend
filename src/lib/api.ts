import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  // Axios follows redirects but re-sends GET for 307 POST redirects by default.
  // maxRedirects: 0 so we handle trailing-slash 307s at the call site by always
  // including trailing slashes in the URL.
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token } = res.data;
          localStorage.setItem("access_token", access_token);
          original.headers.Authorization = `Bearer ${access_token}`;
          return api(original);
        } catch {
          // Refresh failed — clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          if (typeof window !== "undefined") window.location.href = "/login";
        }
      } else {
        // No refresh token at all — send to login
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

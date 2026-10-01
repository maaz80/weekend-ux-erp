// Token and user management for ERP Counselor/Admin authentication

const TOKEN_KEY = "weekend_ux_erp_token";
const USER_KEY = "weekend_ux_erp_user";

export const getErpToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setErpToken = (token, user, remember = true) => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearErpToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const getErpUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : { username: "Admin", role: "admin" };
  } catch {
    return { username: "Admin", role: "admin" };
  }
};

export const isErpAuthenticated = () => {
  const token = getErpToken();
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp && decoded.exp < Date.now()) {
      clearErpToken();
      return false;
    }
    return true;
  } catch {
    // If not a JSON token, check if it's non-empty
    return !!token;
  }
};

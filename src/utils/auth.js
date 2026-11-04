// Token and user management for ERP Counselor/Admin authentication

const TOKEN_KEY = "weekend_ux_erp_token";
const USER_KEY = "weekend_ux_erp_user";

export const getErpToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
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
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isErpAuthenticated = () => {
  const token = getErpToken();
  if (!token) return false;

  try {
    const parts = token.split(".");
    let payloadJson = "";
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      payloadJson = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else {
      payloadJson = atob(token);
    }

    const decoded = JSON.parse(payloadJson);
    if (decoded.exp) {
      const expMs = decoded.exp < 1e11 ? decoded.exp * 1000 : decoded.exp;
      if (expMs < Date.now()) {
        clearErpToken();
        return false;
      }
    }
    return true;
  } catch {
    return Boolean(token && token.length > 10);
  }
};

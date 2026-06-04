const TOKEN_KEY = "tutornest_token";

// SAVE TOKEN
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// GET TOKEN
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// REMOVE TOKEN
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// DECODE JWT (simple frontend decode)
export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
};
const USERS_KEY = "tutornest_users";
const CURRENT_USER_KEY = "tutornest_user";

// Get all users
export const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
};

// Save users
export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// REGISTER
export const registerUser = (user) => {
  const users = getUsers();

  const exists = users.find((u) => u.email === user.email);

  if (exists) {
    return { success: false, message: "User already exists" };
  }

  users.push(user);
  saveUsers(users);

  return { success: true };
};

// LOGIN
export const loginUser = (email, password) => {
  const users = getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return { success: true, user };
};

// CURRENT USER
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
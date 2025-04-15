import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      return {
        user: parsedUser,
        isAdmin: parsedUser.role === "admin",
      };
    }
  } catch (error) {
    // If there's any error, clear localStorage
    localStorage.removeItem("user");
    console.error("Error parsing user data from localStorage:", error);
  }
  return {
    user: null,
    isAdmin: false,
  };
};

const { user, isAdmin } = getUserFromLocalStorage();

const initialState = {
  user,
  csrfToken: null,
  initialized: false,
  isAdmin,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      //save to localstorage
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
      state.isAdmin = user?.role === "admin";
    },
    setCsrfToken: (state, action) => {
      state.csrfToken = action.payload;
      state.initialized = true;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setCredentials, logout, setCsrfToken } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectCsrfToken = (state) => state.auth.csrfToken;
export const selectIsCsrfInitialized = (state) => state.auth.initialized;

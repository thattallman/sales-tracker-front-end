import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  token: null,
  role: null,
  name: null,
  email: null,
  phone: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user data & token
    setCredentials: (state, action) => {
      const { token, role, name, email, phone } = action.payload;
      state.token = token;
      state.role = role;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.isAuthenticated = true;


    },

    // Clear user data (logout)
    clearCredentials: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      state.email = null;
      state.phone = null;
      state.isAuthenticated = false;

    },
  },
});

// Export actions
export const { setCredentials, clearCredentials } = authSlice.actions;

// Selectors to access auth state easily
export const selectCurrentUser = (state) => ({
  name: state.auth.name,
  email: state.auth.email,
  phone: state.auth.phone,
  role: state.auth.role,
});
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;

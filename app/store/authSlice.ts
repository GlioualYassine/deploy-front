import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  },
};

console.log("initialState" , initialState.user);


export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      console.log("inside login", action.payload);
      state.user = action.payload.user;
      state.isLoggedIn = true;
      console.log("out of login", state.user);
    },
    logout: (state) => {
      state.user = {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      };
      state.isLoggedIn = false;
    },

    getAuth: (state, action) => {
      console.log("git auth", action.payload);
      state.user = action.payload.user;
      state.isLoggedIn = true;
    }

  },
});

export const { login, logout , getAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: any) => state.auth.user;
export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;

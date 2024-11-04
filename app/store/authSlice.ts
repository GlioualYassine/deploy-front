import { createSlice } from "@reduxjs/toolkit";

interface  User  {
    id : number 
    firstName : string
    lastName : string
    email : string 
    role : string
  }


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        value : {
            isLoggedIn: false,
            user : {
                id: 0,
                firstName: "",
                lastName: "",
                email: "",
                role: ""
            } as User,
        },
    },
    reducers: {
        login : (state,action)=>{
            console.log("inside login" , action.payload);
            state.value.user = action.payload.user;
            state.value.isLoggedIn = true; 
            console.log("out of login" , state.value.user );
        },
        logout : (state)=>{
            state.value.user = {
                id: 0,
                firstName: "",
                lastName: "",
                email: "",
                role: ""
            };
            state.value.isLoggedIn = false;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
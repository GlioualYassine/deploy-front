import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id : number 
  firstName : string 
  lastName : string 
  email : string 
  companyId : string
  role : string
  companyName : string
}


interface ClientState {
  clients: User[];
}

const initialState: ClientState = {
  clients: [],
};

const ClientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setClients(state, action: PayloadAction<User[]>) {
      state.clients = action.payload;
    },
    addClient(state, action: PayloadAction<User>) {
      state.clients.push(action.payload);
    },
    modifyClient(state, action: PayloadAction<User>) {
      const index = state.clients.findIndex(
        (client) => client.id === action.payload.id
      );
      console.log(action.payload);
      state.clients[index] = action.payload;
    },
    deleteClient(state,action : PayloadAction<User>){
      state.clients = state.clients.filter(client=>client.id != action.payload.id)
    }
  },
});

export const { setClients, addClient , modifyClient,deleteClient } = ClientSlice.actions;
export default ClientSlice.reducer;

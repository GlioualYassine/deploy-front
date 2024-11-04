import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Voiture } from "../(routes)/automobiles/components/ListAutomobiles/ListAutomobiles.type";

interface VoitureState {
  voitures: Voiture[];
}

const initialState: VoitureState = {
  voitures: [],
};

const voitureSlice = createSlice({
  name: "voitures",
  initialState,
  reducers: {
    setVoitures(state, action: PayloadAction<Voiture[]>) {
      state.voitures = action.payload;
    },
    addVoiture(state, action: PayloadAction<Voiture>) {
      state.voitures.push(action.payload);
    },
    modifyVoiture(state, action: PayloadAction<Voiture>) {
      const index = state.voitures.findIndex(
        (voiture) => voiture.id === action.payload.id
      );
      console.log(action.payload);
      state.voitures[index] = action.payload;
    }
  },
});

export const { setVoitures, addVoiture , modifyVoiture } = voitureSlice.actions;
export default voitureSlice.reducer;

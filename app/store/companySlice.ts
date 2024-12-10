import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "../(routes)/companies/components/companie.types";

interface CompanyState {
  companies: Company[];
}

const initialState: CompanyState = {
  companies: [],
};

const CompanySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies(state, action: PayloadAction<Company[]>) {
      state.companies = action.payload;
    },
    addCompany(state, action: PayloadAction<Company>) {
      state.companies.push(action.payload);
    },
    modifyCompany(state, action: PayloadAction<Company>) {
      const index = state.companies.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        // Create a new array with the updated company in its original position
        state.companies = [
          ...state.companies.slice(0, index),
          action.payload,
          ...state.companies.slice(index + 1),
        ];
      }
    },
    deleteCompany(state, action: PayloadAction<number>) {
      console.log("--------------------");

      console.log(action.payload);

      state.companies = state.companies.filter(
        (device) => device.id !== action.payload
      );
    },
  },
});

export const { setCompanies, addCompany, modifyCompany, deleteCompany } =
  CompanySlice.actions;
export default CompanySlice.reducer;

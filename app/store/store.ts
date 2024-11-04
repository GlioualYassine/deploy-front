"use client"
import { configureStore } from '@reduxjs/toolkit';
import voitureReducer from './VoitureSlice';
import deviceReducer from './deviceSlise';
import authReducer from './authSlice';
import deliveredNotifs from './deliveredNotifsSlice';
import clientReducer from "./clientsSlice";
import NotificationReducer from "./NotificationSlice";
import CompanyReducer from "./companySlice";

export const store = configureStore({
  reducer: {
    voitures: voitureReducer,
    devices: deviceReducer,
    auth : authReducer,
    deliveredNotifs : deliveredNotifs,
    clients : clientReducer,
    notifications : NotificationReducer,
    companies : CompanyReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

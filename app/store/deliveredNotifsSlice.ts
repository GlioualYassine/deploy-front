import { createSlice,current } from "@reduxjs/toolkit";

export const deliveredNotifsSlice = createSlice({
    name : "deliveredNotifs",
    initialState : {
        value : {
            notifs : [] as any[],
            notifToastList : [] as any[],
        },
    },
    reducers : {
        add:(state,action)=>{
            state.value.notifs = [...state.value.notifs, ...action.payload.newNotifs];
            state.value.notifToastList = [
                ...state.value.notifToastList,
                ...action.payload.newNotifs
            ]
       
        },

        clear : (state)=>{
            state.value.notifs = []
        },

        removeFromToastList : (state,action)=>{
            let updated = state.value.notifToastList.filter((notif)=>notif.id !== action.payload.id);
            state.value.notifToastList = updated;
        },
    },
    
});

export const { add,clear,removeFromToastList } = deliveredNotifsSlice.actions;
export default deliveredNotifsSlice.reducer;


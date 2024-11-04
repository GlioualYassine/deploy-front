import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationType {
  id: number;
  status?:
    | "DEVICE_CREATED"
    | "DEVICE_CONNECTED"
    | "DEVICE_DISCONNECTED"
    | "DEVICE_DELETED"
    | "DEVICE_UPDATED"
    | "DEVICE_NOT_FOUND"
    | "DEVICE_ALREADY_EXISTS"
    | "DEVICE_NOT_CONNECTED";
  message?: string;
  deviceName?: string;
  deviceId?: number;
  read?: boolean;
  timestamp?: Date;
}



interface NotificationState {
  notifications: NotificationType[];
  unreadCount: number; // Ajout du compteur de notifications non lues

}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const NotificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification(state, action: PayloadAction<NotificationType[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((notif) => !notif.read).length; // Calcul des notifications non lues
    },
    addNotification(state, action: PayloadAction<NotificationType>) {
      state.notifications.push(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1; // Incrément si la notification n'est pas lue
      }
    },
    modifyNotification(state, action: PayloadAction<NotificationType>) {
      const index = state.notifications.findIndex(
        (notif) => notif.id === action.payload.id
      );
      if (index !== -1) {
        if (!state.notifications[index].read && action.payload.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1); // Décrément si la notification devient lue
        }
        state.notifications[index] = action.payload;
      }
    },
    deleteNotification(state,action : PayloadAction<NotificationType>){
      const notificationToDelete = state.notifications.find(
        (notif) => notif.id === action.payload.id
      );
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload.id
      );
      // Si la notification supprimée n'était pas lue, décrémenter le compteur
      if (notificationToDelete && !notificationToDelete.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    
    },
    dismissAllNotification(state){
      state.notifications = state.notifications.map((notification)=>({...notification,read : true}))
      state.unreadCount = 0;
    }
  },
});

export const { setNotification,   addNotification , modifyNotification , deleteNotification , dismissAllNotification } = NotificationSlice.actions;
export default NotificationSlice.reducer;

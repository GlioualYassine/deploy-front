"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect } from "react";
import ListNotifications, {
  NotificationType,
} from "./components/ListNotifications/ListNotifications";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  dismissAllNotification,
  modifyNotification,
  setNotification,
} from "@/app/store/NotificationSlice";
import { set } from "date-fns";

const Page = ({ params }: { params: { deviceID: string } }) => {
  let deviceID = params.deviceID;
  //let [notifications, setNotifications] = React.useState<NotificationType[]>([]);
  let notifications = useAppSelector((state) =>
    state.notifications.notifications.filter(
      (notification) => notification.deviceId === parseInt(deviceID)
    )
  );
  const dispatch = useAppDispatch();

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // Envoyer la requête pour marquer la notification comme lue
      await axiosInstance.put(
        `/notifications/markNotificationAsRead/${notificationId}`
      );

      // Trouver la notification à mettre à jour
      const notificationToUpdate = notifications.find(
        (notification) => notification.id === notificationId
      );

      if (notificationToUpdate) {
        // Créer une nouvelle version de la notification avec le statut "read" mis à jour
        const updatedNotification = {
          ...notificationToUpdate,
          read: true,
        };

        // Mettre à jour l'état via le dispatch de l'action `modifyNotification`
        dispatch(modifyNotification(updatedNotification));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDismissAll = async (deviceId: number) => {
    try {
      await axiosInstance.put(
        `notifications/markAllNotificationAsReadOfDevice/${deviceId}`
      );
      // Mettre à jour l'état pour refléter que toutes les notifications sont lues
      dispatch(dismissAllNotification());
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex  justify-center">
      <ListNotifications
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDismissAll={handleDismissAll}
      />
    </div>
  );
};

export default Page;

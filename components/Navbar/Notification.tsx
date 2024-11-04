"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationType } from "./Notification.type";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { set } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  addNotification,
  modifyNotification,
  setNotification,
} from "@/app/store/NotificationSlice";

const Notification = ({
  userFromLocalStorage,
  token,
}: {
  userFromLocalStorage: any;
  token: string | null;
}) => {
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  ); // Utiliser useAppSelector pour récupérer les notifications
  const unreadNotificationsCount = useAppSelector(
    (state) => state.notifications.unreadCount
  ); // Utilisation du compteur de notifications non lues dans Redux
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const socketClientRef = useRef<any>(null); // Utiliser un ref pour stocker le client WebSocket
  const dispatch = useAppDispatch();

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(
        "/notifications/AllNotificationsOrderByDeviceIdAndTimestamp"
      );
      console.log(response.data);
      const fetchedNotifications = response.data;
      //setNotifications(fetchedNotifications);
      dispatch(setNotification(fetchedNotifications));
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (userFromLocalStorage && token) {
      if (!socketClientRef.current) {
        // S'assurer que le client WebSocket est initialisé une seule fois
        const ws = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(ws);
        stompClient.connect(
          { Authorization: "Bearer " + token, userId: userFromLocalStorage.id },
          () => {
            console.log(
              "Connected to WebSocket with user:",
              userFromLocalStorage
            );
            stompClient.subscribe(
              `/user/${userFromLocalStorage.id}/notifications`,
              (message: any) => {
                const notification: NotificationType = JSON.parse(message.body);
                if (notification) {
                  dispatch(addNotification(notification));
                }
              }
            );
          },
          (error: any) => {
            console.error("Connection error:", error);
          }
        );
        socketClientRef.current = stompClient; // Stocker le client WebSocket dans le ref
      }
    }

    fetchNotifications();

    return () => {
      if (socketClientRef.current && socketClientRef.current.connected) {
        socketClientRef.current.disconnect();
        console.log("Disconnected from WebSocket");
      }
    };
  }, [userFromLocalStorage, token]);

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (notificationId: number) => {
    try {
      await axiosInstance.put(
        `/notifications/markNotificationAsRead/${notificationId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // Trouver la notification dans la liste et la marquer comme lue
      const updatedNotification = notifications.find(
        (notif) => notif.id === notificationId
      );
      if (updatedNotification) {
        dispatch(modifyNotification({ ...updatedNotification, read: true }));
      }
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className="relative cursor-pointer mr-3"
          onClick={() => setIsOpen((prev) => !prev)} // Toggle pour ouvrir/fermer le menu
        >
          <Bell className="w-6 h-6" />
          {/* Indicateur des notifications non lues */}
          {unreadNotificationsCount > 0 && (
            <span
              className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
              style={{ transform: "translate(50%, -50%)" }}
            >
              {unreadNotificationsCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 mr-3 mt-3">
        <DropdownMenuLabel>My Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-72  rounded-md border">
          <div className="p-2">
            {notifications.length > 0 ? (
              notifications.map(
                (notification: NotificationType, index: number) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex justify-between mb-3"
                    // onClick={() => markAsRead(notification.id)}
                  >
                    <span>{notification.message}</span>
                    {/* Marquer comme lu */}
                    {!notification.read && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="bg-primary px-2 py-1 rounded-[50%]">
                              <CheckCheck
                                className="text-white dark:text-black"
                                strokeWidth={2}
                                size={16}
                                onClick={() => markAsRead(notification.id)}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="mr-2">
                            <p>mark as read</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </DropdownMenuItem>
                )
              )
            ) : (
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;

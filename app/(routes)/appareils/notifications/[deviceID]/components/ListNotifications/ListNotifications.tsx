import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

const ListNotifications = ({
  notifications,
  onMarkAsRead,
  onDismissAll,
}: {
  notifications: NotificationType[];
  onMarkAsRead: (id:number)=>void // La fonction de rappel (callback) pour marquer comme lu
  onDismissAll: (deviceId:number) => void; // La fonction de rappel (callback) pour tout marquer comme lu
}) => {

    




  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Your recent device notifications</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        {notifications.length > 0 ? (
          <Table>
            <TableCaption>A summary of your recent notifications.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead> Date et Heure </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">
                    {notification.deviceName || "Unknown device"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={notification.read ? "outline" : "default"}
                    >
                      {notification.status?.replace("_", " ") || "No status"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(
                      new Date(notification.timestamp || Date.now()),
                      { addSuffix: true }
                    )}
                  </TableCell>
                  <TableCell>
                    {notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString()
                      : "No date"}
                  </TableCell>

                  <TableCell className="text-right">
                    {!notification.read && (
                      <Button size="sm" variant="secondary" onClick={()=>onMarkAsRead(notification.id)} >
                        Mark as Read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-500">
            No notifications available.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={()=>onDismissAll(notifications.length>=1 ? notifications[0].deviceId ?? -1 : -1)} >Dismiss All</Button>
      </CardFooter>
    </Card>
  );
};

export default ListNotifications;

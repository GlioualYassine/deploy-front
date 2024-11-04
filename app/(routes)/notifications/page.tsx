"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clear } from "@/app/store/deliveredNotifsSlice";

interface  User  {
  id : number 
  firstName : string
  lastName : string
  email : string 
  role : string
}

const Page = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: { auth: { value: { user: User } } }) => state.auth.value.user);


  console.log(user);
  const getAllNotifications = async (userId: Number) => {
    return await axiosInstance.get(`/notification/${userId}`);
  };

  const changeNotificationStatus = async (notifId: Number) => {
    return await axiosInstance.patch(`/notification/read/${notifId}`);
  };

  const fetchNotifications = async () => {
    dispatch(clear());
    const response = await getAllNotifications(user.id);
    const data = response.data;
    setNotifications(data);
  };

  const readNotif = async (notifId: Number) => {
    await changeNotificationStatus(notifId);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      {/* Render notifications or other content here */}
      zded
    </div>
  );
};

export default Page;

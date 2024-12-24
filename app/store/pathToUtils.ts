// A utility method to safely get the user from localStorage

import axiosInstance from "@/lib/axiosInstance";
import { User } from "./clientsSlice";
const user = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  role: "",
};

export const  getUserFromLocalStorage = async (): Promise<User> => {
  try {
  const respons =  await axiosInstance.get('auth/check-auth');
  return respons.data;
  } catch (error) {
    console.error("Error reading user from localStorage", error);
  }
  return user as User;
};

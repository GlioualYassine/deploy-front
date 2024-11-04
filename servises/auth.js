"use client";
import { toast } from "@/components/ui/use-toast";
import { login } from "@/app/store/authSlice";
import axiosInstance from "@/lib/axiosInstance";

// lib/auth.js
export const loginAuth = async (credentials, dispatch, router) => {
  toast({
    variant: "destructive",
    title: "Logging in",
    description: "Please wait...",
  });

  console.log(credentials);

  await axiosInstance
    .post("auth/login", credentials)
    .then((response) => {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login({ user }));
      //window.location.href = "/";
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
};

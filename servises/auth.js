"use client";
import { toast } from "@/components/ui/use-toast";
import { login , getAuth } from "@/app/store/authSlice";

import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
// lib/auth.js
export const loginAuth = async (credentials, dispatch, router) => {
  console.log(credentials);

  await axiosInstance
    .post("auth/login", credentials)
    .then((response) => {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Cookies.set("authTokens", token, { expires: 1, path: "/" }); // Cookie expiration in days
      Cookies.set("user", JSON.stringify(user), { expires: 1, path: "/" });

      dispatch(login({ user }));
      //window.location.href = "/";
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "Please wait...",
      });
    });
};

export const fetchAuthData = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get("auth/check-auth");
    dispatch(
      getAuth({
        user: res.data, // Assuming `res.data` contains the user object
      })
    );
  } catch (err) {
    console.error("Error fetching auth data:", err);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  Cookies.remove("authTokens");
  Cookies.remove("user");
};

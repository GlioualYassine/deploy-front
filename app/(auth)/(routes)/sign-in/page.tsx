"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { Button } from "@/components/ui/button";
import { loginAuth } from "@/servises/auth";
import Logo from "@/components/Logo/Logo";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const login = async () => {
    const credentials = {
      email: email,
      password: password,
    };
    loginAuth(credentials, dispatch, router);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(42 61 98)" }}>
      <div
        className="grid grid-cols-1  md:grid-cols-3 w-full h-full"
        style={{
          backgroundImage: "url('/bgweb1.png')",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          backgroundSize: "cover",
        }}
      >
        <div className=" flex flex-col col-span-2 items-center justify-center text-white "></div>

        <div
          className="p-10 flex items-center justify-center w-full h-screen"
          style={{ background: "rgba(203, 203, 203, 0.5)" }}
        >
          <Card className="w-96 justify-center bg-transparent  border-none shadow-none">
            <CardHeader>
              <Logo />
              <CardTitle className="text-center text-2xl text-white">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {/* <Label htmlFor="email ">Email</Label> */}
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrez votre email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    {/* <Label htmlFor="password">Password</Label> */}
                    <Input
                      id="password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-blue-600"
                      />
                      <span className="ml-2 text-white ">Remember</span>
                    </label>
                    {/* <a href="#" className="text-blue-600 hover:underline">
                    Forgot Password?
                  </a> */}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={login}
                className="w-full"
                style={{ backgroundColor: "hsl(203.6deg 98.89% 35.29%)" }}
              >
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

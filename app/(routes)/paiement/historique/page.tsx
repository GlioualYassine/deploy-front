"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import { Payment } from "./components/ListHistorique/historique.types";
import ListHistorique from "./components/ListHistorique/ListHistorique";

const Page = () => {
  const [paiements, setPaiements] = useState<Payment[]>([]);

  useEffect(() => {
    let fetchHistorique = async () => {
      const response = await axiosInstance.get("/paiements/all");
      setPaiements(response.data);
      console.log("paiements", response.data);
    };
    fetchHistorique();
  }, []);

  return (
    <div>
      <ListHistorique paiements={paiements} />
    </div>
  );
};

export default Page;

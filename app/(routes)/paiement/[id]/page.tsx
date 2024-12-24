"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import PaymentEditPage from "./components/editPaiementComponent";
import { Payment } from "../components/historique.types";
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Page = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [payment, setPayment] = useState<Payment>();

  const user = useSelector(selectUser);
  const router = useRouter();
  useEffect(() => {
    if (user?.role != "ROLE_GENERAL_ADMIN") {
      router.push("/");
    }
    const fetchPayment = async () => {
      try {
        const response = await axiosInstance.get(`/paiements/${params.id}`);
        const { data } = response;
        setPayment(data);
      } catch (error) {
        console.error("Error fetching payment:", error);
        alert("Failed to load payment details.");
      }
    };

    fetchPayment();
  }, [params.id]);
  return <div>{payment && <PaymentEditPage paiement={payment} />}</div>;
};

export default Page;

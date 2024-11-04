"use client";
import React from "react";
import { FooterCompanyProps } from "./FooterCompany.types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { title } from "process";
import axiosInstance from "@/lib/axiosInstance";

const FooterCompany = (props: FooterCompanyProps) => {
  const { companyId } = props;
  const router = useRouter();

  const onDeleteCompany = async () => {
    try {
      console.log("teeeest")
      await axiosInstance.delete(`/company/${companyId}`);
      toast({
        title : "Company deleted",
      })
      router.push("/companies")
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-end mt-5">
      <Button variant="destructive" onClick={onDeleteCompany}>
        <Trash className="w-4 h-4 mr-2" />
        Delete Company
      </Button>
    </div>
  );
};

export default FooterCompany;
"use client";
import React from "react";
import { CompanyInformationProps } from "./companyInformation.types";
import { ArrowLeft, User } from "lucide-react";
import CompanyForm from "../CompanyForm/CompanyForm";
import { useRouter } from "next/navigation";
import FooterCompany from "../FooterCompany/FooterCompany";

const CompanyInformation = (props: CompanyInformationProps) => {
  const router = useRouter();

  const { company } = props;
  return (
    <div className="grid grid-cols-1   gap-y-4">
      <div className=" rounded-lg px-4">
        <div>
          <CompanyForm company={company} />
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;

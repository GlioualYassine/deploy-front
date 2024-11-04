"use client"
import React from "react";
import { CompanyInformationProps } from "./companyInformation.types";
import { User } from "lucide-react";
import CompanyForm from "../CompanyForm/CompanyForm";
import ListClients from "./ListClients/ListClients";


const CompanyInformation = (props: CompanyInformationProps) => {
  const { company } = props;
  console.log("company", company);
  return (
    <div className=" grid grid-cols-1   gap-y-4">
      <div className=" rounded-lg p-4">
        <div>
          <CompanyForm company={company} />
        </div>
      </div>
      <div className="rounded-lg bg-background   p-4 h-min">
        <div className="flex flex-col   gap-x-2">
          <div className="flex gap-x-2">
            Utilisateur d&apos;entreprise
          </div>
          <div>
           <ListClients clients={company.users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;

"use client";
import { Button } from "@/components/ui/button";


import FormCreateCustomer from "../FormCreateCustomer/FormCreateCustomer";
import Link from "next/link";

const HeaderCompanies = () => {

  return (
  <div className="flex justify-between items-center">
    <h2 className="text-2xl">List of companies</h2>

   
           <Link href="companies/create"><Button>Créer une entreprise</Button></Link> 
        
  </div>)
};

export default HeaderCompanies;

"use client";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import CompanyForm from "./CompanyForm";

const CompanieIdPage = ({ params }: { params: { companyId: number } }) => {
  const [c, setC] = useState<any>();
  useEffect(() => {
    findCompany();
  }, []);

  const findCompany = async () => {
    if (!params.companyId) {
      redirect("/companies");
    } else {
      const company: any = await axiosInstance
        .get(`/company/${params.companyId}`)
        .then((res) => res.data);

      let c: any = {
        id: company.id,
        name: company.nameCompany,
        adress: company.address,
        phone: company.phone,
        admin_id: company.admin.id,
        admin_first_name: company.admin.firstName,
        admin_last_name: company.admin.lastName,
        admin_email: company.admin.email,
      };
      setC(c);
    }
  };
  return <div>{c && <CompanyForm company={c} />} </div>;
};

export default CompanieIdPage;

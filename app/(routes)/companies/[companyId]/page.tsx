import { redirect } from "next/navigation";
import Header from "./components/Header/Header";
import CompanyInformation from "./components/companyInformation/CompanyInformation";
import FooterCompany from "./components/FooterCompany/FooterCompany";
import { Company } from "../components/ListCompanies/ListCompanies.types";
import axiosInstance from "@/lib/axiosInstance";

const CompanieIdPage = async ({
  params,
}: {
  params: { companyId: number };
}) => {
  
  const company : any = await axiosInstance.get(`/company/${params.companyId}`).then((res) => res.data);
  let c : any = {
    id: company.id,
    name: company.nameCompany,
    adress: company.address,
    phone: company.phone,
    admin_id : company.admin.id,
    admin_first_name: company.admin.firstName,
    admin_last_name: company.admin.lastName,
    admin_email: company.admin.email,
    users : company.users
  };

  return (
    <div>
      <CompanyInformation company={c} />
    </div>
  );
};

export default CompanieIdPage;

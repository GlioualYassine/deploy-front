import { Company } from "../../../components/ListCompanies/ListCompanies.types";
export type CompanyInformationProps = {
    company : any
}

export type ClientsEntreprise =  {
    clients : User[]
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyId: string;
}
"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Company } from "./ListCompanies.types";
import axiosInstance from "@/lib/axiosInstance";
import { useAppSelector } from "@/app/store/hooks";
import { setCompanies } from "@/app/store/companySlice";

const ListCompanies = () => {
  const dispatch = useDispatch();
  const companies = useAppSelector((state) => state.companies);


  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await axiosInstance.get("/company");

      // Map the response data to Company type and sort by id
      const companiesList: Company[] = response.data
        .map((c: any) => ({
          id: c.id,
          name: c.nameCompany,
          admin_first_name: c.admin.firstName,
          admin_last_name: c.admin.lastName,
          admin_email: c.admin.email,
          admin_id: c.admin.id,
          adress: c.address,
          phone: c.phone,
        }))
        .sort((a:any, b:any) => a.id - b.id); // Sort by id in ascending order

      // Dispatch setCompanies to update the Redux store
      dispatch(setCompanies(companiesList));
    };

    fetchCompanies();
  }, [dispatch]);

  return <DataTable columns={columns} data={companies.companies} />;
};

export default ListCompanies;

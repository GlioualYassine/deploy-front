"use client";
import { DataTable } from "./data-table";
import { columns } from   "./columns";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Company } from "./list/ListCompanies.types";
import { useAppSelector } from "@/app/store/hooks";
import { setCompanies } from "@/app/store/companySlice";
import { useFetch } from "@/servises/useFetch";
import { Pagination } from "@/typs/pagination";
import { defaultFilter } from "@/typs/filter";

const { fetchAll } = useFetch("company");

const ListCompanies = () => {
  const dispatch = useDispatch();
  const companies = useAppSelector((state) => state.companies);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();

  useEffect(() => {
    fetchCompanies(filter);
  }, [dispatch]);

  const fetchCompanies = async (baseFilter: any) => {

    const response = await fetchAll(baseFilter);
    setPagination(response.pagination);

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
      .sort((a: any, b: any) => a.id - b.id);
    dispatch(setCompanies(companiesList));
  };

  return (
    <DataTable
      columns={columns}
      data={companies.companies}
      pagination={pagination as Pagination}
      fetch={fetchCompanies}
    />
  );
};

export default ListCompanies;

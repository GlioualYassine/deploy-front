"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";
import { Pagination } from "@/typs/pagination";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
const Page = () => {
  const { fetchAll } = useFetch("rapports");
  const user = useSelector(selectUser);

  const [rapports, setRapports] = useState<any[]>([]);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();
  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {
    fetchRapports(filter);
  }, []);

  const fetchRapports = async (baseFilter: any) => {
    const response = await fetchAll(baseFilter);
    setRapports(response.data);
    setPagination(response.pagination);
  };

  const changeValue = (value: any) => {
    setSelectedValue(value);
    fetchRapports({ ...filter, clientId: value });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des rapports</h2>
      </div>
      <div className="p-4 bg-background shadow-md rounded-lg mt-4">
        <div className="flex items-center mb-2">
          {(user.role === "ROLE_GENERAL_ADMIN" ||
            user.role === "ROLE_COMPANY_ADMIN") && (
            <BaseSelectWithFetch
              placeholder="Choisir un Client"
              labelOption="firstName"
              valueOption="id"
              fetchUrl="users/clients"
              value={selectedValue}
              setValue={changeValue}
            />
          )}
        </div>
        <DataTable
          columns={columns}
          data={rapports}
          pagination={pagination as Pagination}
          fetch={fetchRapports}
        />
      </div>
    </div>
  );
};

export default Page;

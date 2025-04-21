"use client";
import React, { useState, useEffect, useCallback } from "react";
import { defaultFilter } from "@/typs/filter";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Pagination } from "@/typs/pagination";
import { columns } from "./columns";

import { useSelector } from "react-redux";
import { selectUser } from "@/app/store/authSlice";
import axiosInstance from "@/lib/axiosInstance";
import { useFetch } from "@/servises/useFetch";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Page = () => {
  const user = useSelector(selectUser);

  const { fetchAll } = useFetch("notifications");
  const [filter, setFilter] = React.useState({ ...defaultFilter });
  const [selectedClient, setSelectedClient] = useState();
  const [selectedCompany, setSelectedCompany] = useState();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [pagination, setPagination] = useState<Pagination>();

  const [notifications, setNotifications] = useState([]);

  const fetchData = async (baseFilter: any) => {
    const response = await fetchAll(baseFilter);
    setNotifications(response.data);
    setPagination(response.pagination);
  };

  useEffect(() => {
    fetchData(filter);
  }, []);

  const companySelected = (data: any) => {
    setSelectedCompany(data);
    fetchData({
      ...filter,
      companyId: data,
      clientId: selectedClient,
    });
  };

  const clientSetSelected = (data: any) => {
    setSelectedClient(data);
    fetchData({
      ...filter,
      clientId: data,
      companyId: selectedCompany,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des notifications</h2>
      </div>
      <div className="p-4 bg-background shadow-md rounded-lg mt-4 ">
        <div className="flex gap-4 items-center mt-0 mb-4 z-50 border-b pb-4">
          {(user.role === "ROLE_GENERAL_ADMIN" ||
            user.role === "ROLE_COMPANY_ADMIN") && (
            <BaseSelectWithFetch
              placeholder="Choisir un Client"
              labelOption="firstName"
              valueOption="id"
              fetchUrl="users/clients"
              value={selectedClient}
              setValue={clientSetSelected}
            />
          )}

          {user.role === "ROLE_GENERAL_ADMIN" && (
            <BaseSelectWithFetch
              placeholder="Choisir un entreprise"
              labelOption="nameCompany"
              valueOption="id"
              fetchUrl="company/getCompaniesBasicInfo"
              value={selectedCompany}
              setValue={companySelected}
            />
          )}

          {/* <BaseSelectWithFetch
            // label="Choisir un Appareil"
            placeholder="Choisir un Appareil"
            labelOption="VoitureNom"
            valueOption="imei"
            fetchUrl={urlApapreil}
            value={selectedValue}
            setValue={setSelectedValue}
          />*/}

          {/* <BaseRangeDate
            placeholder="Choisir une date"
            value={date}
            setValue={setDate}
          /> */}
        </div>

        <DataTable
          data={notifications}
          columns={columns} // columns
          pagination={pagination as Pagination}
          fetch={fetchData} // fetch function to call when filter changes
        />
      </div>
    </div>
  );
};

export default Page;

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
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

const Page = ({
  params,
}: {
  params: {
    imei: string;
  };
}) => {
  const { fetchAll } = useFetch(`rapports/${params.imei}`);

  const [rapports, setRapports] = useState<any[]>([]);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();
  const [selectedValue, setSelectedValue] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

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
    if (
      !value?.from ||
      !value?.to ||
      value?.from == undefined ||
      value?.to == undefined ||
      !value
    ) {
      fetchRapports({
        ...filter,
        startDate: null,
        endDate: null,
      });
    } else {
      const startDate = format(value.from, "yyyy-MM-dd");
      const endDate = format(value.to, "yyyy-MM-dd");
      fetchRapports({
        ...filter,
        startDate: startDate,
        endDate: endDate,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des rapports</h2>
      </div>
      <div className="p-4 bg-background shadow-md rounded-lg mt-4">
        <div className="flex items-center mb-2">
          <BaseRangeDate
            placeholder="Choisir un date"
            value={selectedValue}
            setValue={changeValue}
          />
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

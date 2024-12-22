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

const Page = () => {
  const { fetchAll } = useFetch("paiements");

  const [paiements, setPaiements] = useState<any[]>([]);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();
  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {}, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des rapports</h2>
      </div>
      <div className="p-4 bg-background shadow-md rounded-lg mt-4">
        <div className="flex items-center mb-2">
          <BaseSelectWithFetch
            placeholder="Choisir un Client"
            labelOption="firstName"
            valueOption="id"
            fetchUrl="users/clients"
            value={selectedValue}
            setValue={setSelectedValue}
          />
        </div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default Page;

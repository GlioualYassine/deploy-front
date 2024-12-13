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

const { fetchAll } = useFetch("paiements");

const Page = () => {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();

  useEffect(() => {}, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des rapports</h2>
      </div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default Page;

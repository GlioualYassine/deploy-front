"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";
import { Pagination } from "@/typs/pagination";
import { Payment } from "./components/historique.types";
import ListHistorique from "./components/ListHistorique";

import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
const Page = () => {
  const { fetchAll } = useFetch("paiements");

  const [paiements, setPaiements] = useState<Payment[]>([]);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [pagination, setPagination] = useState<Pagination>();

  useEffect(() => {
    fetchPaiements(filter);
  }, []);

  const fetchPaiements = async (baseFilter: any) => {
    const response = await fetchAll(baseFilter);
    setPaiements(response.data);
    setPagination(response.pagination);
  };
  const user = useSelector(selectUser);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des factures</h2>
        {user.role === "ROLE_GENERAL_ADMIN" && ( <Link href="paiement/create">
          <Button>Créer un facture</Button>

        </Link>) }
        

      </div>
      <ListHistorique
        paiements={paiements}
        pagination={pagination as Pagination}
        fetch={fetchPaiements}
      />
    </div>
  );
};

export default Page;

"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import { Payment } from "./historique/components/ListHistorique/historique.types";
import ListHistorique from "./historique/components/ListHistorique/ListHistorique";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";
import { Pagination } from "@/typs/pagination";
import DownloadInvoice from "./components/pdf/DownloadInvoice";


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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des factures</h2>
        <Link href="paiement/create">
          <Button>Créer un facture</Button>
        </Link>
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

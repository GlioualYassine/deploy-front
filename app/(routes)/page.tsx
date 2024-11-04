"use client";
import CardSummary from "./components/CardSummary/CardSummary";
import { UserRound, Waypoints, BookOpenCheck } from "lucide-react";
import LastCustomer from "@/app/(routes)/components/LastCustomers/LastCustomer";
import Salesdistributor from "@/app/(routes)/components/Salesdistributors/Salesdistributor";
import TotatSubscribers from "./components/TotalSubscribers/TotatSubscribers";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface CardSummaryData {
  icon: any;
  total: string;
  average: number;
  title: string;
  tooltipText: string;
}

interface Transaction {
  id: string;
  status: string;
  email: string;
  clientName : string;
  clientId : number;
  amount: number;
}

export default function Home() {
  const [dataCardSummary, setDataCardSummary] = useState<CardSummaryData[]>([]);
  const [lastCustomers, setLastCustomers] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance("/dashboard/summary");
        const data = response.data;
        console.log("response", data);

        // Mettre à jour les données de résumé en français
        setDataCardSummary([
          {
            icon: UserRound,
            total: data.summary.userCount.toString(),
            average: 15,
            title: `Nombre Total d'Utilisateurs : ${data.summary.userCount}`,
            tooltipText: "Voir tous les utilisateurs",
          },
          {
            icon: Waypoints,
            total: `${data.summary.totalPaidThisMonth.toFixed(2)} DHS`,
            average: 80,
            title: `Revenu Ce Mois`,
            tooltipText: "Voir le revenu pour le mois en cours",
          },
          {
            icon: BookOpenCheck,
            total: `${data.summary.totalPaid.toFixed(2)} DHS`,
            average: 30,
            title: "Total Payé",
            tooltipText: "Voir le total payé",
          },
        ]);

        

        setLastCustomers(data.lastCustomers);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Tableau de Bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20 ">
        {dataCardSummary.map((item, index) => (
          <CardSummary
            key={index}
            icon={item.icon}
            total={item.total}
            average={item.average}
            title={item.title}
            tooltipText={item.tooltipText}
          />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 xl:grid-cols-2 md:gap-x-10">
        <LastCustomer lastCustomers={lastCustomers} />
        <Salesdistributor />
      </div>

      <div className="flex-col xl:flex-row gap-y-4 md:gap-y-0 mt-12 md:mb-10 justify-center">
        <TotatSubscribers />
        <p>Liste des intégrations</p>
      </div>
    </div>
  );
}

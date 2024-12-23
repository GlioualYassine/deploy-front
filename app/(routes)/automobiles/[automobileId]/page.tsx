"use client";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import AutomobileInformation from "./components/AutomobileInformation/AutomobileInformation";
import { Voiture } from "@/app/(routes)/automobiles/[automobileId]/components/AutomobileInformation/AutomobileInformation.types";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton"; // Assure-toi que ce composant existe
import FooterAutomobile from "./components/FooterAutomobile/FooterAutomobile";

const AutomobileIdPage = ({ params }: { params: { automobileId: string } }) => {
  const [voiture, setVoiture] = useState<Voiture | null>(null);

  useEffect(() => {
    const fetchVoiture = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/voitures/${params.automobileId}`
        );
        setVoiture(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la voiture :", error);
      }
    };
    fetchVoiture();
  }, [params.automobileId]);

  if (!voiture) {
    return (
      <div>
        <Skeleton className=" w-[100px] h-[20px] rounded-full" />{" "}
        {/* Utilisation d'un skeleton ici */}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <AutomobileInformation voiture={voiture} />
      <FooterAutomobile VoitureId={voiture.id.toString()} />
    </div>
  );
};

export default AutomobileIdPage;

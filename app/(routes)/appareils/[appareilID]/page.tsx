"use client";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import AppareilInfrormation from "./components/AppareilInformation/AppareilInformation";
import { Appareil } from "@/app/(routes)/appareils/[appareilID]/components/AppareilInformation/AppareilInformation.types";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton"; // Assure-toi que ce composant existe
import FooterAutomobile from "./components/FooterAppareil/FooterAutomobile";

const AutomobileIdPage = ({ params }: { params: { appareilID: string } }) => {
  const [appareil, setAppareil] = useState<Appareil | null>(null);

  useEffect(() => {
    const fetchGPS = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/gpsDevices/${params.appareilID}`
        );
        setAppareil(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la voiture :", error);
      }
    };
    fetchGPS();
  }, [params.appareilID]);

  // <FooterAutomobile appareilID={appareil.id.toString()} />

  if (!appareil) {
    return (
      <div>
        <Header />
        <Skeleton className=" w-[100px] h-[20px] rounded-full" />
        {/* Utilisation d'un skeleton ici */}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <AppareilInfrormation appareil={appareil} />
    </div>
  );
};

export default AutomobileIdPage;
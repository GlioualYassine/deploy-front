"use client";
import { useEffect, useState } from "react";
import AppareilInfrormation from "./components/AppareilInformation/AppareilInformation";
import { Appareil } from "@/app/(routes)/appareils/[appareilID]/components/AppareilInformation/AppareilInformation.types";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton"; // Assure-toi que ce composant existe
import FooterAutomobile from "./components/FooterAppareil/FooterAutomobile";
import axiosInstance from "@/lib/axiosInstance";
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const AutomobileIdPage = ({ params }: { params: { appareilID: string } }) => {
  const [appareil, setAppareil] = useState<Appareil | null>(null);
  const user = useSelector(selectUser);
  const router = useRouter();
  useEffect(() => {
    if (user?.role != "ROLE_GENERAL_ADMIN") {
      router.push("/");
    }

    const fetchGPS = async () => {
      try {
        const response = await axiosInstance.get(
          `/gpsDevices/${params.appareilID}`
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
        <Skeleton className=" w-[100px] h-[20px] rounded-full" />
        {/* Utilisation d'un skeleton ici */}
      </div>
    );
  }

  return (
    <div>
      <AppareilInfrormation appareil={appareil} />
    </div>
  );
};

export default AutomobileIdPage;

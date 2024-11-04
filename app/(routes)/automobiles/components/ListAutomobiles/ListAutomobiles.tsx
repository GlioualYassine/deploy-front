"use client";
import { redirect } from "next/navigation";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Voiture } from "./ListAutomobiles.type";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setVoitures } from "@/app/store/VoitureSlice";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface V {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatricule: string;
  user: User;
}

const ListAutomobiles = () => {
  //const { voitures, setVoitures } = useAutomobileContext();
  const dispatch = useAppDispatch();
  const voitures = useAppSelector(
    (state: { voitures: { voitures: Voiture[] } }) => state.voitures.voitures
  );

  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/voitures"
        );
        const fetchedVoitures = response.data.map((voiture: V) => {
          var voitureUser = {
            id: voiture.id,
            nom: voiture.nom,
            modele: voiture.modele,
            marque: voiture.marque,
            immatricule: voiture.immatricule,
            conducteur: voiture.user
              ? voiture.user.firstName + " " + voiture.user.lastName
              : "Pas de conducteur",
            idConducteur: voiture.user ? voiture.user.id : "0",
          };

          return voitureUser;
        });

        //setVoitures(fetchedVoitures);
        dispatch(setVoitures(fetchedVoitures));
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
      }
    };

    fetchVoitures();
  }, [dispatch]); // Le tableau de dépendances vide [] signifie que ce useEffect est appelé une seule fois au montage du composant
  console.log(voitures);
  return <DataTable columns={columns} data={voitures} />;
};

export default ListAutomobiles;

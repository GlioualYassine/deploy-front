'use client';
import axiosInstance from '@/lib/axiosInstance';
import React, { useEffect, useState } from 'react';
import ClientInformations from './components/clientInformation/clientInformations';

const Page = (props: any) => {
  const utilisateurID = props.params.utilisateurID;
  const [utilisateur, setUtilisateur] = useState<any | null>(null);

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const response = await axiosInstance.get(`users/${utilisateurID}`);
        setUtilisateur(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    };

    fetchUtilisateur();
  }, [utilisateurID]); // Inclure utilisateurID dans le tableau des dépendances

  return (
    <>
      {utilisateur && <ClientInformations utilisateur={utilisateur} />}
    </>
  );
};

export default Page;

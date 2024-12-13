"use client"
import React, { useEffect } from 'react';
import PaymentEntry from './components/paiement/paiement';
import axiosInstance from '@/lib/axiosInstance';
interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    companyId: number | null;
    companyName: string | null;
    role: string;
  }


const Page = () => {
  const [clients, setClients] = React.useState([]);
  useEffect(() => {
    const fetchClients = async () => {
        const response = await axiosInstance.get('users/clients')
        setClients(response.data)
        console.log(response.data)
    };
    fetchClients();
  }, []);

  return (
    <div>
      <PaymentEntry clients={clients} />
    </div>
  );
};

export default Page;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
import axiosInstance from "@/lib/axiosInstance";
import { useSelector } from "react-redux";
import { selectUser } from "@/app/store/authSlice";
import { format } from "date-fns";

import dynamic from "next/dynamic";

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import("./components/Map/MapPage"), { ssr: false });

const Page = () => {
  const user = useSelector(selectUser);

  const [apapreils, setApapreils] = useState<Record<string, string>[]>([]);
  const [selectedValue, setSelectedValue] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [history, setHistory] = useState<any>([]);
  const [date, setDate] = useState({ from: undefined, to: undefined });

  const fetchData = useCallback(async (url: string) => {
    try {
      const response = await axiosInstance.get(url);
      setApapreils(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(`/gpsDevices/all`);
  }, [fetchData]);

  const selectedData = (data: any) => {
    setSelectedClient(data);
    if (data == null) {
      fetchData(`/gpsDevices/all`);
    } else {
      fetchData(`/gpsDevices/user/${data}`);
    }
  };

  const handleMarkerClick = (value: any) => {
    setSelectedValue(value);
    if (date?.from && date?.to) {
      choisirDate(date);
    }
  };

  const choisirDate = async (value: any) => {
    setDate(value);
    if (value?.from && value?.to) {
      const startDate = format(value.from, "yyyy-MM-dd");
      const endDate = format(value.to, "yyyy-MM-dd");
      const response = await axiosInstance.get(
        `/positions/${selectedValue}/range?startDate=${startDate}&endDate=${endDate}`
      );
      setHistory(response.data);
    }
  };

  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="flex gap-4 items-center mt-0 mb-4 z-50 border-b pb-4">
        {(user.role === "ROLE_GENERAL_ADMIN" ||
          user.role === "ROLE_COMPANY_ADMIN") && (
          <BaseSelectWithFetch
            placeholder="Choisir un Client"
            labelOption="firstName"
            valueOption="id"
            fetchUrl="users/clients"
            value={selectedClient}
            setValue={selectedData}
          />
        )}

        <BaseSelectWithFetch
          placeholder="Choisir un Appareil"
          labelOption="nom"
          valueOption="imei"
          data={apapreils}
          value={selectedValue}
          setValue={handleMarkerClick}
        />

        <BaseRangeDate
          placeholder="Choisir une date"
          value={date}
          setValue={choisirDate}
        />
      </div>

      <div className="flex flex-col gap-2 w-full h-[80vh] relative">
        <MapComponent apapreils={apapreils} history={history} />
      </div>
    </div>
  );
};

export default Page;

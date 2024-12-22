"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clear } from "@/app/store/deliveredNotifsSlice";
import { defaultFilter } from "@/typs/filter";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Pagination } from "@/typs/pagination";
import { columns } from "./columns";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Page = () => {
  const [filter, setFilter] = React.useState({ ...defaultFilter });
  const [selectedValue, setSelectedValue] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [urlApapreil, setUrlApapreil] = useState("");
  const [pagination, setPagination] = useState<Pagination>();

  const [notifications, setNotifications] = useState([]);
  const dispatch = useAppDispatch();

  const changeNotificationStatus = async (notifId: Number) => {
    return await axiosInstance.patch(`/notification/read/${notifId}`);
  };

  const fetchNotifications = async () => {
    // dispatch(clear());
    // const response = await getAllNotifications(user.id);
    // const data = response.data;
    // setNotifications(data);
  };

  const readNotif = async (notifId: Number) => {
    await changeNotificationStatus(notifId);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">List des notifications</h2>
      </div>
      <div className="p-4 bg-background shadow-md rounded-lg mt-4 ">
        <div className="flex gap-4 items-center mt-0 mb-4 z-50 border-b pb-4">
          <BaseSelectWithFetch
            placeholder="Choisir un Client"
            labelOption="firstName"
            valueOption="id"
            fetchUrl="users/clients"
            value={selectedClient}
            setValue={setSelectedClient}
          />

          <BaseSelectWithFetch
            // label="Choisir un Appareil"
            placeholder="Choisir un Appareil"
            labelOption="VoitureNom"
            valueOption="imei"
            fetchUrl={urlApapreil}
            value={selectedValue}
            setValue={setSelectedValue}
          />

          <BaseRangeDate
            placeholder="Choisir une date"
            value={date}
            setValue={setDate}
          />

          <Button>Rechercher</Button>
        </div>

        <DataTable
          data={notifications}
          columns={columns} // columns
          pagination={pagination as Pagination}
          fetch={fetchNotifications}
        />
      </div>
    </div>
  );
};

export default Page;

"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Device } from "./ListDevice.type";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setDevices } from "@/app/store/deviceSlise";
import { Pagination } from "@/typs/pagination";
import { useFetch } from "@/servises/useFetch";
import { defaultFilter } from "@/typs/filter";

const { fetchAll } = useFetch("gpsDevices");

const ListDevices = () => {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(
    (state: { devices: { devices: Device[] } }) => state.devices.devices
  );
  const [pagination, setPagination] = useState<Pagination>();
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    fetchVoitures(filter);
    const interval = setInterval(fetchVoitures, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const fetchVoitures = async (baseFilter: any) => {
    try {
      const response = await fetchAll(baseFilter);
      setPagination(response.pagination);

      dispatch(setDevices(response.data));
      console.log("devices", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des voitures :", error);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={devices}
      // pagination={pagination as Pagination}
      // fetch={fetchCompanies}
    />
  );
};

export default ListDevices;

"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Coins,
  FileCheck,
  FileClock,
  SmartphoneNfc,
  School,
  VibrateOff,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const StatisticsNumerique: React.FC = () => {
  const [data, setData] = React.useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/statistics");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-smedium">
            Chiffre d'affaires
          </CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-m font-bold">{data?.total} DH</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">Factures payées</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="text-m font-bold">{data?.totalPaid} DH</div>
          <div>
            <span className="text-xs font-medium">{data?.facteurPayedCount}</span>{" "}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">
            Factures en cours
          </CardTitle>
          <FileClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-1">
          <div className="text-m font-bold">{data?.totalUnpaid} DH</div>
          <div>
            <span className="text-xs font-medium">{data?.facteurUnpaidCount}</span>{" "}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">Appareils</CardTitle>
          <SmartphoneNfc className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-m font-bold">{data?.deviceCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">
            Appareils en ligne
          </CardTitle>
          <SmartphoneNfc className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-m font-bold">{data?.connectedDeviceCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">
            Appareils desactivés
          </CardTitle>
          <VibrateOff className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-m font-bold">{data?.deviceDesactive}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-m font-bold">{data?.companyCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-m font-bold">{data?.userCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsNumerique;

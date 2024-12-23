"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import axiosInstance from "@/lib/axiosInstance";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { BaseRangeDate } from "@/app/components/base/BaseRangeDate";
// Define the client type based on updated User model
interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyId: number | null;
  companyName: string | null;
  role: string;
}

// Define the device entry type without 'dateFrom' and 'dateTo'
interface DeviceEntry {
  description: string;
  rate: number;
  tva: number;
  total: number;
}

// Define props type for PaymentEntry component
interface PaymentEntryProps {
  clients: Client[];
}

const PaymentEntry: React.FC<PaymentEntryProps> = ({ clients }) => {
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState();

  const [filterText, setFilterText] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  const [period, setPeriod] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Device list and calculation states
  const [deviceList, setDeviceList] = useState<DeviceEntry[]>([
    {
      description: "",
      rate: 0,
      tva: 20,
      total: 0,
    },
  ]);
  const [globalTva, setGlobalTva] = useState<number>(20);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    calculateTotals();
  }, [deviceList, discount, shippingFee, adjustment]);

  const calculateTotals = () => {
    const subtotalValue = deviceList.reduce((sum, item) => sum + item.rate, 0);
    const totalTva = deviceList.reduce(
      (sum, item) => sum + (item.rate * item.tva) / 100,
      0
    );
    const discountAmount = subtotalValue * (discount / 100);
    const calculatedTotal =
      subtotalValue + totalTva + shippingFee - discountAmount + adjustment;

    setSubtotal(subtotalValue);
    setTotal(calculatedTotal);
  };

  const handleDeviceChange = <K extends keyof DeviceEntry>(
    index: number,
    key: K,
    value: DeviceEntry[K]
  ) => {
    const updatedList = [...deviceList];
    updatedList[index][key] = value;
    updatedList[index].total =
      updatedList[index].rate * (1 + updatedList[index].tva / 100);
    setDeviceList(updatedList);
  };

  const handleClientSelect = async (client: any) => {
    setSelectedValue(client);
    try {
      const response = await axiosInstance.get(`/gpsDevices/user/${client}`);
      if (response.status === 200) {
        const devices = response.data.map((device: any) => ({
          description: device.imei, // Assuming IMEI is in the 'description' field
          rate: 0,
          tva: 20,
          total: 0,
        }));
        setDeviceList(devices);
      }
    } catch (error) {
      console.error("Error fetching client devices:", error);
      toast({
        title: "Error fetching devices",
        description: "Failed to load devices for the selected client.",
        variant: "destructive",
      });
    }
  };

  const addDevice = () => {
    setDeviceList([
      ...deviceList,
      {
        description: "",
        rate: 0,
        tva: globalTva,
        total: 0,
      },
    ]);
  };

  const removeDevice = (index: number) => {
    const updatedList = deviceList.filter((_, i) => i !== index);
    setDeviceList(updatedList);
  };

  const applyGlobalTvaToAllDevices = () => {
    setDeviceList(deviceList.map((device) => ({ ...device, tva: globalTva })));
  };

  const handleSubmit = async () => {
    if (!selectedValue) {
      toast({
        title: "Veuillez sélectionner un client.",
        description: "Le client est requis pour enregistrer le paiement.",
        variant: "destructive",
      });
      return;
    }

    if (
      !period?.from ||
      !period.to ||
      period.from == undefined ||
      period.to == undefined
    ) {
      toast({
        title: "Veuillez sélectionner une période.",
        description: "La période est requise pour enregistrer le paiement.",
        variant: "destructive",
      });
      return;
    }

    if (deviceList.length === 0) {
      toast({
        title: "Veuillez ajouter au moins un appareil.",
        description:
          "Ajoutez au moins un appareil pour enregistrer le paiement.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      clientId: selectedValue,
      devices: deviceList.map((device) => ({
        imei: device.description, // Assuming `description` is the IMEI; update if needed
        unitPrice: device.rate,
        tva: device.tva,
      })),
      subtotal,
      discount,
      shippingFee,
      adjustment,
      dateFrom: period?.from,
      dateTo: period?.to,
      datePaiement: paymentDate,
    };

    try {
      const response = await axiosInstance.post("/paiements/add", payload);
      if (response.status === 200) {
        toast({
          title: "Paiement enregistré avec succès.",
          description: "Le paiement a été enregistré avec succès.",
          variant: "default",
        });
        router.push("/paiement");
      } else {
        toast({
          title: "Erreur lors de l'enregistrement du paiement.",
          description: "Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      toast({
        title: "Erreur lors de l'enregistrement du paiement.",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  const DatePicker = ({
    selectedDate,
    onSelect,
    placeholder = "Choisir une date",
  }: {
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    placeholder?: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2" />
          {selectedDate ? (
            format(selectedDate, "dd/MM/yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={(day) => day && onSelect(day)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="w-full mx-auto p-3 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Saisie d`&apos;une facture
        </CardTitle>
        <div className=" grid grid-cols-1 md:flex gap-4 items-center mt-2">
          <BaseSelectWithFetch
            label="Client"
            placeholder="Choisir un Client"
            labelOption="firstName"
            valueOption="id"
            fetchUrl="users/clients"
            value={selectedValue}
            setValue={handleClientSelect}
          />

          <div>
            <label className="text-gray-600 font-medium">
              Date de paiement
            </label>
            <div className="w-48">
              <DatePicker
                selectedDate={paymentDate}
                onSelect={setPaymentDate}
              />
            </div>
          </div>

          <div>
            <BaseRangeDate
              label="Période"
              placeholder="Choisir une date"
              value={period}
              setValue={setPeriod}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 md:flex items-center gap-4 mt-2">
          <label className="text-gray-600 font-medium">TVA Globale (%)</label>
          <Input
            type="number"
            value={globalTva}
            onChange={(e) => setGlobalTva(Number(e.target.value))}
            className="w-20"
          />
          <Button onClick={applyGlobalTvaToAllDevices}>
            Appliquer la TVA à tous
          </Button>
        </div>

        {/* Device Information Table */}
        <Table className="w-full border mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Imei</TableHead>
              <TableHead>Prix unitaire (DHS)</TableHead>
              <TableHead>TVA (%)</TableHead>
              <TableHead>Montant (DHS)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviceList.map((device, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    placeholder="Imei"
                    value={device.description}
                    onChange={(e) =>
                      handleDeviceChange(index, "description", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Prix unitaire"
                    value={device.rate}
                    onChange={(e) =>
                      handleDeviceChange(index, "rate", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="TVA"
                    value={device.tva}
                    onChange={(e) =>
                      handleDeviceChange(index, "tva", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <span>{device.total.toFixed(2)} DHS</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-red-500 bg-pink-100"
                    onClick={() => removeDevice(index)}
                  >
                    -
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <Button
          variant="ghost"
          className="bg-slate-300 mt-2"
          onClick={addDevice}
        >
          +
        </Button> */}

        {/* Summary Section */}
        <div className="mt-6 space-y-2 border-t pt-4 mx-auto">
          <h2 className="text-lg font-semibold">Résumé</h2>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Sous-total</span>
            <span>{subtotal.toFixed(2)} DHS</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-600 font-medium">Remise (%)</label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-600 font-medium">
              Frais de livraison (DHS)
            </label>
            <Input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-600 font-medium">
              Ajustement (DHS)
            </label>
            <Input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total à payer</span>
            <span>{total.toFixed(2)} DHS</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSubmit}
          className="0 text-white"
        >
          Enregistrer le Paiement
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentEntry;

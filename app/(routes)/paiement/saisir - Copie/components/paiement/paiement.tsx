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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import axiosInstance from "@/lib/axiosInstance";

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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  // General period dates
  const [periodFrom, setPeriodFrom] = useState<Date | null>(null);
  const [periodTo, setPeriodTo] = useState<Date | null>(null);

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
  const onClientSelect = (client: Client) => {
    handleClientSelect(client);
  };

  // Fetch client devices when a client is selected
  const handleClientSelect = async (client: Client) => {
    setSelectedClient(client);
    setFilterText(`${client.firstName} ${client.lastName}`);

    try {
      const response = await axiosInstance.get(
        `/gpsDevices/user/${client.id}`
      );
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
      alert("Failed to load devices for the selected client.");
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

  const deselectClient = () => {
    setSelectedClient(null);
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    if (!periodFrom || !periodTo) {
      alert("Veuillez sélectionner une période.");
      return;
    }

    const payload = {
      clientId: selectedClient.id,
      devices: deviceList.map((device) => ({
        imei: device.description, // Assuming `description` is the IMEI; update if needed
        unitPrice: device.rate,
        tva: device.tva,
      })),
      subtotal,
      discount,
      shippingFee,
      adjustment,
      dateFrom: periodFrom,
      dateTo: periodTo,
      datePaiement: paymentDate,
    };

    try {
      const response = await axiosInstance.post("/paiements/add", payload);
      if (response.status === 200) {
        alert("Paiement enregistré avec succès !");
      } else {
        alert("Échec de l'enregistrement du paiement.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      alert("Erreur de connexion au serveur.");
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
            <label className="text-gray-600 font-medium">Période</label>
            <div className="grid grid-cols-1 sm:flex gap-4">
              <div className="w-48 flex gap-2 items-center">
                <label className="text-gray-600 font-medium">du</label>
                <DatePicker
                  selectedDate={periodFrom}
                  onSelect={setPeriodFrom}
                  placeholder="Date de début"
                />
              </div>
              <div className="w-48 flex gap-2 items-center">
                <label className="text-gray-600 font-medium">au</label>
                <DatePicker
                  selectedDate={periodTo}
                  onSelect={setPeriodTo}
                  placeholder="Date de fin"
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Client Selection and Info Section */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <label className="text-gray-600 font-medium mb-1 block">
              Client
            </label>
            <Command className="rounded-lg border shadow-md w-full">
              <CommandInput
                placeholder="Rechercher un client..."
                value={filterText}
                onValueChange={(value) => {
                  setFilterText(value);
                  setSelectedClient(null); // Reset selected client when input changes
                }}
              />
              <ScrollArea className="h-48">
                <CommandList>
                  <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                  {clients
                    .filter((client) =>
                      `${client.firstName} ${client.lastName} ${
                        client.companyName || ""
                      }`
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
                    )
                    .map((client) => (
                      <CommandItem
                        key={client.id}
                        onSelect={() => {
                          onClientSelect(client);
                          setFilterText(
                            `${client.firstName} ${client.lastName}`
                          );
                        }}
                      >
                        <PersonIcon className="mr-2" />
                        <span>{`${client.firstName} ${client.lastName} (${
                          client.companyName || "Aucune société"
                        })`}</span>
                      </CommandItem>
                    ))}
                </CommandList>
              </ScrollArea>
            </Command>
          </div>

          {/* Display selected client info */}
          <Card className="w-1/3 p-4 mt-7">
            <CardTitle className="text-md font-semibold">
              Infos Client
            </CardTitle>
            {selectedClient ? (
              <div className="mt-2 space-y-1">
                <p>
                  <strong>Nom:</strong> {selectedClient.firstName}{" "}
                  {selectedClient.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedClient.email}
                </p>
                <p>
                  <strong>Entreprise:</strong>{" "}
                  {selectedClient.companyName || "Non spécifiée"}
                </p>
              </div>
            ) : (
              <div className="mt-2 text-gray-500">Aucun client sélectionné</div>
            )}
          </Card>
        </div>

        {/* Global TVA Application */}
        <div className="mb-4 grid grid-cols-1 md:flex items-center gap-4 mt-12">
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
              <TableHead>Description</TableHead>
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
                    placeholder="Description"
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
        <Button
          variant="ghost"
          className="bg-slate-300 mt-2"
          onClick={addDevice}
        >
          +
        </Button>

        {/* Summary Section */}
        <div className="mt-6 space-y-2 border-t pt-4 w-1/2 mx-auto">
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
            <label className="text-gray-600 font-medium">Ajustement (DHS)</label>
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
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Enregistrer le Paiement
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentEntry;

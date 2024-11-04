import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
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
import { editPaimentProp } from "./editPaiement.type";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { toast } from "@/components/ui/use-toast"; // Import toast from shadcn

interface DeviceEntry {
  id?: number;
  imei: string;
  unitPrice: number;
  tva: number;
  totalPrice: number;
}

const PaymentEditPage = (props: editPaimentProp) => {
  const [clientName, setClientName] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [periodFrom, setPeriodFrom] = useState<Date | null>(null);
  const [periodTo, setPeriodTo] = useState<Date | null>(null);
  const [deviceList, setDeviceList] = useState<DeviceEntry[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [badgeColor, setBadgeColor] = useState<string>(
    "border-red-500 text-red-500"
  );

  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Set data to the form fields
    setClientName(props.paiement.clientName);
    setPaymentDate(new Date(props.paiement.datePaiement));
    setPeriodFrom(new Date(props.paiement.dateFrom));
    setPeriodTo(new Date(props.paiement.dateTo));
    setSubtotal(props.paiement.subtotal);
    setDiscount(props.paiement.discount);
    setShippingFee(props.paiement.shippingFee);
    setAdjustment(props.paiement.adjustment);
    setTotal(props.paiement.total);
    // Retrieve payment status from props and set badge color
    const paymentStatus = props.paiement.isPaid === true; // Ensure it's a boolean
    setIsPaid(paymentStatus);
    setBadgeColor(
      paymentStatus
        ? "border-green-500 text-green-500"
        : "border-red-500 text-red-500"
    );

    // Map payment lines to deviceList
    const mappedDevices = props.paiement.paymentLines.map((line: any) => ({
      id: line.id,
      imei: line.imei,
      unitPrice: line.unitPrice,
      tva: line.tva,
      totalPrice: line.totalPrice,
    }));
    setDeviceList(mappedDevices);
  }, [props.paiement]); // Adding props.paiement as a dependency

  const calculateTotals = () => {
    const subtotalValue = deviceList.reduce(
      (sum, item) => sum + item.unitPrice,
      0
    );
    const totalTva = deviceList.reduce(
      (sum, item) => sum + (item.unitPrice * item.tva) / 100,
      0
    );
    const discountAmount = subtotalValue * (discount / 100);
    const calculatedTotal =
      subtotalValue + totalTva + shippingFee - discountAmount + adjustment;

    setSubtotal(subtotalValue);
    setTotal(calculatedTotal);
  };

  useEffect(() => {
    calculateTotals();
  }, [deviceList, discount, shippingFee, adjustment]);

  const handleDeviceChange = <K extends keyof DeviceEntry>(
    index: number,
    key: K,
    value: DeviceEntry[K]
  ) => {
    const updatedList = [...deviceList];
    updatedList[index][key] = value;
    updatedList[index].totalPrice =
      updatedList[index].unitPrice * (1 + updatedList[index].tva / 100);
    setDeviceList(updatedList);
  };

  const handlePaymentStatusChange = (value: string) => {
    const paymentStatus = value === "true"; // Convert string to boolean
    setIsPaid(paymentStatus);
    console.log("isPaid", paymentStatus);
    setBadgeColor(
      paymentStatus
        ? "border-green-500 text-green-500"
        : "border-red-500 text-red-500"
    );
  };

  const handleSubmit = async () => {
    if (!periodFrom || !periodTo) {
      alert("Veuillez sélectionner une période.");
      return;
    }

    const payload = {
      datePaiement: paymentDate,
      dateFrom: periodFrom,
      dateTo: periodTo,
      subtotal,
      discount,
      shippingFee,
      adjustment,
      total,
      paid : isPaid, // Add isPaid to payload
      devices: deviceList.map((device) => ({
        imei: device.imei,
        unitPrice: device.unitPrice,
        tva: device.tva,
      })),
    };

    console.log("payload", payload);

    try {
      const response = await axiosInstance.put(
        `/paiements/${props.paiement.id}`,
        payload
      );
      if (response.status === 200) {
        toast({
          title: "Succès",
          description: "Paiement modifié avec succès !",
          variant: "default",
        });
        router.push('/paiement/historique'); // Redirect to /paiements
      } else {
        toast({
          title: "Erreur",
          description: "Échec de la modification du paiement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la modification du paiement:", error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur.",
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
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2" />
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
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
    <Card className="w-full mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Modifier la facture
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-gray-600 font-medium">Client</label>
            <Input value={clientName} readOnly className="w-full bg-gray-100" />
          </div>
          <div>
            <label className="text-gray-600 font-medium">
              Date de paiement
            </label>
            <DatePicker selectedDate={paymentDate} onSelect={setPaymentDate} />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Période</label>
            <div className="flex gap-4">
              <DatePicker
                selectedDate={periodFrom}
                onSelect={setPeriodFrom}
                placeholder="Début"
              />
              <DatePicker
                selectedDate={periodTo}
                onSelect={setPeriodTo}
                placeholder="Fin"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className=" w-2/6 flex justify-between gap-3 items-center">
          <div>
            <label className="text-gray-600 font-medium flex gap-x-2 mb-2">
              <p>État de paiement </p>
              <Badge
                className={`border ${badgeColor} px-10 py-1 rounded bg-transparent hover:bg-transparent`}
              >
                <p>{isPaid ? "Payé" : "Non payé"}</p>
              </Badge>
            </label>
            <Select
              value={isPaid ? "true" : "false"}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner l'état" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>État de paiement</SelectLabel>
                  <SelectItem value="true">Payé</SelectItem>
                  <SelectItem value="false">Non payé</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

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
              <TableRow key={device.id || index}>
                <TableCell>
                  <Input
                    value={device.imei}
                    readOnly
                    placeholder="Description"
                    className="bg-gray-100"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Prix unitaire"
                    value={device.unitPrice}
                    onChange={(e) =>
                      handleDeviceChange(
                        index,
                        "unitPrice",
                        Number(e.target.value)
                      )
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
                  <span>{device.totalPrice.toFixed(2)} DHS</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-red-500"
                    onClick={() =>
                      setDeviceList((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
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
          className="bg-gray-200 mt-2"
          onClick={() =>
            setDeviceList([
              ...deviceList,
              { imei: "", unitPrice: 0, tva: 20, totalPrice: 0 },
            ])
          }
        >
          + Ajouter un appareil
        </Button>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Résumé</h2>
          <div className="flex justify-between">
            <span className="text-gray-600">Sous-total</span>
            <span>{subtotal.toFixed(2)} DHS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remise (%)</span>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frais de livraison (DHS)</span>
            <Input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{total.toFixed(2)} DHS</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Enregistrer les modifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentEditPage;

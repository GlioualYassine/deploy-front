"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { set, z } from "zod";
import { formSchema } from "./AppareilForm.form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { modifyDevice } from "@/app/store/deviceSlise";
import { Device } from "../../../components/ListDevices/ListDevice.type";
import { AppareilInformationProps, Voiture } from "./AppareilForm.types";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface Driver {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
}

const AppareilForm = (props: AppareilInformationProps) => {
  const { appareil } = props;
  let selcdriver = {
    id: appareil.idConducteur,
    firstName: appareil.nomConducteur,
    lastName: appareil.prenomConducteur,
    email: appareil.email_Conducteur,
    idCompany: appareil.idCompany,
  };

  //console.log(selcdriver);

  const [driverInputValue, setDriverInputValue] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [isNewDriver, setIsNewDriver] = useState(false); // État pour le statut de nouveau conducteur
  const dispatch = useAppDispatch();

  const [dateInsuranceExpiryDate, setDateInsuranceExpiryDate] =
    React.useState<Date>(appareil.insuranceExpiryDate);
  const [dateVignetteDeadline, setDateVignetteDeadline] = React.useState<Date>(
    appareil.vignetteDeadline
  );
  const [dateOilChangeDate, setDateOilChangeDate] = React.useState<Date>(
    appareil.oilChangeDate
  );

  const handleDateinsuranceExpiryDate = (date: Date) => {
    setDateInsuranceExpiryDate(date);
    form.setValue("insuranceExpiryDate", date.toISOString());
    console.log(form.getValues());
  };

  const handleDateVignetteDeadline = (date: Date) => {
    setDateVignetteDeadline(date);
    form.setValue("vignetteDeadline", date.toISOString());
    console.log(form.getValues());
  };

  const handleDateOilChangeDate = (date: Date) => {
    setDateOilChangeDate(date);
    form.setValue("oilChangeDate", date.toISOString());
    console.log(form.getValues());
  };

  const router = useRouter();

  const handleDriverSwitchChange = (checked: boolean) => {
    setIsNewDriver(checked);
    console.log("chicked", checked);
    console.log("isNewDriver", isNewDriver);
    if (checked) {
      form.setValue("firstNameConducteur", ""); // Réinitialiser le prénom du conducteur
      form.setValue("lastNameConducteur", ""); // Réinitialiser le nom du conducteur
      form.setValue("emailConducteur", ""); // Réinitialiser l'email du conducteur
    } else {
      form.setValue("idConducteur", selcdriver.id); // Réinitialiser l'ID du conducteur
      form.setValue("firstNameConducteur", selcdriver.firstName); // Réinitialiser le prénom du conducteur
      form.setValue("lastNameConducteur", selcdriver.lastName); // Réinitialiser le nom du conducteur
      form.setValue("emailConducteur", selcdriver.email); // Réinitialiser l'email du conducteur
    }
  };

  // Fonction pour récupérer tous les conducteurs lors du chargement initial du composant
  useEffect(() => {
    axiosInstance
      .get("users/clients")
      .then((response) => {
        setDrivers(response.data); // Supposons que response.data est un tableau d'objets conducteur
        setFilteredDrivers(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des conducteurs :",
          error
        );
      });
  }, []);

  const handleDriverInputChange = (value: string) => {
    setDriverInputValue(value);

    const filtered = drivers.filter((driver) =>
      `${driver.firstName} ${driver.lastName}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  const handleDriverDeselect = () => {
    setSelectedDriver(null);
    setDriverInputValue(""); // Réinitialiser l'input à une chaîne vide
    form.setValue("idConducteur", 10); // Réinitialiser l'ID du conducteur
    form.setValue("firstNameConducteur", ""); // Réinitialiser le prénom du conducteur
    form.setValue("lastNameConducteur", ""); // Réinitialiser le nom du conducteur
    form.setValue("emailConducteur", ""); // Réinitialiser l'email du conducteur
    setFilteredDrivers(drivers); // Réinitialiser les conducteurs filtrés
  };
  const handleDriverSelect = async (driver: Driver) => {
    setSelectedDriver(driver);
    setDriverInputValue(`${driver.firstName} ${driver.lastName}`);
    form.setValue("idConducteur", Number(driver.id)); // Set selected driver id in form
    form.setValue("firstNameConducteur", driver.firstName); // Set selected driver first name in form
    form.setValue("lastNameConducteur", driver.lastName); // Set selected driver last name in form
    form.setValue("emailConducteur", driver.email); // Set selected driver email in form
    // Force the form to re-validate
    // await form.trigger(); // Ensure this matches the API of your form library
  };

  console.log("appareil", appareil);

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idAppareil: appareil.id || 10, // Si appareil.id est vide, utilise une chaîne vide
      nomAppareil: appareil.name || "",
      descriptionAppareil: appareil.description || "",
      actifAppareil: appareil.actif !== undefined ? appareil.actif : false, // Si actif est indéfini, utilise false
      serverAppareil: appareil.serverType || "",
      imeiAppareil: appareil.imei || "",
      sim1Appareil: appareil.simNumber1 || "",
      sim2Appareil: appareil.simNumber2 || "", // Vérifie si appareil.simNumber1 est défini, sinon utilise une chaîne vide
      smsEmailAppareil: appareil.smsEmail || "",
      vitesseMaxAppareil:
        appareil.vitesseMax !== undefined ? appareil.vitesseMax : 0, // Utilise 0 si vitesseMax n'est pas défini
      idConducteur: appareil.idConducteur,
      firstNameConducteur: selcdriver.firstName || "",
      lastNameConducteur: selcdriver.lastName || "",
      emailConducteur: selcdriver.email || "",
      nomVoiture: appareil.VoitureNom || "",
      marqueVoiture: appareil.marque || "",
      modeleVoiture: appareil.Voituremodele || "",
      immatriculeVoiture: appareil.Voitureimmatricule || "",
      insuranceExpiryDate: appareil.insuranceExpiryDate.toString() || "",
      vignetteDeadline: appareil.vignetteDeadline.toString() || "",
      oilChangeDate: appareil.oilChangeDate.toString() || "",
      idCompany: appareil.idCompany || -1,
      speedAlertEnabled: appareil.speedAlertEnabled || false,
      fuelAlertEnabled: appareil.fuelAlertEnabled || false,
      hoodOpenAlertEnabled: appareil.hoodOpenAlertEnabled || false,
      deviceConnected: appareil.deviceConnected || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //console.log(values);

    let {
      nomAppareil,
      descriptionAppareil,
      actifAppareil,
      serverAppareil,
      imeiAppareil,
      sim1Appareil,
      sim2Appareil,
      smsEmailAppareil,
      vitesseMaxAppareil,
      idConducteur,
      firstNameConducteur,
      lastNameConducteur,
      emailConducteur,
      idCompany,
      nomVoiture,
      marqueVoiture,
      modeleVoiture,
      immatriculeVoiture,
      insuranceExpiryDate,
      vignetteDeadline,
      oilChangeDate,
    } = values;

    console.log(values);
  };

  return (
    <div className="">
      <Card className=" shadow-md">
        <div className="flex items-center mt-3 p-3 font-[600] text-2xl text-slate-800 dark:text-slate-200">
          <div className="bg-slate-200 rounded-[50%] flex justify-center items-center p-1 mr-2">
            <ArrowLeft
              className="  h-5 cursor-pointer w-6"
              onClick={() => router.push("/appareils")}
            />{" "}
          </div>
          <h1>Editer l&#39;appareil #{appareil.imei}</h1>
        </div>
        <CardHeader>
          <CardTitle className="text-xl">
            Informations de l&#39;appareil GPS
          </CardTitle>
          <CardDescription>
            Ajoutez une balise GPS en un clic pour un suivi de localisation
            facile et précis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=" ">
                <div className=" ">
                  <div className=" items-center p-3 w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3  gap-x-20 ">
                    <FormField
                      control={form.control}
                      name="nomAppareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom Appareil</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom Appareil"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serverAppareil"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Server Appareil </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="selectionnez un serveur " />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TELTONIKA_SERVER">
                                Teltonika
                              </SelectItem>
                              <SelectItem value="s1">S1</SelectItem>
                              <SelectItem value="s2">S2</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="descriptionAppareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Description"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actifAppareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Etat dC&#39;appareil</FormLabel>
                          <Select
                            defaultValue={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            } // Convertir la valeur en booléen
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="selectionnez l'état de appareil " />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Oui</SelectItem>
                              <SelectItem value="false">Non</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imeiAppareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMEI</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="3547*********"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sim1Appareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro SIM 1</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="066*********"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sim2Appareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro SIM 2 (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="066*********"
                              type="text"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smsEmailAppareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMS Email Adresse</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex@exemple.com"
                              type="text"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vitesseMaxAppareil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vitesse maximale</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="120"
                              type="number"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deviceConnected"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Etat de la connexion</FormLabel>
                          <div>
                            {field.value == true ? (
                              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Connecté
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Déconnecté
                              </span>
                            )}
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-12" />

                  <CardTitle className="text-xl mb-3">
                    {" "}
                    Informations de la voiture{" "}
                  </CardTitle>
                  <CardDescription className="mb-6">
                    Entrez les informations du conducteur pour assurer un suivi
                    précis des utilisateurs de lC&#39;appareil.
                  </CardDescription>
                  <div className=" items-center p-3 w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3  gap-x-20 ">
                    <FormField
                      control={form.control}
                      name="nomVoiture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom Voiture</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom  Voiture"
                              type="text"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marqueVoiture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>marque Voiture</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="marque voiture"
                              type="text"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modeleVoiture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modèle voiture</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Description"
                              type="text"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="immatriculeVoiture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Immatricule voiture</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="immatricule voiture"
                              type="text"
                              value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insuranceExpiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d&#39;expiration d&#39;assurance</FormLabel>{" "}
                          <br />
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal ",
                                    !dateInsuranceExpiryDate &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateInsuranceExpiryDate ? (
                                    // Utiliser la localisation française dans la fonction format
                                    format(dateInsuranceExpiryDate, "PPP", {
                                      locale: fr,
                                    })
                                  ) : (
                                    <span>choisir une date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateInsuranceExpiryDate}
                                  onSelect={(date) =>
                                    date && handleDateinsuranceExpiryDate(date)
                                  }
                                  initialFocus
                                  // S'assurer que le composant Calendar utilise également la locale française
                                  locale={fr} // Ajouter la locale ici si le composant prend en charge cette option
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vignetteDeadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de vignette</FormLabel> <br />
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal ",
                                    !dateVignetteDeadline &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateVignetteDeadline ? (
                                    format(dateVignetteDeadline, "PPP", {
                                      locale: fr,
                                    })
                                  ) : (
                                    <span>choisir une date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateVignetteDeadline}
                                  onSelect={(date) =>
                                    date && handleDateVignetteDeadline(date)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="oilChangeDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de vidange</FormLabel> <br />
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal ",
                                    !dateOilChangeDate &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateOilChangeDate ? (
                                    format(dateOilChangeDate, "PPP", {
                                      locale: fr,
                                    })
                                  ) : (
                                    <span>choisir une date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateOilChangeDate}
                                  onSelect={(date) =>
                                    date && handleDateOilChangeDate(date)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="speedAlertEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alerte de vitesse</FormLabel>
                          <Select
                            defaultValue={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le statut de l'alerte de vitesse" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Oui</SelectItem>
                              <SelectItem value="false">Non</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fuelAlertEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alerte de carburant</FormLabel>
                          <Select
                            defaultValue={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le statut de l'alerte de carburant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Oui</SelectItem>
                              <SelectItem value="false">Non</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hoodOpenAlertEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alerte d&#39;ouverture du capot</FormLabel>
                          <Select
                            defaultValue={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le statut de l'alerte du capot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Oui</SelectItem>
                              <SelectItem value="false">Non</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div></div>
                </div>
                <div className=" mt-10 grid grid-cols-1 items-center">
                  <Button className="mx-10" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppareilForm;

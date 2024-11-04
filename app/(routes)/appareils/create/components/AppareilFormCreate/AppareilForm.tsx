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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { formSchema } from "./AppareilForm.form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Combobox } from "@headlessui/react";

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
import { ArrowLeft, CheckIcon } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { addDevice } from "@/app/store/deviceSlise";
import { Device } from "../../../components/ListDevices/ListDevice.type";

import { fr, se } from "date-fns/locale"; // Importation de la locale française
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface Driver {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const AppareilForm = () => {
  const [isNewDriver, setIsNewDriver] = useState(false); // État pour le statut de nouveau conducteur
  const dispatch = useAppDispatch();
  const [dateInsuranceExpiryDate, setDateInsuranceExpiryDate] =
    React.useState<Date>();
  const [dateVignetteDeadline, setDateVignetteDeadline] =
    React.useState<Date>();
  const [dateOilChangeDate, setDateOilChangeDate] = React.useState<Date>();

  const router = useRouter();
  const handleSwitchChange = (checked: boolean) => {
    setIsNewDriver(checked);
  };

  const [companies, setCompanies] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputCompanyValue, setInputCompanyValue] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  // Fonction pour récupérer tous les conducteurs lors du chargement initial du composant
  useEffect(() => {
    axiosInstance
      .get("users/clients")
      .then((response) => {
        setDrivers(response.data); // Supposons que response.data est un tableau d'objets conducteur
        setFilteredDrivers(response.data); // Initialement, tous les conducteurs sont affichés
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des conducteurs :",
          error
        );
      });
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get(
          "company/getCompaniesBasicInfo"
        );
        console.log(response.data);
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
    };
    fetchCompanies();
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    const filtered = drivers.filter((driver) =>
      `${driver.firstName} ${driver.lastName}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  const handleCompanyInputChange = (value: string) => {
    setInputCompanyValue(value);

    const filtered = companies.filter((company) =>
      `${company.nameCompany}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleDriverSelect = async (driver: Driver) => {
    setSelectedDriver(driver);
    setInputValue(`${driver.firstName} ${driver.lastName}`);
    form.setValue("idConducteur", Number(driver.id)); // Set selected driver id in form
    form.setValue("firstNameConducteur", driver.firstName); // Set selected driver first name in form
    form.setValue("lastNameConducteur", driver.lastName); // Set selected driver last name in form
    form.setValue("emailConducteur", driver.email); // Set selected driver email in form
    // Force the form to re-validate
    // await form.trigger(); // Ensure this matches the API of your form library
  };

  const handleDeselect = () => {
    setSelectedDriver(null);
    setInputValue(""); // Réinitialiser l'input à une chaîne vide
    form.setValue("idConducteur", 10); // Réinitialiser l'ID du conducteur
    form.setValue("firstNameConducteur", ""); // Réinitialiser le prénom du conducteur
    form.setValue("lastNameConducteur", ""); // Réinitialiser le nom du conducteur
    form.setValue("emailConducteur", ""); // Réinitialiser l'email du conducteur
    setFilteredDrivers(drivers); // Réinitialiser les conducteurs filtrés
  };

  const handleCompanySelect = async (company: any) => {
    if (selectedCompany?.id === company.id) {
      // Si l'entreprise est déjà sélectionnée, désélectionnez-la
      setSelectedCompany(null);
      setInputCompanyValue("");
      form.setValue("idCompany", null);
    } else {
      // Sinon, sélectionnez l'entreprise
      setSelectedCompany(company);
      setInputCompanyValue(company.nameCompany);
      form.setValue("idCompany", company.id);
    }
  };

  const handleCompanyDeselect = () => {
    setSelectedCompany(null);
    setInputCompanyValue(""); // Réinitialiser l'input à une chaîne vide
    form.setValue("idCompany", null); // Réinitialiser l'ID de l'entreprise
    setFilteredCompanies(companies); // Réinitialiser les entreprises filtrées
  };

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idAppareil: 10,
      nomAppareil: "appareilTest",
      descriptionAppareil: "descriptionAppareilTest",
      actifAppareil: true,
      serverAppareil: "TELTONIKA_SERVER",
      imeiAppareil: "65684684684",
      sim1Appareil: "0687479525",
      sim2Appareil: "0687479525",
      smsEmailAppareil: "test@gmail.com",
      vitesseMaxAppareil: 50,

      speedAlertEnabled: false,
      fuelAlertEnabled: false,
      hoodOpenAlertEnabled: false,

      idConducteur: 10,
      firstNameConducteur: "",
      lastNameConducteur: "",
      emailConducteur: "",
      nomVoiture: "mercedesA859",
      marqueVoiture: "mercedes",
      modeleVoiture: "2015",
      immatriculeVoiture: "i896532",
      insuranceExpiryDate: new Date().toISOString(),
      vignetteDeadline: new Date().toISOString(),
      oilChangeDate: new Date().toISOString(),
      idCompany: null,
      deviceConnected: true,
    },
  });

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
      speedAlertEnabled,
      fuelAlertEnabled,
      hoodOpenAlertEnabled,

      idConducteur,
      firstNameConducteur,
      lastNameConducteur,
      emailConducteur,

      nomVoiture,
      marqueVoiture,
      modeleVoiture,
      immatriculeVoiture,
      insuranceExpiryDate,
      vignetteDeadline,
      oilChangeDate,
      idCompany,
      deviceConnected,
    } = values;
    let conducteurObject = null;
    try {
      if (isNewDriver) {
        // Créer un nouveau conducteur
        const response = await axiosInstance.post("users/clients", {
          firstName: firstNameConducteur,
          lastName: lastNameConducteur,
          email: emailConducteur,
          companyId: idCompany,
          role: "ROLE_USER",
        });
        console.log("response.data", response.data);
        conducteurObject = response.data.user;
        conducteurObject.id = response.data.user.id;
      } else {
        // Utiliser le conducteur sélectionné
        conducteurObject = drivers.find(
          (d) => d.id == idConducteur?.toString()
        );
        //conducteurObject.password = "password"; // Ajouter un mot de passe par défaut
        //console.log(conducteurObject)
      }

      // Créer un nouvel appareil
      const response = await axiosInstance.post("gpsDevices", {
        name: nomAppareil,
        description: descriptionAppareil,
        actif: actifAppareil,
        serverType: serverAppareil,
        imei: imeiAppareil,
        simNumber1: sim1Appareil,
        simNumber2: sim2Appareil,
        smsEmail: smsEmailAppareil,
        vitesseMax: vitesseMaxAppareil,

        userId: conducteurObject.id,

        voitureNom: nomVoiture,
        voitureModele: modeleVoiture,
        voitureMarque: marqueVoiture,
        voitureImmatricule: immatriculeVoiture,

        insuranceExpiryDate: insuranceExpiryDate,
        vignetteDeadline: vignetteDeadline,
        oilChangeDate: oilChangeDate,

        speedAlertEnabled,
        fuelAlertEnabled,
        hoodOpenAlertEnabled,
      });
      console.log("rep ", response.data);
      const newAppareil: Device = {
        id: response.data.id,
        nom: response.data.name,
        description: response.data.description,
        actif: response.data.actif,
        serverType: response.data.serverType,
        imei: response.data.imei,
        simNumber1: response.data.simNumber1,
        simNumber2: response.data.simNumber2,
        smsEmail: response.data.smsEmail,
        vitesseMax: response.data.vitesseMax,
        VoitureNom: response.data.VoitureNom,
        Voituremarque: response.data.Voituremarque,
        Voitureimmatricule: response.data.Voitureimmatricule,
        userId: response.data.userId,
        speedAlertEnabled: response.data.speedAlertEnabled,
        fuelAlertEnabled: response.data.fuelAlertEnabled,
        hoodOpenAlertEnabled: response.data.hoodOpenAlertEnabled,
        insuranceExpiryDate: response.data.insuranceExpiryDate,
        oilChangeDate: response.data.oilChangeDate,
        vignetteDeadline: response.data.vignetteDeadline,
      };
      dispatch(addDevice(newAppareil));

      router.push("/appareils");

      console.log(newAppareil);
    } catch (error: any) {
      console.error("Erreur lors de la création de l'appareil", error);

      toast({
        variant: "destructive",
        title:
          "Erreur lors de la création de l'appareil : \n" + error.response.data,
      });
    }
  };

  return (
    <div className="">
      <Card className=" shadow-md">
        <div className="flex items-center mt-3 p-3 font-[600] text-2xl text-slate-800 dark:text-slate-200">
          <ArrowLeft
            className="mr-2 w-5 h-5 cursor-pointer"
            onClick={() => router.push("/appareils")}
          />
          <h1>Créer un nouveau appareil</h1>
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
                          <FormLabel>Etat d&#39;appareil</FormLabel>
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
                  </div>

                  <Separator className="my-12" />
                  <CardTitle className="text-xl mb-3">
                    Informations du conducteur
                  </CardTitle>

                  <motion.div
                    key={isNewDriver ? "new-driver-form" : "command-component"}
                    initial={{ opacity: 0, y: isNewDriver ? -20 : -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: isNewDriver ? -20 : 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {drivers.length > 0 ? ( // Si des conducteurs existent, on affiche le switch et la sélection du conducteur
                      <>
                        <div>
                          <div className=" w-full md:w-1/2  mb-5">
                            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                              <div className="space-y-0.5">
                                <CardDescription className="">
                                  Cocher si C&#39;est un nouveau conducteur
                                </CardDescription>
                              </div>
                              <Switch
                                checked={isNewDriver}
                                onCheckedChange={handleSwitchChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 mb-5 justify-center gap-x-10">
                          {/* Switch pour indiquer s'il s'agit d'un nouveau conducteur */}

                          {/* Si ce n'est pas un nouveau conducteur */}
                          {!isNewDriver ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 mb-5 justify-between gap-x-10">
                              <div className="grid grid-cols-1 gap-y-3">
                                <Command>
                                  <div className="">
                                    <CommandInput
                                      placeholder="Entrez le nom du conducteur..."
                                      value={inputValue}
                                      onValueChange={handleInputChange}
                                    />
                                  </div>

                                  <FormField
                                    control={form.control}
                                    name="idConducteur"
                                    render={() => (
                                      <FormItem>
                                        <FormMessage className="mt-2 mb-3" />
                                      </FormItem>
                                    )}
                                  />

                                  <CommandList>
                                    <CommandEmpty>
                                      Aucun conducteur trouvé.
                                    </CommandEmpty>
                                    <CommandGroup heading="Suggestions">
                                      {filteredDrivers.map((driver) => (
                                        <CommandItem
                                          key={driver.email}
                                          onSelect={() =>
                                            handleDriverSelect(driver)
                                          }
                                        >
                                          {driver.firstName} {driver.lastName}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>

                                  {selectedDriver && (
                                    <div className="mt-3">
                                      <Button
                                        onClick={handleDeselect}
                                        variant="outline"
                                      >
                                        Désélectionner
                                      </Button>
                                    </div>
                                  )}
                                </Command>
                              </div>

                              <div>
                                <Card className="w-full mt-5 md:mt-0 border-1 md:border-l-2 shadow-sm md:shadow-none md:rounded-none">
                                  <CardHeader>
                                    <CardDescription className="text-center">
                                      Information du conducteur choisi
                                    </CardDescription>
                                  </CardHeader>

                                  <CardContent>
                                    <FormField
                                      control={form.control}
                                      name="firstNameConducteur"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Nom Conducteur</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Nom conducteur"
                                              type="text"
                                              {...field}
                                              readOnly
                                              className="outline-none opacity-50 focus:ring-0 focus:border-transparent"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="lastNameConducteur"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Prénom Conducteur
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Prénom conducteur"
                                              type="text"
                                              {...field}
                                              readOnly
                                              className="outline-none opacity-50 focus:ring-0 focus:border-transparent"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="emailConducteur"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Email conducteur
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Description"
                                              type="text"
                                              {...field}
                                              readOnly
                                              className="outline-none opacity-50 focus:ring-0 focus:border-transparent"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          ) : (
                            // Formulaire pour ajouter un nouveau conducteur
                            <div>
                              <CardDescription className="mb-6 mt-5">
                                Entrez les informations du conducteur pour
                                assurer un suivi précis des utilisateurs de
                                l&#39;appareil.
                              </CardDescription>

                              <div className=" md:h-96 p-3 w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 gap-x-20">
                                <div>
                                  <FormField
                                    control={form.control}
                                    name="firstNameConducteur"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Nom Conducteur</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Nom conducteur"
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
                                    name="lastNameConducteur"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Prénom Conducteur</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Prénom conducteur"
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
                                    name="emailConducteur"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email conducteur</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Email conducteur"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <Command>
                                  <div>
                                    <FormLabel>Nom d&#39;entreprise</FormLabel>
                                    <CommandInput
                                      placeholder="Entrez le nom d'entreprise..."
                                      value={inputCompanyValue}
                                      onValueChange={handleCompanyInputChange}
                                    />
                                  </div>

                                  <FormField
                                    control={form.control}
                                    name="idCompany"
                                    render={() => (
                                      <FormItem>
                                        <FormMessage className="mt-2 mb-3" />
                                      </FormItem>
                                    )}
                                  />

                                  {/* Ajout de hauteur fixe et du défilement */}
                                  <CommandList className="md:max-h-56 overflow-y-auto">
                                    <CommandEmpty>
                                      Aucun conducteur trouvé.
                                    </CommandEmpty>

                                    <CommandGroup heading="Suggestions">
                                      {filteredCompanies.map((company: any) => (
                                        <CommandItem
                                          key={company.id}
                                          onSelect={() =>
                                            handleCompanySelect(company)
                                          }
                                          className={`flex justify-between items-center ${
                                            selectedCompany?.id === company.id
                                              ? "bg-gray-200" // Changer le fond pour l'entreprise sélectionnée
                                              : ""
                                          }`}
                                        >
                                          {company.nameCompany}
                                          {selectedCompany?.id ===
                                            company.id && (
                                            <CheckIcon className="w-4 h-4 text-green-500" />
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  className=""
                                  onClick={() => {
                                    router.push("/companies/create");
                                  }}
                                >
                                  Ajouter une Company ?
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      // Si aucun conducteur n'existe, afficher directement le formulaire
                      <div>
                        <CardDescription className="mb-6 mt-5">
                          Veuillez ajouter un nouveau conducteur.
                        </CardDescription>
                        <div className="items-center p-3 w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 gap-x-20">
                          <FormField
                            control={form.control}
                            name="firstNameConducteur"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom Conducteur</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nom conducteur"
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
                            name="lastNameConducteur"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom Conducteur</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Prénom conducteur"
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
                            name="emailConducteur"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email conducteur</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Email conducteur"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <Separator className="mb-12 mt-6" />

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

"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { addDevice } from "@/app/store/deviceSlise";
import { Device } from "../../../components/ListDevices/ListDevice.type";
import { fr, id } from "date-fns/locale"; // Importation de la locale française
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { BaseSelectWithFetch } from "@/app/components/base/BaseSelectWithFitch";
import { AppareilInformationProps } from "./AppareilForm.types";

const formSchema = z.object({
  id: z.string(),
  userId: z.string().min(1, "Client is required"),
  name: z
    .string()
    .min(1, "Nom Appareil is required")
    .max(50, "Le nom de l'appareil ne doit pas dépasser 50 caractères."),
  description: z
    .string()
    .max(
      255,
      "La description de l'appareil ne doit pas dépasser 255 caractères."
    ),
  actif: z.boolean(),
  serverType: z.string(),
  imei: z.string().min(8, "IMEI is required and must be 8 characters"),
  simNumber1: z
    .string()
    .min(6, "La carte SIM1 de l'appareil doit contenir au moins 6 caractères.")
    .refine((val) => /^\d{6,15}$/.test(val), {
      message: "Le numéro de SIM1 doit contenir entre 6 et 15 chiffres.",
    }),
  vitesseMax: z.string().optional(),
  speedAlertEnabled: z.boolean(),
  fuelAlertEnabled: z.boolean(),
  hoodOpenAlertEnabled: z.boolean(),
  voitureNom: z.string(),
  voitureMarque: z.string(),
  voitureModele: z.string(),
  voitureImmatricule: z.string(),
  insuranceExpiryDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          const date = val ? new Date(val) : new Date();
          return !isNaN(date.getTime());
        }
        return false;
      },
      {
        message:
          "La date d'expiration de l'assurance doit être une date valide.",
      }
    ), // Use date
  vignetteDeadline: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          const date = val ? new Date(val) : new Date();
          return !isNaN(date.getTime());
        }
        return false;
      },
      {
        message:
          "La date d'expiration de l'assurance doit être une date valide.",
      }
    ),
  oilChangeDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          const date = val ? new Date(val) : new Date();
          return !isNaN(date.getTime());
        }
        return false;
      },
      {
        message:
          "La date d'expiration de l'assurance doit être une date valide.",
      }
    ),
});

const AppareilForm = (props: AppareilInformationProps) => {
  
  let form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props?.appareil?.id.toString() ?? "",
      userId: props?.appareil?.idConducteur?.toString(),
      name: props?.appareil?.nom ?? "",
      description: props?.appareil?.description,
      actif: props?.appareil?.actif,
      serverType: props?.appareil?.serverType,
      imei: props?.appareil?.imei,
      simNumber1: props?.appareil?.simNumber1,
      vitesseMax: props?.appareil?.vitesseMax.toString() ?? "",
      speedAlertEnabled: props?.appareil?.speedAlertEnabled,
      fuelAlertEnabled: props?.appareil?.fuelAlertEnabled,
      hoodOpenAlertEnabled: props?.appareil?.hoodOpenAlertEnabled,
      voitureNom: props?.appareil?.VoitureNom,
      voitureMarque: props?.appareil?.Voituremarque ?? "",
      voitureModele: props?.appareil?.Voituremodele ?? "",
      voitureImmatricule: props?.appareil?.Voitureimmatricule,
      insuranceExpiryDate:
        props?.appareil?.insuranceExpiryDate.toString() ?? "",
      vignetteDeadline: props?.appareil?.vignetteDeadline.toString() ?? "",
      oilChangeDate: props?.appareil?.oilChangeDate.toString() ?? "",
    },
  });

  const [client, setClient] = useState(props?.appareil?.idConducteur?.toString());
  const dispatch = useAppDispatch();
  const [dateinsuranceExpiryDate, setDateinsuranceExpiryDate] =
    React.useState<Date>();
  const [datevignetteDeadline, setDatevignetteDeadline] =
    React.useState<Date>();
  const [dateoilChangeDate, setDateoilChangeDate] = React.useState<Date>();
  const router = useRouter();

  const handleDateinsuranceExpiryDate = (date: Date) => {
    setDateinsuranceExpiryDate(date);
    form.setValue("insuranceExpiryDate", date.toISOString());
    console.log(form.getValues());
  };

  const handleDatevignetteDeadline = (date: Date) => {
    setDatevignetteDeadline(date);
    form.setValue("vignetteDeadline", date.toISOString());
    console.log(form.getValues());
  };

  const handleDateoilChangeDate = (date: Date) => {
    setDateoilChangeDate(date);
    form.setValue("oilChangeDate", date.toISOString());
    console.log(form.getValues());
  };

  const choisirClient = (client: any) => {
    setClient(client);

    if (!client) {
      form.setValue("userId", "");
    } else {
      form.setValue("userId", client);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.patch(`gpsDevices/${values.id}`, values);
       router.push("/appareils");
    } catch (error: any) {
      console.error("Erreur lors de la modification de l'appareil", error);
      toast({
        variant: "destructive",
        title:
          "Erreur lors de la modification de l'appareil : \n" + error.response.data,
      });
    }
  };

  return (
    <div className=" shadow-md bg-white  rounded">
      <div className="flex items-center justify-between p-3 border-b">
        <h1 className="mr-2 p-2 text-md font-semibold">
          Modifier les informations de l'appareil
        </h1>
        <div>
          <button
            onClick={() => form.handleSubmit(onSubmit)()}
            className=" bg-primary rounded mr-2  !pl-8 pr-8 pt-2 pb-2  text-white"
          >
            <span className="">Modifier</span>
          </button>

          <button
            onClick={() => router.push("/appareils")}
            className=" bg-gray-200 rounded mr-2 !pl-8 pr-8 pt-2 pb-2 "
          >
            <span className="">Annuler</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className=" ">
              <div className=" ">
                <div className=" items-center mx-auto grid grid-cols-1 md:grid-cols-2 gap-3  gap-x-20 ">
                  <div>
                    <BaseSelectWithFetch
                      label="Client"
                      placeholder="Sélectionnez un client"
                      setValue={choisirClient}
                      value={client}
                      labelOption="firstName"
                      valueOption="id"
                      fetchUrl="users/clients"
                    />
                    {form.formState.errors.userId && (
                      <p className="text-red-500">
                        {form.formState.errors.userId.message}
                      </p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
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
                    name="serverType"
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="actif"
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
                    name="imei"
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
                    name="simNumber1"
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
                    name="vitesseMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vitesse maximale</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="120"
                            type="string"
                            value={field.value ?? ""} // Assure que la valeur soit toujours une chaîne
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            min={50}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="mb-6 mt-6" />
                <CardTitle className="text-sm mb-3">
                  Informations de la voiture
                </CardTitle>

                <div className=" items-center  mx-auto grid grid-cols-1 md:grid-cols-2 gap-3  gap-x-20 ">
                  <FormField
                    control={form.control}
                    name="voitureNom"
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
                    name="voitureMarque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marque Voiture</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Marque voiture"
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
                    name="voitureModele"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modèle voiture</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Modèle"
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
                    name="voitureImmatricule"
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
                        <FormLabel>
                          Date d&#39;expiration d&#39;assurance
                        </FormLabel>{" "}
                        <br />
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal ",
                                  !dateinsuranceExpiryDate &&
                                    "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateinsuranceExpiryDate ? (
                                  // Utiliser la localisation française dans la fonction format
                                  format(dateinsuranceExpiryDate, "PPP", {
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
                                selected={dateinsuranceExpiryDate}
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
                                  !datevignetteDeadline &&
                                    "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {datevignetteDeadline ? (
                                  format(datevignetteDeadline, "PPP", {
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
                                selected={datevignetteDeadline}
                                onSelect={(date) =>
                                  date && handleDatevignetteDeadline(date)
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
                                  !dateoilChangeDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateoilChangeDate ? (
                                  format(dateoilChangeDate, "PPP", {
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
                                selected={dateoilChangeDate}
                                onSelect={(date) =>
                                  date && handleDateoilChangeDate(date)
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AppareilForm;

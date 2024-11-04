"use client";
import React, { use, useEffect, useState } from "react";
import { AutomobileFormProps } from "./AutomobileForm.types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./AutomobileForm.form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { User } from "../AutomobileInformation/AutomobileInformation.types";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { modifyVoiture } from "@/app/store/VoitureSlice";
import { useAppDispatch } from "@/app/store/hooks";

const AutomobileForm = (props: AutomobileFormProps) => {
  const { voiture } = props;
  const router = useRouter();
  const [conducteurs, setConducteurs] = useState<User[]>([]);
  const dispatch = useAppDispatch();
  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: voiture.nom,
      model: voiture.modele,
      marque: voiture.marque,
      immatricule: voiture.immatricule,
      conducteur:
        voiture.user && voiture.user.firstName && voiture.user.lastName
          ? voiture.user.firstName + " " + voiture.user.lastName
          : "Pas de conducteur",
      idConducteur: voiture.user ? voiture.user.id.toString() : " ",
    },
  });

  useEffect(() => {
    const fetchConducteurs = async () => {
      const response = await axios.get("http://localhost:8080/api/v1/users");
      setConducteurs(response.data);
    };
    fetchConducteurs();
  }, []);

  useEffect(() => {}, [conducteurs]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { nom, model, marque, immatricule, conducteur, idConducteur } =
        values;
      var conducteurObject = null;
      if (idConducteur !== " ") {
        conducteurObject = conducteurs.find(
          (c) => c.id === parseInt(idConducteur)
        );
      }

      const rep = await axios.patch(
        "http://localhost:8080/api/v1/voitures/" + voiture.id,
        {
          nom,
          modele: model,
          marque,
          immatricule,
          user: conducteurObject,
        }
      );
      toast({
        title: "Automobile est mise à jour!",
      });

      dispatch(
        modifyVoiture({
          id: voiture.id,
          nom: rep.data.nom,
          modele: rep.data.modele,
          marque: rep.data.marque,
          immatricule: rep.data.immatricule,
          conducteur: rep.data.user
            ? rep.data.user.firstName + " " + rep.data.user.lastName
            : "Pas de conducteur",
          idConducteur: rep.data.user ? rep.data.user.id : -1,
        })
      );

      router.push("/automobiles");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour de l'automobile",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom Voiture</FormLabel>
                <FormControl>
                  <Input placeholder="Nom voiture" type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idConducteur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conducteur</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un conducteur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=" ">Pas de conducteur</SelectItem>
                    {conducteurs.map((conducteur) => (
                      <SelectItem
                        key={conducteur.id}
                        value={conducteur.id.toString()}
                      >
                        {conducteur.firstName} {conducteur.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marque"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <FormControl>
                  <Input placeholder="2007" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modele</FormLabel>
                <FormControl>
                  <Input placeholder="2007" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="immatricule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immatricule</FormLabel>
                <FormControl>
                  <Input placeholder="+212 6555555" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Editer Automobile</Button>
      </form>
    </Form>
  );
};

export default AutomobileForm;

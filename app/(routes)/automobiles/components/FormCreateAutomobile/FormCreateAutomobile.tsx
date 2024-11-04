"use client";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { FormCreateAutomobileProps, User } from "./FormCreateAutomobile.type";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutomobileContext } from "../Context/AutomobileContext";
import { useAppDispatch } from "@/app/store/hooks";
import { addVoiture } from "@/app/store/VoitureSlice";

const formSchema = z.object({
  nom: z.string().min(2).max(50),
  model: z.string().min(2),
  marque: z.string().min(6),
  immatricule: z.string().min(6),
  conducteur: z.string().min(1),
});

const FormCreateAutomobile = (props: FormCreateAutomobileProps) => {
  const { setOPenModalCreate } = props;
  const router = useRouter();
  const [conducteurs, setConducteurs] = useState<User[]>([]);
  //const { setVoitures } = useAutomobileContext();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchConducteurs = async () => {
      const response = await axios.get("http://localhost:8080/api/v1/users");
      setConducteurs(response.data);
    };
    fetchConducteurs();
  }, []);

  useEffect(() => {}, [conducteurs]);

  // 1.   // Initialize the form using useForm hook with zodResolver for validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      model: "",
      marque: "",
      immatricule: "",
      conducteur: "",
    },
  });

  const { isValid } = form.formState;

  // Define the submit handler for the form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { nom, model, marque, immatricule, conducteur } = values;
    console.log(values);
    var conducteurObject = null;

    if (conducteur !== " ") {
      conducteurObject = conducteurs.find(
        (conducteur) => conducteur.id === parseInt(values.conducteur)
      );
    }
    console.log("conducteurObject", conducteurObject);
    try {
      var response = await axios.post("http://localhost:8080/api/v1/voitures", {
        nom,
        marque,
        modele: model,
        immatricule,
        user: conducteurObject,
      });

      console.log(response);
      toast({
        title: "Automobile créé avec succès",
      });

      const newVoiture = {
        id: response.data.id,
        nom: response.data.nom,
        marque: response.data.marque,
        modele: response.data.modele,
        immatricule: response.data.immatricule,
        conducteur:
          response.data.user.firstName + " " + response.data.user.lastName,
        idConducteur: response.data.user.id,
      };

      dispatch(addVoiture(newVoiture));
      /* // Fetch updated list of voitures
      response = await axios.get("http://localhost:8080/api/v1/voitures");
      const fetchedVoitures = response.data.map((voiture: any) => ({
        id: voiture.id,
        nom: voiture.nom,
        marque: voiture.marque,
        modele: voiture.modele,
        immatricule: voiture.immatricule,
        conducteur: voiture.user.firstName + " " + voiture.user.lastName,
        idConducteur: voiture.user.id,
      }));
      console.log(response.data);
      setVoitures(fetchedVoitures);
*/

      setOPenModalCreate(false);
    } catch (error) {
      toast({
        title: "Something went wrong", // Show error toast notification
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-3">
            {/* Form field for  name */}
            <FormField
              control={form.control}
              name="nom"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Nom Voiture</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="nom voiture..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Form field for marque name */}
            <FormField
              control={form.control}
              name="marque"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Marque Voiture</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="marque voiture..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form field for immatricule */}
            <FormField
              control={form.control}
              name="immatricule"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Immatricule</FormLabel>
                  <FormControl>
                    <Input placeholder="B-1234567" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Form field for website */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Model Voiture</FormLabel>
                  <FormControl>
                    <Input placeholder="2007" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Form field for country */}
            <FormField
              control={form.control}
              name="conducteur"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Conducteur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value} // Set the default value of the select input
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le conducteur" />
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
          </div>
          <Button type="submit" disabled={!isValid}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormCreateAutomobile;

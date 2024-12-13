"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/app/store/hooks";
import { addCompany } from "@/app/store/companySlice";
import { Company } from "../components/companie.types";
import { formSchema } from "./Companyform.form";
import axiosInstance from "@/lib/axiosInstance";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

const CompanyForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      admin_first_name: "",
      admin_last_name: "",
      admin_email: "",
      adress: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        nameCompany: values.name,
        address: values.adress,
        phone: values.phone,
        adminFirstName: values.admin_first_name,
        adminLastName: values.admin_last_name,
        adminEmail: values.admin_email,
        password: values.password,
      };
      await axiosInstance.post(`company`, data);
      dispatch(addCompany(values as Company));
      toast({ title: "Entreprise créée avec succès !" });
      router.push("/companies");
    } catch (error) {
      toast({
        title: "Erreur lors de la création",
        description: "Réessayez plus tard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center mb-2">
            <ArrowLeft
              className="mr-2 h-5 w-5 cursor-pointer"
              onClick={() => router.push("/companies")}
            />
            <CardTitle className="text-2xl font-bold">Créer une entreprise</CardTitle>
          </div>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer une nouvelle entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                   <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+212 6555555" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom de l'Admin</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'Admin</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de l'Admin</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input placeholder="Mot de passe" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <motion.div
                className="pt-4"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button type="submit" className="w-full">
                  Créer l'entreprise
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyForm;


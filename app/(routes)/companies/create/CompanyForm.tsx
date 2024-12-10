"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
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
import axios from "axios";
import { formSchema } from "./Companyform.form";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { addCompany, setCompanies } from "@/app/store/companySlice";
import { Company } from "../components/list/ListCompanies.types";
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
      };
      await axiosInstance.post(`company`, data);
      dispatch(addCompany(values as Company));
      toast({ title: "Entreprise créée avec succès !" });
      router.push("/companies");
    } catch (error) {
      toast({
        title: "Erreur lors de la création",
        description: "Réessayez plus tard",
      });
    }
  };

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-8 bg-white shadow-xl rounded-lg w-[70%] mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          Créer une entreprise
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Nom de l’entreprise
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de l’entreprise"
                      className="transition-colors focus:border-blue-500"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700 font-medium">
                    Adresse
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Adresse de l’entreprise"
                      className="transition-colors focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="admin_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Prénom de l’Admin
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom"
                      className="transition-colors focus:border-blue-500"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700 font-medium">
                    Nom de l’Admin
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom"
                      className="transition-colors focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="admin_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email de l’Admin
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      type="email"
                      className="transition-colors focus:border-blue-500"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700 font-medium">
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+212 6555555"
                      className="transition-colors focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full mt-8  text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Créer l&#39;entreprise
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default CompanyForm;

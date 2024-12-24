"use client"
import React, { useEffect } from "react";
import { UtilisateurProp } from "./utilisateurId.types";
import axiosInstance from "@/lib/axiosInstance";
import { useForm } from "react-hook-form";
import { formSchema } from "./clientInformation.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/app/store/hooks";
import { modifyClient } from "@/app/store/clientsSlice";

const ClientInformations = (props: { utilisateur: UtilisateurProp }) => {
  const dispatch = useAppDispatch();

  const { utilisateur } = props;
  const router = useRouter();
  console.log(utilisateur);
  const [companies, setCompanies] = React.useState<any | null>(null);
  let company = null;
  if (companies !== null && utilisateur.companyId !== null) {
    company = companies.find((c: any) => c.id === utilisateur.companyId);
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      let companies = await axiosInstance.get("company/getCompaniesBasicInfo");
      setCompanies(companies.data);
      //console.log(companies.data)
    };
    fetchCompanies();
  }, []);

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: utilisateur.id,
      firstName: utilisateur.firstName,
      lastName: utilisateur.lastName,
      email: utilisateur.email,
      role: utilisateur.role,
      companyId: utilisateur.companyId?.toString(),
      companyName: company ? company.name : null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let { id, firstName, lastName, email, role, companyId } = values;

    try {
      await axiosInstance.put(`users/${id}`, {
        firstName,
        lastName,
        email,
        role,
        companyId,
        password: null,
      });
      toast({
        title: "Utilisateur modifié avec succès",
        
      })
      // dispatch(modifyClient({
      //   id: id as number,
      //   firstName: firstName,
      //   lastName: lastName,
      //   email: email,
      //   companyId: companyId as string,
      //   role: role,
      //   companyName: company ? company.name : null,
      // }));
      router.push("/utilisateurs");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    router.back();
  }


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <Card className="w-full  ">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Modifier les informations de l&#39;utilisateur
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Veuillez mettre à jour les informations de l&#39;utilisateur
                ci-dessous.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Prénom */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nom */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rôle */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rôle</SelectLabel>
                          <SelectItem value="ROLE_GENERAL_ADMIN">
                            Administrateur général
                          </SelectItem>
                          {utilisateur.companyId !== null && (
                            <SelectItem value="ROLE_COMPANY_ADMIN">
                              Administrateur Company
                            </SelectItem>
                          )}
                          <SelectItem value="ROLE_USER">
                            Utilisateur Normal
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entreprise */}
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Entreprise</SelectLabel>
                          {companies &&
                            companies.map(
                              (company: {
                                id: React.Key | null | undefined;
                                nameCompany: string | null | undefined;
                              }) => (
                                <SelectItem
                                  key={company.id}
                                  value={company.id?.toString() || ""}
                                >
                                  {company.nameCompany}
                                </SelectItem>
                              )
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancel}> Annuler</Button>
              <Button type="submit">Modifier l&#39;utilisateur</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
export default  ClientInformations;

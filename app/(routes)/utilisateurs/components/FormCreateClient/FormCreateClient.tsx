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
import { FormCreateClientProps } from "./FormCreateClient.type";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { addClient } from "@/app/store/clientsSlice";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  password: z.string().min(6),
  email: z.string().min(6),
  companyId: z.string().nullable(),
});

const FormCreateAutomobile = (props: FormCreateClientProps) => {
  const { setOPenModalCreate } = props;
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get(
          "company/getCompaniesBasicInfo"
        );
        console.log(response.data);
        setCompanies(response.data);
      } catch (error) {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
    };
    fetchCompanies();
  }, []);

  // 1.   // Initialize the form using useForm hook with zodResolver for validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyId: "",
      password: "",
    },
  });

  const { isValid } = form.formState;

  // Define the submit handler for the form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    let { firstName, lastName, email, companyId } = values;
    const parsedCompanyId = parseInt(companyId as string);
    try {
      const response = await axiosInstance.post("users/clients", {
        firstName,
        lastName,
        email,
        companyId: parsedCompanyId,
      });
      console.log(response.data);
      toast({
        title: "Clients créé avec succès",
      });
      dispatch(
        addClient({
          id: response.data.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          companyId: companyId as string,
          role: response.data.role,
          companyName: response.data.companyName,
        })
      );
      router.refresh();
      setOPenModalCreate(false);
    } catch (error) {
      toast({
        title: "Something went wrong", // Show error toast notification
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3 ">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Nom CLient</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel> Mot de passe</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Mot de passe" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyId"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Entreprise </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  // Set the default value of the select input
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner une entreprise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Entreprise</SelectLabel>
                      {companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.nameCompany}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-3 w-full" type="submit" disabled={!isValid}>
          Créer
        </Button>
      </form>
    </Form>
  );
};

export default FormCreateAutomobile;

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
import { selectUser } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  password: z.string().min(6),
  email: z.string().min(6),
  identifiant: z.string().min(2).max(255),
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
          "users/clients"
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
      password: "",
      identifiant: ""
    },
  });

  const { isValid } = form.formState;

  // Define the submit handler for the form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    let { firstName, lastName, email,password , identifiant } = values;

    try {
      const response = await axiosInstance.post("users/clients", {
        firstName,
        lastName,
        email,
        identifiant,
        password
      });
      console.log(response.data);
      toast({
        title: "Clients créé avec succès",
      });
      dispatch(
        addClient({
          id: response.data.id,
          firstName: firstName,
          identifiant: identifiant,
          lastName: lastName,
          email: email,
          password: password,
          role: response.data.role,
          companyName: response.data.companyName,
          companyId: response.data.companyId,
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

  const user = useSelector(selectUser);


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
            name="identifiant"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Username" type="text" {...field} />
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

        </div>
        <Button className="mt-3 w-full" type="submit" disabled={!isValid}>
          Créer
        </Button>
      </form>
    </Form>
  );
};

export default FormCreateAutomobile;

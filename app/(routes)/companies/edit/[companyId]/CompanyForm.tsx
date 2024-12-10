"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { modifyCompany } from "@/app/store/companySlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formSchema } from "../../create/Companyform.form";
import {  ChevronLeft } from "lucide-react";
import { Company } from "../../components/list/ListCompanies.types";
import { CompanyFormProps } from "./Companyform.types";

const CompanyForm = (props: CompanyFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { company } = props;
  console.log("company", company);
  // Form setup using react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company.name,
      admin_first_name: company.admin_first_name,
      admin_last_name: company.admin_last_name,
      admin_email: company.admin_email,
      adress: company.adress,
      phone: company.phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        nameCompany: values.name,
        address: values.adress,
        phone: values.phone,
        adminId: company.admin_id,
        adminFirstName: values.admin_first_name,
        adminLastName: values.admin_last_name,
        adminEmail: values.admin_email,
      };

      if (company?.id) {
        // If company ID exists, update the company
        await axiosInstance.put(`company/${company.id}`, data);

        let c: Company = {
          id: company.id,
          name: values.name,
          adress: values.adress,
          phone: values.phone,
          admin_id: company.admin_id,
          admin_first_name: values.admin_first_name,
          admin_last_name: values.admin_last_name,
          admin_email: values.admin_email,
        };

        dispatch(modifyCompany(c));
        toast({ title: "Entreprise mise à jour avec succès !" });
      }
      router.push("/companies");
    } catch (error) {
      toast({
        title: "Erreur lors de l'opération",
        description: "Réessayez plus tard",
      });
    }
  };

  return (
    <Card className="w-[100%]  shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <div className="flex items-center font-semibold text-lg">
            <ChevronLeft
              className="mr-2 w-5 h-5 cursor-pointer hover:text-gray-700 transition ease-in-out duration-150"
              onClick={() => router.push("/companies")}
              strokeWidth={5}
            />
            <div>Editer entreprise</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l’entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="X Sarl" {...field} />
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
                      <Input placeholder="123 rue Exemple, Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="admin_first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom de l’Admin</FormLabel>
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
                    <FormLabel>Nom de l’Admin</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
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
                name="admin_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de l’Admin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          Modifier l&apos;entreprise
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyForm;

"use client"; // Indicates that this file is a client-side component in Next.js
import axios from "axios"; // Importing axios for making HTTP requests
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for form validation
import { useForm } from "react-hook-form"; // Importing useForm hook from react-hook-form
import { z } from "zod"; // Importing zod for schema validation
import { Button } from "@/components/ui/button"; // Importing Button component
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Importing form-related components
import { Input } from "@/components/ui/input"; // Importing Input component
import { FormCreateCustomerProps } from "./FormCreateCustomer.types"; // Importing type definitions for props
import { useState } from "react"; // Importing useState hook from React
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"; // Importing Select components
import { UploadButton } from "@uploadthing/react"; // Importing UploadButton component
import { toast } from "@/components/ui/use-toast"; // Importing toast for notifications
import { useRouter } from "next/navigation"; // Importing useRouter hook for navigation

// Define the schema for form validation using zod
const formSchema = z.object({
  name: z.string().min(2).max(50),
  country: z.string().min(2),
  website: z.string().min(2),
  phone: z.string().min(6),
  cif: z.string().min(6),
  profileImage: z.string(),
});

// Define the FormCreateCustomer component
const FormCreateCustomer = (props: FormCreateCustomerProps) => {
  const { setOPenModalCreate } = props; // Destructure setOPenModalCreate from props
  const [photoUploaded, setPhotoUploaded] = useState(false); // State to track if photo is uploaded
  const router = useRouter(); // Initialize router for navigation

  // Initialize the form using useForm hook with zodResolver for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      website: "",
      cif: "",
      profileImage: "",
    },
  });

  const { isValid } = form.formState; // Destructure isValid from form state

  // Define the submit handler for the form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values); // Log form values to the console

    try {
      await axios.post("/api/company", values); // Make a POST request to create a company
      toast({
        title: "Company created", // Show success toast notification
      });
      router.refresh(); // Refresh the page
      setOPenModalCreate(false); // Close the modal
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
            {/* Form field for company name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company name..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form field for country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="spain">Espana</SelectItem>
                      <SelectItem value="united-kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="portugal">Portugal</SelectItem>
                      <SelectItem value="gracia">Gracia</SelectItem>
                      <SelectItem value="italia">Italia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form field for website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="www.example.com..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form field for phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+212 665 55 55"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form field for CIF */}
            <FormField
              control={form.control}
              name="cif"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>CIF</FormLabel>
                  <FormControl>
                    <Input placeholder="B-1234567" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
          </div>
          <Button type="submit" disabled={!isValid}>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default FormCreateCustomer; // Export the component as default
"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyFormProps } from "./Companyform.types";

const CompanyView = (props: CompanyFormProps) => {
  const router = useRouter();
  const { company } = props;
  console.log("my company", company);
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-lg transition ease-in-out duration-200 dark:bg-gray-800 dark:text-gray-200">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-xl font-semibold dark:text-white">Détails de l&apos;entreprise</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-gray-600 font-medium dark:text-gray-400">Nom de l’entreprise:</span>
          <span className="text-black dark:text-gray-200">{company.name}</span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-gray-600 font-medium dark:text-gray-400">Adresse:</span>
          <span className="text-black dark:text-gray-200">{company.adress}</span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-gray-600 font-medium dark:text-gray-400">Téléphone:</span>
          <span className="text-black dark:text-gray-200">{company.phone}</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
            <span className="text-gray-600 font-medium dark:text-gray-400">Prénom de l’Admin:</span>
            <span className="text-black dark:text-gray-200">{company.admin_first_name}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-gray-600 font-medium dark:text-gray-400">Nom de l’Admin:</span>
            <span className="text-black dark:text-gray-200">{company.admin_last_name}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-gray-600 font-medium dark:text-gray-400">Email de l’Admin:</span>
          <span className="text-black dark:text-gray-200">{company.admin_email}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center py-4">
        <button
          onClick={() => router.push("/companies")}
          className="px-6 py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Retour à la liste des entreprises
        </button>
      </CardFooter>
    </Card>
  );
};

export default CompanyView;

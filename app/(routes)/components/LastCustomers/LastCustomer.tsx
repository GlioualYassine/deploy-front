import { Building } from "lucide-react";
import CustomIcon from "../../../../components/CustomIcon/CustomIcon";
import CustomersTable from "../CustomersTable/CustomersTable";

interface LastCustomerProps {
  lastCustomers: {
    id: string;
    status: string;
    email: string;
    clientName: string;
    clientId: number;
    amount: number;
  }[];
}

const LastCustomer = ({ lastCustomers }: LastCustomerProps) => {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
      <div className="flex gap-x-2 items-center mb-4">
        <CustomIcon icon={Building} />
        <p className="text-xl">Dernières Transactions</p>
      </div>
      <CustomersTable data={lastCustomers} />
    </div>
  );
};

export default LastCustomer;

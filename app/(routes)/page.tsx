import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
export default function Home() {
  // Redirect to /dashboard

  redirect("/dashboard");

  return (
    <div className="flex justify-center items-center h-screen w-full ">
      <Loader2 className="h-4 w-4 animate-spin text-gray-400 mr-2" />
      <span className="text-gray-400">Loading...</span>
    </div>
  );
}

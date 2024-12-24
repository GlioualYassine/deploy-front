"use client";

import { Button } from "@/components/ui/button";
import { generateInvoiceHTML } from "./InvoiceTemplate";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function DownloadInvoice({ invoice }: { invoice: any }) {
  const handleDownload = async () => {
    // Ensure this runs only in a browser environment
    if (typeof window === "undefined") {
      console.error("html2pdf.js can only run in a browser environment.");
      return;
    }

    const html2pdf = (await import("html2pdf.js")).default; // Dynamically import html2pdf.js

    const invoiceHTML = generateInvoiceHTML(invoice); // Your HTML content as a string
    const element = document.createElement("div");
    element.innerHTML = invoiceHTML;

    // Use html2pdf to generate and download the PDF
    html2pdf()
      .set({
        filename: `invoice-${invoice.id}.pdf`,
        html2canvas: { scale: 2 }, // Improve quality
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />
      Telecharger la facture
    </DropdownMenuItem>
  );
}

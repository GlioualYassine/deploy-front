"use client";

import { Button } from "@/components/ui/button";
import { generateInvoiceHTML } from "./InvoiceTemplate";
import html2pdf from "html2pdf.js";

export default function DownloadInvoice({ invoice }: { invoice: any }) {
  const handleDownload = () => {
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

  return <Button onClick={handleDownload}>Download Invoice (HTML)</Button>;
}

export function generateInvoiceHTML(invoice: {
  id: string;
  customerName: string;
  amount: string;
  description: string;
  date: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.id}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }
            .invoice-details {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                padding: 20px;
                margin-top: 20px;
                border-radius: 5px;
            }
            .invoice-details p {
                margin: 10px 0;
            }
            .amount {
                font-size: 1.2em;
                font-weight: bold;
                color: #2980b9;
            }
        </style>
    </head>
    <body>
        <h1>Invoice</h1>
        <div class="invoice-details">
            <p><strong>Invoice ID:</strong> ${invoice.id}</p>
            <p><strong>Date:</strong> ${invoice.date}</p>
            <p><strong>Customer Name:</strong> ${invoice.customerName}</p>
            <p><strong>Description:</strong> ${invoice.description}</p>
            <p class="amount"><strong>Amount:</strong> $${invoice.amount}</p>
        </div>
    </body>
    </html>
  `
}


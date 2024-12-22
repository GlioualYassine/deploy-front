export function generateInvoiceHTML(invoice: any) {
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Facture Ramycan</title>
    <style>
      .body-pdf {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
      }
      .invoice {
        max-width: 800px;
        margin: 0 auto;
        border: 1px solid #ccc;
        padding: 20px;
      }
      .invoice-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .invoice-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .table-pdf {
        width: 100%;
        border-collapse: collapse;
      }
      .th-td-pdf {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
      }
      .th-pdf {
        background-color: #0070b7;
        color: #fff;
      }
      .total {
        text-align: right;
        margin-top: 20px;
      }
      .invoice-date {
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body class="body-pdf">
    <div class="invoice">
      <div class="invoice-header">
        <div class="invoice-details">
          <div><h1>Facture</h1></div>
          <div>
            <img
              src="C:\Users\achra\Documents\project\me\nostrum\geolocation\deploy-front\public/logo.png"
              alt="Logo Ramycan"
              width="200"
            />
          </div>
        </div>
      </div>
      <div class="invoice-details">
        <div>
          <strong>De:</strong>
          <p>
            Ramycan<br />
            123 Rue de l'Entreprise<br />
            Tanger , Morocco<br />
            Tél: 06 23 45 67 89
          </p>
        </div>
        <div>
          <strong>À:</strong>
          <p>
            ${invoice?.clientName}<br />
            456 Avenue du Client<br />
            Tanger , Morocco
          </p>
        </div>
      </div>
      <div class="invoice-date">
        <strong>Facture N°:</strong> 001<br />
        <strong>Date:</strong> ${invoice?.datePaiement?.split("T")[0]}
      </div>
      <table class="table-pdf">
        <thead>
          <tr>
            <th class="th-pdf th-td-pdf">Imei de l'appareil</th>
            <th class="th-pdf th-td-pdf">Prix</th>
            <th class="th-pdf th-td-pdf">Date de début</th>
            <th class="th-pdf th-td-pdf">Date de fin</th>
          </tr>
        </thead>
        <tbody>
            ${invoice.paymentLines
              .map(
                (item: any) => `
                <tr>
                  <td class="th-td-pdf">${item?.imei}</td>
                    <td class="th-td-pdf">${item?.totalPrice}</td>
                    <td class="th-td-pdf">${invoice?.dateFrom?.split("T")[0]}</td>
                    <td class="th-td-pdf">${invoice?.dateTo?.split("T")[0]}</td>
                </tr>
              `
              )
              .join("")}
           

        </tbody>
      </table>
      <div class="total">
        <p><strong>Total HT:</strong> ${invoice?.subtotal} DH</p>
        <p><strong>TVA (20%):</strong> ${invoice?.total * 0.2} DH</p>
        <p><strong>Total TTC:</strong> ${invoice?.total} DH</p>
      </div>
    </div>
  </body>
</html>

  `;
}

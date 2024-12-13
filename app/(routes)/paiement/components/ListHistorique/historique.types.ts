export interface PaymentLine {
    id: number;
    imei: string;
    unitPrice: number;
    tva: number;
    totalPrice: number;
}

export interface Payment {
    id: string;
    clientId: number;
    clientName:string
    datePaiement: Date; // Tu peux utiliser Date si tu préfères
    dateFrom: Date; // Ou Date
    dateTo: Date; // Ou Date
    subtotal: number;
    discount: number;
    shippingFee: number;
    adjustment: number;
    total: number;
    isPaid: boolean;
    paymentLines: PaymentLine[];
}

export interface listHistoriqueProps {
    paiements: Payment[];
}
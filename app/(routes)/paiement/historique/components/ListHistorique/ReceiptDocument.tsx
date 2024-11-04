// components/ReceiptDocument.tsx

import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font
} from '@react-pdf/renderer';
import { Payment } from './historique.types';

// Charger une police si nécessaire
Font.register({
    family: 'Arial',
    src: 'https://fonts.gstatic.com/s/arial/v11/YFOjCnqEu92Fr1Me5Q.ttf'
});

// Définir les styles
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Arial',
        fontSize: 12,
        backgroundColor: '#f4f4f4',
    },
    container: {
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 8,
        maxWidth: 800,
        margin: '0 auto',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2 solid #333333',
        paddingBottom: 10,
        marginBottom: 20,
    },
    companyInfo: {
        fontSize: 14,
        color: '#333333',
    },
    companyName: {
        fontSize: 18,
        margin: 0,
        color: '#1d4ed8', // Couleur principale alignée avec ShadCN
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1d4ed8',
    },
    sectionTitle: {
        fontSize: 16,
        color: '#333333',
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    infoSection: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 15,
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
        padding: 5,
        fontWeight: 'bold',
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    totalLabel: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#1d4ed8',
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        color: '#888888',
        fontSize: 12,
    },
});

interface ReceiptDocumentProps {
    paymentData: Payment;
}

const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({ paymentData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Image
                            src="/logo.png" // Assurez-vous que le logo est dans le dossier public
                            style={{ height: 60, marginBottom: 10 }}
                        />
                        <Text style={styles.companyName}>Nom de l`&apos;entreprise</Text>
                        <Text>ICE : {paymentData.id}</Text>
                        <Text>RC : 134431 | IF : 53587957</Text>
                        <Text>AV MOULAY ISMAIL, Tanger, 90000</Text>
                    </View>
                    <View>
                        <Text style={styles.invoiceTitle}>Reçu de Paiement</Text>
                        <Text>Référence: {paymentData.id}</Text>
                    </View>
                </View>

                {/* Client Information */}
                <Text style={styles.sectionTitle}>Informations sur le Client</Text>
                <View style={styles.infoSection}>
                    <Text><Text style={{ fontWeight: 'bold' }}>Nom:</Text> {paymentData.clientName}</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Date de Paiement:</Text> {new Date(paymentData.datePaiement).toLocaleDateString('fr-FR')}</Text>
                </View>

                {/* Payment Details */}
                <Text style={styles.sectionTitle}>Détails du Paiement</Text>
                <View style={styles.infoSection}>
                    <Text><Text style={{ fontWeight: 'bold' }}>Période:</Text> {new Date(paymentData.dateFrom).toLocaleDateString('fr-FR')} - {new Date(paymentData.dateTo).toLocaleDateString('fr-FR')}</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Sous-total:</Text> {paymentData.subtotal} MAD</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Remise:</Text> {paymentData.discount}%</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Frais de Livraison:</Text> {paymentData.shippingFee} MAD</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Ajustement:</Text> {paymentData.adjustment} MAD</Text>
                </View>

                {/* Payment Lines Table */}
                <Text style={styles.sectionTitle}>Détails des Paiements</Text>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>imei</Text>
                        <Text style={styles.tableColHeader}>Prix Unitaire (MAD)</Text>
                        <Text style={styles.tableColHeader}>TVA (%)</Text>
                        <Text style={styles.tableColHeader}>Total (MAD)</Text>
                    </View>
                    {/* Table Rows */}
                    {paymentData.paymentLines.map((line, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCol}>{line.imei}</Text>
                            <Text style={styles.tableCol}>{line.unitPrice}</Text>
                            <Text style={styles.tableCol}>{line.tva}</Text>
                            <Text style={styles.tableCol}>{line.totalPrice}</Text>
                        </View>
                    ))}
                    {/* Table Footer */}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.totalLabel]}>Total à Payer (MAD)</Text>
                        <Text style={styles.tableCol}>{paymentData.total} MAD</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Merci pour votre confiance.</Text>
                    <Text>Conditions : Payable à réception</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default ReceiptDocument;

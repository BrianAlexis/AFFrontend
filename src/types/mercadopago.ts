export interface BuyerInfo {
    email: string;
    name: string;
    surname: string;
    phone?: string;
}

export interface MercadoPagoItem {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
    description?: string;
    picture_url?: string;
}

export interface PaymentInfo {
    id: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    external_reference: string;
}

export interface StockCheckItem {
    documentId: string;
    titulo?: string;
    cantidadSolicitada: number;
    stockDisponible: number;
    disponible: boolean;
}

export interface StockUpdateItem {
    documentId: string;
    cantidad: number;
}


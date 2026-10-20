export interface Ticket {
    id:string;
    title:string;
    price:number;
    quantity:number;
    status:TicketStatus;
    createdAt?:string
    
}

export type TicketStatus = 'available' | 'reserved' | 'sold'

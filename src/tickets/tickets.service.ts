import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket, TicketStatus } from './ticket.interface.js';
import { generateUUID } from './utils/uuid.js';

@Injectable()
export class TicketsService {
    private nextTicketId = 4
    private readonly tickets: Ticket[] = [
        {
            id: '1',
            title: 'Concert A',
            price: 45,
            status: 'available',
            quantity: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Concert B',
            price: 75,
            status: 'available',
            quantity: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Concert c',
            price: 35,
            status: 'available',
            quantity: 1,
            createdAt: new Date().toISOString()
        }
    ]
    // check is ticket is sold or not
    isTicketSold(status: string) {
        return status === 'sold' ? true : false
    }
    createTickets(payload: any) {

        const ticket = this.tickets.find(t => t.title === payload.title)
        if (ticket) throw new BadRequestException('ticket already exist')
        const newTickets: Ticket = {
            id: crypto.randomUUID(),
            title: payload.title,
            price: parseInt(payload.price),
            status: 'reserved',
            quantity: parseInt(payload.quantity),
            createdAt: new Date().toISOString()
        }
        this.tickets.push(newTickets)
        return newTickets
    }
    // update status
    changeStatus(status: string, id: string) {

        const ticket = this.tickets.find(t => t.id === id)
        if (!ticket) {
            throw new NotFoundException('ticket is not found')

        }
        if (this.isTicketSold(ticket.status)) {
            console.log(ticket.status)
            throw new Error('ticket is already sold')
        }

        ticket.status = status as TicketStatus
        return ticket

    }
    findTicketById(id: string) {
        const tickets = this.tickets.find(t => t.id === id)
        if (!tickets) {
            throw new Error('ticket not found')
        }
        if (this.isTicketSold(tickets?.status)) {
            throw new Error('ticket is already sold')
        }
        return tickets
    }
    findAll(status?: TicketStatus) {
        let tickets = this.tickets
        if (status) {
            tickets = tickets.filter(t => t.status === status)
        }
        return tickets
    }
}

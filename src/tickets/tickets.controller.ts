import { Controller, Get, Put, Post, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { Ticket, TicketStatus } from './ticket.interface.js';
import { FilterTicketDto } from './dto/filter-ticket.dto.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) { }
  @Get()
  findAll(@Query() filters: FilterTicketDto) {
    return this.ticketService.findAll(filters.status)
  }
  @Get(':id')
  findTicketById(@Param('id') id: string) {
    return this.ticketService.findTicketById(id)
  }
  //  create ticket
  @Post()
  createTickets(@Body() ticket: CreateTicketDto) {
    return this.ticketService.createTickets(ticket)
  }
  @Put(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ticketService.changeStatus(status, id)
  }
}

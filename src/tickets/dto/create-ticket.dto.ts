import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from "class-validator";
import { TicketStatus } from "../ticket.interface.js";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    price: number;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsIn(["available", "sold", "reserved"])
    status?: 'available' | 'sold' | 'reserved'
}

import { IsIn, IsOptional } from "class-validator";
import { TicketStatus } from "../ticket.interface.js";

export class FilterTicketDto {
    @IsOptional()
    @IsIn(["available", "sold", "reserved"])
    status?: "available" | "sold" | "reserved"
}
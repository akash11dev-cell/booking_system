import { Type } from "class-transformer";
import { AppointmentStatus } from "@prisma/client";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator";

export class CreateAppointmentDto {
   

    @IsString()
    @IsNotEmpty()
    serviceId: string

    @Type(() => String)
    @IsString()
    @MaxLength(100)
    customerName: string

    @IsString()
    @MaxLength(70)
    customerPhone: string

    @IsString()
    startAt: string

}

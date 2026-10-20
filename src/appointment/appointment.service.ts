import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { SetWorkingHoursDto } from '../business-working-hours/dto/set-working-hours.dto/set-working-hours.dto.js';


@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) { }
  async getBusinessId(id: string) {
    return await this.prisma.business.findFirst({ where: { id } })
  }
  // create appointment
  async create(businessId: string, dto: CreateAppointmentDto) {
    const business = await this.getBusinessId(businessId)
    if (!business) {
      throw new NotFoundException('business is not found')
    }

    const service = await this.prisma.services.findFirst({ where: { id: dto.serviceId, businessId } })
    if (!service) {
      throw new NotFoundException('service is not found')
    }

    const startAt = new Date(dto.startAt)
    const endAt = new Date(startAt.getTime() + (service.duration * 60 * 1000))
    if (startAt <= new Date()) {
      throw new BadRequestException('appointment start time must be in the future')
    }

    const conflictAppointment = await this.prisma.appointment.findFirst({
      where: {
        businessId,
        status: {
          not: 'CANCELLED'
        },
        startAt: {
          lt: endAt
        },
        endAt: {
          gt: startAt
        }
      }
    })
    console.log('conflict', conflictAppointment)
    if (conflictAppointment) {
      throw new BadRequestException('this time slot already booked')
    }
    const appointment = this.prisma.appointment.create({
      data: {
        businessId,
        serviceId: service?.id,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        startAt,
        endAt,
        status: "PENDING",
        serviceName: service?.name,
        serviceDurationMinutes: service.duration,
        priceAtBooking: service.price
      }
    })
    return appointment
  }

  async cancel(businessId: string, appointmentId: string) {
    const business = await this.getBusinessId(businessId)
    const appointment = await this.prisma.appointment.findFirst({ where: { id: appointmentId, businessId } })
    if (!business) {
      throw new NotFoundException('business is not found')
    }
    if (!appointment) {
      throw new NotFoundException('appointment is not found')
    }
    if (appointment.status === 'CANCELLED') {
      return appointment
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED'
      }
    })
  }
  
  // get appointments
  async getAppointments(businessId: string) {
    // check business id
    const business = await this.getBusinessId(businessId)
    // business id is not found
    if (!business) {
      throw new NotFoundException('business is not found')
    }

    // check appointments
    const appointments = await this.prisma.appointment.findMany({
      where: { businessId },
      orderBy: { startAt: 'asc' }
    })

    return appointments
  }
  // get appointment by id
  async getAppointmentsById(businessId: string, appointmentId: string) {
    const business = await this.getBusinessId(businessId)
    if (!business) {
      throw new NotFoundException('business is not found')
    }
    const appointment = await this.prisma.appointment.findFirst({ where: { id: appointmentId, businessId } })
   
    if (!appointment) {
      throw new NotFoundException('appointment is not found')
    }
    return appointment
  }
  // update status for appointment
  async updateStatus(businessId: string, appointmentId: string) {
    const business = await this.getBusinessId(businessId)
    if (!business) {
      throw new NotFoundException('business is not found')
    }
    const appointment = await this.prisma.appointment.findFirst({ where: { id: appointmentId, businessId } })

    if (!appointment) {
      throw new NotFoundException('appointment is not found')
    }
    
    if (appointment.status === "CANCELLED") {
      throw new BadRequestException('cancelled appointment can not be changed')
    }
    if (appointment.status === 'COMPLETED') {
      return appointment
    }
    if (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') {
      return await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'COMPLETED' }
      })
    }
    return appointment
  }
  async setWorkingHours(businessId: string, dto: SetWorkingHoursDto) {
  
    const business = await this.getBusinessId(businessId)
    if (!business) {
      throw new NotFoundException('business is not found')
    }

    const isClosed = dto.isClosed ?? false
    if (!isClosed) {
      if (!dto.openTime || !dto.closeTime) {
         throw new BadRequestException('openTime and closeTime are required')
      }
      if (dto.openTime >= dto.closeTime) {
         throw new BadRequestException('openTime must be earlier from closeTime')
      }
    }
      const openTime = isClosed ? null : dto.openTime!;
      const closeTime = isClosed ? null : dto.closeTime!;

      return this.prisma.businessWorkingHours.upsert({
        where: {
          businessId_dayOfWeek: {
            businessId,
            dayOfWeek: dto.dayOfWeek,
          },
        },
        create: {
          businessId,
          dayOfWeek: dto.dayOfWeek,
          isClosed,
          openTime,
          closeTime,
        },
        update: {
          isClosed,
          openTime,
          closeTime,
        },
      });
    }
}
    



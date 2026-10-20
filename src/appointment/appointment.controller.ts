import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { AppointmentService } from './appointment.service.js';
import { get } from 'http';
import { SetWorkingHoursDto } from '../business-working-hours/dto/set-working-hours.dto/set-working-hours.dto.js';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }
  @Post(":businessId")
  createAppointment(@Param('businessId') businessId: string, @Body() dto: CreateAppointmentDto,) {
    return this.appointmentService.create(businessId, dto)
  }
  // cancel status
  @Patch(':businessId/:appointmentId/cancel')
  cancelAppointment(
    @Param('businessId') businessId: string,
    @Param('appointmentId') appointmentId: string
  ) {
    return this.appointmentService.cancel(businessId, appointmentId)
  }

  @Patch(':businessId/:appointmentId/complete')
  completeAppointment(@Param('businessId') businessId: string,
    @Param('appointmentId') appointmentId: string) {
     return this.appointmentService.updateStatus(businessId,appointmentId)
  }
  // get appointments
  @Get(':businessId')
  getAllAppointments(@Param('businessId') businessForId: string) {
    return this.appointmentService.getAppointments(businessForId)
  }
  // get appointment by id
  @Get(':businessId/:appointmentId')
  getAppointmentsById(@Param('businessId') businessId: string, @Param('appointmentId') appointmentId: string) { 
     return this.appointmentService.getAppointmentsById(businessId, appointmentId)
  }

  // setworking hours
  @Put(':businessId/work-hours')
  setWorkinghours(@Param('businessId') businessId: string, @Body() dto: SetWorkingHoursDto) {
     return this.appointmentService.setWorkingHours(businessId,dto)
  }
  
}

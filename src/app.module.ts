import { Module } from '@nestjs/common';
import { BooklyModule } from './bookly/bookly.module.js';
import { BusinessModule } from './business/business.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppointmentModule } from './appointment/appointment.module.js';





@Module({
  imports: [
    PrismaModule,
    BooklyModule,
    BusinessModule,
    AppointmentModule,
  
  ],
})
export class AppModule {}

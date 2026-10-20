import { Injectable } from '@nestjs/common';

import { BusinessDto } from './dto/business-dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BusinessService {
     constructor(private readonly prisma: PrismaService) {}

  async create(dto: BusinessDto) {
    return this.prisma.business.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }
}

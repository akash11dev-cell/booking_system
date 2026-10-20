import { Body, Controller, Post } from '@nestjs/common';
import { BusinessService } from './business.service.js';
import { BusinessDto } from './dto/business-dto.js';

@Controller('business')
export class BusinessController {
    constructor(
    private readonly businessService: BusinessService,
  ) {}

  @Post()
  create(@Body() dto:BusinessDto) {
    return this.businessService.create(dto);
  }
}

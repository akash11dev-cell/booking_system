import { Body, Controller, Post, Get, Param, Query, Patch } from '@nestjs/common';
import { CreateBooklyDto } from './dto/create-bookly.dto.js';
import { BooklyService } from './bookly.service.js';
import { GetServiceQueryDto } from './dto/serviceQueryDto.js';
import { UpdateServiceDto } from './dto/updateServiceDto.js';

@Controller('bookly/services')
export class BooklyController {
    constructor(private readonly booklyBusiness: BooklyService) { }
    // get all business services
    @Get(':businessId')
    getBooklyServices(@Param('businessId') businessId: string, @Query() query: GetServiceQueryDto) {
        return this.booklyBusiness.getServicesByBusinessId(businessId, query)
    }
    // create business services
    @Post(':businessId')
    createBooklyServices(@Body() booklyService: CreateBooklyDto, @Param('businessId') businessId: string) {
        return this.booklyBusiness.createService(businessId, booklyService)
    }

    // update services
    @Patch(':businessId/:serviceId')
    UpdateBooklyServices(@Body() updateServiceDto: UpdateServiceDto, @Param('businessId') businessId: string, @Param('serviceId') serviceId: string) {
        return this.booklyBusiness.updateService(businessId, serviceId, updateServiceDto)
    }
}

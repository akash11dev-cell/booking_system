import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Bookly } from './bookly.interface.js';
import { CreateBooklyDto } from './dto/create-bookly.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateServiceDto } from './dto/updateServiceDto.js';
import { GetServiceQueryDto } from './dto/serviceQueryDto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooklyService {
    constructor(private readonly prisma: PrismaService) { }
    async getBusinessId(id: string) {
        return await this.prisma.business.findUnique({
            where: { id },
            select: { id: true }
        })
    }
    async createService(id: string, payload: CreateBooklyDto) {
        const business = await this.prisma.business.findUnique({
            where: { id },
            select: { id: true }
        })

        if (!business) {
            throw new NotFoundException('business is not found')
        }

        try {
            return this.prisma.services.create({
                data: {
                    name: payload?.name,
                    duration: payload.duration,
                    price: payload.price,
                    description: payload.description,
                    businessId: id
                }
            })
        } catch (error: unknown) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new NotFoundException(error.message)
            }
            throw error
        }

    }

    async getServicesByBusinessId(
        businessId: string,
        query: GetServiceQueryDto

    ) {
        const business = await this.getBusinessId(businessId);

        if (!business) {
            throw new NotFoundException('Business not found');
        }
        const { cursor, limit = 5, search, minPrice, maxPrice } = query
        if (minPrice != undefined && maxPrice != undefined && new Prisma.Decimal(minPrice).greaterThan(new Prisma.Decimal(maxPrice))) {
            throw new BadRequestException('min Price can not be greater than maxPrice')
        }
        if (cursor) {
            const cursorService = await this.prisma.services.findFirst({
                where: {
                    id: cursor,
                    businessId,
                },
                select: { id: true },
            });

            if (!cursorService) {
                throw new BadRequestException(
                    'Invalid cursor for this business',
                );
            }
        }


        const where: Prisma.ServicesWhereInput = {
            businessId,
            ...(search?.trim() && { name: { contains: search.trim(), mode: 'insensitive' } }),
            ...(minPrice !== undefined || maxPrice !== undefined ? {
                price: {
                    ...(minPrice !== undefined && { gte: Number(minPrice) }),
                    ...(maxPrice !== undefined && { lte: Number(maxPrice) })
                }
            } : {}


            )
        }

        const services = await this.prisma.services.findMany({
            where,
            select: {
                id: true,
                name: true,
                duration: true,
                price: true,
                description: true,
                businessId: true,
            },
            orderBy: { id: 'asc' },
            ...(cursor
                ? {
                    cursor: { id: cursor },
                    skip: 1,
                }
                : {}),
            take: limit + 1,
        });

        const hasMore = services.length > limit;
        const data = services.slice(0, limit);

        return {
            data,
            pagination: {
                limit,
                hasMore,
                nextCursor:
                    hasMore && data.length > 0
                        ? data[data.length - 1].id
                        : null,
            },
        };
    }

    async updateService(businessId: string, serviceId: string, payload: Partial<UpdateServiceDto>) {
        const business = await this.getBusinessId(businessId);
        if (!business) {
            throw new NotFoundException('Business not found');
        }
        if (Object.keys(payload).length === 0) {
            throw new BadRequestException('Payload is empty')
        }
        const service = await this.prisma.services.findUnique({ where: { id: serviceId } })
        if (!service) {
            throw new NotFoundException('service id is not found')
        }

        try {
            return await this.prisma.services.update({
                where: { id: serviceId, businessId },
                data: payload,
                select: { id: true, name: true, price: true, description: true, duration: true },

            })
        } catch (error) {
            console.log(error)
        }
    }
    // delete services
    async deleteService(businessId: string, serviceId: string) {
        const business = await this.getBusinessId(businessId)
        if (!business) {
            throw new NotFoundException('business is not found')
        }
        const result = await this.prisma.services.deleteMany({
            where: { id: serviceId, businessId }
        })
        if (result.count === 0) {
            throw new NotFoundException('service not found')
        }
        return result
    }
}


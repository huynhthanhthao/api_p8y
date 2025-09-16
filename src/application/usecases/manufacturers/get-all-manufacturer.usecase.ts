import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllManufacturerRequestDto,
  GetAllManufacturerResponseDto
} from '@interface-adapter/dtos/manufacturers'

@Injectable()
export class GetAllManufacturerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllManufacturerRequestDto,
    branchId: string
  ): Promise<GetAllManufacturerResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = data

    const where: Prisma.ManufacturerWhereInput = {
      branchId
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'manufacturer',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true,
          createdAt: true,
          updatedAt: true
        }
      },
      { page, perPage }
    )
  }
}

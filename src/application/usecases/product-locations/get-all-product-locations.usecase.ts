import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllProductLocationRequestDto,
  GetAllProductLocationResponseDto
} from '@interface-adapter/dtos/product-locations'

@Injectable()
export class GetAllProductLocationUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllProductLocationRequestDto,
    branchId: string
  ): Promise<GetAllProductLocationResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = data

    const where: Prisma.ProductLocationWhereInput = {
      branchId
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'productLocation',
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

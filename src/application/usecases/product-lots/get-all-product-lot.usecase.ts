import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllProductLotRequestDto,
  GetAllProductLotResponseDto
} from '@interface-adapter/dtos/product-lots'
import { getEndOfDay } from '@common/helpers'

@Injectable()
export class GetAllProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllProductLotRequestDto,
    branchId: string
  ): Promise<GetAllProductLotResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, isExpired, quantityGreaterThan, productId } =
      data

    const where: Prisma.ProductLotWhereInput = {
      branchId,
      productId,
      stockQuantity: {
        gt: quantityGreaterThan
      }
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    if (isExpired !== undefined) {
      const endOfToday = getEndOfDay(new Date())
      where.expiryAt = isExpired ? { lt: endOfToday } : { gte: endOfToday }
    }

    return await this.prismaClient.findManyWithPagination(
      'productLot',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true
        }
      },
      { page, perPage }
    )
  }
}

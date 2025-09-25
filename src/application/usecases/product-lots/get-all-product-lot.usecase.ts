import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import {
  GetAllProductLotRequestDto,
  GetAllProductLotResponseDto
} from '@interface-adapter/dtos/product-lots'
import { getEndOfDay } from '@common/helpers'
import { HttpException } from '@common/exceptions'
import { PRODUCT_ERROR } from '@common/errors'

@Injectable()
export class GetAllProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    params: GetAllProductLotRequestDto,
    branchId: string
  ): Promise<GetAllProductLotResponseDto> {
    const {
      page,
      perPage,
      keyword,
      orderBy,
      sortBy,
      isExpired,
      quantityGreaterThan,
      productParentId,
      expiryFrom,
      expiryTo
    } = params

    const product = await this.prismaClient.product.findUnique({
      where: { id: productParentId },
      select: { id: true, parentId: true }
    })

    if (!product) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    const where: Prisma.ProductLotWhereInput = {
      branchId,
      productParentId: product.parentId ?? product.id,
      stockQuantity: {
        gt: quantityGreaterThan
      },
      ...(expiryFrom && expiryTo
        ? {
            expiryAt: {
              gte: expiryFrom,
              lte: expiryTo
            }
          }
        : {}),
      ...(expiryFrom && !expiryTo
        ? {
            expiryAt: {
              gte: expiryFrom
            }
          }
        : {}),
      ...(!expiryFrom && expiryTo
        ? {
            expiryAt: {
              lte: expiryTo
            }
          }
        : {})
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

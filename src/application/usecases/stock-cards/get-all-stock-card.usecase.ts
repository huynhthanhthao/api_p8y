import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllStockCardRequestDto,
  GetAllStockCardResponseDto
} from '@interface-adapter/dtos/stock-cards'
import { STOCK_CARD_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class GetAllStockCardUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    data: GetAllStockCardRequestDto,
    branchId: string
  ): Promise<GetAllStockCardResponseDto> {
    const { page, perPage, orderBy, sortBy, productId } = data

    const where: Prisma.StockCardWhereInput = {
      branchId,
      ...(productId && {
        OR: [
          {
            products: {
              some: {
                id: productId
              }
            }
          },
          {
            products: {
              some: {
                parentId: productId
              }
            }
          }
        ]
      })
    }

    return await this.prismaService.findManyWithPagination(
      'stockCard',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        ...STOCK_CARD_SELECT_FIELDS
      },
      { page, perPage }
    )
  }
}

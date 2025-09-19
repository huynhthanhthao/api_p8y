import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllStockTransactionRequestDto,
  GetAllStockTransactionResponseDto
} from '@interface-adapter/dtos/stock-transactions'
import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants'

@Injectable()
export class GetAllStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    data: GetAllStockTransactionRequestDto,
    branchId: string
  ): Promise<GetAllStockTransactionResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, type, supplierGroupIds } = data

    const where: Prisma.StockTransactionWhereInput = {
      deletedAt: null,
      branchId,
      type,
      ...(supplierGroupIds?.length && { supplierGroupId: { in: supplierGroupIds } })
    }

    if (keyword) {
      where.OR = [{ code: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaService.findManyWithPagination(
      'stockTransaction',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        STOCK_TRANSACTION_INCLUDE_FIELDS
      },
      { page, perPage }
    )
  }
}

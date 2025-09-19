import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { StockTransaction } from '@common/types'
import { HttpException } from '@common/exceptions'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants'

@Injectable()
export class GetOneStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string, branchId: string): Promise<StockTransaction> {
    const stockTransaction = await this.prismaService.stockTransaction.findUnique({
      where: { id, branchId, deletedAt: null },
      ...STOCK_TRANSACTION_INCLUDE_FIELDS
    })

    if (!stockTransaction) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_NOT_FOUND
      )
    }

    return stockTransaction
  }
}

import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants'
import { HttpException } from '@common/exceptions'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { getStockCardType, updateStockQuantity } from '@common/utils'
import { StockTransaction } from '@common/types'
import { StockTransactionStatusEnum, StockTransactionTypeEnum } from '@common/enums'

@Injectable()
export class ReviewStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<StockTransaction> {
    const stockTransaction = await this.prismaClient.stockTransaction.findUnique({
      where: { id, branchId },
      select: {
        id: true,
        stockItems: true,
        status: true,
        type: true
      }
    })

    if (!stockTransaction) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_NOT_FOUND
      )
    }

    if (stockTransaction.status === StockTransactionStatusEnum.COMPLETED) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_COMPLETED
      )
    }

    return await this.prismaClient.$transaction(async (tx: PrismaService) => {
      const stockInputs = stockTransaction.stockItems.map(item => {
        if (item.productLotId) {
          return {
            productId: item.productId,
            isLotEnabled: true as const,
            productLotId: item.productLotId,
            quantity: item.quantity
          }
        } else {
          return {
            productId: item.productId,
            isLotEnabled: false as const,
            quantity: item.quantity
          }
        }
      })

      for (const stockInput of stockInputs) {
        await updateStockQuantity(
          stockInput,
          getStockCardType(stockTransaction.type as StockTransactionTypeEnum),
          tx
        )
      }

      return await tx.stockTransaction.update({
        where: { id, branchId },
        data: {
          status: StockTransactionStatusEnum.COMPLETED,
          updatedBy: userId,
          reviewedBy: userId
        },
        ...STOCK_TRANSACTION_INCLUDE_FIELDS
      })
    })
  }
}

import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { StockTransactionStatusEnum } from '@common/enums'

@Injectable()
export class CancelManyStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const stockTransactions = await this.prismaClient.stockTransaction.findMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })

    if (stockTransactions.length !== data.ids.length) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.SOME_STOCK_TRANSACTIONS_NOT_FOUND
      )
    }

    /**
     * Kiểm tra có giao dịch đã hủy chưa
     */
    const hasStockTransactionCanceled = stockTransactions.find(
      stockTransaction => stockTransaction.status === StockTransactionStatusEnum.CANCELED
    )

    if (hasStockTransactionCanceled) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.SOME_STOCK_TRANSACTIONS_CANCELED
      )
    }

    return await this.prismaClient.stockTransaction.updateMany({
      where: {
        id: { in: data.ids },
        updatedBy: userId,
        branchId
      },
      data: {
        status: StockTransactionStatusEnum.CANCELED,
        updatedBy: userId
      }
    })
  }
}

import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { StockTransactionStatusEnum } from '@common/enums'

@Injectable()
export class CancelStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const stockTransaction = await this.prismaClient.stockTransaction.findUnique({
      where: { id, branchId }
    })

    if (!stockTransaction) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_NOT_FOUND
      )
    }

    if (stockTransaction.status === StockTransactionStatusEnum.CANCELED) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_CANCELED
      )
    }

    await this.prismaClient.stockTransaction.update({
      where: { id, branchId },
      data: {
        status: StockTransactionStatusEnum.CANCELED,
        updatedBy: userId
      }
    })

    return id
  }
}

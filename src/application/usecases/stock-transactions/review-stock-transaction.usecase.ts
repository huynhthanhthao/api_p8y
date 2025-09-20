import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { getStockCardType, StockInput, updateStockQuantity } from '@common/utils'
import { StockTransaction } from '@common/types'
import { StockTransactionStatusEnum, StockTransactionTypeEnum } from '@common/enums'
import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants'

@Injectable()
export class ReviewStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient() {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<StockTransaction> {
    /**
     * Tìm transaction với chỉ các field cần thiết
     */
    const stockTransaction = await this.prismaClient.stockTransaction.findFirst({
      where: {
        id,
        branchId,
        status: { not: StockTransactionStatusEnum.COMPLETED }
      },
      select: {
        id: true,
        stockItems: {
          select: {
            productId: true,
            productLotId: true,
            quantity: true
          }
        },
        type: true
      }
    })

    if (!stockTransaction) {
      /**
       * Kiểm tra xem transaction có tồn tại không để phân biệt lỗi
       */
      const existingTransaction = await this.prismaClient.stockTransaction.findUnique({
        where: { id, branchId },
        select: { id: true, status: true }
      })

      if (existingTransaction) {
        throw new HttpException(
          HttpStatus.CONFLICT,
          STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_COMPLETED
        )
      }

      throw new HttpException(
        HttpStatus.NOT_FOUND,
        STOCK_TRANSACTION_ERROR.STOCK_TRANSACTION_NOT_FOUND
      )
    }

    return await this.prismaClient.$transaction(
      async (tx: PrismaService) => {
        /**
         * Tạo stock inputs và group
         */
        const stockInputs = this.groupStockInputs(
          stockTransaction.stockItems.map(item => {
            if (item.productLotId) {
              return {
                productId: item.productId,
                isLotEnabled: true as const,
                productLotId: item.productLotId,
                quantity: item.quantity
              } as StockInput
            } else {
              return {
                productId: item.productId,
                isLotEnabled: false as const,
                quantity: item.quantity
              } as StockInput
            }
          })
        )

        /**
         * Xử lý song song các stock updates
         */
        await Promise.all(
          stockInputs.map(stockInput =>
            updateStockQuantity(
              stockInput,
              getStockCardType(stockTransaction.type as StockTransactionTypeEnum),
              tx
            )
          )
        )

        return await tx.stockTransaction.update({
          where: { id, branchId },
          data: {
            status: StockTransactionStatusEnum.COMPLETED,
            updatedBy: userId,
            reviewedBy: userId
          },
          ...STOCK_TRANSACTION_INCLUDE_FIELDS
        })
      },
      {
        timeout: 10000,
        maxWait: 5000
      }
    )
  }

  private groupStockInputs(stockInputs: StockInput[]): StockInput[] {
    const grouped = new Map<string, StockInput>()

    for (const item of stockInputs) {
      const key = `${item.productId}-${item.isLotEnabled ? item.productLotId : 'no-lot'}`

      if (grouped.has(key)) {
        grouped.get(key)!.quantity += item.quantity
      } else {
        grouped.set(key, { ...item })
      }
    }

    return Array.from(grouped.values())
  }
}

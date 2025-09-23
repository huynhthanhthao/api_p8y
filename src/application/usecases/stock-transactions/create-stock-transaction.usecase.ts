import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateStockTransactionRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { StockTransaction } from '@common/types'
import { StockTransactionStatusEnum, StockTransactionTypeEnum } from '@common/enums'
import {
  checkDuplicateProductId,
  checkInventoryEnabled,
  checkMissingProductLotId,
  generateCodeModel,
  getStockCardType,
  processHandleStockItems
} from '@common/utils'
import { PrismaService } from '@infrastructure/prisma'
import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'

@Injectable()
export class CreateStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateStockTransactionRequestDto,
    userId: string,
    branchId: string
  ): Promise<StockTransaction> {
    /**
     * check mã tồn tại chưa
     */
    if (data.code) await this.validateUniqueFields(data.code, branchId)

    /**
     * Nhóm các sản phẩm giống nhau
     */
    const uniqueProductIds = [...new Set(data.stockItems.map(p => p.productId))]
    const productList = await this.prismaClient.product.findMany({
      where: {
        id: { in: uniqueProductIds || [] }
      },
      select: {
        id: true,
        code: true,
        isLotEnabled: true,
        isStockEnabled: true,
        stockQuantity: true,
        productLots: true
      }
    })

    /**
     * Check sản phẩm lô
     * Check sản phẩm có bật quản lý kho
     */
    checkInventoryEnabled(data, productList)
    checkMissingProductLotId(data, productList)
    checkDuplicateProductId(data.type, data.stockItems, productList)

    return await this.prismaClient.$transaction(async (tx: PrismaService) => {
      /**
       * Xử lý nếu hoàn thành phiếu
       */
      if (data.status === StockTransactionStatusEnum.COMPLETED)
        processHandleStockItems(
          data.type as StockTransactionTypeEnum,
          data.stockItems,
          productList,
          tx
        )

      const transaction = await tx.stockTransaction.create({
        data: {
          branchId,
          code: data.code || (await this.generateCode(data.type, branchId)),
          type: data.type,
          discountType: data.discountType,
          discountValue: data.discountValue,
          note: data.note,
          supplierId: data.supplierId,
          transactedAt: data.transactedAt,
          createdBy: userId,
          status: data.status,
          ...(data.status === StockTransactionStatusEnum.COMPLETED && {
            reviewedBy: userId
          }),
          stockItems: {
            create: data.stockItems.map(item => {
              const product = productList.find(p => p.id === item.productId)
              const productLot = product?.productLots.find(p => p.id === item.productLotId)
              return {
                productId: item.productId,
                discountType: item.discountType,
                discountValue: item.discountValue,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                previousStock: item.productLotId
                  ? productLot?.stockQuantity
                  : product?.stockQuantity,
                ...(product?.isLotEnabled && {
                  productLotId: item.productLotId
                })
              }
            })
          }
        },
        ...STOCK_TRANSACTION_INCLUDE_FIELDS
      })

      /**
       * Tạo thẻ kho
       */
      if (data.status === StockTransactionStatusEnum.COMPLETED)
        await tx.stockCard.create({
          data: {
            products: {
              connect: uniqueProductIds.map(id => ({ id }))
            },
            type: getStockCardType(data.type),
            branchId,
            transactionId: transaction.id
          }
        })

      return transaction
    })
  }

  private async generateCode(type: StockTransactionTypeEnum, branchId: string): Promise<string> {
    let prefix = ''

    if (type === StockTransactionTypeEnum.IMPORT) prefix = 'PN'
    if (type === StockTransactionTypeEnum.CANCEL) prefix = 'XH'
    if (type === StockTransactionTypeEnum.CHECK) prefix = 'KK'

    return generateCodeModel({ model: 'StockTransaction', branchId, prefix })
  }

  private async validateUniqueFields(code: string, branchId: string): Promise<void> {
    const existingRecord = await this.prismaClient.stockTransaction.findUnique({
      where: {
        code_branchId: {
          branchId,
          code
        }
      },
      select: {
        id: true
      }
    })

    if (existingRecord) {
      throw new HttpException(HttpStatus.CONFLICT, STOCK_TRANSACTION_ERROR.CODE_EXISTS)
    }
  }
}

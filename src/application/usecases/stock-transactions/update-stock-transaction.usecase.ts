import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateStockTransactionRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import {
  checkDuplicateProductId,
  checkInventoryEnabled,
  checkMissingProductLotId,
  generateCodeModel,
  getStockCardType,
  groupStockItems,
  processHandleStockItems
} from '@common/utils'
import { StockTransactionStatusEnum, StockTransactionTypeEnum } from '@common/enums'
import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants'
import { StockTransaction } from '@common/types'

@Injectable()
export class UpdateStockTransactionUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: CreateStockTransactionRequestDto,
    userId: string,
    branchId: string
  ): Promise<StockTransaction> {
    const stockTransaction = await this.prismaClient.stockTransaction.findUnique({
      where: { id, branchId },
      select: {
        id: true,
        code: true,
        type: true,
        status: true
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

    /**
     * check mã tồn tại chưa
     */
    if (data.code && data.code !== stockTransaction.code)
      await this.validateUniqueFields(data.code, branchId)

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
     * Check sản phẩm lô và sản phẩm có bật quản lý kho
     */
    checkMissingProductLotId(data, productList)
    checkInventoryEnabled(data, productList)
    checkDuplicateProductId(data.type, data.stockItems, productList)

    /**
     * Kiểm tra mã phiếu đã tồn tại
     */
    if (data.code && data.code !== stockTransaction.code) {
      const recordWithSameCode = await this.prismaClient.stockTransaction.findFirst({
        where: {
          code: {
            equals: data.code,
            mode: 'insensitive'
          },
          id: {
            not: id
          },
          branchId
        }
      })

      if (recordWithSameCode) {
        throw new HttpException(HttpStatus.CONFLICT, STOCK_TRANSACTION_ERROR.CODE_EXISTS)
      }
    }

    return await this.prismaClient.$transaction(async (tx: PrismaService) => {
      await tx.stockItem.deleteMany({ where: { transactionId: id } })
      await tx.stockItem.createMany({
        data: data.stockItems.map(item => {
          const product = productList.find(p => p.id === item.productId)
          return {
            transactionId: id,
            productId: item.productId,
            discountType: item.discountType,
            discountValue: item.discountValue,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            previousStock: product?.stockQuantity,
            ...(product?.isLotEnabled && {
              productLotId: item.productLotId
            })
          }
        })
      })

      if (data.status === StockTransactionStatusEnum.COMPLETED)
        await Promise.all([
          /**
           * Xử lý stock item và cập nhật số lượng kho
           */
          processHandleStockItems(
            stockTransaction.type as StockTransactionTypeEnum,
            groupStockItems(data.stockItems),
            productList,
            tx
          ),

          /**
           * Nếu complete, tạo thẻ kho
           */
          data.status === StockTransactionStatusEnum.COMPLETED &&
            tx.stockCard.create({
              data: {
                products: {
                  connect: uniqueProductIds.map(id => ({ id }))
                },
                type: getStockCardType(data.type)
              }
            })
        ])

      return await tx.stockTransaction.update({
        where: { id, branchId },
        data: {
          code: data.code === '' ? await this.generateCode(data.type, branchId) : data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          note: data.note,
          supplierId: data.supplierId,
          transactedAt: data.transactedAt,
          updatedBy: userId,
          ...(data.status === StockTransactionStatusEnum.COMPLETED && {
            reviewedBy: userId
          })
        },
        ...STOCK_TRANSACTION_INCLUDE_FIELDS
      })
    })
  }

  private async generateCode(type: StockTransactionTypeEnum, branchId: string): Promise<string> {
    let prefix = ''

    if (type === StockTransactionTypeEnum.IMPORT) prefix = 'PN'
    if (type === StockTransactionTypeEnum.CANCEL) prefix = 'XH'
    if (type === StockTransactionTypeEnum.CHECK) prefix = 'KK'

    return await generateCodeModel({ model: 'StockTransaction', branchId, prefix })
  }

  private async validateUniqueFields(code: string, branchId: string): Promise<void> {
    const existingRecord = await this.prismaClient.supplier.findUnique({
      where: {
        code_branchId: {
          branchId,
          code
        }
      },
      select: {
        phone: true
      }
    })

    if (existingRecord) {
      throw new HttpException(HttpStatus.CONFLICT, STOCK_TRANSACTION_ERROR.CODE_EXISTS)
    }
  }
}

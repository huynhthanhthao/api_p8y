import { PrismaService } from '@infrastructure/prisma'
import { StockTransactionTypeEnum } from '@common/enums'
import { PRODUCT_ERROR } from '@common/errors'
import { Product } from '@common/types'
import { StockItemRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { HttpStatus } from '@nestjs/common'
import { getStockCardType } from './get-stock-card-type.util'
import { updateStockQuantity } from './update-stock-quantity.util'
import { HttpException } from '@common/exceptions'
import { groupStockItems } from './grouped-stock-item.util'

export async function processHandleStockItems(
  stockTransactionType: StockTransactionTypeEnum,
  stockItems: StockItemRequestDto[],
  productList: Pick<Product, 'id' | 'isLotEnabled' | 'code'>[],
  tx: PrismaService
): Promise<void> {
  const productMap = new Map<string, Pick<Product, 'id' | 'isLotEnabled' | 'code'>>(
    productList.map(p => [p.id, p])
  )

  /**
   * Group stock items trước
   */
  const stockItemsGrouped = groupStockItems(stockItems)

  /**
   * Kiểm tra tất cả products tồn tại một lần
   */
  for (const stockItem of stockItemsGrouped) {
    if (!productMap.has(stockItem.productId)) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }
  }

  /**
   * Xử lý tất cả stock items song song
   */
  const updatePromises = stockItemsGrouped.map(async stockItem => {
    const productTarget = productMap.get(stockItem.productId)!

    const stockCardType = getStockCardType(stockTransactionType)

    const stockInput = productTarget.isLotEnabled
      ? {
          productId: productTarget.id,
          isLotEnabled: true as const,
          quantity: stockItem.quantity,
          productLotId: stockItem.productLotId
        }
      : {
          productId: productTarget.id,
          isLotEnabled: false as const,
          quantity: stockItem.quantity
        }

    return updateStockQuantity(stockInput, stockCardType, tx)
  })

  await Promise.all(updatePromises)
}

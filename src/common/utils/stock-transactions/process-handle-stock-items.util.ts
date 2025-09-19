import { StockTransactionTypeEnum } from '@common/enums'
import { PRODUCT_ERROR } from '@common/errors'
import { Product, StockTransaction } from '@common/types'
import { StockItemRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { HttpStatus } from '@nestjs/common'
import { getStockCardType } from './get-stock-card-type.util'
import { updateStockQuantity } from './update-stock-quantity.util'
import { HttpException } from '@common/exceptions'
import { PrismaService } from '@infrastructure/prisma'

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
   * Xử lý tuần tự để đảm bảo cập nhật tồn kho đúng
   */

  for (const stockItem of stockItems) {
    const productTarget = productMap.get(stockItem.productId)

    if (!productTarget) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    const stockCardType = getStockCardType(stockTransactionType as StockTransactionTypeEnum)

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

    await updateStockQuantity(stockInput, stockCardType, tx)
  }
}

import { PrismaService } from '@infrastructure/prisma'
import { StockTransactionTypeEnum } from '@common/enums'
import { Product } from '@common/types'
import { StockItemRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { getStockCardType } from './get-stock-card-type.util'
import { updateStockQuantity } from '../update-stock-quantity.util'
import { groupStockItemsByParent } from './group-stock-items-by-parent'

export async function processHandleStockItems(
  stockTransactionType: StockTransactionTypeEnum,
  stockItems: StockItemRequestDto[],
  productList: Pick<Product, 'id' | 'isLotEnabled' | 'code' | 'parent' | 'conversion'>[],
  tx: PrismaService
): Promise<void> {
  const productMap = new Map(productList.map(p => [p.id, p]))

  /**
   * Group stock items theo parent và tính toán conversion
   */
  const parentGroupedItems = groupStockItemsByParent(stockItems, productMap)

  /**
   * Xử lý tất cả item đã group theo parent
   */
  const updatePromises = Array.from(parentGroupedItems.entries()).map(async ([, item]) => {
    const stockCardType = getStockCardType(stockTransactionType)

    const stockInput = item.isLotEnabled
      ? {
          productId: item.productParentId, // ID của parent product
          isLotEnabled: true as const,
          quantity: item.finalQuantity, // Quantity đã được conversion
          productLotId: item.productLotId!
        }
      : {
          productId: item.productParentId, // ID của parent product
          isLotEnabled: false as const,
          quantity: item.finalQuantity // Quantity đã được conversion
        }

    return await updateStockQuantity(stockInput, stockCardType, tx)
  })

  await Promise.all(updatePromises)
}

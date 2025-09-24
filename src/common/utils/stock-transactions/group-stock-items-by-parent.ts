import { Product } from '@common/types'
import { StockItemRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { calculateTargetProductAndRate } from '../calculate-target-product-and-rate.util'
import { HttpException } from '@common/exceptions'
import { HttpStatus } from '@nestjs/common'
import { PRODUCT_ERROR } from '@common/errors'

export function groupStockItemsByParent(
  stockItems: StockItemRequestDto[],
  productMap: Map<string, Pick<Product, 'id' | 'isLotEnabled' | 'code' | 'parent' | 'conversion'>>
): Map<
  string,
  {
    finalQuantity: number
    productParentId: string
    isLotEnabled: boolean
    productLotId?: string
  }
> {
  const result = new Map<
    string,
    {
      finalQuantity: number
      productParentId: string
      isLotEnabled: boolean
      productLotId?: string
    }
  >()

  for (const item of stockItems) {
    const product = productMap.get(item.productId)
    if (!product) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    const { targetProductId, conversionRate } = calculateTargetProductAndRate(product)
    const convertedQuantity = item.quantity * conversionRate
    const groupKey = `${targetProductId}-${item.productLotId ?? 'no-lot'}`

    const existing = result.get(groupKey)

    if (existing) {
      existing.finalQuantity += convertedQuantity
    } else {
      result.set(groupKey, {
        finalQuantity: convertedQuantity,
        productParentId: targetProductId,
        isLotEnabled: product.parent?.isLotEnabled ?? product.isLotEnabled,
        productLotId: item.productLotId
      })
    }
  }

  return result
}
